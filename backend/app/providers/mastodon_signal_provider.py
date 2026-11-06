"""Real traveler chatter from Mastodon's public hashtag timelines.

Zero-auth public endpoint - no account or API key needed:

    GET https://mastodon.social/api/v1/timelines/tag/{hashtag}?limit=20

(Full-text status search needs an authenticated account, so hashtag timelines
are the public route. Reddit's public search.json was the first choice but
answers 403 to unauthenticated server clients.) Public instances rate-limit
unauthenticated clients, and a city hashtag is mostly unrelated chatter, so
this provider is best-effort: posts are kept only if they are recent, name the
place itself, and describe an actual disruption; every failure (timeout, HTTP error,
rate limit, bad JSON, nothing relevant) returns None so the caller falls back
to the labelled simulated feed. It never raises.
"""

from __future__ import annotations

import html
import logging
import re
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import httpx

logger = logging.getLogger("safarsathi.providers.mastodon")

RATE_LIMIT_COOLDOWN_SECONDS = 60
MAX_POST_AGE = timedelta(hours=72)

_TAG_RE = re.compile(r"<[^>]+>")
# A ground signal must describe an actual disruption. Topic words on their own
# ("flight", "airport", "weather") are not enough - city hashtags are full of
# route-launch news, tour adverts and unrelated chatter.
_DISRUPTION_RE = re.compile(
    r"\b(delay(s|ed)?|cancel(l?ed|lations?|s)?|divert(ed|ions?)?|grounded|stranded|closed|closure|shut|"
    r"flood(s|ed|ing)?|waterlog\w*|inundat\w*|landslides?|heavy rain|downpour|cloudburst|storm|cyclone|"
    r"dense fog|fog delays?|low visibility|blizzard|snowfall|heatwave|traffic jams?|gridlock|strike|bandh|"
    r"long queues?|chaos|disrupt\w*)\b",
    re.I,
)


def _mentions_place(text: str, place: str) -> bool:
    """The post itself must name the place (so #leh posts about Le Havre don't count)."""
    name = place.split("(")[0].strip()
    return bool(name) and re.search(rf"\b{re.escape(name)}\b", text, re.I) is not None


@dataclass(frozen=True)
class PublicPost:
    id: str
    text: str
    url: str
    created_at: datetime
    author: str


def hashtag_for(place: str) -> str:
    """'Delhi (DEL)' -> 'delhi', 'Nubra Valley' -> 'nubravalley'."""
    name = place.split("(")[0]
    return re.sub(r"[^a-z0-9]", "", name.lower())


class MastodonSignalProvider:
    """Small cached client with injectable HTTP transport for tests."""

    BASE_URL = "https://mastodon.social"
    USER_AGENT = "SafarSathi/1.0 (+traveler-signals)"
    CACHE_MINUTES = 10

    def __init__(self, client: httpx.Client | None = None, timeout_seconds: float = 3.0):
        self._client = client
        self.timeout_seconds = timeout_seconds
        self._cache: dict[str, tuple[list[PublicPost] | None, float]] = {}
        self._paused_until = 0.0
        self._lock = threading.Lock()

    def _fetch(self, tag: str) -> list[dict]:
        url = f"{self.BASE_URL}/api/v1/timelines/tag/{tag}"
        params = {"limit": 20}
        headers = {"User-Agent": self.USER_AGENT, "Accept": "application/json"}
        getter = self._client.get if self._client is not None else httpx.get
        response = getter(url, params=params, headers=headers, timeout=self.timeout_seconds)
        if response.status_code == 429:
            self._paused_until = time.monotonic() + RATE_LIMIT_COOLDOWN_SECONDS
            raise RuntimeError("Mastodon rate limit reached")
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, list):
            raise ValueError("Mastodon returned an unexpected payload")
        return data

    @staticmethod
    def _parse(items: list[dict], now: datetime, place: str = "") -> list[PublicPost]:
        posts: list[PublicPost] = []
        for item in items:
            try:
                created = datetime.fromisoformat(str(item["created_at"]).replace("Z", "+00:00"))
                if not now - MAX_POST_AGE <= created <= now + timedelta(minutes=5):
                    continue
                text = " ".join(html.unescape(_TAG_RE.sub(" ", str(item.get("content") or ""))).split())
                if not text or not _DISRUPTION_RE.search(text) or (place and not _mentions_place(text, place)):
                    continue
                posts.append(PublicPost(
                    id=str(item["id"]),
                    text=text if len(text) <= 220 else text[:217].rstrip() + "…",
                    url=str(item.get("url") or item.get("uri") or ""),
                    created_at=created,
                    author=str((item.get("account") or {}).get("acct") or ""),
                ))
            except (KeyError, TypeError, ValueError):
                continue  # skip malformed posts, keep the rest
        return posts

    def recent_posts(self, place: str, limit: int = 3, now: datetime | None = None) -> list[PublicPost] | None:
        """Up to `limit` recent, relevant public posts for a place, newest first.
        None when the source is unavailable or has nothing relevant."""
        tag = hashtag_for(place)
        if not tag:
            return None
        with self._lock:
            cached = self._cache.get(tag)
            if cached and cached[1] > time.monotonic():
                return cached[0][:limit] if cached[0] else None
            if time.monotonic() < self._paused_until:
                return None
        try:
            posts = self._parse(self._fetch(tag), now or datetime.now(timezone.utc), place) or None
        except Exception as exc:  # timeout, connection, HTTP status, rate limit, bad JSON
            logger.warning("Mastodon signals for #%s unavailable (%s); using simulated signals", tag, type(exc).__name__)
            posts = None
        with self._lock:
            # Empty/failed lookups are cached briefly too, so a quiet hashtag or an
            # outage isn't re-requested on every 20-second ticker poll.
            ttl = self.CACHE_MINUTES * 60 if posts else 120
            self._cache[tag] = (posts, time.monotonic() + ttl)
        return posts[:limit] if posts else None
