"""Live Journey Pipeline: runs real Safar Sathi workflows on an isolated demo
journey and records their execution trace.

The demo journey is a copy of the existing seeded itinerary (Mumbai -> Delhi ->
Leh, from app/database/seed.py) under its own trip, node ids and "Demo
Traveller" - resetting or disrupting it never touches a real traveller's trips.

Each workflow issues real HTTP requests to this API (with an `X-Pipeline-Run`
header), so routing, validation, auth, services, engines, repositories and
providers all execute exactly as they do for the app, while the trace layer
(app/core/pipeline_trace.py) reports what ran. Nothing here decides which
bookings are affected - the propagation engine does.
"""

from __future__ import annotations

import secrets
import threading
from dataclasses import dataclass
from typing import Any, Callable

import httpx
from sqlalchemy import create_engine, inspect as sa_inspect, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import get_settings
from app.core import pipeline_trace
from app.core.pipeline_trace import PIPELINE_DEMO_TRIP_ID, TraceRun, span
from app.database import seed
from app.database.base import Base
from app.models.booking import Booking
from app.models.dependency_edge import DependencyEdge
from app.models.enums import TripStatus
from app.models.itinerary_node import ItineraryNode
from app.models.traveler import Traveler
from app.models.trip import Trip
from app.services import trip_service
from app.services.auth_service import create_token, hash_password

DEMO_TRAVELER_ID = "traveler-pipeline-demo"
_PREFIX = "pd-"
_SRC = pipeline_trace.source_of


@dataclass(frozen=True)
class Workflow:
    id: str
    label: str
    mode: str  # "live" writes the demo journey; "simulation" is a dry run / sandbox
    description: str
    data_source: str = "demo"


WORKFLOWS: dict[str, Workflow] = {w.id: w for w in (
    Workflow("flight_delay", "Flight delay", "live", "Mumbai → Delhi flight delayed; the disruption is propagated and recovery plans are generated."),
    Workflow("flight_cancellation", "Flight cancellation", "live", "Mumbai → Delhi flight cancelled; every dependent booking is re-evaluated."),
    Workflow("event_change", "Event change", "live", "The first sightseeing activity is pushed back; only what depends on it can be affected."),
    Workflow("provider_failure", "Provider failure", "live", "Flight delay, but the rebooking providers time out (injected at the provider boundary)."),
    Workflow("what_if", "What-if: flight delay", "simulation", "Dry-run of the same delay: the journey is evaluated but nothing is saved."),
    Workflow("weather", "Weather disruption", "simulation", "Heavy-rain scenario run through the Digital Twin on a sandbox copy of the journey."),
    Workflow("live_flight", "Live flight feed", "live", "Real flight status from Aviationstack drives the delay on the demo journey.", data_source="live"),
    Workflow("apply_recovery", "Apply recovery", "live", "The traveller accepts a recovery plan; it is applied and the journey re-validated."),
    Workflow("reset", "Reset demo", "live", "Restore the demo journey to its original schedule."),
)}

_run_lock = threading.Lock()
# Tests replace this with a TestClient-backed factory.
client_factory: Callable[[str], Any] = lambda base_url: httpx.Client(base_url=base_url, timeout=60)


class PipelineBusyError(Exception):
    pass


# ---- Demo journey ------------------------------------------------------------------------


def _copy(obj: Any, **overrides: Any) -> dict[str, Any]:
    values = {attr.key: getattr(obj, attr.key) for attr in sa_inspect(obj).mapper.column_attrs}
    values.update(overrides)
    return values


def _seeded_itinerary() -> tuple[list[dict], list[dict], list[dict]]:
    """Build the seeded itinerary in a throwaway in-memory database (so the
    real seeded trip is untouched) and return plain column values."""
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    with Session(engine) as scratch:
        seed.build_ladakh_trip(scratch, "scratch")
        scratch.flush()
        nodes = [_copy(n) for n in scratch.scalars(select(ItineraryNode).where(ItineraryNode.trip_id == seed.LADAKH_TRIP_ID))]
        edges = [_copy(e) for e in scratch.scalars(select(DependencyEdge).where(DependencyEdge.trip_id == seed.LADAKH_TRIP_ID))]
        bookings = [_copy(b) for b in scratch.scalars(select(Booking).where(Booking.trip_id == seed.LADAKH_TRIP_ID))]
    engine.dispose()
    return nodes, edges, bookings


def build_demo_trip(db: Session) -> Trip:
    token = pipeline_trace.activate(None)  # setup writes are not part of the demonstrated workflow
    try:
        if db.get(Traveler, DEMO_TRAVELER_ID) is None:
            db.add(Traveler(id=DEMO_TRAVELER_ID, name="Demo Traveller", email="demo-traveller@pipeline.safarsathi.local",
                            home_airport="Mumbai (BOM)", loyalty_tier="Standard", password_hash=hash_password(secrets.token_urlsafe(24)),
                            email_notifications_opt_in=False))
            db.flush()
        seed._clear_trip_data(db, PIPELINE_DEMO_TRIP_ID)
        trip = db.get(Trip, PIPELINE_DEMO_TRIP_ID)
        if trip is None:
            trip = Trip(id=PIPELINE_DEMO_TRIP_ID, traveler_id=DEMO_TRAVELER_ID)
            db.add(trip)
        trip.name = "Demo Trip"
        trip.route = "Mumbai → Delhi → Leh"
        trip.origin, trip.destination = "Mumbai", "Leh"
        trip.start_date, trip.end_date = "12 Sep 2025", "16 Sep 2025"
        trip.status = TripStatus.OPERATIONAL
        nodes, edges, bookings = _seeded_itinerary()
        trip.trip_value = sum(n["cost"] or 0 for n in nodes)
        trip.health_score = 87
        for n in nodes:
            db.add(ItineraryNode(**{**n, "id": _PREFIX + n["id"], "trip_id": PIPELINE_DEMO_TRIP_ID}))
        db.flush()
        for e in edges:
            db.add(DependencyEdge(**{**e, "id": _PREFIX + e["id"], "trip_id": PIPELINE_DEMO_TRIP_ID,
                                     "source_id": _PREFIX + e["source_id"], "target_id": _PREFIX + e["target_id"]}))
        for b in bookings:
            db.add(Booking(**{**b, "id": _PREFIX + b["id"], "trip_id": PIPELINE_DEMO_TRIP_ID, "node_id": _PREFIX + b["node_id"]}))
        db.commit()
        return trip
    finally:
        pipeline_trace.deactivate(token)


def ensure_demo_trip(db: Session) -> None:
    if db.get(Trip, PIPELINE_DEMO_TRIP_ID) is None:
        build_demo_trip(db)


def demo_trip_out(db: Session):
    ensure_demo_trip(db)
    return trip_service.get_trip_out(db, PIPELINE_DEMO_TRIP_ID, DEMO_TRAVELER_ID)


def _first(db: Session, category: str) -> ItineraryNode:
    rows = db.scalars(select(ItineraryNode).where(ItineraryNode.trip_id == PIPELINE_DEMO_TRIP_ID)).all()
    return min((n for n in rows if n.category.value == category), key=lambda n: n.scheduled_start)


# ---- Runner -----------------------------------------------------------------------------------


class _Api:
    """Real HTTP calls into this app, carrying the run id and the demo traveller's token."""

    def __init__(self, client: Any, run: TraceRun):
        self.client = client
        self.headers = {"X-Pipeline-Run": run.id, "Authorization": f"Bearer {create_token(DEMO_TRAVELER_ID)}"}

    def __call__(self, method: str, path: str, json: dict | None = None, params: dict | None = None) -> httpx.Response:
        return self.client.request(method, path, json=json, params=params, headers=self.headers)


def start_run(workflow_id: str, params: dict, pace_ms: int, base_url: str, session_factory: Callable[[], Session],
              wait: bool = False) -> TraceRun:
    workflow = WORKFLOWS[workflow_id]
    fault = "timeout" if workflow_id == "provider_failure" else None
    if not _run_lock.acquire(blocking=False):
        raise PipelineBusyError("A pipeline run is already in progress.")
    run = pipeline_trace.create_run(workflow=workflow_id, mode=workflow.mode, data_source=workflow.data_source,
                                    pace_ms=pace_ms, fault=fault, params=params)

    def target() -> None:
        try:
            _execute(run, workflow, params, base_url, session_factory)
        finally:
            _run_lock.release()

    if wait:
        target()
    else:
        threading.Thread(target=target, name=f"pipeline-{run.id}", daemon=True).start()
    return run


def _execute(run: TraceRun, workflow: Workflow, params: dict, base_url: str, session_factory: Callable[[], Session]) -> None:
    token = pipeline_trace.activate(run)
    client = client_factory(base_url)
    response: dict[str, Any] | None = None
    try:
        api = _Api(client, run)
        handler = _HANDLERS[workflow.id]
        response = handler(run, api, params, session_factory)
        pipeline_trace.activate(None)
        with session_factory() as db:
            trip = trip_service.get_trip_out(db, PIPELINE_DEMO_TRIP_ID, DEMO_TRAVELER_ID)
        run.finish(result={"workflow": workflow.id, "mode": workflow.mode, "dataSource": workflow.data_source,
                           "response": response, "trip": trip.model_dump(by_alias=True, mode="json")})
    except Exception as exc:  # reported on the run; never leaks internals beyond the class name
        run.emit(type="stage", stage="error", component="module:app.services.pipeline_service", function=workflow.id,
                 status="failed", message=f"Workflow stopped: {exc.__class__.__name__}", error=str(exc)[:200])
        run.finish(error=exc.__class__.__name__)
    finally:
        pipeline_trace.deactivate(token)
        close = getattr(client, "close", None)
        if close and not getattr(client, "_pipeline_keep_open", False):
            close()


def _real_world(run: TraceRun, text: str, **detail: Any) -> None:
    run.emit(type="stage", stage="event", component="event:real-world", function="real_world_event", status="completed",
             durationMs=0.0, message=text, detail=detail or None)


def _reset(run: TraceRun, session_factory: Callable[[], Session]) -> None:
    src = _SRC(build_demo_trip)
    with span("setup", "module:app.services.pipeline_service", "build_demo_trip", file=src["file"], line=src["line"],
              message="Demo journey restored to its original schedule (isolated demo trip)") as info:
        with session_factory() as db:
            build_demo_trip(db)
        if info is not None:
            info["tripId"] = PIPELINE_DEMO_TRIP_ID


def _json(resp: httpx.Response) -> Any:
    try:
        return resp.json()
    except ValueError:
        return None


def _disruption(run: TraceRun, api: _Api, session_factory, node_category: str, dtype: str, delay: int | None, text: str) -> dict:
    _reset(run, session_factory)
    with session_factory() as db:
        node = _first(db, node_category)
    _real_world(run, text.format(title=node.title, subtitle=node.subtitle), nodeId=node.id, type=dtype, delayMinutes=delay)
    disruption = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/disruptions",
                     json={"type": dtype, "primaryNodeId": node.id, "delayMinutes": delay})
    out: dict[str, Any] = {"disruption": _json(disruption), "disruptionStatus": disruption.status_code}
    if disruption.status_code < 400:
        options = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/recovery-options/generate")
        out.update(recoveryOptions=_json(options), recoveryStatus=options.status_code)
    return out


def _flight_delay(run, api, params, sf):
    delay = int(params.get("delayMinutes", 120))
    return _disruption(run, api, sf, "flight", "flight-delay", delay, f"{{title}} ({{subtitle}}) delayed by {delay} minutes")


def _flight_cancellation(run, api, params, sf):
    return _disruption(run, api, sf, "flight", "flight-cancellation", None, "{title} ({subtitle}) cancelled by the airline")


def _event_change(run, api, params, sf):
    delay = int(params.get("delayMinutes", 90))
    return _disruption(run, api, sf, "activity", "activity-delay", delay, f"{{title}} rescheduled {delay} minutes later")


def _provider_failure(run, api, params, sf):
    delay = int(params.get("delayMinutes", 120))
    return _disruption(run, api, sf, "flight", "flight-delay", delay,
                       f"{{title}} ({{subtitle}}) delayed by {delay} minutes — rebooking providers will time out (demo fault)")


def _what_if(run, api, params, sf):
    delay = int(params.get("delayMinutes", 120))
    _reset(run, sf)
    with sf() as db:
        node = _first(db, "flight")
    _real_world(run, f"What if {node.title} ({node.subtitle}) were delayed {delay} minutes?", nodeId=node.id, simulated=True)
    resp = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/simulate",
               json={"type": "flight-delay", "primaryNodeId": node.id, "delayMinutes": delay})
    return {"simulation": _json(resp), "simulationStatus": resp.status_code}


def _weather(run, api, params, sf):
    _reset(run, sf)
    _real_world(run, "Heavy rain forecast along the route (what-if scenario)", simulated=True)
    forecast = api("GET", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/weather")
    twin = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/digital-twin/simulate", json={
        "scenarioName": "Heavy Rain", "rainfallMmPerHour": 55, "windSpeedKmh": 65, "visibilityMeters": 300,
        "temperatureCelsius": 18, "stormDurationHours": 4,
    })
    return {"forecast": _json(forecast), "forecastStatus": forecast.status_code, "twin": _json(twin), "twinStatus": twin.status_code}


def _live_flight(run, api, params, sf):
    number = str(params.get("flightNumber") or "").strip() or "6E2175"
    _reset(run, sf)
    _real_world(run, f"Live status requested for flight {number}", flightNumber=number)
    live = api("GET", f"/api/live/flights/{number}")
    body = _json(live) or {}
    if live.status_code >= 400:
        return {"live": body, "liveStatus": live.status_code}
    real_delay = body.get("delayMinutes")
    extra = int(params.get("simulatedExtraMinutes", 0))
    total = (real_delay or 0) + extra
    with sf() as db:
        node = _first(db, "flight")
    run.emit(type="stage", stage="event", component="event:real-world", function="live_baseline", status="completed", durationMs=0.0,
             message=f"Live delay {real_delay if real_delay is not None else 'not reported'}"
                     + (f" + simulated {extra} min" if extra else "") + f" applied to {node.title}",
             detail={"realDelayMinutes": real_delay, "simulatedExtraMinutes": extra, "totalMinutes": total})
    disruption = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/disruptions",
                     json={"type": "flight-delay", "primaryNodeId": node.id, "delayMinutes": total})
    out = {"live": body, "liveStatus": live.status_code, "disruption": _json(disruption), "disruptionStatus": disruption.status_code}
    if disruption.status_code < 400:
        options = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/recovery-options/generate")
        out.update(recoveryOptions=_json(options), recoveryStatus=options.status_code)
    return out


def _apply_recovery(run, api, params, sf):
    recovery_id = str(params.get("recoveryId") or "")
    _real_world(run, "Traveller chose a recovery plan", recoveryId=recovery_id)
    resp = api("POST", f"/api/trips/{PIPELINE_DEMO_TRIP_ID}/recovery/apply", json={"recoveryId": recovery_id})
    return {"applied": _json(resp), "applyStatus": resp.status_code}


def _reset_workflow(run, api, params, sf):
    _reset(run, sf)
    return {"reset": True}


_HANDLERS = {
    "flight_delay": _flight_delay,
    "flight_cancellation": _flight_cancellation,
    "event_change": _event_change,
    "provider_failure": _provider_failure,
    "what_if": _what_if,
    "weather": _weather,
    "live_flight": _live_flight,
    "apply_recovery": _apply_recovery,
    "reset": _reset_workflow,
}


def workflows_out() -> list[dict[str, Any]]:
    settings = get_settings()
    out = []
    for w in WORKFLOWS.values():
        available, note = True, None
        if w.id == "live_flight" and not settings.aviationstack_api_key:
            available, note = False, "AVIATIONSTACK_API_KEY is not configured on the server."
        out.append({"id": w.id, "label": w.label, "mode": w.mode, "dataSource": w.data_source, "description": w.description,
                    "available": available, "note": note})
    return out
