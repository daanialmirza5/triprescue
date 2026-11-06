"""Shared live-provider helpers: cache, error mapping, input sanitising."""

from app.providers.live import common
from app.providers.live.common import LiveProviderError, TTLCache, as_float, as_int, kind_for_status, safe_url


def test_cache_expires_and_evicts(monkeypatch):
    clock = [100.0]
    monkeypatch.setattr(common.time, "monotonic", lambda: clock[0])
    cache = TTLCache(ttl_seconds=10, max_entries=2)
    assert cache.get_or_set("a", lambda: 1) == 1
    assert cache.get_or_set("a", lambda: 2) == 1  # fresh: cached
    clock[0] += 11
    assert cache.get_or_set("a", lambda: 3) == 3  # expired: recomputed
    cache.get_or_set("b", lambda: "b")
    cache.get_or_set("c", lambda: "c")  # evicts the least recently used ("a")
    assert cache.get_or_set("a", lambda: "new") == "new"


def test_status_codes_map_to_friendly_kinds():
    assert [kind_for_status(s) for s in (401, 403, 404, 429, 400, 500)] == [
        "auth", "auth", "not_found", "rate_limited", "bad_request", "unavailable"]
    err = LiveProviderError("x", "made-up-kind")
    assert err.kind == "unavailable" and err.http_status == 503 and "temporarily unavailable" in err.message


def test_only_plain_web_links_pass():
    assert safe_url("https://example.com/a") == "https://example.com/a"
    assert safe_url("javascript:alert(1)") is None
    assert safe_url("ftp://files.example.com") is None
    assert safe_url(42) is None


def test_number_parsing_is_defensive():
    assert as_float("3.5") == 3.5 and as_float("nan") is None and as_float(None) is None
    assert as_int("7.6") == 8 and as_int("x") is None
