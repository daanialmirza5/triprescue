"""Live weather for coordinates and whole itineraries, plus the Weather
Vulnerability Index (WVI): how exposed each kind of booking is to weather."""

from __future__ import annotations

import contextvars
import re
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy.orm import Session

from app.config import get_settings
from app.providers.weather_provider import HourlyWeather, WeatherForecast, WeatherForecastProvider
from app.repositories.node_repository import NodeRepository
from app.schemas.weather import HourlyWeatherOut, NodeWeatherOut, TripWeatherOut, WeatherForecastOut
from app.services.trip_service import get_trip
from app.core.pipeline_trace import traced

_provider = WeatherForecastProvider(timeout_seconds=get_settings().weather_request_timeout_seconds)

MOUNTAIN_RE = re.compile(r"\b(leh|ladakh|manali|shimla|darjeeling|munnar|pass|ghat|hill|mountain|nubra|pangong|spiti)\b", re.I)
OUTDOOR_RE = re.compile(r"\b(tour|trek|hike|lake|safari|cruise|boat|dive|scuba|beach|valley|sunrise|sunset|fort|garden|excursion|rafting|camp)\b", re.I)


def category_of(node) -> str:
    return str(getattr(node.category, "value", node.category))


def is_mountain(node) -> bool:
    return bool(MOUNTAIN_RE.search(f"{node.title} {node.location}"))


def is_outdoor(node) -> bool:
    return bool(OUTDOOR_RE.search(f"{node.title} {getattr(node, 'subtitle', '')} {node.location}"))


def vulnerability_index(node) -> int:
    """0-100: outdoor activities and mountain road transfers are the most
    weather-exposed; indoor stays the least."""
    category = category_of(node)
    if category == "activity":
        return 88 if is_outdoor(node) else 55
    if category == "transfer":
        return 78 if is_mountain(node) else 58
    if category in ("flight", "return"):
        return 62 if is_mountain(node) else 46
    if category == "connection":
        return 38
    if category == "hotel":
        return 12
    return 40


def to_out(hour: HourlyWeather) -> HourlyWeatherOut:
    return HourlyWeatherOut(
        time=hour.time, temperature_c=hour.temperature_c, precipitation_probability=hour.precipitation_probability,
        rainfall_mm=hour.rainfall_mm, wind_speed_kmh=hour.wind_speed_kmh, cloud_cover=hour.cloud_cover,
        visibility_m=hour.visibility_m, weather_code=hour.weather_code, label=hour.label, risk_percent=hour.risk_percent,
    )


def get_forecast(lat: float, lng: float) -> WeatherForecast:
    return _provider.get_forecast(lat, lng)


def forecast_out(lat: float, lng: float, hours: int = 48) -> WeatherForecastOut:
    forecast = get_forecast(lat, lng)
    return WeatherForecastOut(
        lat=lat, lng=lng, source=forecast.source, current=to_out(forecast.current),
        hourly=[to_out(h) for h in forecast.hourly[: max(1, min(hours, len(forecast.hourly)))]],
    )


def node_coordinates(nodes: list) -> dict[str, tuple[float, float]]:
    """Coordinates per node; nodes without their own borrow from another node
    at the same location."""
    by_location = {n.location: (n.lat, n.lng) for n in nodes if n.lat is not None and n.lng is not None}
    coords: dict[str, tuple[float, float]] = {}
    for n in nodes:
        if n.lat is not None and n.lng is not None:
            coords[n.id] = (n.lat, n.lng)
        elif n.location in by_location:
            coords[n.id] = by_location[n.location]
    return coords


def _forecasts_for(points: set[tuple[float, float]]) -> dict[tuple[float, float], WeatherForecast]:
    """One forecast per distinct location, fetched concurrently: a trip with
    six stops costs one Open-Meteo round-trip of latency, not six. The provider
    never raises (it falls back offline), so every point gets an answer."""
    if not points:
        return {}
    ordered = list(points)
    # Each worker runs in a copy of the caller's context so request-scoped
    # context (e.g. a pipeline trace) follows the call into the pool.
    contexts = [contextvars.copy_context() for _ in ordered]
    with ThreadPoolExecutor(max_workers=min(6, len(ordered)), thread_name_prefix="trip-weather") as pool:
        return dict(zip(ordered, pool.map(lambda cp: cp[0].run(get_forecast, *cp[1]), zip(contexts, ordered))))


@traced("service", "Weather service: forecast for every booking")
def trip_weather(db: Session, trip_id: str, traveler_id: str | None = None) -> TripWeatherOut:
    get_trip(db, trip_id, traveler_id)
    nodes = NodeRepository(db).list_for_trip(trip_id)
    coords = node_coordinates(nodes)
    forecasts = _forecasts_for(set(coords.values()))
    out: list[NodeWeatherOut] = []
    for n in nodes:
        wvi = vulnerability_index(n)
        point = coords.get(n.id)
        if point is None:
            out.append(NodeWeatherOut(node_id=n.id, title=n.title, category=category_of(n), location=n.location,
                                      scheduled_start=n.scheduled_start, vulnerability_index=wvi, exposure=0, source="unavailable"))
            continue
        forecast = forecasts[point]
        in_range = bool(forecast.hourly) and forecast.hourly[0].time <= n.scheduled_start <= forecast.hourly[-1].time
        if in_range:
            hour, source = forecast.at(n.scheduled_start), forecast.source
        elif forecast.source == "open-meteo":
            # The booking is outside Open-Meteo's 7-day window (past trips, or
            # far-future ones): show the live conditions at that place right now,
            # labelled as such, rather than a synthetic guess for that hour.
            hour, source = forecast.current, "open-meteo-current"
        else:
            hour, source = forecast.at(n.scheduled_start), "fallback"
        out.append(
            NodeWeatherOut(
                node_id=n.id, title=n.title, category=category_of(n), location=n.location, lat=point[0], lng=point[1],
                scheduled_start=n.scheduled_start, conditions=to_out(hour), vulnerability_index=wvi,
                exposure=round(wvi * hour.risk_percent / 100),
                source=source,
            )
        )
    worst = max(out, key=lambda o: o.exposure, default=None)
    if worst is None or worst.exposure < 15:
        summary = "Weather poses little threat to this itinerary."
    else:
        c = worst.conditions
        summary = (
            f"{worst.title} is the most weather-exposed booking (exposure {worst.exposure}/100"
            + (f": {c.label.lower()}, {c.precipitation_probability}% rain chance, wind {c.wind_speed_kmh:.0f} km/h" if c else "")
            + ")."
        )
    return TripWeatherOut(
        trip_id=trip_id, nodes=out, max_exposure=worst.exposure if worst else 0,
        most_exposed_node_id=worst.node_id if worst and worst.exposure else None, summary=summary,
    )
