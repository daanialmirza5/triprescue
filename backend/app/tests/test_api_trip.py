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
