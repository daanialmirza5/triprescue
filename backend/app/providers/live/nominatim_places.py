"""Hotels and tourist attractions from OpenStreetMap via Nominatim search.

Free and keyless (https://nominatim.org). Used instead of Overpass by default
(PLACES_PROVIDER=nominatim) because public Overpass instances are often slow
or unreachable. Same OpenStreetMap records and ids ("node/123"), so trip links
and duplicate prevention are unaffected.

Usage policy (https://operations.osmfoundation.org/policies/nominatim/): max
1 request/second and an identifying User-Agent - enforced by a process-wide
throttle; results are cached for 6 hours. Searches are bounded to a box around
one point. Only fields OSM has are returned - never prices or availability.
"""

from __future__ import annotations

import math
import threading
import time
from datetime import datetime, timezone
from typing import Any

import httpx

from app.providers.live.common import LiveProviderError, TTLCache, as_float, request_json, safe_url
from app.providers.live.overpass import clean_query
from app.schemas.live import AttractionOut, HotelOut

PROVIDER = "openstreetmap"
HOTEL_TYPES = {"hotel", "resort", "guest_house", "hostel", "motel", "apartment"}

# UI category -> Nominatim special-phrase searches (one request each).
CATEGORY_QUERIES: dict[str, list[str]] = {
    "all": ["attraction", "museum", "fort", "beach"],
    "beaches": ["beach"],
    "forts": ["fort", "castle"],
    "museums": ["museum", "gallery"],
    "nature": ["waterfall", "peak", "beach"],
    "viewpoints": ["viewpoint"],
    "monuments": ["monument", "archaeological site"],
    "attractions": ["attraction", "zoo", "theme park"],
}
# (OSM key, value) pairs accepted as places - filters out roads/buildings that merely share a name.
PLACE_TAGS = {
    "tourism": {"attraction", "museum", "viewpoint", "theme_park", "zoo", "gallery"},
    "historic": {"monument", "castle", "fort", "archaeological_site", "memorial", "ruins"},
    "natural": {"waterfall", "peak", "beach", "cave_entrance"},
    "waterway": {"waterfall"},
}

_throttle_lock = threading.Lock()
_last_request = 0.0
MIN_INTERVAL = 1.1  # seconds between requests (policy: max 1/s)


def _throttle() -> None:
    global _last_request
    with _throttle_lock:
        wait = MIN_INTERVAL - (time.monotonic() - _last_request)
        if wait > 0:
            time.sleep(wait)
        _last_request = time.monotonic()


def viewbox(lat: float, lng: float, radius_m: int) -> str:
    dlat = radius_m / 111_320
    dlng = radius_m / (111_320 * max(0.2, math.cos(math.radians(lat))))
    return f"{lng - dlng:.5f},{lat + dlat:.5f},{lng + dlng:.5f},{lat - dlat:.5f}"


def _address(addr: dict[str, str]) -> str | None:
    street = " ".join(p for p in (addr.get("house_number"), addr.get("road")) if p)
    city = addr.get("city") or addr.get("town") or addr.get("village")
    parts = [p for p in (street, addr.get("suburb") or addr.get("neighbourhood"), city, addr.get("postcode")) if p]
    return ", ".join(parts) or None


def _base(row: dict[str, Any], city: str | None) -> dict[str, Any] | None:
    name = (row.get("name") or "").strip()
    osm_type, osm_id = row.get("osm_type"), row.get("osm_id")
    lat, lng = as_float(row.get("lat")), as_float(row.get("lon"))
    if not name or osm_type not in ("node", "way", "relation") or osm_id is None or lat is None or lng is None:
        return None
    addr = row.get("address") or {}
    extra = row.get("extratags") or {}
    return {
        "id": f"{PROVIDER}:{osm_type}/{osm_id}",
        "external_id": f"{osm_type}/{osm_id}",
        "name": name,
        "category": row.get("type") or "place",
        "latitude": lat,
        "longitude": lng,
        "address": _address(addr),
        "city": addr.get("city") or addr.get("town") or addr.get("village") or city,
        "website": safe_url(extra.get("website") or extra.get("contact:website")),
        "source_url": f"https://www.openstreetmap.org/{osm_type}/{osm_id}",
        "extra": extra,
    }


def normalize_hotels(rows: list[dict[str, Any]], city: str | None, retrieved_at: datetime) -> list[HotelOut]:
    out: dict[str, HotelOut] = {}
    for row in rows:
        if row.get("category") != "tourism" or row.get("type") not in HOTEL_TYPES:
            continue
        base = _base(row, city)
        if base is None:
            continue
        extra = base.pop("extra")
        stars = as_float(extra.get("stars"))
        out.setdefault(base["id"], HotelOut(**base, phone=extra.get("phone") or extra.get("contact:phone"),
                                            stars=stars if stars is not None and 0 < stars <= 7 else None, last_updated_at=retrieved_at))
    return list(out.values())


def normalize_attractions(rows: list[dict[str, Any]], city: str | None, retrieved_at: datetime) -> list[AttractionOut]:
    out: dict[str, AttractionOut] = {}
    for row in rows:
        if row.get("type") not in PLACE_TAGS.get(row.get("category") or "", set()):
            continue
        base = _base(row, city)
        if base is None:
            continue
        base.pop("extra")
        out.setdefault(base["id"], AttractionOut(**base, last_updated_at=retrieved_at))
    return list(out.values())


class NominatimPlacesProvider:
    def __init__(self, url: str, timeout_seconds: float = 8.0, contact: str | None = None, client: httpx.Client | None = None):
        self.url = url
        self.timeout = timeout_seconds
        self._client = client
        self.user_agent = f"SafarSathi/1.0 (travel itinerary planner; {contact})" if contact else "SafarSathi/1.0 (travel itinerary planner)"
        self._cache = TTLCache(ttl_seconds=6 * 3600, max_entries=300)

    def _search(self, q: str, box: str, limit: int) -> list[dict[str, Any]]:
        _throttle()
        rows = request_json(PROVIDER, self._client, "GET", self.url, httpx.Timeout(self.timeout, connect=4.0),
                            params={"q": q, "format": "jsonv2", "viewbox": box, "bounded": 1, "limit": min(limit, 40),
                                    "extratags": 1, "addressdetails": 1, "countrycodes": "in"},
                            headers={"User-Agent": self.user_agent})
        if not isinstance(rows, list):
            raise LiveProviderError(PROVIDER, "bad_response")
        return rows

    @staticmethod
    def _bounds(lat: float, lng: float, radius_m: int, limit: int) -> tuple[float, float, int, int]:
        if not (-90 <= lat <= 90 and -180 <= lng <= 180):
            raise LiveProviderError(PROVIDER, "bad_request")
        return round(lat, 4), round(lng, 4), max(500, min(radius_m, 20_000)), max(1, min(limit, 60))

    def hotels(self, lat: float, lng: float, radius_m: int = 5000, limit: int = 30, query: str | None = None, city: str | None = None) -> list[HotelOut]:
        lat, lng, radius_m, limit = self._bounds(lat, lng, radius_m, limit)
        name = clean_query(query)
        q = f"hotel {name}" if name else "hotel"
        box = viewbox(lat, lng, radius_m)

        def load() -> list[HotelOut]:
            rows = self._search(q, box, 40)
            if name and not rows:  # a hotel whose name doesn't say "hotel"
                rows = self._search(name, box, 40)
            return normalize_hotels(rows, city, datetime.now(timezone.utc))[:limit]

        return self._cache.get_or_set(("hotels", q, box), load)

    def attractions(self, lat: float, lng: float, radius_m: int = 8000, limit: int = 30, category: str | None = None, query: str | None = None, city: str | None = None) -> list[AttractionOut]:
        lat, lng, radius_m, limit = self._bounds(lat, lng, radius_m, limit)
        key = category or "all"
        if key not in CATEGORY_QUERIES:
            raise LiveProviderError(PROVIDER, "bad_request")
        name = clean_query(query)
        phrases = [name] if name else CATEGORY_QUERIES[key]
        box = viewbox(lat, lng, radius_m)

        def load() -> list[AttractionOut]:
            rows: list[dict[str, Any]] = []
            for phrase in phrases:
                rows += self._search(phrase, box, 20)
            return normalize_attractions(rows, city, datetime.now(timezone.utc))[:limit]

        return self._cache.get_or_set(("attractions", key, name, box), load)
