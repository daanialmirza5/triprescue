"""Live Indian Railways data from RailRadar (https://railradar.in/docs).

- GET /v1/trains/{number}/live            live running status
- GET /v1/trains/between/{from}/{to}      trains between two stations

The live position is the provider-reported current station; its coordinates
come from the provider's own route list (includeCoordinates=true) - nothing is
interpolated or invented. Live status is cached 60 s, timetables 30 min.
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from app.providers.live.common import LiveProviderError, TTLCache, as_float, as_int, request_json
from app.schemas.live import GeoPoint, LiveTransportOut, PlaceRef, RouteStop, TrainBetweenOut, TrainsBetweenResultOut

PROVIDER = "railradar"
TRAIN_NUMBER_RE = re.compile(r"^\d{5}$")
STATION_RE = re.compile(r"^[A-Z]{1,5}$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _dt(value: Any) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _status(raw: str, delay: int | None, exceptions: list[dict], current: dict) -> str:
    # RailRadar uses hyphenated values ("not-started", "at-station").
    text = re.sub(r"[-_]+", " ", (raw or "").lower())
    types = " ".join(str(e.get("type") or "").lower() for e in exceptions)
    if "cancel" in text or ("cancel" in types and "partial" not in types):
        return "cancelled"
    if "divert" in text or current.get("isDiverted") or "divert" in types:
        return "diverted"
    if any(w in text for w in ("arrived", "completed", "reached", "terminated")):
        return "arrived"
    if any(w in text for w in ("not started", "yet to start", "scheduled", "upcoming")):
        return "delayed" if delay and delay >= 15 else "scheduled"
    if any(w in text for w in ("running", "departed", "in transit", "moving", "halt", "at station", "live")):
        return "en_route"
    return "unknown"


def normalize_live(data: dict[str, Any], retrieved_at: datetime) -> LiveTransportOut:
    train = data.get("train") or {}
    number = str(data.get("trainNumber") or train.get("number") or "")
    if not number:
        raise KeyError("trainNumber")
    name = data.get("trainName") or train.get("name")
    route_raw = [s for s in (data.get("route") or []) if isinstance(s, dict) and s.get("stationCode")]
    by_code = {s["stationCode"]: s for s in route_raw}
    current = data.get("currentLocation") or {}
    exceptions = [e for e in (data.get("exceptions") or []) if isinstance(e, dict)]
    delay = as_int(data.get("delayMinutes"))

    here = by_code.get(current.get("stationCode") or "")
    location = None
    # Provider-reported position first, else the current station's coordinates.
    coords = current.get("coordinates") or here or {}
    lat, lng = as_float(coords.get("lat")), as_float(coords.get("lng"))
    if lat is not None and lng is not None:
        location = GeoPoint(latitude=lat, longitude=lng)
    as_of = _dt(data.get("lastUpdatedAt")) or retrieved_at

    def happened(stop: dict, field: str) -> datetime | None:
        """RailRadar pre-fills actual* with projected times for stops the
        train hasn't reached; only a time at or before the provider's own
        timestamp, at a stop that isn't upcoming, is really "actual"."""
        value = _dt(stop.get(field))
        if value is None or str(stop.get("status") or "").lower() == "upcoming":
            return None
        try:
            return value if value <= as_of else None
        except TypeError:  # naive vs aware timestamps: can't tell, don't claim it
            return None

    def ref(obj: dict | None) -> PlaceRef | None:
        if not obj:
            return None
        code = obj.get("code") or obj.get("stationCode")
        station = by_code.get(code or "")
        return PlaceRef(
            code=code,
            name=obj.get("name") or obj.get("stationName") or code or "Unknown station",
            latitude=as_float(station.get("lat")) if station else None,
            longitude=as_float(station.get("lng")) if station else None,
        )

    first, last = (route_raw[0], route_raw[-1]) if route_raw else ({}, {})
    scheduled_arrival = _dt(last.get("scheduledArrival"))
    actual_arrival = happened(last, "actualArrival")
    actual_departure = happened(first, "actualDeparture")
    projected_arrival = None if actual_arrival else _dt(last.get("actualArrival"))
    projected_departure = None if actual_departure else _dt(first.get("actualDeparture"))
    next_halt = data.get("nextHalt") or None
    next_station = by_code.get((next_halt or {}).get("stationCode") or "")
    # At a station, its own platform; while running, the next halt's.
    at_station = str(current.get("status") or "").lower().replace("_", "-") == "at-station"
    platform = ((here if at_station else next_station) or here or next_station or {}).get("platform") or None

    notices = [str(e.get("message")) for e in exceptions if e.get("message")]
    if any("resched" in str(e.get("type") or "").lower() or e.get("rescheduled") for e in exceptions):
        notices.append("Rescheduled by Indian Railways.")

    return LiveTransportOut(
        id=f"{PROVIDER}:{number}:{(data.get('startDate') or '')[:10]}",
        mode="train",
        provider=PROVIDER,
        source=PROVIDER,
        external_id=f"{number}@{(data.get('startDate') or '')[:10]}" if data.get("startDate") else number,
        number=number,
        name=name,
        operator="Indian Railways",
        origin=ref(train.get("source")) or ref(first),
        destination=ref(train.get("destination")) or ref(last),
        status=_status(str(data.get("status") or ""), delay, exceptions, current),
        delay_minutes=delay,
        current_location=location,
        current_location_name=(here or {}).get("stationName") or current.get("stationCode"),
        speed_kmh=as_float(current.get("speedKmh")),
        heading=as_float(current.get("bearingDegrees")),
        scheduled_departure=_dt(first.get("scheduledDeparture")),
        estimated_departure=projected_departure,
        actual_departure=actual_departure,
        scheduled_arrival=scheduled_arrival,
        # The provider's projection, else its delay applied to the timetable -
        # only while no actual arrival exists yet.
        estimated_arrival=projected_arrival or ((scheduled_arrival + timedelta(minutes=delay)) if scheduled_arrival and delay is not None and not actual_arrival else None),
        actual_arrival=actual_arrival,
        previous_stop=ref(data.get("previousHalt")),
        next_stop=ref(next_halt),
        platform=str(platform) if platform else None,
        route=[
            RouteStop(code=s["stationCode"], name=s.get("stationName") or s["stationCode"], latitude=as_float(s.get("lat")), longitude=as_float(s.get("lng")))
            for s in route_raw
            if s.get("isHalt", True)
        ],
        journey_date=(data.get("startDate") or "")[:10] or None,
        notices=notices,
        last_updated_at=_dt(data.get("lastUpdatedAt")) or retrieved_at,
        retrieved_at=retrieved_at,
    )


def normalize_between(data: dict[str, Any], date: str | None, retrieved_at: datetime) -> TrainsBetweenResultOut:
    origin = data.get("from") or {}
    dest = data.get("to") or {}
    origin_ref = PlaceRef(code=origin.get("code"), name=origin.get("name") or origin.get("code") or "")
    dest_ref = PlaceRef(code=dest.get("code"), name=dest.get("name") or dest.get("code") or "")
    trains: list[TrainBetweenOut] = []
    for row in data.get("trains") or []:
        try:
            train = row["train"]
            number = str(train["number"])
            dep, arr = row.get("from") or {}, row.get("to") or {}
            live = row.get("live") or {}
            trains.append(TrainBetweenOut(
                id=f"{PROVIDER}:{number}:{date or ''}",
                external_id=f"{number}@{date}" if date else number,
                number=number,
                name=train.get("name") or number,
                train_type=train.get("type"),
                origin=origin_ref,
                destination=dest_ref,
                departure_time=dep.get("departure"),
                arrival_time=arr.get("arrival"),
                arrival_day_offset=max(0, (as_int(arr.get("day")) or 1) - (as_int(dep.get("day")) or 1)),
                duration_minutes=as_int(row.get("duration")),
                run_days=[str(d) for d in train.get("runDays") or []],
                live_delay_minutes=as_int(live.get("delayMinutes")),
                live_platform=str(live["platform"]) if live.get("platform") else None,
            ))
        except (KeyError, TypeError, ValueError):
            continue
    return TrainsBetweenResultOut(origin=origin_ref, destination=dest_ref, date=date, trains=trains, retrieved_at=retrieved_at)


class RailRadarProvider:
    def __init__(self, api_key: str | None, base_url: str, timeout_seconds: float = 8.0, client: httpx.Client | None = None):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout_seconds
        self._client = client
        self._live_cache = TTLCache(ttl_seconds=60, max_entries=200)
        self._between_cache = TTLCache(ttl_seconds=30 * 60, max_entries=200)

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def _get(self, path: str, params: dict[str, Any]) -> dict[str, Any]:
        if not self.configured:
            raise LiveProviderError(PROVIDER, "not_configured")
        payload = request_json(PROVIDER, self._client, "GET", f"{self.base_url}{path}", self.timeout,
                               params=params, headers={"Authorization": f"Bearer {self.api_key}"})
        if not isinstance(payload, dict) or payload.get("success") is False or not isinstance(payload.get("data"), dict):
            raise LiveProviderError(PROVIDER, "bad_response")
        return payload["data"]

    def live_status(self, train_number: str, date: str | None = None) -> LiveTransportOut:
        number = (train_number or "").strip()
        if not TRAIN_NUMBER_RE.match(number) or (date and not DATE_RE.match(date)):
            raise LiveProviderError(PROVIDER, "bad_request")
        params: dict[str, Any] = {"includeCoordinates": "true"}
        if date:
            params["date"] = date

        def load() -> LiveTransportOut:
            data = self._get(f"/v1/trains/{number}/live", params)
            try:
                return normalize_live(data, datetime.now(timezone.utc))
            except (KeyError, TypeError, ValueError) as exc:
                raise LiveProviderError(PROVIDER, "bad_response") from exc

        return self._live_cache.get_or_set((number, date), load)

    def between(self, origin_code: str, destination_code: str, date: str | None = None) -> TrainsBetweenResultOut:
        origin, dest = (origin_code or "").strip().upper(), (destination_code or "").strip().upper()
        if not STATION_RE.match(origin) or not STATION_RE.match(dest) or (date and not DATE_RE.match(date)):
            raise LiveProviderError(PROVIDER, "bad_request")
        params: dict[str, Any] = {"byCity": "true"}
        if date:
            params["date"] = date

        def load() -> TrainsBetweenResultOut:
            data = self._get(f"/v1/trains/between/{origin}/{dest}", params)
            return normalize_between(data, date, datetime.now(timezone.utc))

        return self._between_cache.get_or_set((origin, dest, date), load)
