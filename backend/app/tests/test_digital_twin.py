"""Weather-driven Digital Twin: weather API, social signals, twin simulation,
preemptive apply, and the Nugen reasoning integration (all offline)."""

from datetime import datetime

import httpx
import pytest

from app.config import get_settings
from app.core.nugen_client import NugenClient
from app.engines.digital_twin_engine import DigitalTwinEngine, WeatherScenario
from app.engines.propagation_engine import PropagationEngine
from app.engines.types import EngineEdge, EngineNode
from app.providers.weather_provider import WeatherForecastProvider
from app.services import nugen_service, social_signals_service, weather_service

TRIP = "trip-ladakh-2025"
MONSOON = {"scenarioName": "Severe Monsoon Deluge", "rainfallMmPerHour": 55, "windSpeedKmh": 65,
           "visibilityMeters": 300, "temperatureCelsius": 28, "stormDurationHours": 4}


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    """No network: Open-Meteo is 'down' (deterministic fallback) and Nugen is unconfigured."""
    def down(*a, **k):
        raise httpx.ConnectError("offline")
    monkeypatch.setattr(weather_service._provider, "_fetch", down)
    weather_service._provider._cache.clear()
    monkeypatch.setattr(nugen_service, "_client", NugenClient(api_key=""))


# ---- Weather ----------------------------------------------------------------------


def test_weather_endpoint_falls_back_offline(client):
    body = client.get("/api/weather", params={"lat": 19.09, "lng": 72.87, "hours": 24}).json()
    assert body["source"] == "fallback" and len(body["hourly"]) == 24
    for key in ("temperatureC", "precipitationProbability", "rainfallMm", "windSpeedKmh", "cloudCover", "visibilityM"):
        assert key in body["current"]
    assert client.get("/api/weather", params={"lat": 200, "lng": 0}).status_code == 422


def test_fallback_is_deterministic():
    a = WeatherForecastProvider.fallback(28.55, 77.1, datetime(2026, 7, 1, 10))
    b = WeatherForecastProvider.fallback(28.55, 77.1, datetime(2026, 7, 1, 10))
    assert a.hourly == b.hourly and len(a.hourly) == 168


def test_open_meteo_forecast_is_parsed_and_cached():
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(200, json={
            "current": {"time": "2026-09-27T10:00", "temperature_2m": 31, "precipitation_probability": 80, "rain": 12,
                        "wind_speed_10m": 40, "cloud_cover": 90, "visibility": 2500, "weather_code": 63},
            "hourly": {"time": ["2026-09-27T10:00", "2026-09-27T11:00"], "temperature_2m": [31, 30],
                       "precipitation_probability": [80, 85], "rain": [12, 20], "wind_speed_10m": [40, 45],
                       "cloud_cover": [90, 95], "visibility": [2500, 1800], "weather_code": [63, 65]},
        })

    provider = WeatherForecastProvider(client=httpx.Client(transport=httpx.MockTransport(handler)))
    forecast = provider.get_forecast(19.09, 72.87)
    provider.get_forecast(19.09, 72.87)
    assert forecast.source == "open-meteo" and forecast.current.rainfall_mm == 12 and forecast.hourly[1].visibility_m == 1800
    assert len(calls) == 1  # second call served from the 15-minute cache


def test_trip_weather_has_vulnerability_index(client):
    body = client.get(f"/api/trips/{TRIP}/weather").json()
    wvi = {n["nodeId"]: n["vulnerabilityIndex"] for n in body["nodes"]}
    assert wvi["pangong-tour"] > wvi["airport-transfer"] > wvi["grand-dragon"]  # outdoor > mountain road > hotel
    assert all(0 <= n["exposure"] <= 100 for n in body["nodes"])
    assert client.get("/api/trips/nope/weather").status_code == 404


# ---- Social signals ------------------------------------------------------------------


def test_scenario_signals_reflect_the_weather():
    hub = {"name": "Mumbai (BOM)", "lat": 19.09, "lng": 72.87, "nodes": ["a"], "airport": True}
    stormy = social_signals_service.signals_for_conditions(hub, social_signals_service.HubConditions(60, 70, 400, 28), "s", 9)
    kinds = {s.type for s in stormy}
    assert {"road_waterlogging", "airport_congestion", "weather_warning", "crowd_surge", "transit_strike"} <= kinds
    assert all(s.source == "simulated" and -1 <= s.sentiment <= 1 for s in stormy)
    calm = social_signals_service.signals_for_conditions(hub, social_signals_service.HubConditions(0, 10, 9000, 25), "s")
    assert [s.type for s in calm] == ["all_clear"] and calm[0].sentiment > 0


def test_social_signals_endpoint(client):
    body = client.get(f"/api/trips/{TRIP}/social-signals").json()
    assert body["signals"] and all(s["source"] == "simulated" for s in body["signals"])
    assert client.get("/api/trips/nope/social-signals").status_code == 404


# ---- Engine -------------------------------------------------------------------------


def _n(id, category, start, end, title=None, location="Delhi"):
    return EngineNode(id=id, category=category, title=title or id, location=location,
                      scheduled_start=datetime(2026, 1, 1, *start), scheduled_end=datetime(2026, 1, 1, *end), cost=1000, origin_code="DEL" if category == "flight" else None)


def test_extra_overrides_apply_simultaneous_hits():
    nodes = [_n("f", "flight", (8, 0), (10, 0)), _n("t", "transfer", (11, 0), (12, 0)), _n("a", "activity", (14, 0), (16, 0))]
    edges = [EngineEdge("e1", "f", "t", "hard", 30), EngineEdge("e2", "t", "a", "soft", 0)]
    impacts = PropagationEngine().propagate(nodes, edges, "f", "flight-delay", 30, extra_overrides={"a": ("weather-disruption", None)}).impacts
    assert impacts["f"].status == "delayed" and impacts["a"].status == "cancelled"
    # Classic behaviour unchanged without overrides.
    assert PropagationEngine().propagate(nodes, edges, "f", "flight-delay", 30).impacts["a"].status == "healthy"


def test_stress_rules_by_booking_type():
    s = WeatherScenario("x", rainfall_mm_per_hour=50, wind_speed_kmh=70, visibility_meters=500)
    engine = DigitalTwinEngine
    assert engine.stress_for(_n("f", "flight", (8, 0), (10, 0)), s).disruption_type == "flight-delay"
    assert engine.stress_for(_n("r", "transfer", (8, 0), (9, 0), "Leh airport transfer", "Leh"), s).disruption_type == "transfer-failure"
    assert engine.stress_for(_n("r2", "transfer", (8, 0), (9, 0), "City cab", "Delhi"), s).disruption_type == "activity-delay"
    assert engine.stress_for(_n("a", "activity", (8, 0), (9, 0), "Pangong Lake Tour"), s).disruption_type == "weather-disruption"
    assert engine.stress_for(_n("h", "hotel", (8, 0), (9, 0)), s) is None


def test_storm_window_limits_the_hits():
    nodes = [_n("f", "flight", (8, 0), (10, 0)), _n("a", "activity", (20, 0), (22, 0), "Sunset cruise")]
    run = DigitalTwinEngine().run(nodes, [], WeatherScenario("x", 60, 70, 300, storm_duration_hours=3))
    assert "f" in run.hits and "a" not in run.hits and run.impacts["a"].status == "healthy"


# ---- Simulate / apply API ----------------------------------------------------------------


def test_simulate_is_sandboxed_and_complete(client):
    before = client.get(f"/api/trips/{TRIP}").json()
    body = client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON).json()
    after = client.get(f"/api/trips/{TRIP}").json()
    assert before == after  # the live itinerary was not touched

    assert body["twin"]["healthScore"] < body["live"]["healthScore"] and body["healthDelta"] < 0
    statuses = {n["nodeId"]: n["twinStatus"] for n in body["nodes"]}
    assert statuses["del-leh"] == "broken" and all(n["liveStatus"] == "healthy" for n in body["nodes"])
    top = body["risks"][0]
    assert top["label"] == "Connection miss risk" and top["low"] <= top["probability"] <= top["high"]
    assert any(c["fromNodeId"] == "weather" for c in body["cascade"])
    assert body["options"] and sum(o["recommended"] for o in body["options"]) == 1
    assert body["explanationSource"] == "heuristic" and "Monsoon" in body["explanation"]
    assert body["mitigation"] and body["socialSignals"]["signals"]


def test_twin_state_counts_cached_simulations(client):
    before = client.get("/api/twin/state")
    assert before.status_code == 200 and before.json()["status"] == "ready"
    client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON)
    after = client.get("/api/twin/state").json()
    assert after["active_simulations_cached"] == before.json()["active_simulations_cached"] + 1


def test_simulate_validates_input(client):
    assert client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json={**MONSOON, "rainfallMmPerHour": -5}).status_code == 422
    assert client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json={**MONSOON, "affectedNodeId": "nope"}).status_code == 400
    assert client.post("/api/trips/nope/digital-twin/simulate", json=MONSOON).status_code == 404


def test_apply_recommended_plan_revalidates_itinerary(client):
    sim = client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON).json()
    option = next(o for o in sim["options"] if o["recommended"])
    resp = client.post(f"/api/trips/{TRIP}/digital-twin/apply", json={"simulationId": sim["simulationId"], "optionId": option["id"]})
    assert resp.status_code == 200
    body = resp.json()
    nodes = {n["id"]: n for n in body["trip"]["nodes"]}
    for change in option["changes"]:
        assert nodes[change["nodeId"]]["scheduledStart"].startswith(change["newStart"][:16])
    assert body["allConnectionsValid"] is (option["residualFailures"] == 0)
    assert body["trip"]["status"] == "operational"
    # A simulation can only be applied once.
    again = client.post(f"/api/trips/{TRIP}/digital-twin/apply", json={"simulationId": sim["simulationId"], "optionId": option["id"]})
    assert again.status_code == 404


def test_apply_refuses_stale_or_disrupted_trips(client):
    sim = client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON).json()
    opt = sim["options"][0]["id"]
    client.post(f"/api/trips/{TRIP}/nodes", json={"category": "activity", "title": "Shanti Stupa visit", "provider": "Self", "confirmation": "X1",
                                                  "location": "Leh", "scheduledStart": "2025-09-15T10:00:00", "scheduledEnd": "2025-09-15T12:00:00", "cost": 0})
    stale = client.post(f"/api/trips/{TRIP}/digital-twin/apply", json={"simulationId": sim["simulationId"], "optionId": opt})
    assert stale.status_code == 409

    sim2 = client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON).json()
    client.post(f"/api/trips/{TRIP}/disruptions", json={"type": "flight-delay", "delayMinutes": 60})
    blocked = client.post(f"/api/trips/{TRIP}/digital-twin/apply", json={"simulationId": sim2["simulationId"], "optionId": sim2["options"][0]["id"]})
    assert blocked.status_code == 409


# ---- Nugen ----------------------------------------------------------------------------


def _nugen(handler) -> NugenClient:
    return NugenClient(api_key="key", model_id="safar-sathi-travel-twin-v1", base_url="https://api.nugen.in",
                       http_client=httpx.Client(transport=httpx.MockTransport(handler)))


def test_nugen_client_uses_documented_chat_endpoint():
    seen = {}

    def handler(request):
        seen["url"], seen["auth"], seen["body"] = str(request.url), request.headers["Authorization"], request.read()
        return httpx.Response(200, json={"choices": [{"message": {"content": " Delhi → Leh breaks. "}}]})

    assert _nugen(handler).chat("sys", "user") == "Delhi → Leh breaks."
    assert seen["url"] == "https://api.nugen.in/api/v3/inference/chat/completions"
    assert seen["auth"] == "Bearer key" and b'"model":"safar-sathi-travel-twin-v1"' in seen["body"].replace(b" ", b"")


def test_nugen_client_degrades_gracefully():
    assert NugenClient(api_key="").chat("s", "u") is None
    assert _nugen(lambda r: httpx.Response(500)).chat("s", "u") is None
    calls = []

    def limited(request):
        calls.append(1)
        return httpx.Response(429)

    c = _nugen(limited)
    assert c.chat("s", "u") is None and c.chat("s", "u") is None and len(calls) == 1  # cool-down after 429


def test_twin_uses_nugen_when_configured(client, monkeypatch):
    monkeypatch.setattr(nugen_service, "_client", _nugen(lambda r: httpx.Response(200, json={"choices": [{"message": {"content": "Aligned model reasoning."}}]})))
    body = client.post(f"/api/trips/{TRIP}/digital-twin/simulate", json=MONSOON).json()
    assert body["explanation"] == "Aligned model reasoning." and body["explanationSource"] == "nugen"
    assert body["model"] == "safar-sathi-travel-twin-v1"


def test_settings_expose_nugen_defaults():
    s = get_settings()
    assert s.nugen_model_id == "safar-sathi-travel-twin-v1" and s.nugen_base_url == "https://api.nugen.in"


def test_alignment_dataset_is_valid():
    import json
    from pathlib import Path

    path = Path(__file__).resolve().parents[2] / "scripts" / "nugen_alignment_dataset.jsonl"
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    assert len(rows) >= 15
    assert all(r["instruction"] and r["response"] and r["sample_num"] == i + 1 for i, r in enumerate(rows))
    assert any(r["metadata"]["impacted"] == 0 for r in rows)  # includes no-impact negatives
    assert all(json.loads(r["instruction"].split("\n\n", 1)[1])["scenario"] for r in rows)  # grounded JSON context