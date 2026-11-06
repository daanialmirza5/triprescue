from datetime import datetime, timedelta, timezone

import pytest

from app.providers.mastodon_signal_provider import PublicPost
from app.services.social_signals_service import signal_from_post

NOW = datetime(2026, 10, 5, 12, 0, tzinfo=timezone.utc)
HUB = {"name": "Mumbai", "lat": 19.09, "lng": 72.87, "nodes": ["n1", "n2"], "airport": True}


def post(text, minutes_ago=10, url="https://mastodon.social/@x/1"):
    return PublicPost(id="1", text=text, url=url, created_at=NOW - timedelta(minutes=minutes_ago), author="x")


@pytest.mark.parametrize("text,kind", [
    ("Roads waterlogged near Andheri", "road_waterlogging"),
    ("Auto bandh across the city today", "transit_strike"),
    ("Huge queues at the station", "crowd_surge"),
    ("Runway closed for maintenance", "airport_congestion"),
    ("Pleasant evening by the sea", "weather_warning"),
])
def test_classifies_posts_by_wording(text, kind):
    assert signal_from_post(HUB, post(text), NOW).type == kind


def test_severe_words_raise_urgency():
    calm = signal_from_post(HUB, post("Long queues at security"), NOW)
    severe = signal_from_post(HUB, post("Flights cancelled, passengers stranded"), NOW)
    assert (calm.intensity, calm.urgency) == (0.45, "medium")
    assert (severe.intensity, severe.urgency) == (0.7, "high")
    assert severe.sentiment < calm.sentiment


def test_keeps_the_source_link_and_age():
    signal = signal_from_post(HUB, post("Rush at T2", minutes_ago=42), NOW)
    assert signal.source == "mastodon" and signal.id == "mastodon-1"
    assert signal.url == "https://mastodon.social/@x/1"
    assert signal.minutes_ago == 42
    assert signal.node_ids == ["n1", "n2"]


def test_future_timestamps_count_as_just_now_and_empty_urls_are_dropped():
    signal = signal_from_post(HUB, post("Rush at T2", minutes_ago=-5, url=""), NOW)
    assert signal.minutes_ago == 0
    assert signal.url is None
