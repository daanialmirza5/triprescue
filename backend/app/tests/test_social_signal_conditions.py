from app.services.social_signals_service import HubConditions, signals_for_conditions

CITY = {"name": "Jaipur", "lat": 26.9, "lng": 75.8, "nodes": ["h"], "airport": False}
AIRPORT = {"name": "Delhi", "lat": 28.6, "lng": 77.1, "nodes": ["f"], "airport": True}
CALM = dict(rainfall_mm=0, wind_kmh=10, visibility_m=9000, temperature_c=25)


def kinds(hub, **weather):
    return [s.type for s in signals_for_conditions(hub, HubConditions(**{**CALM, **weather}), "salt")]


def test_heat_and_wind_warnings_for_a_city():
    assert kinds(CITY, temperature_c=46) == ["weather_warning"]
    assert kinds(CITY, wind_kmh=80) == ["weather_warning"]


def test_fog_is_airport_congestion_only_at_airports():
    assert kinds(CITY, visibility_m=200) == ["weather_warning"]
    assert kinds(AIRPORT, visibility_m=200)[:2] == ["airport_congestion", "crowd_surge"]


def test_mild_weather_does_not_trigger_crowd_reports():
    assert "crowd_surge" not in kinds(AIRPORT, rainfall_mm=22)


def test_long_storms_add_transport_pauses():
    weather = HubConditions(**{**CALM, "rainfall_mm": 60})
    short = [s.type for s in signals_for_conditions(CITY, weather, "s", storm_hours=2)]
    long = [s.type for s in signals_for_conditions(CITY, weather, "s", storm_hours=9)]
    assert "transit_strike" not in short and "transit_strike" in long


def test_same_inputs_give_the_same_signals():
    weather = HubConditions(**{**CALM, "rainfall_mm": 40})
    assert signals_for_conditions(CITY, weather, "x") == signals_for_conditions(CITY, weather, "x")
