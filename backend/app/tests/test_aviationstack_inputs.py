"""Aviationstack provider: input validation never reaches the network."""

import pytest

from app.providers.live.aviationstack import AviationstackProvider, normalize_flight_number
from app.providers.live.common import LiveProviderError


class _NoNetwork:
    def request(self, *args, **kwargs):  # pragma: no cover - must never be called
        raise AssertionError("network used")


def _provider() -> AviationstackProvider:
    return AviationstackProvider("key", "https://api.test/v1", client=_NoNetwork())


def test_flight_numbers_are_normalised():
    assert normalize_flight_number(" ai 101 ") == "AI101"
    assert normalize_flight_number("6e-2175") == "6E2175"


@pytest.mark.parametrize("kwargs", [
    {},                                  # no filter at all: never a global query
    {"flight_number": "NOT A FLIGHT"},
    {"dep_iata": "BOMBAY"},
    {"arr_iata": "D1"},
])
def test_invalid_searches_are_rejected_locally(kwargs):
    with pytest.raises(LiveProviderError) as exc:
        _provider().search(**kwargs)
    assert exc.value.kind == "bad_request"


def test_missing_key_is_reported_not_faked():
    with pytest.raises(LiveProviderError) as exc:
        AviationstackProvider(None, "https://api.test/v1", client=_NoNetwork()).search(flight_number="AI101")
    assert exc.value.kind == "not_configured"
