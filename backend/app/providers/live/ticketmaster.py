"""Events from the Ticketmaster Discovery API v2 (countryCode=IN).

Only events Ticketmaster actually returns are shown - its Indian coverage is
partial, so an empty result means "none listed there", not "no events".
Cached for 10 minutes.
"""

from __future__ import annotations

import re
from datetime import date, datetime, timezone
from typing import Any

import httpx

from app.providers.live.common import LiveProviderError, TTLCache, as_float, request_json, safe_url
from app.schemas.live import TravelEventOut

PROVIDER = "ticketmaster"
CLASSIFICATIONS = {"music": "Music", "sports": "Sports", "theatre": "Arts & Theatre", "culture": "Arts & Theatre", "family": "Family", "film": "Film"}
_TEXT_RE = re.compile(r"[^\w\s'&.-]", re.UNICODE)


def _clean(value: str | None, limit: int = 80) -> str | None:
    if not value:
        return None
    cleaned = re.sub(r"\s+", " ", _TEXT_RE.sub("", value)).strip()[:limit]
    return cleaned or None


def _dt(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _best_image(images: list[dict[str, Any]]) -> str | None:
    wide = sorted((i for i in images if i.get("ratio") == "16_9"), key=lambda i: i.get("width") or 0, reverse=True)
    for image in wide or images:
        url = safe_url(image.get("url"))
        if url:
            return url
    return None


def normalize(item: dict[str, Any], retrieved_at: datetime) -> TravelEventOut:
    event_id, name = item["id"], item["name"]
    dates = item.get("dates") or {}
    start = dates.get("start") or {}
    end = dates.get("end") or {}
    venue = ((item.get("_embedded") or {}).get("venues") or [{}])[0] or {}
    location = venue.get("location") or {}
    classification = (item.get("classifications") or [{}])[0] or {}
    segment = (classification.get("segment") or {}).get("name")
    genre = (classification.get("genre") or {}).get("name")
    category = " · ".join(c for c in (segment, genre) if c and c.lower() != "undefined") or None
    return TravelEventOut(
        id=f"{PROVIDER}:{event_id}",
        external_id=str(event_id),
        name=name,
        venue=venue.get("name"),
        city=(venue.get("city") or {}).get("name"),
        latitude=as_float(location.get("latitude")),
        longitude=as_float(location.get("longitude")),
        start_time=_dt(start.get("dateTime")),
        start_date=start.get("localDate"),
        end_time=_dt(end.get("dateTime")),
        category=category,
        image_url=_best_image(item.get("images") or []),
        ticket_url=safe_url(item.get("url")),
        status=((dates.get("status") or {}).get("code")),
        last_updated_at=retrieved_at,
    )


class TicketmasterProvider:
    def __init__(self, api_key: str | None, base_url: str, timeout_seconds: float = 8.0, client: httpx.Client | None = None):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout_seconds
        self._client = client
        self._cache = TTLCache(ttl_seconds=10 * 60, max_entries=200)

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def search(
        self,
        city: str | None = None,
        lat: float | None = None,
        lng: float | None = None,
        radius_km: int = 50,
        start_date: date | None = None,
        end_date: date | None = None,
        category: str | None = None,
        keyword: str | None = None,
        limit: int = 20,
    ) -> list[TravelEventOut]:
        if not self.configured:
            raise LiveProviderError(PROVIDER, "not_configured")
        params: dict[str, Any] = {"countryCode": "IN", "size": max(1, min(limit, 50)), "sort": "date,asc"}
        if lat is not None and lng is not None:
            params.update(latlong=f"{lat:.4f},{lng:.4f}", radius=max(1, min(radius_km, 200)), unit="km")
        elif city:
            params["city"] = _clean(city, 60)
        if start_date:
            params["startDateTime"] = f"{start_date.isoformat()}T00:00:00Z"
        if end_date:
            params["endDateTime"] = f"{end_date.isoformat()}T23:59:59Z"
        if category:
            if category.lower() not in CLASSIFICATIONS:
                raise LiveProviderError(PROVIDER, "bad_request")
            params["classificationName"] = CLASSIFICATIONS[category.lower()]
        if keyword and _clean(keyword):
            params["keyword"] = _clean(keyword)
        cache_key = tuple(sorted((k, str(v)) for k, v in params.items()))

        def load() -> list[TravelEventOut]:
            payload = request_json(PROVIDER, self._client, "GET", f"{self.base_url}/discovery/v2/events.json", self.timeout,
                                   params={**params, "apikey": self.api_key})
            if not isinstance(payload, dict):
                raise LiveProviderError(PROVIDER, "bad_response")
            now = datetime.now(timezone.utc)
            events: list[TravelEventOut] = []
            for item in (payload.get("_embedded") or {}).get("events") or []:
                try:
                    events.append(normalize(item, now))
                except (KeyError, TypeError, ValueError):
                    continue
            return events

        return self._cache.get_or_set(cache_key, load)
