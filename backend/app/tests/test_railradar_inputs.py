"""RailRadar provider: input validation never reaches the network."""

import pytest

from app.providers.live.common import LiveProviderError
from app.providers.live.railradar import RailRadarProvider


class _NoNetwork:
    def request(self, *args, **kwargs):  # pragma: no cover - must never be called
        raise AssertionError("network used")


def _provider(key="rr_live_test") -> RailRadarProvider:
    return RailRadarProvider(key, "https://api.test", client=_NoNetwork())


@pytest.mark.parametrize("number, date", [("1295", None), ("12A51", None), ("129510", None), ("12951", "28-09-2026")])
def test_bad_train_lookups_are_rejected(number, date):
    with pytest.raises(LiveProviderError) as exc:
        _provider().live_status(number, date)
    assert exc.value.kind == "bad_request"


@pytest.mark.parametrize("origin, dest", [("", "NDLS"), ("MUMBAI1", "NDLS"), ("MMCT", "N D")])
def test_bad_station_codes_are_rejected(origin, dest):
    with pytest.raises(LiveProviderError) as exc:
        _provider().between(origin, dest)
    assert exc.value.kind == "bad_request"


def test_missing_key_is_reported_not_faked():
    with pytest.raises(LiveProviderError) as exc:
        _provider(key=None).live_status("12951")
    assert exc.value.kind == "not_configured"
