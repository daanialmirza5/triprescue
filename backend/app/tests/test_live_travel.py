"""Live travel data (Aviationstack, RailRadar, Overpass, Ticketmaster) and
adding discovered items to trips. Every provider runs against a faked HTTP
transport - no network, no real keys."""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from urllib.parse import parse_qs

import httpx
import pytest

from app.providers import live as live_pkg
from app.providers.live import LiveProviders
from app.providers.live.aviationstack import AviationstackProvider
from app.providers.live.aviationstack import normalize as normalize_flight
from app.providers.live.common import RedactSecretsFilter, TTLCache
from app.providers.live.overpass import OverpassProvider, build_query, clean_query
from app.providers.live.railradar import RailRadarProvider
from app.providers.live.ticketmaster import TicketmasterProvider

TRIP = "trip-ladakh-2025"
NOW = datetime(2026, 9, 27, 10, 0, tzinfo=timezone.utc)

FLIGHT = {
    "flight_date": "2026-09-27",
    "flight_status": "active",
    "departure": {"airport": "Chhatrapati Shivaji International", "iata": "BOM", "delay": 18,
                  "scheduled": "2026-09-27T08:00:00+00:00", "estimated": "2026-09-27T08:18:00+00:00", "actual": "2026-09-27T08:20:00+00:00"},
    "arrival": {"airport": "Indira Gandhi International", "iata": "DEL", "delay": 12,
                "scheduled": "2026-09-27T10:10:00+00:00", "estimated": "2026-09-27T10:22:00+00:00", "actual": None},
    "airline": {"name": "Air India", "iata": "AI"},
    "flight": {"number": "101", "iata": "AI101", "icao": "AIC101"},
    "aircraft": {"registration": "VT-ALJ", "iata": "B77W"},
    "live": {"updated": "2026-09-27T09:12:00+00:00", "latitude": 22.5, "longitude": 75.1, "altitude": 10668.0,
             "direction": 25.0, "speed_horizontal": 820.0, "speed_vertical": 0, "is_ground": False},
}

TRAIN_LIVE = {
    "success": True,
    "data": {
        "trainNumber": "12951", "trainName": "Mumbai Rajdhani", "startDate": "2026-09-26T00:00:00+05:30",
        "lastUpdatedAt": "2026-09-27T09:30:00+05:30", "status": "RUNNING", "delayMinutes": 18,
        "train": {"number": "12951", "name": "Mumbai Rajdhani", "source": {"code": "MMCT", "name": "Mumbai Central"},
                  "destination": {"code": "NDLS", "name": "New Delhi"}},
        "currentLocation": {"stationCode": "UJN", "status": "DEPARTED", "isDiverted": False, "speedKmh": 65, "bearingDegrees": 40},
        "previousHalt": {"stationCode": "RTM", "stationName": "Ratlam Jn"},
        "nextHalt": {"stationCode": "KOTA", "stationName": "Kota Jn"},
        "exceptions": [],
        "route": [
            {"sequence": 1, "stationCode": "MMCT", "stationName": "Mumbai Central", "isHalt": True, "lat": 18.9696, "lng": 72.8194,
             "scheduledDeparture": "2026-09-26T17:00:00+05:30", "actualDeparture": "2026-09-26T17:02:00+05:30", "platform": "3"},
            {"sequence": 2, "stationCode": "UJN", "stationName": "Ujjain Jn", "isHalt": False, "lat": 23.1765, "lng": 75.7885,
             "scheduledDeparture": "2026-09-27T01:00:00+05:30"},
            {"sequence": 3, "stationCode": "KOTA", "stationName": "Kota Jn", "isHalt": True, "lat": 25.1790, "lng": 75.8330,
             "scheduledDeparture": "2026-09-27T04:00:00+05:30", "platform": "1"},
            {"sequence": 4, "stationCode": "NDLS", "stationName": "New Delhi", "isHalt": True, "lat": 28.6431, "lng": 77.2197,
             "scheduledArrival": "2026-09-27T08:35:00+05:30", "scheduledDeparture": None},
        ],
        "isLive": True,
    },
}

TRAINS_BETWEEN = {
    "success": True,
    "data": {
        "from": {"code": "MMCT", "name": "Mumbai Central"}, "to": {"code": "NDLS", "name": "New Delhi"}, "count": 1,
        "trains": [{"train": {"number": "12951", "name": "Mumbai Rajdhani", "type": "rajdhani", "runDays": ["Mon", "Tue"]},
                    "from": {"departure": "17:00", "day": 1}, "to": {"arrival": "08:35", "day": 2}, "duration": 935,
                    "live": {"delayMinutes": 5, "platform": "3"}}],
    },
}

OVERPASS_HOTELS = {"elements": [
    {"type": "node", "id": 101, "lat": 15.49, "lon": 73.82, "tags": {"tourism": "hotel", "name": "Hotel Mandovi", "stars": "3",
                                                                     "addr:street": "D B Marg", "addr:city": "Panaji", "website": "https://mandovi.example"}},
    {"type": "way", "id": 202, "center": {"lat": 15.5, "lon": 73.83}, "tags": {"tourism": "guest_house", "name": "Casa Goa", "website": "javascript:alert(1)"}},
    {"type": "node", "id": 303, "lat": 15.5, "lon": 73.8, "tags": {"tourism": "hotel"}},  # no name -> skipped
    {"type": "node", "id": 101, "lat": 15.49, "lon": 73.82, "tags": {"tourism": "hotel", "name": "Hotel Mandovi"}},  # duplicate
]}

OVERPASS_PLACES = {"elements": [
    {"type": "way", "id": 9, "center": {"lat": 15.4966, "lon": 73.7735}, "tags": {"historic": "fort", "name": "Fort Aguada"}},
    {"type": "node", "id": 10, "lat": 15.55, "lon": 73.75, "tags": {"natural": "beach", "name": "Calangute Beach"}},
]}

TM_EVENTS = {"_embedded": {"events": [{
    "id": "Z7r9jZ1A7", "name": "Sunburn Arena", "url": "https://www.ticketmaster.com/event/Z7r9jZ1A7",
    "images": [{"url": "https://s1.ticketm.net/a.jpg", "ratio": "16_9", "width": 1024}, {"url": "https://s1.ticketm.net/b.jpg", "ratio": "3_2", "width": 640}],
    "dates": {"start": {"localDate": "2026-10-03", "dateTime": "2026-10-03T14:30:00Z"}, "status": {"code": "onsale"}},
    "classifications": [{"segment": {"name": "Music"}, "genre": {"name": "Dance/Electronic"}}],
    "_embedded": {"venues": [{"name": "Vagator Beach", "city": {"name": "Goa"}, "location": {"latitude": "15.6", "longitude": "73.74"}}]},
}]}}


class Fake:
    """Programmable HTTP backend recording every request."""

    def __init__(self):
        self.requests: list[httpx.Request] = []
        self.routes: dict[str, httpx.Response] = {}

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        for prefix, response in self.routes.items():
            if request.url.path.startswith(prefix):
                return response
        return httpx.Response(404, json={"error": "nope"})


@pytest.fixture()
def fake():
    return Fake()


@pytest.fixture()
def providers(fake):
    client = httpx.Client(transport=httpx.MockTransport(fake))
    registry = LiveProviders(
        flights=AviationstackProvider("av-secret", "https://api.aviationstack.com/v1", client=client),
        trains=RailRadarProvider("rr-secret", "https://api.railradar.in", client=client),
        places=OverpassProvider("https://overpass.test/api/interpreter", client=client),
        events=TicketmasterProvider("tm-secret", "https://app.ticketmaster.com", client=client),
    )
    live_pkg.set_registry(registry)
    yield registry
    live_pkg.set_registry(None)


# ---- Flights ------------------------------------------------------------------------------------


def test_flight_normalization_keeps_provider_values():
    f = normalize_flight(FLIGHT, NOW)
    assert (f.mode, f.source, f.data_source, f.number, f.operator) == ("flight", "aviationstack", "live", "AI101", "Air India")
    assert f.external_id == "AI101@2026-09-27" and f.status == "en_route" and f.delay_minutes == 12
    assert (f.current_location.latitude, f.current_location.longitude) == (22.5, 75.1)
    assert f.altitude_meters == 10668.0 and f.speed_kmh == 820.0 and f.heading == 25.0
    assert f.origin.code == "BOM" and f.destination.code == "DEL"
    assert f.actual_departure.isoformat() == "2026-09-27T08:20:00+00:00" and f.actual_arrival is None
    assert f.last_updated_at.isoformat() == "2026-09-27T09:12:00+00:00"


def test_flight_without_live_position_has_no_coordinates():
    f = normalize_flight({**FLIGHT, "flight_status": "scheduled", "live": None}, NOW)
    assert f.current_location is None and f.status == "scheduled" and f.last_updated_at == NOW


def test_flight_search_queries_only_the_requested_flight_and_caches(client, providers, fake):
    fake.routes["/v1/flights"] = httpx.Response(200, json={"data": [FLIGHT]})
    first = client.get("/api/live/flights", params={"flightNumber": "ai 101"})
    second = client.get("/api/live/flights", params={"flightNumber": "AI101"})
    assert first.status_code == 200 and second.json() == first.json()
    body = first.json()[0]
    assert body["dataSource"] == "live" and body["currentLocation"] == {"latitude": 22.5, "longitude": 75.1}
    assert len(fake.requests) == 1  # second call served from cache
    params = parse_qs(fake.requests[0].url.query.decode())
    assert params["flight_iata"] == ["AI101"] and params["access_key"] == ["av-secret"]


def test_flight_search_requires_a_filter(client, providers):
    assert client.get("/api/live/flights").status_code == 400


@pytest.mark.parametrize("status,expected_code,message", [
    (401, 503, "Live provider authentication is not configured."),
    (429, 429, "Live provider request limit reached. Please try again shortly."),
    (500, 503, "Live provider temporarily unavailable."),
])
def test_flight_provider_errors_are_friendly_and_never_faked(client, providers, fake, status, expected_code, message):
    fake.routes["/v1/flights"] = httpx.Response(status, json={"error": {"code": "raw_provider_detail"}})
    resp = client.get("/api/live/flights/AI101")
    assert resp.status_code == expected_code
    assert resp.json() == {"detail": message}


def test_flight_error_in_200_body_and_missing_flight(client, providers, fake):
    fake.routes["/v1/flights"] = httpx.Response(200, json={"error": {"code": "usage_limit_reached"}})
    assert client.get("/api/live/flights/AI101").status_code == 429
    providers.flights._cache.clear()
    fake.routes["/v1/flights"] = httpx.Response(200, json={"data": []})
    resp = client.get("/api/live/flights/AI999")
    assert resp.status_code == 404 and resp.json()["detail"] == "No live record found."


def test_missing_keys_mean_not_configured(client):
    live_pkg.set_registry(LiveProviders(
        flights=AviationstackProvider(None, "https://x"), trains=RailRadarProvider(None, "https://x"),
        places=OverpassProvider("https://x"), events=TicketmasterProvider(None, "https://x"),
    ))
    try:
        assert client.get("/api/live/flights/AI101").json()["detail"] == "Live provider authentication is not configured."
        assert client.get("/api/live/trains/12951").status_code == 503
        assert client.get("/api/events", params={"city": "Goa"}).status_code == 503
        health = client.get("/api/live/health").json()
        assert health["flights"] == {"provider": "aviationstack", "available": False, "configured": False,
                                     "detail": "AVIATIONSTACK_API_KEY is not configured on the server."}
        assert health["places"]["available"] is True
    finally:
        live_pkg.set_registry(None)


# ---- Trains ---------------------------------------------------------------------------------


def test_train_live_status_uses_provider_location(client, providers, fake):
    fake.routes["/v1/trains/12951/live"] = httpx.Response(200, json=TRAIN_LIVE)
    resp = client.get("/api/live/trains/12951")
    assert resp.status_code == 200
    t = resp.json()
    assert (t["mode"], t["source"], t["number"], t["name"], t["status"]) == ("train", "railradar", "12951", "Mumbai Rajdhani", "en_route")
    assert t["delayMinutes"] == 18 and t["speedKmh"] == 65
    assert t["currentLocation"] == {"latitude": 23.1765, "longitude": 75.7885} and t["currentLocationName"] == "Ujjain Jn"
    assert t["nextStop"]["name"] == "Kota Jn" and t["previousStop"]["name"] == "Ratlam Jn" and t["platform"] == "1"
    assert t["externalId"] == "12951@2026-09-26"
    assert [s["code"] for s in t["route"]] == ["MMCT", "KOTA", "NDLS"]  # halts only
    request = fake.requests[0]
    assert request.headers["Authorization"] == "Bearer rr-secret"
    assert request.url.params["includeCoordinates"] == "true"


def test_train_cancellation_and_unknown_train(client, providers, fake):
    cancelled = json.loads(json.dumps(TRAIN_LIVE))
    cancelled["data"]["status"] = "CANCELLED"
    cancelled["data"]["exceptions"] = [{"type": "CANCELLED", "message": "Cancelled due to flooding"}]
    fake.routes["/v1/trains/12951/live"] = httpx.Response(200, json=cancelled)
    t = client.get("/api/live/trains/12951").json()
    assert t["status"] == "cancelled" and "Cancelled due to flooding" in t["notices"]
    assert client.get("/api/live/trains/99999").json() == {"detail": "No live record found."}
    assert client.get("/api/live/trains/12A").status_code == 400


def test_trains_between_stations(client, providers, fake):
    fake.routes["/v1/trains/between/MMCT/NDLS"] = httpx.Response(200, json=TRAINS_BETWEEN)
    body = client.get("/api/live/trains/between", params={"from": "mmct", "to": "ndls", "date": "2026-09-28"}).json()
    train = body["trains"][0]
    assert (train["number"], train["departureTime"], train["arrivalTime"], train["arrivalDayOffset"]) == ("12951", "17:00", "08:35", 1)
    assert train["externalId"] == "12951@2026-09-28" and train["liveDelayMinutes"] == 5


# ---- Hotels + attractions -----------------------------------------------------------------------


def test_hotel_search_normalizes_osm_without_inventing_fields(client, providers, fake):
    fake.routes["/api/interpreter"] = httpx.Response(200, json=OVERPASS_HOTELS)
    resp = client.get("/api/places/hotels", params={"city": "Goa", "radius": 4000})
    assert resp.status_code == 200
    hotels = resp.json()
    assert [h["name"] for h in hotels] == ["Hotel Mandovi", "Casa Goa"]  # nameless skipped, duplicate merged
    mandovi, casa = hotels
    assert mandovi["externalId"] == "node/101" and mandovi["stars"] == 3 and mandovi["city"] == "Panaji"
    assert mandovi["sourceUrl"] == "https://www.openstreetmap.org/node/101" and mandovi["phone"] is None
    assert casa["website"] is None  # unsafe link dropped
    assert "price" not in mandovi and "availability" not in mandovi
    query = parse_qs(fake.requests[0].content.decode())["data"][0]
    assert "around:4000,15.49090,73.82780" in query  # Goa from the catalog


def test_place_name_filter_cannot_inject_overpass(providers):
    assert clean_query('beach"];out;node(1);("') == "beachoutnode1"
    q = build_query([("natural", ["beach"])], 15.0, 73.0, 1000, 5, clean_query('fort"]'))
    assert q.count('"') % 2 == 0 and '["name"~"fort",i]' in q


def test_attraction_categories(client, providers, fake):
    fake.routes["/api/interpreter"] = httpx.Response(200, json=OVERPASS_PLACES)
    places = client.get("/api/places/attractions", params={"city": "Goa", "category": "forts"}).json()
    assert {p["name"]: p["category"] for p in places} == {"Fort Aguada": "fort", "Calangute Beach": "beach"}
    query = parse_qs(fake.requests[0].content.decode())["data"][0]
    assert '"historic"~"^(fort|castle)$"' in query and "natural" not in query
    assert client.get("/api/places/attractions", params={"city": "Goa", "category": "casinos"}).status_code == 400
    assert client.get("/api/places/hotels").status_code == 400  # a destination is required


# ---- Events ------------------------------------------------------------------------------------


def test_events_are_ticketmaster_india_only(client, providers, fake):
    fake.routes["/discovery/v2/events.json"] = httpx.Response(200, json=TM_EVENTS)
    events = client.get("/api/events", params={"city": "Goa", "startDate": "2026-10-01", "endDate": "2026-10-07", "category": "music"}).json()
    e = events[0]
    assert (e["source"], e["externalId"], e["venue"], e["city"], e["status"]) == ("ticketmaster", "Z7r9jZ1A7", "Vagator Beach", "Goa", "onsale")
    assert e["imageUrl"] == "https://s1.ticketm.net/a.jpg" and e["category"] == "Music · Dance/Electronic"
    assert e["startTime"].startswith("2026-10-03T14:30:00") and e["endTime"] is None
    params = fake.requests[0].url.params
    assert params["countryCode"] == "IN" and params["city"] == "Goa" and params["classificationName"] == "Music"
    assert params["startDateTime"] == "2026-10-01T00:00:00Z" and params["endDateTime"] == "2026-10-07T23:59:59Z"
    bad = client.get("/api/events", params={"city": "Goa", "startDate": "2026-10-07", "endDate": "2026-10-01"})
    assert bad.status_code == 400


def test_destinations_catalog_search(client):
    names = [d["name"] for d in client.get("/api/destinations", params={"query": "kerala"}).json()]
    assert names == ["Kochi", "Munnar"]
    goa = client.get("/api/destinations", params={"query": "goa"}).json()[0]
    assert (goa["airportCode"], goa["stationCode"]) == ("GOI", "MAO")
    assert len(client.get("/api/destinations").json()) == 32


# ---- Trip integration ---------------------------------------------------------------------------


def _add(client, **item):
    return client.post(f"/api/trips/{TRIP}/external-items", json=item)


HOTEL_ITEM = dict(kind="hotel", source="openstreetmap", externalId="node/101", title="Hotel Mandovi", location="Panaji",
                  scheduledStart="2025-09-14T14:00:00", scheduledEnd="2025-09-16T11:00:00", lat=15.49, lng=73.82)


def test_add_every_kind_to_the_existing_trip(client, providers):
    before = len(client.get(f"/api/trips/{TRIP}").json()["nodes"])
    items = [
        dict(kind="flight", source="aviationstack", externalId="AI101@2026-09-27", title="AI101 Mumbai → Delhi", operator="Air India",
             originCode="BOM", destinationCode="DEL", scheduledStart="2025-09-18T08:00:00", scheduledEnd="2025-09-18T10:10:00"),
        dict(kind="train", source="railradar", externalId="12951@2025-09-18", title="12951 Mumbai Rajdhani",
             originCode="MMCT", destinationCode="NDLS", scheduledStart="2025-09-18T17:00:00", scheduledEnd="2025-09-19T08:35:00"),
        HOTEL_ITEM,
        dict(kind="attraction", source="openstreetmap", externalId="way/9", title="Fort Aguada", location="Goa",
             scheduledStart="2025-09-15T10:00:00", scheduledEnd="2025-09-15T12:00:00", lat=15.4966, lng=73.7735),
        dict(kind="event", source="ticketmaster", externalId="Z7r9jZ1A7", title="Sunburn Arena", location="Vagator Beach",
             scheduledStart="2025-09-15T20:00:00", scheduledEnd="2025-09-15T22:00:00"),
    ]
    for item in items:
        resp = _add(client, **item)
        assert resp.status_code == 200, resp.json()
        assert resp.json()["alreadyAdded"] is False
    trip = client.get(f"/api/trips/{TRIP}").json()
    added = {n["title"]: n for n in trip["nodes"]}
    assert len(trip["nodes"]) == before + 5
    assert added["AI101 Mumbai → Delhi"]["category"] == "flight"
    assert added["Train 12951 Mumbai Rajdhani"]["category"] == "transfer"  # trains ride on transfer nodes
    assert added["Hotel Mandovi"]["category"] == "hotel" and added["Fort Aguada"]["category"] == "activity"
    assert added["Sunburn Arena"]["scheduledStart"].startswith("2025-09-15T20:00")  # the event's own date
    assert added["Hotel Mandovi"]["cost"] == 0 and "Not booked · OpenStreetMap" in added["Hotel Mandovi"]["subtitle"]
    # Joined to the dependency graph like any hand-entered booking.
    node_ids = {added[t]["id"] for t in added if t in ("Sunburn Arena", "Fort Aguada")}
    assert any(e["target"] in node_ids for e in trip["edges"])
    links = client.get(f"/api/trips/{TRIP}/external-items").json()
    assert {(l["kind"], l["source"]) for l in links} == {("flight", "aviationstack"), ("train", "railradar"), ("hotel", "openstreetmap"),
                                                         ("attraction", "openstreetmap"), ("event", "ticketmaster")}


def test_duplicate_add_is_prevented_until_the_node_is_removed(client, providers):
    first = _add(client, **HOTEL_ITEM).json()
    count = len(first["trip"]["nodes"])
    again = _add(client, **HOTEL_ITEM).json()
    assert again["alreadyAdded"] is True and again["nodeId"] == first["nodeId"] and len(again["trip"]["nodes"]) == count
    assert client.delete(f"/api/trips/{TRIP}/nodes/{first['nodeId']}").status_code == 200
    third = _add(client, **HOTEL_ITEM).json()
    assert third["alreadyAdded"] is False and third["nodeId"] != first["nodeId"]


def test_invalid_items_are_rejected(client, providers):
    assert _add(client, **{**HOTEL_ITEM, "source": "ticketmaster"}).status_code == 400
    no_codes = dict(kind="flight", source="aviationstack", externalId="XY1@2026-01-01", title="XY1",
                    scheduledStart="2025-09-18T08:00:00", scheduledEnd="2025-09-18T10:00:00")
    assert _add(client, **no_codes).status_code == 400
    assert client.post("/api/trips/nope/external-items", json=HOTEL_ITEM).status_code == 404


# ---- Live baseline + existing simulation ----------------------------------------------------


def test_tracked_flight_feeds_existing_simulation_without_mutating_live_data(client, providers, fake):
    fake.routes["/v1/flights"] = httpx.Response(200, json={"data": [FLIGHT]})
    added = _add(client, kind="flight", source="aviationstack", externalId="AI101@2026-09-27", title="AI101 Mumbai → Delhi",
                 operator="Air India", originCode="BOM", destinationCode="DEL",
                 scheduledStart="2025-09-18T08:00:00", scheduledEnd="2025-09-18T10:10:00").json()
    tracked = client.get(f"/api/live/trips/{TRIP}/tracked").json()
    assert tracked[0]["nodeId"] == added["nodeId"] and tracked[0]["live"]["delayMinutes"] == 12 and tracked[0]["error"] is None
    nodes_before = client.get(f"/api/trips/{TRIP}").json()["nodes"]

    # Real +12 min baseline plus a simulated +120 min, through the existing dry-run simulation.
    total = tracked[0]["live"]["delayMinutes"] + 120
    sim = client.post(f"/api/trips/{TRIP}/simulate", json={"type": "flight-delay", "primaryNodeId": added["nodeId"], "delayMinutes": total})
    assert sim.status_code == 200 and sim.json()["disruption"]["delayMinutes"] == 132

    # Live data and the stored itinerary are untouched by the simulation.
    again = client.get(f"/api/live/trips/{TRIP}/tracked").json()
    assert again[0]["live"]["delayMinutes"] == 12 and again[0]["live"]["dataSource"] == "live"
    assert client.get(f"/api/trips/{TRIP}").json()["nodes"] == nodes_before


def test_tracked_transport_reports_errors_instead_of_fake_data(client, providers, fake):
    _add(client, kind="train", source="railradar", externalId="12951@2025-09-18", title="12951 Mumbai Rajdhani",
         originCode="MMCT", destinationCode="NDLS", scheduledStart="2025-09-18T17:00:00", scheduledEnd="2025-09-19T08:35:00")
    fake.routes["/v1/trains"] = httpx.Response(503)
    tracked = client.get(f"/api/live/trips/{TRIP}/tracked").json()
    assert tracked[0]["live"] is None and tracked[0]["error"] == "Live provider temporarily unavailable."


# ---- Plumbing -------------------------------------------------------------------------------


def test_api_keys_are_redacted_from_logs():
    record = logging.LogRecord("httpx", logging.INFO, __file__, 1, "HTTP Request: GET %s", ("https://x/v1/flights?access_key=SECRET&flight_iata=AI1",), None)
    RedactSecretsFilter().filter(record)
    assert "SECRET" not in record.getMessage() and "access_key=[redacted]" in record.getMessage()
    record = logging.LogRecord("httpx", logging.INFO, __file__, 1, "GET https://x/events.json?apikey=TMKEY&size=5", (), None)
    RedactSecretsFilter().filter(record)
    assert "TMKEY" not in record.getMessage()


def test_ttl_cache_does_not_cache_failures():
    cache = TTLCache(ttl_seconds=60)
    calls = []

    def boom():
        calls.append(1)
        raise RuntimeError("fail")

    for _ in range(2):
        with pytest.raises(RuntimeError):
            cache.get_or_set("k", boom)
    assert len(calls) == 2
    assert cache.get_or_set("k", lambda: 5) == 5 and cache.get_or_set("k", lambda: 6) == 5


def test_not_started_train_from_real_railradar_shape():
    """Shape observed from the real API: hyphenated status, exceptions=null,
    coordinates on currentLocation, and actual* pre-filled with projections."""
    from app.providers.live.railradar import normalize_live

    data = {
        "trainNumber": "12951", "trainName": "Mumbai Central - New Delhi Tejas Rajdhani Express", "startDate": "2026-09-27",
        "lastUpdatedAt": "2026-09-27T10:37:43+05:30", "status": "not-started", "delayMinutes": 0, "exceptions": None,
        "train": {"number": "12951", "source": {"code": "MMCT", "name": "Mumbai Central"}, "destination": {"code": "NDLS", "name": "New Delhi"}},
        "currentLocation": {"stationCode": "MMCT", "stationName": "Mumbai Central", "status": "at-station", "coordinates": {"lat": 18.970784, "lng": 72.819403}, "speedKmh": 0},
        "nextHalt": {"stationCode": "BVI", "stationName": "Borivali"},
        "route": [
            {"stationCode": "MMCT", "stationName": "Mumbai Central", "status": "at-station", "isHalt": True, "lat": 18.970784, "lng": 72.819403,
             "scheduledDeparture": "2026-09-27T17:00:00+05:30", "actualDeparture": "2026-09-27T17:00:00+05:30", "platform": "1"},
            {"stationCode": "NDLS", "stationName": "New Delhi", "status": "upcoming", "isHalt": True, "lat": 28.64177, "lng": 77.22027,
             "scheduledArrival": "2026-09-28T08:32:00+05:30", "actualArrival": "2026-09-28T08:32:00+05:30", "platform": "3"},
        ],
    }
    t = normalize_live(data, NOW)
    assert t.status == "scheduled"
    assert t.actual_departure is None and t.actual_arrival is None  # projections are not "actual"
    assert t.estimated_departure.isoformat() == "2026-09-27T17:00:00+05:30"
    assert t.estimated_arrival.isoformat() == "2026-09-28T08:32:00+05:30"
    assert (t.current_location.latitude, t.current_location.longitude) == (18.970784, 72.819403)
    assert t.platform == "1"  # standing at the origin: its own platform, not the next halt's
    assert t.notices == []

    # Once the provider's clock passes a departed stop, the time is actual.
    data["lastUpdatedAt"], data["status"] = "2026-09-27T17:05:00+05:30", "running"
    data["route"][0]["status"] = "departed"
    t = normalize_live(data, NOW)
    assert t.status == "en_route" and t.actual_departure.isoformat() == "2026-09-27T17:00:00+05:30"
