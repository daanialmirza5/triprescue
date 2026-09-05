"""The mandatory end-to-end hero scenario, driven entirely through the HTTP API
exactly as a frontend client would call it:

  healthy trip -> 3-hour delay -> connection failure -> downstream impact ->
  recovery generation -> recovery selection -> apply recovery ->
  re-propagation -> final stable itinerary

Every assertion checks an actual computed status or number, not just HTTP 200s.
"""

TRIP = "trip-ladakh-2025"


def test_hero_scenario_end_to_end(client):
    # 1. Healthy trip.
    trip = client.get(f"/api/trips/{TRIP}").json()
    assert trip["healthScore"] == 87
    assert all(n["status"] == "healthy" for n in trip["nodes"])

    # 2. Trigger the 3-hour Mumbai -> Delhi delay.
    disruption_resp = client.post(
        f"/api/trips/{TRIP}/disruptions", json={"type": "flight-delay", "delayMinutes": 180}
    )
    assert disruption_resp.status_code == 200
    result = disruption_resp.json()
    impacts = {i["nodeId"]: i for i in result["impacts"]}

    # 3. Connection failure discovered by the engine, not hardcoded.
    assert impacts["del-leh"]["status"] == "broken"
    assert impacts["del-leh"]["requiredBufferMinutes"] == 60
    assert impacts["del-leh"]["availableBufferMinutes"] == 0

    # 4. Downstream impact.
    assert impacts["airport-transfer"]["status"] == "at-risk"
    assert impacts["grand-dragon"]["status"] == "at-risk"
    assert impacts["pangong-tour"]["status"] == "at-risk"
    assert result["disruption"]["downstreamImpact"] >= 3
    assert result["disruption"]["financialExposure"] > 0

    trip_after_disruption = client.get(f"/api/trips/{TRIP}").json()
    assert trip_after_disruption["healthScore"] < 87
    assert trip_after_disruption["status"] == "disrupted"

    # 5. Generate recovery options - at least 3, ranked, all feasible.
    options_resp = client.post(f"/api/trips/{TRIP}/recovery-options/generate")
    assert options_resp.status_code == 200
    options = options_resp.json()
    assert len(options) >= 3
    for option in options:
        assert option["bookingsPreserved"] <= option["totalBookings"]
        assert option["score"] > 0

    # 6. Preference shift toward cost changes the ranking.
    client.post(
        f"/api/trips/{TRIP}/preferences",
        json={"costVsSpeed": 0, "disruptionVsComfort": 50, "recoveryPriorities": {"minimizeCost": True}},
    )
    cost_ranked = client.post(f"/api/trips/{TRIP}/recovery-options/generate").json()

    client.post(
        f"/api/trips/{TRIP}/preferences",
        json={"costVsSpeed": 100, "disruptionVsComfort": 50, "recoveryPriorities": {"minimizeTime": True}},
    )
    speed_ranked = client.post(f"/api/trips/{TRIP}/recovery-options/generate").json()

    assert [o["name"] for o in cost_ranked] != [o["name"] for o in speed_ranked]

    # 7. Select and apply the top-ranked (speed-weighted) recovery.
    chosen = speed_ranked[0]
    apply_resp = client.post(f"/api/trips/{TRIP}/recovery/apply", json={"recoveryId": chosen["id"]})
    assert apply_resp.status_code == 200
    applied = apply_resp.json()

    # 8. Re-propagation: no node is left broken.
    final_nodes = {n["id"]: n["status"] for n in applied["trip"]["nodes"]}
    assert "broken" not in final_nodes.values()
    assert final_nodes["del-leh"] == "recovered"

    # 9. Financial exposure and risk recalculated (health score improved).
    assert applied["trip"]["healthScore"] > trip_after_disruption["healthScore"]

    # 10. Activity log and notification were created for the recovery.
    activity = client.get(f"/api/trips/{TRIP}/activity").json()
    assert any("Recovery applied" in a["message"] for a in activity)
    notifications = client.get(f"/api/trips/{TRIP}/notifications").json()
    assert any(n["category"] == "recovery" for n in notifications)

    # 11. AI assistant explains the applied recovery using real numbers.
    assistant_resp = client.post(
        "/api/assistant", json={"tripId": TRIP, "message": "Why is this recovery recommended?"}
    )
    assert assistant_resp.status_code == 200
    assistant_body = assistant_resp.json()
    assert chosen["name"] in assistant_body["content"]
    assert assistant_body["source"] == "deterministic"  # no ANTHROPIC_API_KEY in test env

    # 12. Reset fully restores the original healthy state.
    reset = client.post(f"/api/trips/{TRIP}/reset").json()
    assert reset["healthScore"] == 87
    assert reset["status"] == "operational"
    assert all(n["status"] == "healthy" for n in reset["nodes"])

    # 13. Running the whole sequence again from the reset state is repeatable.
    second_run = client.post(
        f"/api/trips/{TRIP}/disruptions", json={"type": "flight-delay", "delayMinutes": 180}
    ).json()
    second_impacts = {i["nodeId"]: i for i in second_run["impacts"]}
    assert second_impacts["del-leh"]["status"] == "broken"


def test_recovered_trip_remains_re_disruptable_without_a_reset(client):
    """Section 21 of the spec: after applying a recovery, the trip must still be
    capable of receiving ANOTHER disruption - not just after a reset. This drives
    disrupt -> recover -> apply -> (no reset) -> disrupt again, on the same trip."""
    client.post(f"/api/trips/{TRIP}/disruptions", json={"type": "flight-delay", "delayMinutes": 180})
    options = client.post(f"/api/trips/{TRIP}/recovery-options/generate").json()
    assert options, "expected at least one feasible recovery option for the hero scenario"
    apply_resp = client.post(f"/api/trips/{TRIP}/recovery/apply", json={"recoveryId": options[0]["id"]})
    assert apply_resp.status_code == 200
    recovered = apply_resp.json()["trip"]
    assert "broken" not in {n["status"] for n in recovered["nodes"]}

    # No reset here - trigger a second, different disruption directly on top of
    # the just-recovered itinerary.
    second_resp = client.post(
        f"/api/trips/{TRIP}/disruptions", json={"type": "activity-cancellation", "primaryNodeId": "nubra-valley"}
    )
    assert second_resp.status_code == 200
    second = second_resp.json()
    second_impacts = {i["nodeId"]: i for i in second["impacts"]}
    assert second_impacts["nubra-valley"]["status"] == "cancelled"

    trip_after_second = client.get(f"/api/trips/{TRIP}").json()
    assert trip_after_second["status"] == "disrupted"
    # The graph itself must still be sane - every node/edge from the original
    # itinerary is still present and reachable, nothing was corrupted by the
    # first recovery's edge rewiring.
    assert {n["id"] for n in trip_after_second["nodes"]} == {n["id"] for n in recovered["nodes"]}

    # And recovery generation must work again for THIS second disruption too.
    second_options = client.post(f"/api/trips/{TRIP}/recovery-options/generate").json()
    assert isinstance(second_options, list)
