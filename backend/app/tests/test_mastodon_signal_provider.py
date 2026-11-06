"""MastodonSignalProvider against a faked Mastodon API (httpx.MockTransport), and
the live traveler-signals feed choosing real posts vs the simulated fallback."""

from datetime import datetime, timedelta, timezone

import httpx
import pytest

from app.providers.mastodon_signal_provider import MastodonSignalProvider, PublicPost, hashtag_for

NOW = datetime(2026, 9, 27, 12, 0, tzinfo=timezone.utc)


@pytest.fixture(autouse=True)
def _offline_weather(monkeypatch):
    """No network: Open-Meteo is 'down', so simulated signals use the deterministic fallback."""
    from app.services import weather_service

    def down(*args, **kwargs):
        raise httpx.ConnectError("offline")

    monkeypatch.setattr(weather_service._provider, "_fetch", down)
    weather_service._provider._cache.clear()


def _status(sid, content, hours_ago=1.0):
    return {
        "id": sid,
        "created_at": (NOW - timedelta(hours=hours_ago)).isoformat().replace("+00:00", "Z"),
        "content": content,
        "url": f"https://mastodon.social/@someone/{sid}",
        "account": {"acct": "someone"},
    }


def _provider(handler) -> MastodonSignalProvider:
    return MastodonSignalProvider(client=httpx.Client(transport=httpx.MockTransport(handler)))


def test_hashtag_is_the_place_name_without_airport_code():
    assert hashtag_for("Delhi (DEL)") == "delhi"
    assert hashtag_for("Nubra Valley") == "nubravalley"
    assert hashtag_for("  ") == ""


def test_keeps_recent_relevant_posts_and_strips_html():
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["path"], seen["ua"] = request.url.path, request.headers["User-Agent"]
        return httpx.Response(200, json=[
            _status("1", "<p>Heavy <b>rain</b> &amp; waterlogging near the Delhi airport road</p>"),
            _status("2", "<p>Lovely sunset photos from the old city</p>"),  # not about conditions
            _status("3", "<p>Flights delayed by fog this morning</p>", hours_ago=100),  # too old
            {"id": "4"},  # malformed
        ])

    posts = _provider(handler).recent_posts("Delhi (DEL)", now=NOW)

    assert seen["path"] == "/api/v1/timelines/tag/delhi" and "SafarSathi" in seen["ua"]
    assert posts == [PublicPost("1", "Heavy rain & waterlogging near the Delhi airport road", "https://mastodon.social/@someone/1", NOW - timedelta(hours=1), "someone")]


@pytest.mark.parametrize(
    ("place", "content"),
    [
        # Real false positives seen on the live feed during verification:
        ("Leh (IXL)", "Aviation weather for Le Havre Octeville airport (France) is METAR LFOH 250800Z"),  # #leh != Le Havre
        ("Mumbai (BOM)", "PAL is launching nonstop Manila to Delhi and Mumbai flights this December"),  # news, not a disruption
        ("Jaipur", "10 DAYS / 9 NIGHTS - ROYAL & SPIRITUAL INDIA heritage tour incl. Jaipur"),  # advert
        ("Delhi (DEL)", "Flights delayed by dense fog this morning"),  # a disruption, but doesn't name the place
    ],
)
def test_rejects_posts_that_are_off_place_or_not_disruptions(place, content):
    provider = _provider(lambda request: httpx.Response(200, json=[_status("9", content)]))
    assert provider.recent_posts(place, now=NOW) is None


def test_accepts_a_real_local_disruption():
    provider = _provider(lambda request: httpx.Response(200, json=[_status("7", "Dense fog at Delhi airport, flights delayed 2 hours")]))
    assert [p.id for p in provider.recent_posts("Delhi (DEL)", now=NOW)] == ["7"]


@pytest.mark.parametrize(
    "response",
    [httpx.Response(500, text="boom"), httpx.Response(200, text="<html>nope</html>"), httpx.Response(200, json={"error": "x"}), httpx.Response(200, json=[])],
    ids=["http-500", "non-json", "not-a-list", "empty"],
)
def test_failures_and_empty_results_return_none(response):
    assert _provider(lambda request: response).recent_posts("Leh", now=NOW) is None


def test_timeout_returns_none():
    def handler(request):
        raise httpx.ReadTimeout("slow", request=request)

    assert _provider(handler).recent_posts("Leh", now=NOW) is None


def test_rate_limit_pauses_further_requests():
    calls = []

    def handler(request):
        calls.append(request.url.path)
        return httpx.Response(429, json={"error": "Too many requests"})

    provider = _provider(handler)
    assert provider.recent_posts("Leh", now=NOW) is None
    assert provider.recent_posts("Goa", now=NOW) is None  # different tag, still cooling down
    assert calls == ["/api/v1/timelines/tag/leh"]


def test_results_are_cached_per_hashtag():
    calls = []

    def handler(request):
        calls.append(1)
        return httpx.Response(200, json=[_status("1", "Airport queues are long today")])

    provider = _provider(handler)
    provider.recent_posts("Leh (IXL)", now=NOW)
    provider.recent_posts("Leh", now=NOW)  # same #leh
    assert len(calls) == 1


# ---- live feed: real posts first, simulated fallback per hub ---------------------------


def test_live_feed_uses_real_posts_and_falls_back_per_hub(client, monkeypatch):
    from app.config import get_settings
    from app.services import social_signals_service

    monkeypatch.setattr(get_settings(), "social_signals_live_enabled", True)
    recent = datetime.now(timezone.utc) - timedelta(minutes=30)
    post = PublicPost("99", "Flights delayed at Leh airport this morning", "https://mastodon.social/@a/99", recent, "a")

    def fake_recent_posts(place, limit=3, now=None):
        return [post] if hashtag_for(place) == "leh" else None

    monkeypatch.setattr(social_signals_service._public_posts, "recent_posts", fake_recent_posts)
    body = client.get("/api/trips/trip-ladakh-2025/social-signals").json()

    real = [s for s in body["signals"] if s["source"] == "mastodon"]
    simulated = [s for s in body["signals"] if s["source"] == "simulated"]
    # Leh and Leh airport share #leh: the post appears once.
    assert len(real) == 1
    assert real[0]["text"] == post.text and real[0]["url"] == post.url
    assert real[0]["type"] == "airport_congestion" and 25 <= real[0]["minutesAgo"] <= 35
    # Hubs without a real post keep the labelled simulated signals.
    assert simulated and all(s["url"] is None for s in simulated)
    assert {s["location"] for s in simulated} >= {"Mumbai (BOM)", "Delhi (DEL)"}


def test_live_feed_is_simulated_only_when_disabled(client, monkeypatch):
    from app.services import social_signals_service

    def fail(*args, **kwargs):
        raise AssertionError("no Mastodon calls when social_signals_live_enabled is False")

    monkeypatch.setattr(social_signals_service._public_posts, "recent_posts", fail)
    body = client.get("/api/trips/trip-ladakh-2025/social-signals").json()
    assert body["signals"] and all(s["source"] == "simulated" for s in body["signals"])
