from datetime import datetime

from app.schemas.base import CamelModel


class HourlyWeatherOut(CamelModel):
    time: datetime
    temperature_c: float
    precipitation_probability: int
    rainfall_mm: float
    wind_speed_kmh: float
    cloud_cover: int
    visibility_m: float
    weather_code: int
    label: str
    risk_percent: int


class WeatherForecastOut(CamelModel):
    lat: float
    lng: float
    source: str  # "open-meteo" | "fallback"
    current: HourlyWeatherOut
    hourly: list[HourlyWeatherOut]


class NodeWeatherOut(CamelModel):
    node_id: str
    title: str
    category: str
    location: str
    lat: float | None = None
    lng: float | None = None
    scheduled_start: datetime
    conditions: HourlyWeatherOut | None = None
    # Weather Vulnerability Index: how exposed this kind of booking is to weather (0-100).
    vulnerability_index: int
    # WVI x forecast risk: how much the forecast actually threatens this booking (0-100).
    exposure: int
    source: str  # "open-meteo" | "open-meteo-current" (booking outside the 7-day window) | "fallback" | "unavailable"


class TripWeatherOut(CamelModel):
    trip_id: str
    nodes: list[NodeWeatherOut]
    max_exposure: int
    most_exposed_node_id: str | None = None
    summary: str
