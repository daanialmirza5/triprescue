from datetime import datetime

import httpx

from app.providers.weather_provider import OpenMeteoWeatherProvider


def test_open_meteo_snapshot_uses_scheduled_hour_and_computes_weather_risk():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.params["hourly"] == "temperature_2m,precipitation_probability,weather_code,wind_speed_10m"
        return httpx.Response(
            200,
            json={
                "hourly": {
                    "time": ["2025-09-12T05:00", "2025-09-12T06:00", "2025-09-12T07:00"],
                    "temperature_2m": [20, 21, 22],
                    "precipitation_probability": [20, 80, 10],
                    "weather_code": [0, 63, 0],
                    "wind_speed_10m": [5, 28, 4],
                }
            },
        )

    provider = OpenMeteoWeatherProvider(client=httpx.Client(transport=httpx.MockTransport(handler)))
    snapshot = provider.get_snapshot(28.5562, 77.1, datetime(2025, 9, 12, 6, 20))

    assert snapshot.temperature == 21
    assert snapshot.precipitation_probability == 80
    assert snapshot.weather_code == 63
    assert snapshot.label == "Rain showers"
    assert snapshot.risk_percent > 50
