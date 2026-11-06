"""AmadeusFlightProvider against a faked Amadeus API (httpx.MockTransport) -
no real network access."""

from datetime import datetime

import httpx
import pytest

from app.providers.amadeus_flight_provider import AmadeusFlightProvider
from app.providers.base import ProviderAlternative, ProviderFailureError

BASE_URL = "https://test.api.amadeus.com"


def _segment(carrier, number, dep_code, dep_at, arr_code, arr_at):
    return {
        "carrierCode": carrier,
        "number": number,
        "departure": {"iataCode": dep_code, "at": dep_at},
        "arrival": {"iataCode": arr_code, "at": arr_at},
    }


def _offer(segments, total, cabin="ECONOMY"):
    return {
        "id": "1",
        "itineraries": [{"segments": segments}],
        "price": {"currency": "INR", "total": total},
        "travelerPricings": [{"fareDetailsBySegment": [{"cabin": cabin} for _ in segments]}],
    }


DIRECT = _offer([_segment("AI", "445", "DEL", "2025-09-12T12:30:00", "IXL", "2025-09-12T13:45:00")], "17000.00", "BUSINESS")
CONNECTING = _offer(
    [
        _segment("6E", "2011", "DEL", "2025-09-12T09:00:00", "SXR", "2025-09-12T10:30:00"),
        _segment("6E", "2123", "SXR", "2025-09-12T11:30:00", "IXL", "2025-09-12T12:20:00"),
    ],
    "9800.50",
)


class FakeAmadeus:
    """Routes token and flight-offer requests; records what it received."""

    def __init__(self, offers=None, offers_response=None, token_response=None):
        self.offers = offers if offers is not None else [DIRECT, CONNECTING]
        self.offers_response = offers_response
        self.token_response = token_response
        self.token_calls = 0
        self.search_requests: list[httpx.Request] = []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        if request.url.path == "/v1/security/oauth2/token":
            self.token_calls += 1
            if self.token_response is not None:
                return self.token_response
            assert request.method == "POST"
            body = request.content.decode()
            assert "grant_type=client_credentials" in body
            assert "client_id=test-id" in body and "client_secret=test-secret" in body
            return httpx.Response(200, json={"access_token": "tok-123", "expires_in": 1799})
        if request.url.path == "/v2/shopping/flight-offers":
            self.search_requests.append(request)
            assert request.headers["Authorization"] == "Bearer tok-123"
            if self.offers_response is not None:
                return self.offers_response
            return httpx.Response(200, json={"data": self.offers})
        return httpx.Response(404)


def _provider(fake) -> AmadeusFlightProvider:
    return AmadeusFlightProvider(
        "test-id", "test-secret", BASE_URL, client=httpx.Client(transport=httpx.MockTransport(fake))
    )


def test_search_maps_offers_to_provider_alternatives():
    fake = FakeAmadeus()

    results = _provider(fake).search("DEL", "IXL", "2025-09-12")

    params = fake.search_requests[0].url.params
    assert params["originLocationCode"] == "DEL"
    assert params["destinationLocationCode"] == "IXL"
    assert params["departureDate"] == "2025-09-12"
    assert params["adults"] == "1"
    assert params["currencyCode"] == "INR"

    assert results[0] == ProviderAlternative(
        id="flight-ai-445-202509121230",
        provider="AI",
        confirmation_hint="AI-445",
        origin="DEL",
        destination="IXL",
        departure=datetime(2025, 9, 12, 12, 30),
        arrival=datetime(2025, 9, 12, 13, 45),
        cost=17000.0,
        tier="premium",
        refundable=False,
        refund_percentage=0.0,
        cancellation_deadline_hours=24,
    )
    # Connection: departure from the first segment, arrival from the last.
    connecting = results[1]
    assert connecting.confirmation_hint == "6E-2011/6E-2123"
    assert (connecting.origin, connecting.destination) == ("DEL", "IXL")
    assert connecting.departure == datetime(2025, 9, 12, 9, 0)
    assert connecting.arrival == datetime(2025, 9, 12, 12, 20)
    assert connecting.cost == 9800.5
    assert connecting.tier == "standard"


def test_token_is_cached_across_searches():
    fake = FakeAmadeus()
    provider = _provider(fake)

    provider.search("DEL", "IXL", "2025-09-12")
    provider.search("DEL", "IXL", "2025-09-13")

    assert fake.token_calls == 1
    assert len(fake.search_requests) == 2


def test_expired_token_is_refetched():
    fake = FakeAmadeus()
    provider = _provider(fake)
    provider.search("DEL", "IXL", "2025-09-12")

    provider._token_expires_at = 0.0  # simulate the cached token lapsing
    provider.search("DEL", "IXL", "2025-09-12")

    assert fake.token_calls == 2


def test_get_alternatives_filters_sorts_and_excludes_current_flight():
    fake = FakeAmadeus()

    results = _provider(fake).get_alternatives("DEL", "IXL", datetime(2025, 9, 12, 8, 0), exclude_confirmation="AI-445")

    # Same day and next day are both searched; the two identical responses are
    # de-duplicated by id, AI-445 is excluded, leaving the connection.
    assert [req.url.params["departureDate"] for req in fake.search_requests] == ["2025-09-12", "2025-09-13"]
    assert [r.confirmation_hint for r in results] == ["6E-2011/6E-2123"]


def test_get_alternatives_drops_flights_departing_before_earliest_time():
    results = _provider(FakeAmadeus()).get_alternatives("DEL", "IXL", datetime(2025, 9, 12, 10, 0))

    assert [r.confirmation_hint for r in results] == ["AI-445"]


def test_get_alternatives_with_unbounded_time_makes_no_request():
    fake = FakeAmadeus()

    assert _provider(fake).get_alternatives("DEL", "IXL", datetime.max) == []
    assert fake.search_requests == [] and fake.token_calls == 0


@pytest.mark.parametrize(
    ("fake", "kind"),
    [
        (FakeAmadeus(offers_response=httpx.Response(500, text="boom")), "error"),
        (FakeAmadeus(token_response=httpx.Response(500, text="boom")), "error"),
        (FakeAmadeus(token_response=httpx.Response(401, json={"error": "invalid_client"})), "error"),
        (FakeAmadeus(offers_response=httpx.Response(200, text="<html>not json</html>")), "error"),
        (FakeAmadeus(offers_response=httpx.Response(200, json={"errors": []})), "error"),
        (FakeAmadeus(offers_response=httpx.Response(200, json={"data": [{"id": "1"}]})), "error"),
        (FakeAmadeus(token_response=httpx.Response(200, json={"no_token": True})), "error"),
    ],
    ids=["search-500", "token-500", "token-401", "non-json", "no-data", "unparseable-offers", "malformed-token"],
)
def test_api_failures_raise_provider_failure_error(fake, kind):
    with pytest.raises(ProviderFailureError) as excinfo:
        _provider(fake).search("DEL", "IXL", "2025-09-12")

    assert excinfo.value.provider_name == "AmadeusFlightProvider"
    assert excinfo.value.kind == kind


def test_timeout_raises_provider_failure_error_with_timeout_kind():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("timed out", request=request)

    provider = AmadeusFlightProvider("test-id", "test-secret", BASE_URL, client=httpx.Client(transport=httpx.MockTransport(handler)))

    with pytest.raises(ProviderFailureError) as excinfo:
        provider.get_alternatives("DEL", "IXL", datetime(2025, 9, 12, 8, 0))

    assert excinfo.value.kind == "timeout"


def test_connection_error_raises_provider_failure_error():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("dns failure", request=request)

    provider = AmadeusFlightProvider("test-id", "test-secret", BASE_URL, client=httpx.Client(transport=httpx.MockTransport(handler)))

    with pytest.raises(ProviderFailureError):
        provider.search("DEL", "IXL", "2025-09-12")


def test_one_malformed_offer_does_not_discard_the_rest():
    fake = FakeAmadeus(offers=[{"id": "broken"}, DIRECT])

    results = _provider(fake).search("DEL", "IXL", "2025-09-12")

    assert [r.confirmation_hint for r in results] == ["AI-445"]


def test_booking_lookup_and_cancellation_policy_are_conservative_without_network():
    fake = FakeAmadeus()
    provider = _provider(fake)

    assert provider.get_booking("AI-445") is None
    policy = provider.get_cancellation_policy("AI-445")
    assert (policy.refundable, policy.refund_percentage, policy.cancellation_deadline_hours) == (False, 0.0, 24)
    assert fake.token_calls == 0 and fake.search_requests == []
