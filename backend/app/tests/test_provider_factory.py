"""PROVIDER_MODE factory and the live flight search's graceful fallbacks."""

from datetime import datetime

import httpx

from app.config import Settings
from app.providers.amadeus_flight_provider import AmadeusFlightProvider
from app.providers.factory import build_providers, get_flight_provider
from app.providers.fallback_flight_provider import FallbackFlightProvider
from app.providers.mock_flight_provider import MockFlightProvider

AFTER = datetime(2025, 9, 12, 11, 0)

OFFERS = {
    "data": [
        {
            "id": "1",
            "itineraries": [{"segments": [{"carrierCode": "AI", "number": "445", "departure": {"iataCode": "DEL", "at": "2025-09-12T12:30:00"}, "arrival": {"iataCode": "IXL", "at": "2025-09-12T13:45:00"}}]}],
            "price": {"currency": "INR", "total": "16250.00"},
            "travelerPricings": [{"fareDetailsBySegment": [{"cabin": "BUSINESS"}]}],
        },
        {
            "id": "2",
            "itineraries": [{"segments": [{"carrierCode": "6E", "number": "2011", "departure": {"iataCode": "DEL", "at": "2025-09-12T14:05:00"}, "arrival": {"iataCode": "IXL", "at": "2025-09-12T15:20:00"}}]}],
            "price": {"currency": "INR", "total": "9800.50"},
        },
        {"id": "broken"},  # malformed offers are skipped, not fatal
    ],
    "dictionaries": {"carriers": {"AI": "AIR INDIA", "6E": "INDIGO"}},
}


def _client(handler):
    return httpx.Client(transport=httpx.MockTransport(handler))


def _happy(request: httpx.Request) -> httpx.Response:
    if request.url.path.endswith("/oauth2/token"):
        return httpx.Response(200, json={"access_token": "tok", "expires_in": 1799})
    assert request.headers["Authorization"] == "Bearer tok"
    return httpx.Response(200, json=OFFERS)


def test_factory_defaults_to_mock():
    providers = build_providers(Settings())
    assert providers.mode == "mock" and isinstance(providers.flight, MockFlightProvider)


def test_live_mode_without_credentials_falls_back_to_mock():
    assert isinstance(get_flight_provider(Settings(provider_mode="live")), MockFlightProvider)


def test_live_mode_with_credentials_uses_amadeus():
    provider = get_flight_provider(Settings(provider_mode="live", amadeus_client_id="id", amadeus_client_secret="secret"))
    assert isinstance(provider, FallbackFlightProvider) and isinstance(provider.primary, AmadeusFlightProvider)


def _live(handler) -> FallbackFlightProvider:
    return FallbackFlightProvider(AmadeusFlightProvider("id", "secret", "https://test.api.amadeus.com", client=_client(handler)))


def test_amadeus_offers_become_live_alternatives():
    options = _live(_happy).get_alternatives("DEL", "IXL", AFTER)
    assert [o.confirmation_hint for o in options] == ["AI-445", "6E-2011"]
    assert options[0].tier == "premium" and options[0].cost == 16250.0
    assert all(o.source == "live" for o in options)


def test_amadeus_errors_fall_back_to_simulated_inventory():
    def boom(request):
        return httpx.Response(500, json={"errors": [{"detail": "server error"}]})

    options = _live(boom).get_alternatives("DEL", "IXL", AFTER)
    assert options and all(o.source == "simulated" for o in options)


def test_amadeus_rate_limit_pauses_live_calls():
    calls = {"search": 0}

    def limited(request):
        if request.url.path.endswith("/oauth2/token"):
            return httpx.Response(200, json={"access_token": "tok", "expires_in": 1799})
        calls["search"] += 1
        return httpx.Response(429)

    provider = _live(limited)
    first = provider.get_alternatives("DEL", "IXL", AFTER)
    second = provider.get_alternatives("DEL", "IXL", AFTER)
    assert first and second and all(o.source == "simulated" for o in first + second)
    assert calls["search"] == 1  # second call skipped the API during the cool-down


def test_without_credentials_never_calls_network():
    assert FallbackFlightProvider(None).get_alternatives("DEL", "IXL", AFTER)
