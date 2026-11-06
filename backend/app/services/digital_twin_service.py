"""Digital Twin service: simulate weather scenarios against a sandboxed copy of
a trip, and atomically apply a chosen preemptive plan to the real itinerary.

Simulations are kept in memory for 30 minutes (bounded) so `apply` can refer
to one by id. Each stores a fingerprint of the itinerary it was computed
against; if the trip changed in the meantime, apply refuses (409) instead of
applying a plan built for a different itinerary.
"""

from __future__ import annotations

import hashlib
import threading
import uuid
from collections import OrderedDict
from dataclasses import dataclass
from datetime import datetime, timedelta
from app.core.datetime_utils import utcnow_naive

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.engines.digital_twin_engine import DigitalTwinEngine, TwinOption, TwinRun, WeatherScenario, mode_of
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.propagation_engine import PropagationEngine
from app.models.activity import ActivityEvent
from app.models.booking import Booking
from app.models.enums import ActivityType, EdgeStatus, NodeStatus, NotificationCategory, NotificationSeverity, TripStatus
from app.models.notification import Notification
from app.repositories.activity_repository import ActivityRepository, NotificationRepository
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.node_repository import NodeRepository
from app.schemas.digital_twin import (
    CascadeLinkOut,
    DigitalTwinApplyOut,
    DigitalTwinSimulateRequest,
    DigitalTwinSimulationOut,
    RiskOut,
    StateSummaryOut,
    TwinChangeOut,
    TwinNodeOut,
    TwinOptionOut,
)
from app.services import nugen_service, social_signals_service, weather_service
from app.services.converters import to_engine_edge, to_engine_node
from app.services.trip_service import get_trip, get_trip_out
from app.core.pipeline_trace import traced

TTL = timedelta(minutes=30)
MAX_STORED = 200
_BOOKABLE = {"flight", "train", "transfer", "hotel", "activity", "return"}

_engine = DigitalTwinEngine()
_propagation = PropagationEngine()
_itinerary = ItineraryEngine()


class SimulationNotFoundError(Exception):
    pass


class StaleSimulationError(Exception):
    pass


class ActiveDisruptionError(Exception):
    pass


@dataclass
class _Stored:
    trip_id: str
    traveler_id: str | None
    fingerprint: str
    options: dict[str, TwinOption]
    expires_at: datetime


_store: OrderedDict[str, _Stored] = OrderedDict()
_lock = threading.Lock()


def _fingerprint(nodes: list) -> str:
    raw = "|".join(f"{n.id}:{n.scheduled_start:%Y%m%d%H%M}:{n.scheduled_end:%Y%m%d%H%M}:{n.cost:.2f}" for n in sorted(nodes, key=lambda x: x.id))
    return hashlib.sha256(raw.encode()).hexdigest()


def _remember(entry: _Stored) -> str:
    sim_id = f"twin_{uuid.uuid4().hex[:16]}"
    now = utcnow_naive()
    with _lock:
        for key in [k for k, v in _store.items() if v.expires_at < now]:
            del _store[key]
        while len(_store) >= MAX_STORED:
            _store.popitem(last=False)
        _store[sim_id] = entry
    return sim_id


def _status(value) -> str:
    return str(getattr(value, "value", value))


def _live_summary(trip, nodes: list) -> StateSummaryOut:
    bookable = [n for n in nodes if _status(n.category) in _BOOKABLE]
    risky = [n for n in bookable if _status(n.status) not in ("healthy", "recovered")]
    return StateSummaryOut(health_score=trip.health_score, at_risk_commitments=len(risky), total_commitments=len(bookable),
                           cost_exposure=round(sum(n.cost for n in risky), 2))


def _twin_summary(engine_nodes: list, run: TwinRun) -> StateSummaryOut:
    bookable = [n for n in engine_nodes if str(n.category) in _BOOKABLE]
    risky = [n for n in bookable if run.impacts[n.id].status != "healthy"]
    return StateSummaryOut(health_score=run.health_score, at_risk_commitments=len(risky), total_commitments=len(bookable),
                           cost_exposure=round(run.exposure, 2))


def _option_out(o: TwinOption) -> TwinOptionOut:
    return TwinOptionOut(
        id=o.id, name=o.name, strategy=o.strategy, description=o.description,
        changes=[TwinChangeOut(node_id=c.node_id, title=c.title, change_type=c.change_type, new_start=c.new_start,
                               new_end=c.new_end, cost_delta=c.cost_delta, description=c.description) for c in o.changes],
        delta_cost=o.delta_cost, time_impact_minutes=o.time_impact_minutes, commitments_preserved=o.commitments_preserved,
        total_commitments=o.total_commitments, health_score=o.health_score, residual_failures=o.residual_failures,
        score=o.score, recommended=o.recommended, notes=o.notes,
    )


@traced("service", "Digital Twin service: sandboxed weather what-if")
def simulate(db: Session, trip_id: str, traveler_id: str | None, request: DigitalTwinSimulateRequest) -> DigitalTwinSimulationOut:
    trip = get_trip(db, trip_id, traveler_id)
    repo = NodeRepository(db)
    db_nodes = repo.list_for_trip(trip_id)
    if not db_nodes:
        raise ValueError("This trip has no bookings to simulate yet.")
    if request.affected_node_id and request.affected_node_id not in {n.id for n in db_nodes}:
        raise ValueError(f"Unknown booking '{request.affected_node_id}' for this trip.")
    engine_nodes = [to_engine_node(n) for n in db_nodes]
    engine_edges = [to_engine_edge(e) for e in repo.list_edges_for_trip(trip_id)]

    scenario = WeatherScenario(
        name=request.scenario_name, rainfall_mm_per_hour=request.rainfall_mm_per_hour, wind_speed_kmh=request.wind_speed_kmh,
        visibility_meters=request.visibility_meters, temperature_celsius=request.temperature_celsius,
        storm_duration_hours=request.storm_duration_hours, affected_node_id=request.affected_node_id, storm_start=request.storm_start,
    )
    signals = social_signals_service.scenario_signals(trip_id, db_nodes, scenario)
    intensity = social_signals_service.intensity_by_node(signals)

    run = _engine.run(engine_nodes, engine_edges, scenario, intensity)
    options = _engine.preemptive_options(engine_nodes, engine_edges, scenario, run, intensity)
    explanation = nugen_service.explain_weather_cascade(engine_nodes, scenario, run)
    tips, tips_source = nugen_service.mitigation_guidance(engine_nodes, scenario, run)

    coords = weather_service.node_coordinates(db_nodes)
    live = _live_summary(trip, db_nodes)
    twin = _twin_summary(engine_nodes, run)
    now = utcnow_naive()
    sim_id = _remember(_Stored(trip_id, traveler_id, _fingerprint(db_nodes), {o.id: o for o in options}, now + TTL))

    return DigitalTwinSimulationOut(
        simulation_id=sim_id, trip_id=trip_id, scenario_name=scenario.name, severity=scenario.severity,
        storm_window_start=run.window[0], storm_window_end=run.window[1],
        live=live, twin=twin, health_delta=twin.health_score - live.health_score,
        nodes=[
            TwinNodeOut(
                node_id=n.id, title=n.title, category=_status(n.category), mode=mode_of(e),
                live_status=_status(n.status), twin_status=run.impacts[n.id].status, reason=run.impacts[n.id].reason,
                direct_hit=n.id in run.hits, driver=run.hits[n.id].driver if n.id in run.hits else None,
                delay_minutes=run.impacts[n.id].delay_minutes or (run.hits[n.id].delay_minutes or 0 if n.id in run.hits else 0),
                lat=coords.get(n.id, (None, None))[0], lng=coords.get(n.id, (None, None))[1],
            )
            for n, e in zip(db_nodes, engine_nodes)
        ],
        risks=[RiskOut(node_id=r.node_id, label=r.label, probability=r.probability, low=r.low, high=r.high) for r in run.risks],
        cascade=[CascadeLinkOut(from_node_id=a, to_node_id=b, status=s) for a, b, s in run.cascade],
        options=[_option_out(o) for o in options],
        social_signals=signals,
        explanation=explanation.text, explanation_source=explanation.source, model=explanation.model,
        mitigation=tips, mitigation_source=tips_source,
        expires_at=now + TTL,
    )


@traced("service", "Digital Twin service: apply preemptive plan")
def apply(db: Session, trip_id: str, traveler_id: str | None, simulation_id: str, option_id: str) -> DigitalTwinApplyOut:
    trip = get_trip(db, trip_id, traveler_id)
    with _lock:
        stored = _store.get(simulation_id)
    if stored is None or stored.trip_id != trip_id or stored.expires_at < utcnow_naive() or option_id not in stored.options:
        raise SimulationNotFoundError(simulation_id)
    if DisruptionRepository(db).latest_unresolved(trip_id) is not None:
        raise ActiveDisruptionError(trip_id)
    repo = NodeRepository(db)
    nodes = repo.list_for_trip(trip_id)
    if _fingerprint(nodes) != stored.fingerprint:
        raise StaleSimulationError(simulation_id)

    option = stored.options[option_id]
    by_id = {n.id: n for n in nodes}
    for c in option.changes:
        node = by_id.get(c.node_id)
        if node is None:
            raise StaleSimulationError(simulation_id)
        node.scheduled_start, node.scheduled_end = c.new_start, c.new_end
        node.cost = round(node.cost + c.cost_delta, 2)
        booking = db.scalars(select(Booking).where(Booking.node_id == node.id)).first()
        if booking:
            booking.cost = node.cost
    db.flush()

    # Re-validate the real itinerary end to end with no disruption applied.
    edges = repo.list_edges_for_trip(trip_id)
    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    first = min(nodes, key=lambda n: n.scheduled_start)
    impacts = _propagation.propagate(engine_nodes, engine_edges, first.id, "none").impacts
    changed = {c.node_id for c in option.changes}
    for n in nodes:
        imp = impacts[n.id]
        n.status = NodeStatus.RECOVERED if n.id in changed and imp.status == "healthy" else NodeStatus(imp.status)
        n.status_reason = "Preemptively rescheduled by the Digital Twin." if n.id in changed else imp.reason
        n.caused_by = imp.caused_by
        n.actual_start, n.actual_end = imp.actual_start, imp.actual_end
        booking = db.scalars(select(Booking).where(Booking.node_id == n.id)).first()
        if booking:
            booking.status = n.status
    for e in edges:
        target = impacts[e.target_id].status
        e.status = EdgeStatus(target) if target in EdgeStatus._value2member_map_ else EdgeStatus.AT_RISK
        e.animated = False
    trip.health_score = _itinerary.compute_health_score(engine_nodes, engine_edges, impacts)
    valid = not any(i.status in ("broken", "cancelled") for i in impacts.values())
    trip.status = TripStatus.OPERATIONAL
    ActivityRepository(db).add(ActivityEvent(
        trip_id=trip_id, type=ActivityType.RECOVERY, message=f"Preemptive plan applied: {option.name}",
        detail=f"{len(option.changes)} booking(s) re-timed ahead of forecast weather; +₹{option.delta_cost:,.0f}.",
    ))
    NotificationRepository(db).add(Notification(
        trip_id=trip_id, severity=NotificationSeverity.LOW, category=NotificationCategory.RECOVERY,
        title="Weather plan applied",
        message=f"“{option.name}” applied from the Digital Twin. {'All connections re-validated.' if valid else 'Some connections still need attention.'}",
    ))
    db.commit()
    with _lock:
        _store.pop(simulation_id, None)

    risky = [n for n in nodes if _status(n.category) in _BOOKABLE and _status(n.status) not in ("healthy", "recovered")]
    return DigitalTwinApplyOut(
        trip=get_trip_out(db, trip_id),
        applied_option=_option_out(option),
        validation=StateSummaryOut(
            health_score=trip.health_score, at_risk_commitments=len(risky),
            total_commitments=len([n for n in nodes if _status(n.category) in _BOOKABLE]),
            cost_exposure=round(sum(n.cost for n in risky), 2),
        ),
        all_connections_valid=valid,
    )
