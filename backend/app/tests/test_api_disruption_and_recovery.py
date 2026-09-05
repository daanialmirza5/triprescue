def _trigger_hero_disruption(client):
    return client.post(
        "/api/trips/trip-ladakh-2025/disruptions",
        json={"type": "flight-delay", "delayMinutes": 180},
    )


def test_trigger_disruption_matches_hero_cascade(client):
    resp = _trigger_hero_disruption(client)
    assert resp.status_code == 200
    body = resp.json()

    impacts = {i["nodeId"]: i for i in body["impacts"]}
    assert impacts["del-leh"]["status"] == "broken"
    assert impacts["del-leh"]["causedBy"] == "del-connection"
    assert impacts["airport-transfer"]["status"] == "at-risk"
    assert impacts["grand-dragon"]["status"] == "at-risk"
    assert impacts["pangong-tour"]["status"] == "at-risk"
    assert impacts["nubra-valley"]["status"] == "healthy"
    assert impacts["leh-return"]["status"] == "healthy"
    assert body["tripHealthScore"] < 87  # dynamic drop from the seeded baseline


def test_simulate_preview_computes_real_health_and_financial_figures_not_zero(client):
    """The dry-run /simulate endpoint used by the disruption picker UI must
    compute a genuine preview, not the placeholder zeros it used to return."""
    resp = client.post(
        "/api/trips/trip-ladakh-2025/simulate", json={"type": "flight-delay", "delayMinutes": 180}
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["tripHealthScore"] > 0
    assert body["tripHealthScore"] < 87  # a broken connection must show a lower preview score than healthy
    assert body["disruption"]["financialExposure"] > 0

    # And it must be a true dry-run: nothing persisted.
    trip = client.get("/api/trips/trip-ladakh-2025").json()
    assert trip["healthScore"] == 87
    assert trip["status"] == "operational"
    assert all(n["status"] == "healthy" for n in trip["nodes"])


def test_unknown_disruption_type_is_400(client):
    resp = client.post("/api/trips/trip-ladakh-2025/disruptions", json={"type": "meteor-strike"})
    assert resp.status_code == 400


def test_recovery_options_require_active_disruption(client):
    resp = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    assert resp.status_code == 400


def test_generate_recovery_options_returns_ranked_feasible_plans(client):
    _trigger_hero_disruption(client)
    resp = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    assert resp.status_code == 200
    options = resp.json()
    assert len(options) >= 3
    scores = [o["score"] for o in options]
    assert scores == sorted(scores, reverse=True)


def test_apply_recovery_updates_trip_and_returns_activity_and_notification(client):
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    best = options[0]

    resp = client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": best["id"]})
    assert resp.status_code == 200
    body = resp.json()

    assert body["trip"]["status"] == "recovered"
    node_status = {n["id"]: n["status"] for n in body["trip"]["nodes"]}
    assert node_status["del-leh"] == "recovered"
    assert node_status["bom-del"] == "delayed"  # historical fact, not erased
    assert body["appliedRecovery"]["id"] == best["id"]
    assert body["activityEvent"]["message"].startswith("Recovery applied")
    assert body["notification"]["category"] == "recovery"


def test_apply_recovery_failure_partway_through_leaves_no_partial_state(client, monkeypatch):
    """Section 20's atomicity requirement: if anything fails mid-apply (after
    nodes/edges were already mutated in the session but before the final
    commit), the whole attempt must roll back - never a half-applied
    recovery where the graph was rewritten but the trip's own status/health
    score weren't, or vice versa."""
    import pytest

    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    best = options[0]

    from app.services import recovery_service

    def boom(*args, **kwargs):
        raise RuntimeError("simulated failure after node mutation, before commit")

    # compute_health_score runs AFTER apply_recovery has already rewritten
    # node schedules/edges in the session but BEFORE db.commit() - exactly
    # the "partway through" window this test needs to exercise.
    monkeypatch.setattr(recovery_service._itinerary_engine, "compute_health_score", boom)

    # Starlette's TestClient re-raises unhandled exceptions by default
    # (raise_server_exceptions=True) rather than converting them to the
    # 500 response a real deployment would return via the app's own
    # exception_handler(Exception) - so the exception propagating here IS
    # the expected behavior for this test client, not a bug. What actually
    # matters is exercised below: FastAPI's dependency-cleanup semantics
    # already ran get_db()'s `except Exception: db.rollback()` before this
    # exception reached us, so the session's pending mutations must be gone.
    with pytest.raises(RuntimeError, match="simulated failure"):
        client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": best["id"]})

    # Nothing from the FAILED apply persisted: the trip must still show
    # exactly the state as of the last successful request (generating
    # options legitimately committed "recovering" already) - not "recovered"
    # and not a half-rebooked itinerary.
    trip = client.get("/api/trips/trip-ladakh-2025").json()
    assert trip["status"] == "recovering"
    node_status = {n["id"]: n["status"] for n in trip["nodes"]}
    assert node_status["del-leh"] == "broken"

    # And the trip isn't left corrupted - normal operations still work.
    resp = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    assert resp.status_code == 200
    assert len(resp.json()) >= 3


def test_apply_unknown_recovery_id_is_404(client):
    _trigger_hero_disruption(client)
    client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    resp = client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": "not-a-real-id"})
    assert resp.status_code == 404


def test_reset_restores_healthy_state(client):
    _trigger_hero_disruption(client)
    resp = client.post("/api/trips/trip-ladakh-2025/reset")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "operational"
    assert body["healthScore"] == 87
    assert all(n["status"] == "healthy" for n in body["nodes"])
