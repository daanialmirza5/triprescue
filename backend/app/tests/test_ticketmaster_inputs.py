"""Ticketmaster provider: India-only queries and safe inputs."""

import httpx
import pytest

from app.providers.live.common import LiveProviderError
from app.providers.live.ticketmaster import TicketmasterProvider, _clean


def test_text_inputs_are_sanitised():
    assert _clean('Goa"; DROP <script>') == "Goa DROP script"
    assert _clean("   ") is None
    assert _clean("a" * 200, 10) == "a" * 10


def test_unknown_category_is_rejected():
    with pytest.raises(LiveProviderError) as exc:
        TicketmasterProvider("key", "https://tm.test").search(city="Goa", category="casino")
    assert exc.value.kind == "bad_request"


def test_queries_are_always_restricted_to_india():
    seen = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json={"_embedded": {"events": []}})

    provider = TicketmasterProvider("key", "https://tm.test", client=httpx.Client(transport=httpx.MockTransport(handler)))
    assert provider.search(lat=19.07, lng=72.87) == []
    params = seen[0].url.params
    assert params["countryCode"] == "IN" and params["latlong"] == "19.0700,72.8700" and params["unit"] == "km"
