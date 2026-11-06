from typing import Literal

from app.schemas.base import CamelModel

SignalType = Literal["airport_congestion", "road_waterlogging", "transit_strike", "weather_warning", "crowd_surge", "all_clear"]
Urgency = Literal["low", "medium", "high", "critical"]


class SocialSignalOut(CamelModel):
    id: str
    type: SignalType
    location: str
    lat: float | None = None
    lng: float | None = None
    node_ids: list[str] = []
    urgency: Urgency
    sentiment: float  # -1.0 (distressed) .. +1.0 (positive)
    intensity: float  # 0..1, used to weight Digital Twin confidence
    text: str
    minutes_ago: int
    # "mastodon": a real public post from a hub's hashtag timeline (see
    # providers/mastodon_signal_provider.py). "simulated": synthesized from
    # the weather at that hub when no real post is available. Always shown.
    source: Literal["simulated", "mastodon"] = "simulated"
    url: str | None = None  # link to the original post for real signals


class SocialSignalsOut(CamelModel):
    trip_id: str
    signals: list[SocialSignalOut]
    overall_sentiment: float
    summary: str
