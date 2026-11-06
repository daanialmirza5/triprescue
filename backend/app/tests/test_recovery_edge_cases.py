"""Regression tests for recovery/disruption edge cases found in the live audit:
first-leg cancellations, re-applying or applying stale plans, mismatched
booking types, out-of-range delays, and read-only option listing."""

import pytest

TRIP = "trip-ladakh-2025"


def _disrupt(client, **body):
    resp = client.post(f"/api/trips/{TRIP}/disruptions", json=body)
    assert resp.status_code == 200, resp.text
    return resp.json()


def _generate(client):
    resp = client.post(f"/api/trips/{TRIP}/recovery-options/generate")
    assert resp.status_code == 200, resp.text
    return resp.json()


def _apply(client, plan_id):
    return client.post(f"/api/trips/{TRIP}/recovery/apply", json={"recoveryId": plan_id})


def test_cancelling_the_first_flight_rebooks_that_flight_and_recovers(client):
    # The first leg has no upstream node; this used to overflow datetime.max -> 500,
    # and the engine targeted the last leg instead of the cancelled flight.
    _disrupt(client, type="flight-cancellation", primaryNodeId="bom-del")
    options = _generate(client)
    feasible = [o for o in options if o["feasible"]]
    assert feasible, options
    assert all(any(c["nodeId"] == "bom-del" and c["changeType"] == "rebooked" for c in o["changes"]) for o in feasible)

    assert _apply(client, feasible[0]["id"]).status_code == 200
    trip = client.get(f"/api/trips/{TRIP}").json()
    assert trip["status"] == "recovered"
    assert next(n for n in trip["nodes"] if n["id"] == "bom-del")["status"] == "recovered"


@pytest.mark.parametrize("disruption", ["hotel-cancellation", "transfer-failure", "activity-cancellation"])
def test_rebooking_a_cancelled_booking_leaves_the_trip_recovered(client, disruption):
    _disrupt(client, type=disruption)
    feasible = [o for o in _generate(client) if o["feasible"]]
    assert feasible
    assert _apply(client, feasible[0]["id"]).status_code == 200
    assert client.get(f"/api/trips/{TRIP}").json()["status"] == "recovered"


def test_missed_connection_produces_feasible_rebooking(client):
    _disrupt(client, type="missed-connection")
    options = _generate(client)
    feasible = [o for o in options if o["feasible"]]
    assert feasible, options
    assert _apply(client, feasible[0]["id"]).status_code == 200
    trip = client.get(f"/api/trips/{TRIP}").json()
    assert trip["status"] == "recovered"


def test_absorbed_delay_offers_an_explicit_keep_current_plan(client):
    _disrupt(client, type="activity-delay", delayMinutes=30)
    options = _generate(client)
    assert [o["name"] for o in options] == ["Keep your current plan"]
    assert options[0]["feasible"] and options[0]["changes"] == []
    assert _apply(client, options[0]["id"]).status_code == 200


def test_a_plan_cannot_be_applied_twice(client):
    _disrupt(client, type="flight-delay", delayMinutes=180)
    plan = _generate(client)[0]
    assert _apply(client, plan["id"]).status_code == 200
    again = _apply(client, plan["id"])
    assert again.status_code == 409
    events = client.get(f"/api/trips/{TRIP}/activity").json()
    assert sum(e["message"].startswith("Recovery applied") for e in events) == 1


def test_plan_from_an_earlier_disruption_is_rejected(client):
    _disrupt(client, type="flight-delay", delayMinutes=180)
    old_plan = _generate(client)[0]
    _disrupt(client, type="hotel-conflict")

    resp = _apply(client, old_plan["id"])

    assert resp.status_code == 409
    assert "earlier disruption" in resp.json()["detail"]
    # The current disruption is untouched and still recoverable.
    assert any(o["feasible"] for o in _generate(client))


def test_listing_options_is_read_only(client):
    _disrupt(client, type="flight-delay", delayMinutes=180)
    generated = _generate(client)
    before = client.get(f"/api/trips/{TRIP}/activity").json()

    listed = client.get(f"/api/trips/{TRIP}/recovery-options").json()
    listed_again = client.get(f"/api/trips/{TRIP}/recovery-options").json()

    assert [o["id"] for o in listed] == [o["id"] for o in generated] == [o["id"] for o in listed_again]
    assert client.get(f"/api/trips/{TRIP}/activity").json() == before


def test_listing_options_without_a_disruption_is_empty(client):
    assert client.get(f"/api/trips/{TRIP}/recovery-options").json() == []


@pytest.mark.parametrize(
    ("disruption", "node"),
    [("flight-delay", "grand-dragon"), ("hotel-cancellation", "bom-del"), ("transfer-failure", "pangong-tour")],
)
def test_disruption_type_must_fit_the_booking(client, disruption, node):
    body = {"type": disruption, "primaryNodeId": node}
    if disruption == "flight-delay":
        body["delayMinutes"] = 60
    resp = client.post(f"/api/trips/{TRIP}/disruptions", json=body)
    assert resp.status_code == 400
    assert client.post(f"/api/trips/{TRIP}/simulate", json=body).status_code == 400


@pytest.mark.parametrize("delay", [-50, 48 * 60 + 1])
def test_out_of_range_delays_are_rejected(client, delay):
    body = {"type": "flight-delay", "delayMinutes": delay}
    assert client.post(f"/api/trips/{TRIP}/disruptions", json=body).status_code == 422
    assert client.post(f"/api/trips/{TRIP}/simulate", json=body).status_code == 422


def test_later_flight_can_be_targeted_explicitly(client):
    result = _disrupt(client, type="flight-delay", delayMinutes=120, primaryNodeId="leh-return")
    assert result["disruption"]["primaryNodeId"] == "leh-return"


def test_catalogued_route_on_another_date_still_offers_flights():
    # BOM->GOI is catalogued only on the seeded Goa trip's dates; a traveler's
    # own trip on that route months later must still get alternatives.
    from datetime import datetime

    from app.providers.mock_flight_provider import MockFlightProvider

    after = datetime(2026, 12, 1, 8, 0)
    options = MockFlightProvider().get_alternatives("BOM", "GOI", after, exclude_confirmation="ABC")
    assert options and all(o.departure >= after for o in options)


def test_a_recovered_trip_still_cascades_on_the_next_disruption(client):
    # Applying a recovery used to delete every dependency edge into a rebooked or
    # rescheduled booking, so a later disruption on the recovered trip no longer
    # propagated. The edges must survive and keep cascading.
    edges_before = {(e["source"], e["target"]) for e in client.get(f"/api/trips/{TRIP}").json()["edges"]}
    _disrupt(client, type="flight-delay", delayMinutes=180)
    plan = next(o for o in _generate(client) if o["feasible"])
    assert _apply(client, plan["id"]).status_code == 200
    recovered = client.get(f"/api/trips/{TRIP}").json()
    assert recovered["status"] == "recovered"
    assert {(e["source"], e["target"]) for e in recovered["edges"]} == edges_before

    second = _disrupt(client, type="transfer-failure")
    unhealthy = {i["nodeId"] for i in second["impacts"] if i["status"] != "healthy"}
    assert {"airport-transfer", "grand-dragon", "pangong-tour"} <= unhealthy


def test_airport_closure_is_recoverable_end_to_end(client):
    result = _disrupt(client, type="airport-closure")
    assert result["disruption"]["primaryNodeId"] == "del-leh"
    feasible = [o for o in _generate(client) if o["feasible"]]
    assert feasible
    assert _apply(client, feasible[0]["id"]).status_code == 200
    assert client.get(f"/api/trips/{TRIP}").json()["status"] == "recovered"


def _without_ids(obj):
    if isinstance(obj, dict):
        return {k: _without_ids(v) for k, v in obj.items() if k != "id"}
    if isinstance(obj, list):
        return [_without_ids(v) for v in obj]
    return obj


def test_same_disruption_gives_identical_propagation_risk_and_ranking(client):
    runs = []
    for _ in range(2):
        client.post(f"/api/trips/{TRIP}/reset")
        propagation = _disrupt(client, type="flight-delay", delayMinutes=180)
        risks = client.get(f"/api/trips/{TRIP}/risks").json()
        ranking = _generate(client)
        runs.append(_without_ids({"propagation": propagation, "risks": risks, "ranking": ranking}))
    assert runs[0] == runs[1]  # only generated ids may differ between runs


@pytest.mark.parametrize(
    ("disruption", "primary", "provider_kw"),
    [
        ("transfer-failure", "airport-transfer", {"transfer_provider": "timeout"}),
        ("transfer-failure", "airport-transfer", {"transfer_provider": "empty"}),
        ("activity-cancellation", "pangong-tour", {"activity_provider": "timeout"}),
        ("activity-cancellation", "pangong-tour", {"activity_provider": "empty"}),
    ],
)
def test_transfer_and_activity_provider_failures_become_explanatory_plans(disruption, primary, provider_kw):
    from app.engines.propagation_engine import PropagationEngine
    from app.engines.recovery_engine import RecoveryEngine
    from app.providers.mock_activity_provider import MockActivityProvider
    from app.providers.mock_flight_provider import MockFlightProvider
    from app.providers.mock_hotel_provider import MockHotelProvider
    from app.providers.mock_transfer_provider import MockTransferProvider
    from app.tests.fixtures import ladakh_edges, ladakh_nodes

    classes = {"flight_provider": MockFlightProvider, "hotel_provider": MockHotelProvider,
               "activity_provider": MockActivityProvider, "transfer_provider": MockTransferProvider}
    providers = {name: cls(failure_mode=provider_kw.get(name)) for name, cls in classes.items()}
    nodes, edges = ladakh_nodes(), ladakh_edges()
    detected = next(n for n in nodes if n.id == primary).scheduled_start
    impacts = PropagationEngine().propagate(nodes, edges, primary, disruption, None, detected).impacts

    plans = RecoveryEngine(**providers).generate_plans(nodes, edges, impacts, primary, disruption, None, detected, {})

    assert len(plans) == 1 and not plans[0].feasible
    assert plans[0].provider_reason and "No options from" in plans[0].provider_reason


def test_disruption_narrative_explains_the_cascade_in_plain_language(client):
    result = _disrupt(client, type="flight-delay", delayMinutes=180)
    narrative = result["disruption"]["narrative"]
    assert narrative.startswith("Mumbai → Delhi is running 3h late.")
    assert "Because Mumbai → Delhi runs late, Delhi → Leh can no longer be made" in narrative
    assert "at risk of a late arrival" in narrative and "unaffected" in narrative
    # Same narrative from the dry-run preview and from re-propagation on reload.
    client.post(f"/api/trips/{TRIP}/reset")
    preview = client.post(f"/api/trips/{TRIP}/simulate", json={"type": "flight-delay", "delayMinutes": 180}).json()
    assert preview["disruption"]["narrative"] == narrative
    _disrupt(client, type="flight-delay", delayMinutes=180)
    assert client.post(f"/api/trips/{TRIP}/propagate").json()["disruption"]["narrative"] == narrative


def test_disruption_narrative_for_an_absorbed_delay_says_nothing_else_changes(client):
    narrative = _disrupt(client, type="activity-delay", delayMinutes=30)["disruption"]["narrative"]
    assert "nothing else needs to change" in narrative


def test_cancelled_first_leg_narrative_names_the_cancellation(client):
    narrative = _disrupt(client, type="flight-cancellation", primaryNodeId="bom-del")["disruption"]["narrative"]
    assert "Because Mumbai → Delhi was cancelled, Delhi → Leh can no longer be made" in narrative
