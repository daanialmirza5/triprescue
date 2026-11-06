"""Live flights from Aviationstack (https://aviationstack.com/).

Only the flights a traveler searches for are requested (by flight number or by
departure/arrival airport, with a small limit) - never global data. Results
are cached for 60 s. Every failure raises LiveProviderError.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any

import httpx

from app.providers.live.common import LiveProviderError, TTLCache, as_float, as_int, request_json
from app.schemas.live import GeoPoint, LiveTransportOut, PlaceRef
from app.core.pipeline_trace import traced

PROVIDER = "aviationstack"
FLIGHT_NUMBER_RE = re.compile(r"^[A-Z0-9]{2}\d{1,4}[A-Z]?$")
AIRPORT_RE = re.compile(r"^[A-Z]{3}$")
_STATUS = {"scheduled": "scheduled", "landed": "arrived", "cancelled": "cancelled", "diverted": "diverted", "incident": "unknown"}


def normalize_flight_number(value: str) -> str:
    return re.sub(r"[\s-]", "", value or "").upper()


def _dt(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    return parsed


def normalize(item: dict[str, Any], retrieved_at: datetime) -> LiveTransportOut:
    """Aviationstack `data[]` entry -> LiveTransportOut. Raises KeyError/TypeError
    on entries without a flight identity (callers skip those)."""
    flight = item.get("flight") or {}
    number = flight.get("iata") or flight.get("icao")
    if not number:
        raise KeyError("flight.iata")
    dep = item.get("departure") or {}
    arr = item.get("arrival") or {}
    airline = (item.get("airline") or {}).get("name")
    live = item.get("live") or None
    raw_status = (item.get("flight_status") or "").lower()

    delay = as_int(arr.get("delay"))
    if delay is None:
        delay = as_int(dep.get("delay"))

    if raw_status == "active":
        status = "departed" if not live or live.get("is_ground") else "en_route"
    else:
        status = _STATUS.get(raw_status, "unknown")
    if status == "scheduled" and delay and delay >= 15:
        status = "delayed"

    location = None
    if live:
        lat, lng = as_float(live.get("latitude")), as_float(live.get("longitude"))
        if lat is not None and lng is not None and -90 <= lat <= 90 and -180 <= lng <= 180:
            location = GeoPoint(latitude=lat, longitude=lng)
    flight_date = item.get("flight_date") or ""
    aircraft = item.get("aircraft") or {}
    updated = _dt(live.get("updated")) if live else None

    return LiveTransportOut(
        id=f"{PROVIDER}:{number}:{flight_date}",
        mode="flight",
        provider=PROVIDER,
        source=PROVIDER,
        external_id=f"{number}@{flight_date}" if flight_date else number,
        number=number,
        name=airline,
        operator=airline,
        origin=PlaceRef(code=dep.get("iata"), name=dep.get("airport") or dep.get("iata") or "Unknown airport"),
        destination=PlaceRef(code=arr.get("iata"), name=arr.get("airport") or arr.get("iata") or "Unknown airport"),
        status=status,
        delay_minutes=delay,
        current_location=location,
        speed_kmh=as_float(live.get("speed_horizontal")) if live else None,
        altitude_meters=as_float(live.get("altitude")) if live else None,
        heading=as_float(live.get("direction")) if live else None,
        is_on_ground=live.get("is_ground") if live else None,
        aircraft=aircraft.get("iata") or aircraft.get("registration") or None,
        scheduled_departure=_dt(dep.get("scheduled")),
        estimated_departure=_dt(dep.get("estimated")),
        actual_departure=_dt(dep.get("actual")),
        scheduled_arrival=_dt(arr.get("scheduled")),
        estimated_arrival=_dt(arr.get("estimated")),
        actual_arrival=_dt(arr.get("actual")),
        platform=None,
        journey_date=flight_date or None,
        notices=[f"Departure gate {dep['gate']}"] if dep.get("gate") else [],
        last_updated_at=updated or retrieved_at,
        retrieved_at=retrieved_at,
    )


class AviationstackProvider:
    def __init__(self, api_key: str | None, base_url: str, timeout_seconds: float = 8.0, client: httpx.Client | None = None):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout_seconds
        self._client = client
        self._cache = TTLCache(ttl_seconds=60, max_entries=200)

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def _fetch(self, params: dict[str, Any]) -> list[LiveTransportOut]:
        if not self.configured:
            raise LiveProviderError(PROVIDER, "not_configured")
        payload = request_json(PROVIDER, self._client, "GET", f"{self.base_url}/flights", self.timeout,
                               params={"access_key": self.api_key, **params})
        if not isinstance(payload, dict):
            raise LiveProviderError(PROVIDER, "bad_response")
        if "error" in payload:
            # Aviationstack sometimes answers 200 with an error object.
            code = str((payload.get("error") or {}).get("code") or "").lower()
            kind = "auth" if "access" in code or "key" in code else "rate_limited" if "limit" in code else "unavailable"
            raise LiveProviderError(PROVIDER, kind)
        data = payload.get("data")
        if not isinstance(data, list):
            raise LiveProviderError(PROVIDER, "bad_response")
        now = datetime.now(timezone.utc)
        flights: list[LiveTransportOut] = []
        for item in data:
            try:
                flights.append(normalize(item, now))
            except (KeyError, TypeError, ValueError):
                continue
        return flights

    def search(self, flight_number: str | None = None, dep_iata: str | None = None, arr_iata: str | None = None, limit: int = 20) -> list[LiveTransportOut]:
        params: dict[str, Any] = {"limit": max(1, min(limit, 50))}
        if flight_number:
            number = normalize_flight_number(flight_number)
            if not FLIGHT_NUMBER_RE.match(number):
                raise LiveProviderError(PROVIDER, "bad_request")
            params["flight_iata"] = number
        for key, value in (("dep_iata", dep_iata), ("arr_iata", arr_iata)):
            if value:
                code = value.strip().upper()
                if not AIRPORT_RE.match(code):
                    raise LiveProviderError(PROVIDER, "bad_request")
                params[key] = code
        if len(params) == 1:
            raise LiveProviderError(PROVIDER, "bad_request")  # never an unfiltered global query
        key = tuple(sorted(params.items()))
        return self._cache.get_or_set(key, lambda: self._fetch(params))

    @traced("provider", "Aviationstack live flight status", detail=lambda r, a, k: {"provider": "aviationstack", "dataSource": "live", "flight": r.number, "status": r.status, "delayMinutes": r.delay_minutes})
    def get_flight(self, flight_number: str, flight_date: str | None = None) -> LiveTransportOut:
        flights = self.search(flight_number=flight_number, limit=10)
        if flight_date:
            flights = [f for f in flights if f.journey_date == flight_date]
        if not flights:
            raise LiveProviderError(PROVIDER, "not_found")
        # Prefer a flight that is in the air or next to depart.
        order = {"en_route": 0, "departed": 1, "delayed": 2, "boarding": 2, "scheduled": 3}
        return sorted(flights, key=lambda f: (order.get(f.status, 4), f.journey_date or ""))[0]
