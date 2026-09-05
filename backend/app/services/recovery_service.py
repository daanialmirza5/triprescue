from __future__ import annotations

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.engines.itinerary_engine import ItineraryEngine
from app.engines.propagation_engine import PropagationEngine
from app.engines.recovery_engine import RecoveryEngine, RecoveryPlanResult
from app.models.activity import ActivityEvent
from app.models.booking import Booking
from app.models.dependency_edge import DependencyEdge
from app.models.enums import ActivityType, ChangeType, EdgeStatus, NodeStatus, NotificationCategory, NotificationSeverity, RiskLevel, TripStatus
from app.models.notification import Notification
from app.models.recovery import RecoveryAction, RecoveryPlan
from app.providers.mock_activity_provider import MockActivityProvider
from app.providers.mock_flight_provider import MockFlightProvider
from app.providers.mock_hotel_provider import MockHotelProvider
from app.providers.mock_transfer_provider import MockTransferProvider
from app.repositories.activity_repository import ActivityRepository, NotificationRepository
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.node_repository import NodeRepository
from app.repositories.recovery_repository import RecoveryRepository
from app.schemas.recovery import RecoveryChangeOut, RecoveryOptionOut, ScoreBreakdownOut
from app.schemas.trip import TripOut
from app.services.converters import to_engine_edge, to_engine_node
from app.services.trip_service import get_trip, get_trip_out

_propagation_engine = PropagationEngine()
_itinerary_engine = ItineraryEngine()
_recovery_engine = RecoveryEngine(
    flight_provider=MockFlightProvider(),
    hotel_provider=MockHotelProvider(),
    activity_provider=MockActivityProvider(),
    transfer_provider=MockTransferProvider(),
)


class NoActiveDisruptionError(Exception):
    pass


class RecoveryPlanNotFoundError(Exception):
    pass


def _current_impacts(db: Session, trip_id: str):
    disruption = DisruptionRepository(db).latest_unresolved(trip_id)
    if disruption is None:
        raise NoActiveDisruptionError(trip_id)

    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]

    result = _propagation_engine.propagate(
        nodes=engine_nodes,
        edges=engine_edges,
        disrupted_node_id=disruption.primary_node_id,
        disruption_type=disruption.type.value,
        delay_minutes=disruption.delay_minutes,
        detected_at=disruption.detected_at,
    )
    return disruption, nodes, edges, engine_nodes, engine_edges, result.impacts


def _persist_plan(db: Session, trip_id: str, disruption_id: str, plan: RecoveryPlanResult) -> RecoveryPlan:
    db_plan = RecoveryPlan(
        trip_id=trip_id,
        disruption_id=disruption_id,
        name=plan.name,
        tag=plan.tag,
        tag_color=plan.tag_color,
        description=plan.description,
        cost_delta=plan.cost_delta,
        time_impact_minutes=plan.time_impact_minutes,
        bookings_preserved=plan.bookings_preserved,
        total_bookings=plan.total_bookings,
        refund_recovered=plan.refund_recovered,
        residual_risk=RiskLevel(plan.residual_risk),
        score=plan.score,
        score_breakdown=plan.score_breakdown,
        explanation=plan.description,
        feasible=plan.feasible,
    )
    db.add(db_plan)
    db.flush()
    for action in plan.actions:
        db.add(
            RecoveryAction(
                recovery_plan_id=db_plan.id,
                node_id=action.node_id,
                change_type=ChangeType(action.change_type),
                description=action.description,
                new_scheduled_start=action.new_scheduled_start,
                new_scheduled_end=action.new_scheduled_end,
                new_cost=action.new_cost,
                new_provider=action.new_provider,
                new_confirmation=action.new_confirmation,
            )
        )
    db.flush()
    return db_plan


def _plan_to_out(plan: RecoveryPlan) -> RecoveryOptionOut:
    return RecoveryOptionOut(
        id=plan.id,
        name=plan.name,
        tag=plan.tag,
        tag_color=plan.tag_color,
        description=plan.description,
        cost_delta=plan.cost_delta,
        time_impact_minutes=plan.time_impact_minutes,
        bookings_preserved=plan.bookings_preserved,
        total_bookings=plan.total_bookings,
        refund_recovered=plan.refund_recovered,
        residual_risk=plan.residual_risk.value,
        score=plan.score,
        changes=[
            RecoveryChangeOut(
                node_id=a.node_id,
                node_label=a.node.title,
                change_type=a.change_type.value,
                description=a.description,
            )
            for a in plan.actions
        ],
        score_breakdown=ScoreBreakdownOut(**plan.score_breakdown),
    )


def generate_recovery_options(db: Session, trip_id: str, traveler_id: str | None = None) -> list[RecoveryOptionOut]:
    trip = get_trip(db, trip_id, traveler_id)
    disruption, nodes, edges, engine_nodes, engine_edges, impacts = _current_impacts(db, trip_id)

    # Clear any previous, not-yet-applied plans for this disruption before regenerating.
    existing = RecoveryRepository(db).list_for_disruption(disruption.id)
    for old_plan in existing:
        if not old_plan.applied:
            for action in list(db.scalars(select(RecoveryAction).where(RecoveryAction.recovery_plan_id == old_plan.id))):
                db.delete(action)
            db.delete(old_plan)
    db.flush()

    preferences = trip.traveler.preferences
    plans = _recovery_engine.generate_plans(
        nodes=engine_nodes,
        edges=engine_edges,
        impacts=impacts,
        disrupted_node_id=disruption.primary_node_id,
        disruption_type=disruption.type.value,
        delay_minutes=disruption.delay_minutes,
        detected_at=disruption.detected_at,
        preferences=preferences,
    )

    db_plans = [_persist_plan(db, trip_id, disruption.id, p) for p in plans]

    trip.status = TripStatus.RECOVERING
    ActivityRepository(db).add(
        ActivityEvent(
            trip_id=trip_id,
            type=ActivityType.RECOVERY,
            message=f"{len(db_plans)} recovery strategies generated",
            detail="Ranked using your current traveler preferences." if db_plans else "No feasible recovery found.",
        )
    )
    if db_plans:
        NotificationRepository(db).add(
            Notification(
                trip_id=trip_id,
                severity=NotificationSeverity.MEDIUM,
                category=NotificationCategory.RECOVERY,
                title="Recovery options ready",
                message=f"{len(db_plans)} feasible recovery plan(s) were generated for your review.",
            )
        )
    db.commit()

    return [_plan_to_out(p) for p in db_plans]


def apply_recovery(
    db: Session, trip_id: str, recovery_id: str, traveler_id: str | None = None
) -> tuple[TripOut, RecoveryOptionOut, ActivityEvent, Notification]:
    trip = get_trip(db, trip_id, traveler_id)
    plan = RecoveryRepository(db).get(recovery_id)
    if plan is None or plan.trip_id != trip_id:
        raise RecoveryPlanNotFoundError(recovery_id)

    disruption = DisruptionRepository(db).get(plan.disruption_id)
    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    node_by_id = {n.id: n for n in nodes}

    pre_impacts = _propagation_engine.propagate(
        nodes=[to_engine_node(n) for n in nodes],
        edges=[to_engine_edge(e) for e in edges],
        disrupted_node_id=disruption.primary_node_id,
        disruption_type=disruption.type.value,
        delay_minutes=disruption.delay_minutes,
        detected_at=disruption.detected_at,
    ).impacts
    # The disrupted node itself keeps its real status (e.g. still "delayed" - a
    # flight that departed late is a historical fact recovery doesn't erase);
    # only nodes further downstream flip to "recovered" once fixed.
    was_affected = {
        nid
        for nid, impact in pre_impacts.items()
        if impact.status != "healthy" and nid != disruption.primary_node_id
    }

    changed_node_ids = set()
    for action in plan.actions:
        node = node_by_id.get(action.node_id)
        if node is None:
            continue
        if action.change_type in (ChangeType.REBOOKED, ChangeType.RESCHEDULED):
            if action.new_scheduled_start:
                node.scheduled_start = action.new_scheduled_start
            if action.new_scheduled_end:
                node.scheduled_end = action.new_scheduled_end
            if action.new_cost is not None:
                node.cost = action.new_cost
            if action.new_provider:
                node.provider = action.new_provider
            if action.new_confirmation:
                node.confirmation = action.new_confirmation
            changed_node_ids.add(node.id)

            booking = db.scalars(select(Booking).where(Booking.node_id == node.id)).first()
            if booking:
                if action.new_cost is not None:
                    booking.cost = action.new_cost
                if action.new_provider:
                    booking.provider = action.new_provider
                if action.new_confirmation:
                    booking.confirmation = action.new_confirmation

    # Rebooked/rescheduled nodes are now independent bookings - they're no longer
    # bound to whatever dependency originally broke them.
    for edge in list(edges):
        if edge.target_id in changed_node_ids:
            db.delete(edge)
    db.flush()
    edges = node_repo.list_edges_for_trip(trip_id)

    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    result = _propagation_engine.propagate(
        nodes=engine_nodes,
        edges=engine_edges,
        disrupted_node_id=disruption.primary_node_id,
        disruption_type=disruption.type.value,
        delay_minutes=disruption.delay_minutes,
        detected_at=disruption.detected_at,
    )
    impacts = result.impacts

    for node in nodes:
        impact = impacts[node.id]
        if impact.status in ("healthy", "delayed") and node.id in was_affected:
            node.status = NodeStatus.RECOVERED
        else:
            node.status = NodeStatus(impact.status)
        node.status_reason = impact.reason
        node.caused_by = impact.caused_by
        node.actual_start = impact.actual_start
        node.actual_end = impact.actual_end
        booking = db.scalars(select(Booking).where(Booking.node_id == node.id)).first()
        if booking:
            booking.status = node.status

    for edge in edges:
        target_status = impacts[edge.target_id].status
        if target_status in ("healthy", "delayed") and edge.target_id in was_affected:
            target_status = "recovered"
        edge.status = (
            EdgeStatus(target_status) if target_status in EdgeStatus._value2member_map_ else EdgeStatus.AT_RISK
        )
        edge.animated = target_status == "broken"

    remaining_broken = any(impacts[n.id].status == "broken" for n in nodes)
    disruption.resolved = not remaining_broken
    plan.applied = True
    plan.applied_at = datetime.utcnow()

    trip.status = TripStatus.RECOVERED if not remaining_broken else TripStatus.RECOVERING
    trip.health_score = _itinerary_engine.compute_health_score(engine_nodes, engine_edges, impacts)

    activity_event = ActivityEvent(
        trip_id=trip_id,
        type=ActivityType.RECOVERY,
        message=f"Recovery applied: {plan.name}",
        detail=f"{plan.bookings_preserved}/{plan.total_bookings} bookings preserved.",
    )
    ActivityRepository(db).add(activity_event)
    ActivityRepository(db).add(
        ActivityEvent(trip_id=trip_id, type=ActivityType.SYSTEM, message="Itinerary recalculated", detail=None)
    )

    notification = Notification(
        trip_id=trip_id,
        severity=NotificationSeverity.LOW,
        category=NotificationCategory.RECOVERY,
        title="Recovery applied",
        message=f"Your itinerary has been recalculated. {plan.bookings_preserved}/{plan.total_bookings} "
        "commitments preserved.",
    )
    NotificationRepository(db).add(notification)

    db.commit()

    return get_trip_out(db, trip_id), _plan_to_out(plan), activity_event, notification
