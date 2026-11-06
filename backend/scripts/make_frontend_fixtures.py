"""Capture real API responses from the backend as frontend test fixtures.

Usage (from backend/):  python scripts/make_frontend_fixtures.py ../frontend/src/test/fixtures/ladakh.json

Runs the app in-process on a throwaway SQLite database with every network
dependency off (live weather, Mastodon, LLMs), so the output is deterministic.
"""
import json, os, sys

import tempfile

db = os.path.join(tempfile.gettempdir(), "safarsathi_fixtures.db")
if os.path.exists(db):
    os.remove(db)
os.environ.update(DATABASE_URL="sqlite:///" + db.replace("\\", "/"), WEATHER_RISK_ENABLED="false",
                  SOCIAL_SIGNALS_LIVE_ENABLED="false", ANTHROPIC_API_KEY="", NUGEN_API_KEY="", ENVIRONMENT="development")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import logging
logging.disable(logging.CRITICAL)
from fastapi.testclient import TestClient
from app.main import app
from app.core.rate_limiting import limiter
from app.providers.weather_provider import WeatherForecastProvider

limiter.enabled = False
# No network: the trip-weather endpoint uses its deterministic offline forecast.
WeatherForecastProvider._fetch = lambda self, lat, lng: (_ for _ in ()).throw(RuntimeError("offline"))

T = "trip-ladakh-2025"
FOG = {"scenarioName": "Dense Fog Ground Stop", "rainfallMmPerHour": 0, "windSpeedKmh": 6, "visibilityMeters": 150,
       "temperatureCelsius": 11, "stormDurationHours": 7}
out = {}
with TestClient(app) as c:
    ok = lambda r: (r.raise_for_status(), r.json())[1]
    ok(c.post(f"/api/trips/{T}/reset"))
    out["trip"] = ok(c.get(f"/api/trips/{T}"))
    out["tripWeather"] = ok(c.get(f"/api/trips/{T}/weather"))
    out["socialSignals"] = ok(c.get(f"/api/trips/{T}/social-signals"))
    sim = ok(c.post(f"/api/trips/{T}/digital-twin/simulate", json=FOG))
    out["fogSimulation"] = sim
    rec = next(o for o in sim["options"] if o["recommended"])
    out["fogApply"] = ok(c.post(f"/api/trips/{T}/digital-twin/apply", json={"simulationId": sim["simulationId"], "optionId": rec["id"]}))
    ok(c.post(f"/api/trips/{T}/reset"))
    d = ok(c.post(f"/api/trips/{T}/disruptions", json={"type": "flight-delay", "delayMinutes": 95}))
    out["delayDisruption"] = d["disruption"] if "disruption" in d else d
    out["delayRecoveryOptions"] = ok(c.post(f"/api/trips/{T}/recovery-options/generate", json={}))
    out["delayTrip"] = ok(c.get(f"/api/trips/{T}"))
    out["delayNarrative"] = ok(c.post("/api/assistant/recovery-narrative", json={"tripId": T}))

dest = sys.argv[1]
with open(dest, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1, default=str)
print("wrote", dest, {k: (len(v) if isinstance(v, list) else "obj") for k, v in out.items()})
