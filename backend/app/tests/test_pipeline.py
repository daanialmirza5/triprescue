"""Live Journey Pipeline: real workflows on the isolated demo journey, traced."""

from __future__ import annotations

import pytest

from app.core import pipeline_trace
from app.services import pipeline_service

DEMO = pipeline_trace.PIPELINE_DEMO_TRIP_ID


@pytest.fixture()
def pipe(client, monkeypatch):
    client._pipeline_keep_open = True
    monkeypatch.setattr(pipeline_service, "client_factory", lambda base_url: client)

    def run(workflow: str, **params):
        resp = client.post("/api/pipeline/runs", params={"wait": "true"}, json={"workflow": workflow, "params": params})
        assert resp.status_code == 200, resp.text
        body = resp.json()
        assert body["done"] and body["error"] is None, body
        return body

    return run


def _stages(events, **match):
    return [e for e in events if e.get("type") == "stage" and all(e.get(k) == v for k, v in match.items())]


def _nodes(events):
    return {e["nodeId"]: e for e in events if e.get("type") == "node"}


def test_flight_delay_executes_the_real_pipeline(pipe, client):
    body = pipe("flight_delay", delayMinutes=120)
    ev = body["events"]
    order = [e["stage"] for e in ev if e.get("type") == "stage" and e["status"] in ("running", "completed")]
    for stage in ("event", "setup", "api", "router", "service", "database", "impact_engine", "dependency_graph", "recovery", "provider", "response"):
        assert stage in order, stage
    # The API really went through FastAPI routing to the real service.
    assert _stages(ev, stage="router", function="trigger_disruption")[0]["file"] == "backend/app/api/routes/disruptions.py"
    assert _stages(ev, stage="service", function="trigger_disruption", status="completed")
    assert _stages(ev, stage="impact_engine", function="PropagationEngine.propagate", status="completed")
    assert _stages(ev, stage="dependency_graph", function="GraphEngine.topological_order", status="completed")
    assert any((e.get("detail") or {}).get("operation") == "write" for e in _stages(ev, stage="database"))
    assert all(e["httpStatus"] == 200 for e in _stages(ev, stage="response"))

    nodes = _nodes(ev)
    trip_nodes = {n["id"]: n for n in body["result"]["trip"]["nodes"]}
    # Node statuses come from the engine and match what was persisted.
    assert {nid: e["status"] for nid, e in nodes.items()} == {nid: n["status"] for nid, n in trip_nodes.items()}
    assert nodes["pd-bom-del"]["relation"] == "disrupted" and nodes["pd-bom-del"]["status"] == "delayed"
    assert nodes["pd-del-leh"]["status"] == "broken" and nodes["pd-del-leh"]["path"][0] == "Mumbai → Delhi"
    untouched = [e for e in nodes.values() if e["status"] == "healthy"]
    assert untouched and all(e["relation"] in ("no_dependency_path", "buffer_absorbed") and e["reason"] for e in untouched)
    options = body["result"]["response"]["recoveryOptions"]
    assert options and any(o["feasible"] for o in options)


def test_what_if_is_a_dry_run(pipe, client):
    body = pipe("what_if", delayMinutes=120)
    ev = body["events"]
    assert body["mode"] == "simulation"
    after_setup = ev[max(i for i, e in enumerate(ev) if e.get("stage") == "setup") + 1:]
    assert not [e for e in _stages(after_setup, stage="database") if (e.get("detail") or {}).get("operation") == "write"]
    assert _nodes(ev)["pd-del-leh"]["status"] == "broken"
    assert all(n["status"] == "healthy" for n in body["result"]["trip"]["nodes"])  # journey itself unchanged


def test_weather_runs_through_digital_twin_and_nugen(pipe):
    ev = pipe("weather")["events"]
    assert _stages(ev, stage="service", function="trip_weather", status="completed")
    assert _stages(ev, stage="intelligence", function="DigitalTwinEngine.run", status="completed")
    nugen = _stages(ev, stage="intelligence", function="explain_weather_cascade", status="completed")
    assert nugen and nugen[0]["detail"]["source"] in ("heuristic", "nugen")
    assert _nodes(ev)  # the twin's own propagation reports every node


def test_provider_failure_is_reported_not_hidden(pipe):
    body = pipe("provider_failure")
    ev = body["events"]
    failed = _stages(ev, stage="provider", status="failed")
    assert failed and failed[0]["error"] == "ProviderFailureError"
    options = body["result"]["response"]["recoveryOptions"]
    assert options and not any(o["feasible"] for o in options)


def test_apply_recovery_updates_the_journey(pipe):
    first = pipe("flight_delay")
    option = next(o for o in first["result"]["response"]["recoveryOptions"] if o["feasible"])
    body = pipe("apply_recovery", recoveryId=option["id"])
    assert body["result"]["response"]["applyStatus"] == 200
    assert _stages(body["events"], stage="service", function="apply_recovery", status="completed")
    assert body["result"]["trip"]["status"] == "recovered"


def test_demo_runs_never_touch_real_trips(pipe, client):
    before = client.get("/api/trips/trip-ladakh-2025").json()
    pipe("flight_cancellation")
    pipe("event_change")
    assert client.get("/api/trips/trip-ladakh-2025").json() == before
    assert DEMO not in [t["id"] for t in client.get("/api/trips").json()]  # owned by the Demo Traveller only


def test_long_poll_and_unknown_runs(pipe, client):
    run_id = pipe("reset")["runId"]
    resp = client.get(f"/api/pipeline/runs/{run_id}/events", params={"after": 0, "wait": 0})
    assert resp.status_code == 200 and resp.json()["done"] is True and resp.json()["events"]
    assert client.get("/api/pipeline/runs/run_missing/events").status_code == 404
    assert client.post("/api/pipeline/runs", json={"workflow": "nope"}).status_code == 400


def test_requests_without_the_header_are_not_traced(client):
    count = len(pipeline_trace._runs)
    client.post("/api/trips/trip-ladakh-2025/simulate", json={"type": "flight-delay", "delayMinutes": 60})
    assert len(pipeline_trace._runs) == count and pipeline_trace.current() is None


def test_architecture_is_derived_from_source(client):
    arch = client.get("/api/pipeline/architecture").json()
    ids = {n["id"] for n in arch["nodes"]}
    route = next(r for r in arch["routes"] if r["id"] == "api:POST /api/trips/{trip_id}/disruptions")
    assert "module:app.services.disruption_service" in route["calls"] and route["auth"] is True
    edge = next(e for e in arch["edges"] if e["source"] == "module:app.services.disruption_service" and e["target"] == "module:app.engines.propagation_engine")
    assert edge["calls"][0]["file"] == "backend/app/services/disruption_service.py" and edge["calls"][0]["line"] > 0
    assert "table:itinerary_nodes" in ids and "external:api.aviationstack.com" in ids and "external:api.open-meteo.com" in ids
    assert not any(r["path"].startswith("/api/pipeline") for r in arch["routes"])


def test_standalone_page_is_served_by_the_backend(tmp_path):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient

    from app.core.pipeline_ui import mount_pipeline_ui

    (tmp_path / "index.html").write_text("<title>Safar Sathi — Live Journey Pipeline</title>", encoding="utf-8")
    app = FastAPI()
    assert mount_pipeline_ui(app, tmp_path) is True
    c = TestClient(app)
    first = c.get("/pipeline", follow_redirects=False)
    assert first.status_code in (302, 307) and first.headers["location"].endswith("/pipeline/")
    page = c.get("/pipeline/")
    assert page.status_code == 200 and "Live Journey Pipeline" in page.text

    unbuilt = FastAPI()
    assert mount_pipeline_ui(unbuilt, tmp_path / "missing") is False
    msg = TestClient(unbuilt).get("/pipeline/")
    assert msg.status_code == 404 and "npm run build:pipeline" in msg.text


def test_pipeline_access_needs_login_only_when_required(client):
    from app.config import get_settings

    assert client.get("/api/pipeline/demo").status_code == 200  # standalone page, no login
    settings = get_settings()
    settings.require_authentication = True
    try:
        assert client.get("/api/pipeline/demo").status_code == 401
    finally:
        settings.require_authentication = False
