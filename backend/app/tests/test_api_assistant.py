from app.services.assistant_service import _breakdown_component


def _trigger_hero_disruption(client):
    return client.post(
        "/api/trips/trip-ladakh-2025/disruptions",
        json={"type": "flight-delay", "delayMinutes": 180},
    )


def test_why_question_before_recovery_is_applied_does_not_crash(client):
    """Regression test: asking a 'why' question while recovery options exist
    but none has been applied yet used to raise
    `AttributeError: 'dict' object has no attribute 'cost'` - RecoveryPlan.
    score_breakdown is a raw JSON dict on the ORM model (see
    app/models/recovery.py), never a ScoreBreakdownOut instance, and the
    pre-apply "why" branch was accessing it with attribute syntax instead of
    dict access."""
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    top = max(options, key=lambda o: o["score"])

    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"  # no ANTHROPIC_API_KEY set in tests
    assert top["name"] in body["content"]
    assert "cost score" in body["content"]
    assert "n/a" not in body["content"]  # real breakdown data was present, not a fallback
    assert any(ref["id"] == top["id"] for ref in body["references"])


def test_why_question_after_recovery_is_applied_still_works(client):
    """The post-apply branch already used dict.get() correctly - confirms the
    pre-apply fix didn't change this existing, working behavior."""
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    best = options[0]
    client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": best["id"]})

    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert best["name"] in body["content"]
    assert "was applied because it scored highest" in body["content"]


def test_assistant_with_no_active_disruption_uses_deterministic_fallback(client):
    """No ANTHROPIC_API_KEY is set in the test environment, so every request
    exercises the deterministic responder - this asserts that explicitly
    rather than only incidentally, and covers the "why" keyword on a healthy
    trip (no disruption, no recovery options) without crashing."""
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert "healthy" in body["content"].lower()


def test_breakdown_component_handles_missing_or_partial_data_without_crashing():
    breakdown = {"cost": 42, "speed": 90}
    assert _breakdown_component(breakdown, "cost") == "42"
    assert _breakdown_component(breakdown, "risk") == "n/a"
    assert _breakdown_component({}, "cost") == "n/a"
