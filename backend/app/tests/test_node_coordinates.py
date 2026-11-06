"""Custom hotels/activities keep client-geocoded coordinates for the map."""

BASE = {
    "category": "hotel",
    "title": "Stok Palace Heritage",
    "provider": "Heritage Hotels",
    "confirmation": "SPH-1",
    "location": "Stok, Leh",
    "scheduledStart": "2025-09-13T14:00:00",
    "scheduledEnd": "2025-09-14T11:00:00",
    "cost": 9000,
}


def test_coordinates_are_persisted(client):
    resp = client.post("/api/trips/trip-ladakh-2025/nodes", json={**BASE, "lat": 34.0667, "lng": 77.5667})
    assert resp.status_code == 201
    node = next(n for n in resp.json()["nodes"] if n["title"] == "Stok Palace Heritage")
    assert node["lat"] == 34.0667 and node["lng"] == 77.5667


def test_coordinates_are_optional(client):
    resp = client.post("/api/trips/trip-ladakh-2025/nodes", json=BASE)
    assert resp.status_code == 201
    node = next(n for n in resp.json()["nodes"] if n["title"] == "Stok Palace Heritage")
    assert node["lat"] is None and node["lng"] is None


def test_out_of_range_coordinates_are_rejected(client):
    assert client.post("/api/trips/trip-ladakh-2025/nodes", json={**BASE, "lat": 120, "lng": 10}).status_code == 422
