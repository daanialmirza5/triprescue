"""Hotels and tourist attractions from OpenStreetMap via the Overpass API.

Queries are always bounded: a radius around one point (max 20 km) and a
result limit - never "all of India". Only tags OpenStreetMap actually has are
returned; prices, availability, reviews and descriptions are never invented.
Results are cached for 6 hours.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any

import httpx

from app.providers.live.common import LiveProviderError, TTLCache, as_float, request_json, safe_url
from app.schemas.live import AttractionOut, HotelOut

PROVIDER = "openstreetmap"
USER_AGENT = "SafarSathi/1.0 (travel itinerary planner)"

HOTEL_TAGS = ["hotel", "resort", "guest_house", "hostel", "motel", "apartment"]

# UI category -> Overpass (key, values) selectors.
ATTRACTION_CATEGORIES: dict[str, list[tuple[str, list[str]]]] = {
    "beaches": [("natural", ["beach"])],
    "forts": [("historic", ["fort", "castle"])],
    "museums": [("tourism", ["museum", "gallery"])],
    "nature": [("natural", ["waterfall", "peak", "cave_entrance", "beach"])],
    "viewpoints": [("tourism", ["viewpoint"])],
    "monuments": [("historic", ["monument", "archaeological_site"])],
    "attractions": [("tourism", ["attraction", "theme_park", "zoo"])],
}
ALL_ATTRACTIONS: list[tuple[str, list[str]]] = [
    ("tourism", ["attraction", "museum", "viewpoint", "theme_park", "zoo", "gallery"]),
    ("historic", ["monument", "castle", "fort", "archaeological_site"]),
    ("natural", ["waterfall", "peak", "beach", "cave_entrance"]),
]
_SAFE_QUERY_RE = re.compile(r"[^\w\s'&.-]", re.UNICODE)


def clean_query(value: str | None) -> str | None:
    """Keep a name filter to plain words so it can't alter the Overpass query."""
    if not value:
        return None
    # Only letters, digits, spaces and ' & . - survive; none can close the
    # quoted Overpass string or add a statement.
    cleaned = re.sub(r"\s+", " ", _SAFE_QUERY_RE.sub("", value)).strip()[:60]
    return cleaned or None


def build_query(selectors: list[tuple[str, list[str]]], lat: float, lng: float, radius_m: int, limit: int, name_filter: str | None) -> str:
    name = f'["name"~"{name_filter}",i]' if name_filter else '["name"]'
    parts = "".join(
        f'nwr["{key}"~"^({"|".join(values)})$"]{name}(around:{radius_m},{lat:.5f},{lng:.5f});'
        for key, values in selectors
    )
    return f"[out:json][timeout:10];({parts});out center tags {limit};"


def _coords(el: dict[str, Any]) -> tuple[float, float] | None:
    lat, lng = as_float(el.get("lat")), as_float(el.get("lon"))
    if lat is None or lng is None:
        center = el.get("center") or {}
        lat, lng = as_float(center.get("lat")), as_float(center.get("lon"))
    if lat is None or lng is None:
        return None
    return lat, lng


def _address(tags: dict[str, str]) -> str | None:
    if tags.get("addr:full"):
        return tags["addr:full"]
    street = " ".join(p for p in (tags.get("addr:housenumber"), tags.get("addr:street")) if p)
    parts = [p for p in (street, tags.get("addr:suburb"), tags.get("addr:city"), tags.get("addr:postcode")) if p]
    return ", ".join(parts) or None


def _category(tags: dict[str, str]) -> str:
    for key in ("tourism", "historic", "natural"):
        if tags.get(key):
            return tags[key]
    return "place"


def _base(el: dict[str, Any], city: str | None) -> dict[str, Any] | None:
    tags = el.get("tags") or {}
    name = tags.get("name:en") or tags.get("name")
    coords = _coords(el)
    osm_type, osm_id = el.get("type"), el.get("id")
    if not name or coords is None or osm_type not in ("node", "way", "relation") or osm_id is None:
        return None
    return {
        "id": f"{PROVIDER}:{osm_type}/{osm_id}",
        "external_id": f"{osm_type}/{osm_id}",
        "name": name,
        "category": _category(tags),
        "latitude": coords[0],
        "longitude": coords[1],
        "address": _address(tags),
        "city": tags.get("addr:city") or city,
        "website": safe_url(tags.get("website") or tags.get("contact:website")),
        "source_url": f"https://www.openstreetmap.org/{osm_type}/{osm_id}",
        "tags": tags,
    }


def normalize_hotels(elements: list[dict[str, Any]], city: str | None, retrieved_at: datetime) -> list[HotelOut]:
    out: dict[str, HotelOut] = {}
    for el in elements:
        base = _base(el, city)
        if base is None:
            continue
        tags = base.pop("tags")
        stars = as_float(tags.get("stars"))
        out.setdefault(base["id"], HotelOut(
            **base,
            phone=tags.get("phone") or tags.get("contact:phone"),
            stars=stars if stars is not None and 0 < stars <= 7 else None,
            last_updated_at=retrieved_at,
        ))
    return list(out.values())


def normalize_attractions(elements: list[dict[str, Any]], city: str | None, retrieved_at: datetime) -> list[AttractionOut]:
    out: dict[str, AttractionOut] = {}
    for el in elements:
        base = _base(el, city)
        if base is None:
            continue
        base.pop("tags")
        out.setdefault(base["id"], AttractionOut(**base, last_updated_at=retrieved_at))
    return list(out.values())


class OverpassProvider:
    def __init__(self, url: str, timeout_seconds: float = 12.0, client: httpx.Client | None = None):
        self.url = url
        self.timeout = timeout_seconds
        self._client = client
        self._cache = TTLCache(ttl_seconds=6 * 3600, max_entries=300)

    def _elements(self, query: str) -> list[dict[str, Any]]:
        # Short connect timeout: a host with several addresses retries the
        # connect per address, so an unreachable instance must fail fast.
        timeout = httpx.Timeout(min(self.timeout, 10.0), connect=4.0)
        payload = request_json(PROVIDER, self._client, "POST", self.url, timeout,
                               data={"data": query}, headers={"User-Agent": USER_AGENT})
        elements = payload.get("elements") if isinstance(payload, dict) else None
        if not isinstance(elements, list):
            raise LiveProviderError(PROVIDER, "bad_response")
        return elements

    @staticmethod
    def _bounds(lat: float, lng: float, radius_m: int, limit: int) -> tuple[float, float, int, int]:
        if not (-90 <= lat <= 90 and -180 <= lng <= 180):
            raise LiveProviderError(PROVIDER, "bad_request")
        return round(lat, 4), round(lng, 4), max(500, min(radius_m, 20_000)), max(1, min(limit, 60))

    def hotels(self, lat: float, lng: float, radius_m: int = 5000, limit: int = 30, query: str | None = None, city: str | None = None) -> list[HotelOut]:
        lat, lng, radius_m, limit = self._bounds(lat, lng, radius_m, limit)
        name = clean_query(query)
        q = build_query([("tourism", HOTEL_TAGS)], lat, lng, radius_m, limit, name)
        return self._cache.get_or_set(
            ("hotels", q), lambda: normalize_hotels(self._elements(q), city, datetime.now(timezone.utc))[:limit]
        )

    def attractions(self, lat: float, lng: float, radius_m: int = 8000, limit: int = 30, category: str | None = None, query: str | None = None, city: str | None = None) -> list[AttractionOut]:
        lat, lng, radius_m, limit = self._bounds(lat, lng, radius_m, limit)
        if category and category != "all" and category not in ATTRACTION_CATEGORIES:
            raise LiveProviderError(PROVIDER, "bad_request")
        selectors = ATTRACTION_CATEGORIES.get(category or "", ALL_ATTRACTIONS)
        q = build_query(selectors, lat, lng, radius_m, limit, clean_query(query))
        return self._cache.get_or_set(
            ("attractions", q), lambda: normalize_attractions(self._elements(q), city, datetime.now(timezone.utc))[:limit]
        )
