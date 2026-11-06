"""Geocoding: the Nominatim provider (mocked via httpx.MockTransport - never a
real network call), the /api/geocode route, and lat/lng persistence on
user-created nodes so they get weather-risk scoring."""

import httpx
import pytest

from app.providers.geocoding_provider import NominatimGeocodingProvider


def _provider(handler) -> NominatimGeocodingProvider:
    return NominatimGeocodingProvider(client=httpx.Client(transport=httpx.MockTransport(handler)))


def test_nominatim_geocode_returns_first_result_and_sends_user_agent():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.params["q"] == "Fort Road, Leh"
        assert request.url.params["format"] == "json"
        assert request.url.params["limit"] == "1"
        assert request.headers["User-Agent"].startswith("SafarSathi/1.0")
        return httpx.Response(200, json=[{"lat": "34.1642", "lon": "77.5848", "display_name": "Leh"}])

    assert _provider(handler).geocode("Fort Road, Leh") == (34.1642, 77.5848)


@pytest.mark.parametrize(
    "response",
    [
        httpx.Response(200, json=[]),
        httpx.Response(503, text="unavailable"),
        httpx.Response(200, text="not json"),
        httpx.Response(200, json=[{"display_name": "no coords"}]),
        httpx.Response(200, json={"unexpected": "shape"}),
    ],
    ids=["empty-results", "non-200", "malformed-json", "missing-coords", "wrong-shape"],
)
def test_nominatim_geocode_returns_none_on_failure(response):
    assert _provider(lambda request: response).geocode("anywhere") is None


def test_nominatim_geocode_returns_none_on_timeout():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("timed out", request=request)

    assert _provider(handler).geocode("anywhere") is None


def test_geocode_route_returns_coordinates(client, monkeypatch):
    monkeypatch.setattr("app.api.routes.trips._geocoding_provider.geocode", lambda query: (34.16, 77.58))

    resp = client.post("/api/geocode", json={"query": "Leh"})

    assert resp.status_code == 200
    assert resp.json() == {"lat": 34.16, "lng": 77.58}


def test_geocode_route_returns_404_when_not_found(client, monkeypatch):
    monkeypatch.setattr("app.api.routes.trips._geocoding_provider.geocode", lambda query: None)

    resp = client.post("/api/geocode", json={"query": "nowhere at all"})

    assert resp.status_code == 404


def test_added_hotel_node_persists_lat_lng(client):
    trip = client.post(
        "/api/trips",
        json={"name": "Leh Trip", "origin": "Delhi", "destination": "Leh", "startDate": "2026-04-10", "endDate": "2026-04-13"},
    ).json()
    hotel = {
        "category": "hotel",
        "title": "Grand Dragon",
        "provider": "Direct",
        "confirmation": "GD-1",
        "location": "Old Road, Leh",
        "scheduledStart": "2026-04-10T14:00:00",
        "scheduledEnd": "2026-04-12T11:00:00",
        "cost": 200,
        "lat": 34.16,
        "lng": 77.58,
    }

    resp = client.post(f"/api/trips/{trip['id']}/nodes", json=hotel)

    assert resp.status_code == 201, resp.text
    node = resp.json()["nodes"][0]
    assert (node["lat"], node["lng"]) == (34.16, 77.58)
