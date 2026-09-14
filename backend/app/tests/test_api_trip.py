def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"
    assert "environment" in body


def test_list_trips_returns_seeded_trips(client):
    resp = client.get("/api/trips")
    assert resp.status_code == 200
    ids = {t["id"] for t in resp.json()}
    assert "trip-ladakh-2025" in ids
    assert "trip-goa-2026" in ids
    assert "trip-rajasthan-2026" in ids


def test_get_trip_returns_healthy_ladakh_trip(client):
    resp = client.get("/api/trips/trip-ladakh-2025")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Aisha's Ladakh Expedition"
    assert len(body["nodes"]) == 8
    assert len(body["edges"]) == 7
    assert all(n["status"] == "healthy" for n in body["nodes"])


def test_get_trip_graph_matches_get_trip(client):
    trip = client.get("/api/trips/trip-ladakh-2025").json()
    graph = client.get("/api/trips/trip-ladakh-2025/graph").json()
    assert {n["id"] for n in trip["nodes"]} == {n["id"] for n in graph["nodes"]}
    assert {e["id"] for e in trip["edges"]} == {e["id"] for e in graph["edges"]}


def test_get_unknown_trip_is_404(client):
    resp = client.get("/api/trips/does-not-exist")
    assert resp.status_code == 404


def _register(client, name="Trip Creator", email="trip.creator@example.com", password="hunter2"):
    resp = client.post("/api/auth/register", json={"name": name, "email": email, "password": password})
    assert resp.status_code == 200, resp.text
    return resp.json()


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _valid_trip_payload(**overrides):
    payload = {
        "name": "Weekend in Kyoto",
        "origin": "Tokyo",
        "destination": "Kyoto",
        "startDate": "2026-04-10",
        "endDate": "2026-04-13",
    }
    payload.update(overrides)
    return payload


def test_authenticated_user_can_create_a_trip(client):
    user = _register(client)
    resp = client.post("/api/trips", json=_valid_trip_payload(), headers=_auth_header(user["token"]))
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["name"] == "Weekend in Kyoto"
    assert body["origin"] == "Tokyo"
    assert body["destination"] == "Kyoto"
    assert body["route"] == "Tokyo → Kyoto"
    assert body["nodes"] == []
    assert body["edges"] == []
    # Existing defaults, untouched by the request.
    assert body["tripValue"] == 0
    assert body["healthScore"] == 100
    assert body["status"] == "operational"


def test_created_trip_is_persisted_and_appears_in_the_list(client):
    user = _register(client)
    headers = _auth_header(user["token"])
    created = client.post("/api/trips", json=_valid_trip_payload(), headers=headers).json()

    listed = client.get("/api/trips", headers=headers).json()
    assert any(t["id"] == created["id"] for t in listed)

    fetched = client.get(f"/api/trips/{created['id']}", headers=headers).json()
    assert fetched["id"] == created["id"]
    assert fetched["name"] == "Weekend in Kyoto"


def test_created_trip_belongs_to_the_authenticated_traveler_only(client):
    owner = _register(client, name="Owner", email="owner@example.com")
    created = client.post(
        "/api/trips", json=_valid_trip_payload(), headers=_auth_header(owner["token"])
    ).json()

    other = _register(client, name="Someone Else", email="someone-else@example.com")
    resp = client.get(f"/api/trips/{created['id']}", headers=_auth_header(other["token"]))
    assert resp.status_code == 404

    listed_for_other = client.get("/api/trips", headers=_auth_header(other["token"])).json()
    assert all(t["id"] != created["id"] for t in listed_for_other)


def test_traveler_id_cannot_be_supplied_or_overridden_by_the_client(client):
    owner = _register(client, name="Owner", email="owner2@example.com")
    victim = _register(client, name="Victim", email="victim@example.com")

    # travelerId isn't part of TripCreateRequest at all, so this extra field
    # is simply ignored by the schema - the created trip is owned by the
    # authenticated caller (owner), never by the id an attacker supplies.
    resp = client.post(
        "/api/trips",
        json={**_valid_trip_payload(), "travelerId": victim["travelerId"]},
        headers=_auth_header(owner["token"]),
    )
    assert resp.status_code == 201
    created = resp.json()

    # The real owner can see it; the "victim" whose id was injected cannot.
    assert client.get(f"/api/trips/{created['id']}", headers=_auth_header(owner["token"])).status_code == 200
    assert (
        client.get(f"/api/trips/{created['id']}", headers=_auth_header(victim["token"])).status_code
        == 404
    )


def test_unauthenticated_trip_creation_falls_back_to_the_demo_traveler(client):
    """This app's existing, documented auth design (app/api/deps.py) falls
    every unauthenticated request back to the seeded demo traveler, for
    every mutation route, not just this one - it never rejects a request
    outright for lacking a token. Trip creation deliberately matches that
    same existing behavior rather than being special-cased: the trip is
    created and owned by the demo traveler, not left ownerless or leaking
    another real user's data."""
    resp = client.post("/api/trips", json=_valid_trip_payload())
    assert resp.status_code == 201
    created = resp.json()

    demo = client.get("/api/auth/demo-account").json()
    fetched = client.get(f"/api/trips/{created['id']}", headers=_auth_header(demo["token"]))
    assert fetched.status_code == 200


def test_invalid_date_range_is_rejected(client):
    user = _register(client, name="Date Tester", email="date.tester@example.com")
    resp = client.post(
        "/api/trips",
        json=_valid_trip_payload(startDate="2026-04-13", endDate="2026-04-10"),
        headers=_auth_header(user["token"]),
    )
    assert resp.status_code == 422


def test_missing_required_fields_are_rejected(client):
    user = _register(client, name="Field Tester", email="field.tester@example.com")
    resp = client.post(
        "/api/trips",
        json=_valid_trip_payload(name=""),
        headers=_auth_header(user["token"]),
    )
    assert resp.status_code == 422


def test_get_risks(client):
    resp = client.get("/api/trips/trip-ladakh-2025/risks")
    assert resp.status_code == 200
    body = resp.json()
    assert 0 <= body["score"]["tripResilience"] <= 100
    assert isinstance(body["cards"], list)


def test_get_bookings(client):
    resp = client.get("/api/trips/trip-ladakh-2025/bookings")
    assert resp.status_code == 200
    assert len(resp.json()) == 7  # 8 nodes minus the synthetic connection node


def _valid_flight_payload(**overrides):
    payload = {
        "category": "flight",
        "title": "Tokyo to Kyoto",
        "provider": "ANA",
        "confirmation": "ANA-1234",
        "originCode": "HND",
        "destinationCode": "KIX",
        "scheduledStart": "2026-04-10T09:00:00",
        "scheduledEnd": "2026-04-10T10:30:00",
        "cost": 15000,
    }
    payload.update(overrides)
    return payload


def _create_owned_trip(client, token):
    resp = client.post("/api/trips", json=_valid_trip_payload(), headers=_auth_header(token))
    assert resp.status_code == 201, resp.text
    return resp.json()


def test_authenticated_owner_can_add_a_flight(client):
    user = _register(client, name="Flight Adder", email="flight.adder@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=headers)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert len(body["nodes"]) == 1
    node = body["nodes"][0]
    assert node["category"] == "flight"
    assert node["title"] == "Tokyo to Kyoto"
    assert node["provider"] == "ANA"
    assert node["cost"] == 15000
    assert node["status"] == "healthy"
    # A lone node has no edges yet - not an invented dependency.
    assert body["edges"] == []


def test_flight_node_is_persisted(client):
    user = _register(client, name="Persist Tester", email="persist.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])
    client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=headers)

    fetched = client.get(f"/api/trips/{trip['id']}", headers=headers).json()
    assert len(fetched["nodes"]) == 1
    assert fetched["nodes"][0]["title"] == "Tokyo to Kyoto"


def test_flight_belongs_to_the_requested_owned_trip(client):
    user = _register(client, name="Owner Tester", email="owner.tester@example.com")
    headers = _auth_header(user["token"])
    trip_a = _create_owned_trip(client, user["token"])
    trip_b = client.post(
        "/api/trips", json=_valid_trip_payload(name="Second Trip"), headers=headers
    ).json()

    client.post(f"/api/trips/{trip_a['id']}/nodes", json=_valid_flight_payload(), headers=headers)

    assert len(client.get(f"/api/trips/{trip_a['id']}", headers=headers).json()["nodes"]) == 1
    assert len(client.get(f"/api/trips/{trip_b['id']}", headers=headers).json()["nodes"]) == 0


def test_missing_required_flight_fields_are_rejected(client):
    user = _register(client, name="Required Tester", email="required.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(title=""), headers=headers)
    assert resp.status_code == 422


def test_invalid_category_is_rejected(client):
    user = _register(client, name="Category Tester", email="category.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(
        f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(category="hotel"), headers=headers
    )
    assert resp.status_code == 422


def test_invalid_airport_code_is_rejected(client):
    user = _register(client, name="Airport Tester", email="airport.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(
        f"/api/trips/{trip['id']}/nodes",
        json=_valid_flight_payload(originCode="TokyoHaneda"),
        headers=headers,
    )
    assert resp.status_code == 422


def test_arrival_before_departure_is_rejected(client):
    user = _register(client, name="Time Tester", email="time.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(
        f"/api/trips/{trip['id']}/nodes",
        json=_valid_flight_payload(scheduledStart="2026-04-10T10:30:00", scheduledEnd="2026-04-10T09:00:00"),
        headers=headers,
    )
    assert resp.status_code == 422


def test_negative_cost_is_rejected(client):
    user = _register(client, name="Cost Tester", email="cost.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(
        f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(cost=-100), headers=headers
    )
    assert resp.status_code == 422


def test_a_different_authenticated_user_cannot_add_a_flight_to_the_trip(client):
    owner = _register(client, name="Real Owner", email="real.owner@example.com")
    trip = _create_owned_trip(client, owner["token"])

    intruder = _register(client, name="Intruder", email="intruder@example.com")
    resp = client.post(
        f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=_auth_header(intruder["token"])
    )
    assert resp.status_code == 404

    # And the owner's trip genuinely has no flight added by the attempt.
    fetched = client.get(f"/api/trips/{trip['id']}", headers=_auth_header(owner["token"])).json()
    assert fetched["nodes"] == []


def test_a_different_authenticated_user_cannot_retrieve_the_trip_or_its_flight(client):
    owner = _register(client, name="Real Owner Two", email="real.owner.two@example.com")
    headers = _auth_header(owner["token"])
    trip = _create_owned_trip(client, owner["token"])
    client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=headers)

    intruder = _register(client, name="Intruder Two", email="intruder.two@example.com")
    resp = client.get(f"/api/trips/{trip['id']}", headers=_auth_header(intruder["token"]))
    assert resp.status_code == 404


def test_single_node_zero_edge_trip_has_valid_health_score(client):
    user = _register(client, name="Health Tester", email="health.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    resp = client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=headers)
    assert resp.status_code == 201
    body = resp.json()
    assert 0 <= body["healthScore"] <= 100
    assert body["nodes"][0]["status"] == "healthy"


def test_node_and_booking_are_persisted_atomically(client, monkeypatch):
    """If db.commit() itself never completes, neither the node nor the
    booking (both already added/flushed into the same session by that
    point) may be left behind - get_db's rollback-on-exception (see
    app/database/session.py) is what actually guarantees that, the same
    mechanism apply_recovery's equivalent test already relies on. Patching
    Session.commit to fail is a direct test of that guarantee, rather than
    a seam elsewhere that (as an earlier version of this test mistakenly
    did) would fire only *after* a real commit already succeeded."""
    import pytest
    from sqlalchemy.orm import Session as OrmSession

    user = _register(client, name="Atomic Tester", email="atomic.tester@example.com")
    headers = _auth_header(user["token"])
    trip = _create_owned_trip(client, user["token"])

    def flaky_commit(self, *args, **kwargs):
        raise RuntimeError("simulated failure: commit never completes")

    monkeypatch.setattr(OrmSession, "commit", flaky_commit)

    with pytest.raises(RuntimeError, match="simulated failure"):
        client.post(f"/api/trips/{trip['id']}/nodes", json=_valid_flight_payload(), headers=headers)

    monkeypatch.undo()  # restore the real commit() for the read-only verification below

    fetched = client.get(f"/api/trips/{trip['id']}", headers=headers).json()
    assert fetched["nodes"] == []
    bookings = client.get(f"/api/trips/{trip['id']}/bookings", headers=headers).json()
    assert bookings == []


def test_get_activity_and_notifications(client):
    activity = client.get("/api/trips/trip-ladakh-2025/activity")
    assert activity.status_code == 200
    assert len(activity.json()) >= 1

    notifications = client.get("/api/trips/trip-ladakh-2025/notifications")
    assert notifications.status_code == 200


def test_set_preferences(client):
    resp = client.post(
        "/api/trips/trip-ladakh-2025/preferences",
        json={"costVsSpeed": 20, "disruptionVsComfort": 80, "recoveryPriorities": {}},
    )
    assert resp.status_code == 204
