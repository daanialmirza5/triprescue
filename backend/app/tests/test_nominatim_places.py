"""Nominatim places provider (default hotels/places source) against a faked
HTTP transport - no network."""

from __future__ import annotations

import time

import httpx
import pytest

from app.providers import live as live_pkg
from app.providers.live import LiveProviders, nominatim_places
from app.providers.live.aviationstack import AviationstackProvider
from app.providers.live.nominatim_places import NominatimPlacesProvider, viewbox
from app.providers.live.railradar import RailRadarProvider
from app.providers.live.ticketmaster import TicketmasterProvider

HOTELS = [
    {"osm_type": "node", "osm_id": 10033937305, "lat": "15.4987", "lon": "73.8295", "category": "tourism", "type": "hotel", "name": "Hotel Grande Delmon",
     "address": {"road": "Caetano Albuquerque Road", "city": "Panaji", "postcode": "403001"}, "extratags": {"stars": "3", "website": "https://delmon.example"}},
    {"osm_type": "way", "osm_id": 22, "lat": "15.5", "lon": "73.83", "category": "tourism", "type": "guest_house", "name": "Casa Goa", "address": {}, "extratags": {"website": "ftp://bad"}},
    {"osm_type": "node", "osm_id": 33, "lat": "15.5", "lon": "73.8", "category": "amenity", "type": "restaurant", "name": "Hotel Food Court", "address": {}},  # not lodging
    {"osm_type": "node", "osm_id": 44, "lat": "15.5", "lon": "73.8", "category": "tourism", "type": "hotel", "name": "", "address": {}},  # nameless
]
PLACES = [
    {"osm_type": "relation", "osm_id": 6411419, "lat": "15.4926", "lon": "73.7736", "category": "tourism", "type": "attraction", "name": "Fort Aguada", "address": {"village": "Candolim"}},
    {"osm_type": "way", "osm_id": 156468580, "lat": "15.5", "lon": "73.77", "category": "highway", "type": "secondary", "name": "Fort Aguada Road", "address": {}},  # a road, dropped
    {"osm_type": "node", "osm_id": 13257096538, "lat": "15.6", "lon": "74.0", "category": "waterway", "type": "waterfall", "name": "Shirent Waterfall", "address": {}},
]


class Fake:
    def __init__(self, responses):
        self.responses = list(responses)
        self.requests: list[httpx.Request] = []

    def __call__(self, request):
        self.requests.append(request)
        return self.responses.pop(0) if len(self.responses) > 1 else self.responses[0]


@pytest.fixture(autouse=True)
def _no_throttle(monkeypatch):
    monkeypatch.setattr(nominatim_places, "MIN_INTERVAL", 0.0)


def _provider(fake) -> NominatimPlacesProvider:
    return NominatimPlacesProvider("https://nominatim.test/search", client=httpx.Client(transport=httpx.MockTransport(fake)))


def test_hotels_keep_only_named_lodging_with_real_fields():
    fake = Fake([httpx.Response(200, json=HOTELS)])
    hotels = _provider(fake).hotels(15.4909, 73.8278, 3000, 10, city="Goa")
    assert [h.name for h in hotels] == ["Hotel Grande Delmon", "Casa Goa"]
    delmon, casa = hotels
    assert delmon.external_id == "node/10033937305" and delmon.source == "openstreetmap" and delmon.stars == 3
    assert delmon.address == "Caetano Albuquerque Road, Panaji, 403001" and delmon.city == "Panaji"
    assert delmon.source_url == "https://www.openstreetmap.org/node/10033937305"
    assert casa.website is None and casa.city == "Goa" and casa.phone is None
    params = fake.requests[0].url.params
    assert params["q"] == "hotel" and params["bounded"] == "1" and params["countrycodes"] == "in"
    assert params["viewbox"] == viewbox(15.4909, 73.8278, 3000)
    assert fake.requests[0].headers["User-Agent"].startswith("SafarSathi/1.0")


def test_attractions_filter_out_roads_and_query_per_category():
    fake = Fake([httpx.Response(200, json=PLACES)])
    places = _provider(fake).attractions(15.49, 73.83, 8000, 10, category="forts")
    assert [(p.name, p.category) for p in places] == [("Fort Aguada", "attraction"), ("Shirent Waterfall", "waterfall")]
    assert [r.url.params["q"] for r in fake.requests] == ["fort", "castle"]


def test_results_are_cached_and_bad_input_rejected():
    fake = Fake([httpx.Response(200, json=HOTELS)])
    provider = _provider(fake)
    provider.hotels(15.49, 73.83, 3000, 10)
    provider.hotels(15.49, 73.83, 3000, 10)
    assert len(fake.requests) == 1
    with pytest.raises(live_pkg.LiveProviderError) as exc:
        provider.attractions(15.49, 73.83, category="casinos")
    assert exc.value.kind == "bad_request"


@pytest.mark.parametrize("status,kind", [(429, "rate_limited"), (503, "unavailable"), (403, "auth")])
def test_provider_errors_map_to_friendly_kinds(status, kind):
    with pytest.raises(live_pkg.LiveProviderError) as exc:
        _provider(Fake([httpx.Response(status)])).hotels(15.49, 73.83)
    assert exc.value.kind == kind


def test_throttle_spaces_requests(monkeypatch):
    monkeypatch.setattr(nominatim_places, "MIN_INTERVAL", 0.2)
    fake = Fake([httpx.Response(200, json=[])])
    provider = _provider(fake)
    start = time.monotonic()
    provider.attractions(15.49, 73.83, category="all")  # 4 phrase searches
    assert len(fake.requests) == 4 and time.monotonic() - start >= 0.55


def test_api_uses_nominatim_provider(client):
    fake = Fake([httpx.Response(200, json=HOTELS)])
    live_pkg.set_registry(LiveProviders(
        flights=AviationstackProvider(None, "https://x"), trains=RailRadarProvider(None, "https://x"),
        places=_provider(fake), events=TicketmasterProvider(None, "https://x"),
    ))
    try:
        resp = client.get("/api/places/hotels", params={"city": "Goa", "limit": 5})
        assert resp.status_code == 200 and [h["name"] for h in resp.json()] == ["Hotel Grande Delmon", "Casa Goa"]
    finally:
        live_pkg.set_registry(None)
