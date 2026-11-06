"""Pipeline workflow catalogue: only what can really run is offered."""

from app.config import get_settings
from app.services import pipeline_service


def _by_id():
    return {w["id"]: w for w in pipeline_service.workflows_out()}


def test_live_flight_feed_needs_a_key(monkeypatch):
    settings = get_settings()
    monkeypatch.setattr(settings, "aviationstack_api_key", None)
    live = _by_id()["live_flight"]
    assert live["available"] is False and "AVIATIONSTACK_API_KEY" in live["note"]
    monkeypatch.setattr(settings, "aviationstack_api_key", "configured-for-test")
    assert _by_id()["live_flight"]["available"] is True


def test_simulations_are_marked_as_such():
    workflows = _by_id()
    assert workflows["what_if"]["mode"] == "simulation" and workflows["weather"]["mode"] == "simulation"
    assert workflows["flight_delay"]["mode"] == "live" and workflows["flight_delay"]["dataSource"] == "demo"
    assert workflows["live_flight"]["dataSource"] == "live"
