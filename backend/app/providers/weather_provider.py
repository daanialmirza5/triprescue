"""Open-Meteo weather provider used by the backend risk engine.

The frontend weather service and this provider intentionally use the same
Open-Meteo hourly fields.  Keeping the server-side calculation here means the
risk engine can score the weather at the actual itinerary coordinates and
scheduled hour instead of inferring weather risk from time of day.
"""

from __future__ import annotations

import math
import threading
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from app.core.datetime_utils import utcnow_naive
from typing import Any

import httpx
from app.core.pipeline_trace import traced


@dataclass(frozen=True)
class WeatherSnapshot:
    temperature: float
    precipitation_probability: int
    wind_speed: float
    weather_code: int
    label: str
    fetched_at: datetime

    @property
    def risk_percent(self) -> int:
        """Convert the live weather signal into a deterministic 0-100 risk."""
        code_risk = {
            0: 0,
            1: 8,
            2: 12,
            3: 18,
            45: 25,
            48: 28,
            51: 32,
            53: 38,
            55: 45,
            56: 48,
            57: 55,
            61: 45,
            63: 55,
            65: 68,
            66: 58,
            67: 72,
            71: 55,
            73: 65,
            75: 78,
            77: 60,
            80: 48,
            81: 58,
            82: 72,
            85: 65,
            86: 78,
            95: 82,
            96: 90,
            99: 95,
        }.get(self.weather_code, 25)
        precipitation_risk = self.precipitation_probability * 0.55
        wind_risk = min(max((self.wind_speed - 20) * 2.0, 0.0), 100.0) * 0.15
        return int(round(min(100.0, max(0.0, code_risk * 0.30 + precipitation_risk + wind_risk))))


class OpenMeteoWeatherProvider:
    """Small cached Open-Meteo client with injectable HTTP transport for tests."""

    FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
    ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
    _cache: dict[str, tuple[WeatherSnapshot, datetime]] = {}

    def __init__(self, client: httpx.Client | None = None, timeout_seconds: float = 5.0):
        self._client = client
        self.timeout_seconds = timeout_seconds
        self._cache: dict[str, tuple[WeatherSnapshot, datetime]] = {}

    @staticmethod
    def _label(code: int) -> str:
        if code == 0:
            return "Clear sky"
        if code in (1, 2):
            return "Partly cloudy"
        if code == 3:
            return "Overcast"
        if code in (45, 48):
            return "Fog"
        if code in (51, 53, 55, 56, 57):
            return "Light rain"
        if code in (61, 63, 65, 66, 67, 80, 81, 82):
            return "Rain showers"
        if code in (71, 73, 75, 77, 85, 86):
            return "Snow showers"
        if code in (95, 96, 99):
            return "Thunderstorm"
        return "Changing conditions"

    @staticmethod
    def _cache_key(lat: float, lng: float, moment: datetime) -> str:
        return f"{lat:.2f},{lng:.2f},{moment:%Y-%m-%d-%H}"

    def _request(self, url: str, params: dict[str, Any]) -> dict[str, Any]:
        if self._client is not None:
            response = self._client.get(url, params=params, timeout=self.timeout_seconds)
        else:
            response = httpx.get(url, params=params, timeout=self.timeout_seconds)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, dict) or not data.get("hourly"):
            raise ValueError("Open-Meteo returned no hourly weather data")
        return data

    def get_snapshot(self, lat: float, lng: float, moment: datetime) -> WeatherSnapshot:
        key = self._cache_key(lat, lng, moment)
        cached = self._cache.get(key)
        if cached and cached[1] > utcnow_naive():
            return cached[0]

        day = moment.date()
        # Forecast data is the live path for current/future itinerary dates. For
        # seeded/demo trips in the past, Open-Meteo's archive endpoint supplies the
        # same hourly fields without pretending that an old date is a forecast.
        today = date.today()
        is_forecast = day >= today
        url = self.FORECAST_URL if is_forecast else self.ARCHIVE_URL
        params: dict[str, Any] = {
            "latitude": lat,
            "longitude": lng,
            "hourly": "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
            "start_date": day.isoformat(),
            "end_date": day.isoformat(),
            "timezone": "auto",
        }

        data = self._request(url, params)
        hourly = data["hourly"]
        times = hourly.get("time") or []
        if not times:
            raise ValueError("Open-Meteo returned an empty hourly timeline")

        # Open-Meteo returns local-time hourly strings when timezone=auto. Match the
        # requested scheduled hour, with nearest-hour fallback for unusual inputs.
        target = moment.replace(minute=0, second=0, microsecond=0)
        parsed_times: list[datetime] = []
        for raw in times:
            try:
                parsed_times.append(datetime.fromisoformat(str(raw).replace("Z", "+00:00")).replace(tzinfo=None))
            except ValueError:
                parsed_times.append(datetime.combine(day, datetime.min.time()))
        index = min(range(len(parsed_times)), key=lambda i: abs(parsed_times[i] - target))

        def value(name: str, default: float = 0.0) -> float:
            values = hourly.get(name) or []
            raw = values[index] if index < len(values) else default
            return float(raw if raw is not None else default)

        snapshot = WeatherSnapshot(
            temperature=value("temperature_2m"),
            precipitation_probability=int(round(value("precipitation_probability"))),
            wind_speed=value("wind_speed_10m"),
            weather_code=int(round(value("weather_code"))),
            label=self._label(int(round(value("weather_code")))),
            fetched_at=utcnow_naive(),
        )
        self._cache[key] = (snapshot, utcnow_naive() + timedelta(minutes=10))
        return snapshot


# ---------------------------------------------------------------------------
# 7-day forecast provider (Digital Twin / weather endpoints)
# ---------------------------------------------------------------------------



@dataclass(frozen=True)
class HourlyWeather:
    time: datetime
    temperature_c: float
    precipitation_probability: int
    rainfall_mm: float
    wind_speed_kmh: float
    cloud_cover: int
    visibility_m: float
    weather_code: int

    @property
    def label(self) -> str:
        return OpenMeteoWeatherProvider._label(self.weather_code)

    @property
    def risk_percent(self) -> int:
        return WeatherSnapshot(
            temperature=self.temperature_c,
            precipitation_probability=self.precipitation_probability,
            wind_speed=self.wind_speed_kmh,
            weather_code=self.weather_code,
            label=self.label,
            fetched_at=self.time,
        ).risk_percent


@dataclass(frozen=True)
class WeatherForecast:
    lat: float
    lng: float
    source: str  # "open-meteo" | "fallback"
    current: HourlyWeather
    hourly: list[HourlyWeather] = field(default_factory=list)
    fetched_at: datetime = field(default_factory=utcnow_naive)

    def at(self, moment: datetime) -> HourlyWeather:
        """Nearest forecast hour; outside the forecast range, a deterministic
        climatology estimate for that moment."""
        target = moment.replace(minute=0, second=0, microsecond=0)
        if self.hourly and self.hourly[0].time <= target <= self.hourly[-1].time:
            return min(self.hourly, key=lambda h: abs(h.time - target))
        return synthetic_hour(self.lat, self.lng, target)


def synthetic_hour(lat: float, lng: float, moment: datetime) -> HourlyWeather:
    """Deterministic, plausible weather for any coordinate and hour, used when
    Open-Meteo is unreachable (offline demos, tests) or for dates outside the
    forecast window. Same inputs always give the same output."""
    doy = moment.timetuple().tm_yday
    hour = moment.hour
    abs_lat = abs(lat)
    # Temperature: latitude band + season (flipped for the southern hemisphere) + diurnal swing.
    seasonal = math.cos((doy - 196) / 365 * 2 * math.pi) * (1 if lat >= 0 else -1)
    base = 30 - abs_lat * 0.45 + seasonal * min(14, abs_lat * 0.35)
    diurnal = math.sin((hour - 9) / 24 * 2 * math.pi) * 5
    seed = math.sin(lat * 12.9898 + lng * 78.233 + doy * 0.1 + hour * 0.37) * 43758.5453
    jitter = seed - math.floor(seed)  # 0..1
    temperature = round(base + diurnal + (jitter - 0.5) * 3, 1)
    # South Asian monsoon (Jun-Sep, 5-35N, 65-100E) is wet; elsewhere mostly dry spells.
    monsoon = 152 <= doy <= 273 and 5 <= lat <= 35 and 65 <= lng <= 100
    wetness = 0.75 if monsoon else 0.25
    precip_prob = int(round(min(100, max(0, (wetness * 100) * (0.55 + jitter * 0.6)))))
    rainfall = round(max(0.0, (jitter - (0.35 if monsoon else 0.7)) * (18 if monsoon else 6)), 1)
    wind = round(8 + jitter * 18 + (6 if monsoon else 0), 1)
    cloud = int(round(min(100, precip_prob * 0.9 + jitter * 15)))
    fog_hour = hour in (4, 5, 6, 7) and not monsoon and doy in range(335, 367) or (hour in (4, 5, 6, 7) and doy <= 45)
    visibility = 900.0 + jitter * 1500 if fog_hour and lat > 20 else 8000.0 + jitter * 12000
    if rainfall >= 7.6:
        code = 65
    elif rainfall >= 2.5:
        code = 63
    elif rainfall > 0:
        code = 61
    elif visibility < 1000:
        code = 45
    else:
        code = 3 if cloud > 70 else 2 if cloud > 30 else 0
    return HourlyWeather(moment, temperature, precip_prob, rainfall, wind, cloud, round(visibility), code)


class WeatherForecastProvider:
    """Live current conditions + 7-day hourly forecast from Open-Meteo (no API
    key), cached 15 minutes per ~1 km grid cell, with a deterministic offline
    fallback so callers always get an answer."""

    FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
    HOURLY_FIELDS = "temperature_2m,precipitation_probability,rain,wind_speed_10m,cloud_cover,visibility,weather_code"
    CACHE_MINUTES = 15

    def __init__(self, client: httpx.Client | None = None, timeout_seconds: float = 4.0):
        self._client = client
        self.timeout_seconds = timeout_seconds
        self._cache: dict[str, tuple[WeatherForecast, datetime]] = {}
        self._lock = threading.Lock()

    def _fetch(self, lat: float, lng: float) -> dict[str, Any]:
        params = {"latitude": lat, "longitude": lng, "hourly": self.HOURLY_FIELDS, "current": self.HOURLY_FIELDS,
                  "forecast_days": 7, "timezone": "auto"}
        getter = self._client.get if self._client is not None else httpx.get
        response = getter(self.FORECAST_URL, params=params, timeout=self.timeout_seconds)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, dict) or not (data.get("hourly") or {}).get("time"):
            raise ValueError("Open-Meteo returned no hourly forecast")
        return data

    @staticmethod
    def _parse(data: dict[str, Any], lat: float, lng: float) -> WeatherForecast:
        hourly = data["hourly"]

        def pick(name: str, i: int, default: float = 0.0) -> float:
            values = hourly.get(name) or []
            raw = values[i] if i < len(values) else None
            return float(default if raw is None else raw)

        hours = [
            HourlyWeather(
                time=datetime.fromisoformat(str(t)),
                temperature_c=pick("temperature_2m", i),
                precipitation_probability=int(round(pick("precipitation_probability", i))),
                rainfall_mm=pick("rain", i),
                wind_speed_kmh=pick("wind_speed_10m", i),
                cloud_cover=int(round(pick("cloud_cover", i))),
                visibility_m=pick("visibility", i, 10000.0),
                weather_code=int(round(pick("weather_code", i))),
            )
            for i, t in enumerate(hourly["time"])
        ]
        cur = data.get("current") or {}
        if cur.get("time"):
            current = HourlyWeather(
                time=datetime.fromisoformat(str(cur["time"])).replace(minute=0),
                temperature_c=float(cur.get("temperature_2m") or 0),
                precipitation_probability=int(round(float(cur.get("precipitation_probability") or 0))),
                rainfall_mm=float(cur.get("rain") or 0),
                wind_speed_kmh=float(cur.get("wind_speed_10m") or 0),
                cloud_cover=int(round(float(cur.get("cloud_cover") or 0))),
                visibility_m=float(cur.get("visibility") or 10000),
                weather_code=int(round(float(cur.get("weather_code") or 0))),
            )
        else:
            current = hours[0]
        return WeatherForecast(lat=lat, lng=lng, source="open-meteo", current=current, hourly=hours)

    @staticmethod
    def fallback(lat: float, lng: float, now: datetime | None = None) -> WeatherForecast:
        start = (now or datetime.now()).replace(minute=0, second=0, microsecond=0)
        hours = [synthetic_hour(lat, lng, start + timedelta(hours=i)) for i in range(7 * 24)]
        return WeatherForecast(lat=lat, lng=lng, source="fallback", current=hours[0], hourly=hours)

    @traced("provider", "Weather forecast (Open-Meteo)", detail=lambda r, a, k: {"provider": "open-meteo", "dataSource": r.source})
    def get_forecast(self, lat: float, lng: float) -> WeatherForecast:
        key = f"{lat:.2f},{lng:.2f}"
        with self._lock:
            cached = self._cache.get(key)
            if cached and cached[1] > utcnow_naive():
                return cached[0]
        try:
            forecast = self._parse(self._fetch(lat, lng), lat, lng)
        except Exception:
            forecast = self.fallback(lat, lng)
        with self._lock:
            # Fallbacks are cached briefly so a flapping network retries soon.
            ttl = self.CACHE_MINUTES if forecast.source == "open-meteo" else 2
            self._cache[key] = (forecast, utcnow_naive() + timedelta(minutes=ttl))
        return forecast