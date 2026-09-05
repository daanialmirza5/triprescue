from __future__ import annotations

from sqlalchemy.orm import Session

from app.engines.financial_engine import FinancialEngine
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.propagation_engine import PropagationEngine
from app.models.activity import ActivityEvent
from app.models.dependency_edge import DependencyEdge
from app.models.disruption import CascadeStep, Disruption
from app.models.enums import ActivityType, DisruptionType, EdgeStatus, ImpactLevel, NodeStatus, NotificationCategory, NotificationSeverity, TripStatus
from app.models.itinerary_node import ItineraryNode
from app.models.notification import Notification
from app.repositories.activity_repository import ActivityRepository, NotificationRepository
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.node_repository import NodeRepository
from app.schemas.disruption import CascadeStepOut, DisruptionOut, DisruptionRequest, ImpactEntryOut, PropagationResultOut
from app.services.converters import format_time, to_engine_edge, to_engine_node
from app.services.trip_service import get_trip

_propagation_engine = PropagationEngine()
_itinerary_engine = ItineraryEngine()
_financial_engine = FinancialEngine()

_DISRUPTION_LABELS = {
    "flight-delay": "Flight delay",
    "flight-cancellation": "Flight cancellation",
    "missed-connection": "Missed connection",
    "hotel-conflict": "Hotel check-in conflict",
    "hotel-cancellation": "Hotel cancellation",
    "transfer-failure": "Transfer failure",
    "activity-cancellation": "Activity cancellation",
    "activity-delay": "Activity delay",
    "airport-closure": "Airport closure",
}

_CATEGORY_FOR_TYPE = {
    "flight-delay": "flight",
    "flight-cancellation": "flight",
    "airport-closure": "flight",
    "missed-connection": "connection",
    "hotel-conflict": "hotel",
    "hotel-cancellation": "hotel",
    "transfer-failure": "transfer",
    "activity-cancellation": "activity",
    "activity-delay": "activity",
}

# The hero trip has known-good defaults for a good demo experience; every other
# trip falls back to "first node whose category matches this disruption type".
_LADAKH_DEFAULTS = {
    "flight-delay": "bom-del",
    "flight-cancellation": "bom-del",
    "airport-closure": "del-leh",
    "missed-connection": "del-connection",
    "hotel-conflict": "grand-dragon",
    "hotel-cancellation": "grand-dragon",
    "transfer-failure": "airport-transfer",
    "activity-cancellation": "pangong-tour",
    "activity-delay": "pangong-tour",
}


class InvalidDisruptionError(Exception):
    pass


def _resolve_primary_node(nodes: list[ItineraryNode], disruption_type: str, requested: str | None) -> ItineraryNode:
    if requested:
        node = next((n for n in nodes if n.id == requested), None)
        if node is None:
            raise InvalidDisruptionError(f"Unknown node id: {requested}")
        return node

    default_id = _LADAKH_DEFAULTS.get(disruption_type)
    if default_id:
        node = next((n for n in nodes if n.id == default_id), None)
        if node:
            return node

    category = _CATEGORY_FOR_TYPE.get(disruption_type)
    node = next((n for n in nodes if n.category.value == category), None)
    if node is None:
        raise InvalidDisruptionError(f"No node of category '{category}' found for disruption type '{disruption_type}'.")
    return node


def _label_for(disruption_type: str, node: ItineraryNode, delay_minutes: int | None) -> str:
    base = _DISRUPTION_LABELS.get(disruption_type, disruption_type)
    if disruption_type == "flight-delay" and delay_minutes:
        hours = delay_minutes // 60
        minutes = delay_minutes % 60
        duration = f"{hours}h" + (f" {minutes}m" if minutes else "")
        return f"Delay {node.title} by {duration}"
    if disruption_type == "activity-delay" and delay_minutes:
        return f"Delay {node.title} by {delay_minutes} minutes"
    return f"{base}: {node.title}"


def trigger_disruption(
    db: Session, trip_id: str, request: DisruptionRequest, traveler_id: str | None = None
) -> PropagationResultOut:
    if request.type not in DisruptionType._value2member_map_:
        raise InvalidDisruptionError(f"Unknown disruption type: {request.type}")

    trip = get_trip(db, trip_id, traveler_id)
    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    node_by_id = {n.id: n for n in nodes}

    primary_node = _resolve_primary_node(nodes, request.type, request.primary_node_id)

    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    detected_at = primary_node.scheduled_start

    result = _propagation_engine.propagate(
        nodes=engine_nodes,
        edges=engine_edges,
        disrupted_node_id=primary_node.id,
        disruption_type=request.type,
        delay_minutes=request.delay_minutes,
        detected_at=detected_at,
    )
    impacts = result.impacts

    # Persist computed status/timing back onto each node.
    for node in nodes:
        impact = impacts[node.id]
        node.status = NodeStatus(impact.status)
        node.status_reason = impact.reason
        node.caused_by = impact.caused_by
        node.actual_start = impact.actual_start
        node.actual_end = impact.actual_end

    for edge in edges:
        target_status = impacts[edge.target_id].status
        edge.status = EdgeStatus(target_status) if target_status in EdgeStatus._value2member_map_ else EdgeStatus.HEALTHY
        edge.animated = target_status == "broken"

    non_healthy = [n for n in nodes if impacts[n.id].status != "healthy" and n.id != primary_node.id]
    downstream_impact = len(non_healthy)
    financial = _financial_engine.summarize([to_engine_node(n) for n in nodes], impacts)

    broken_count = sum(1 for n in nodes if impacts[n.id].status in ("broken", "cancelled"))
    if broken_count >= 1 and downstream_impact >= 3:
        impact_level = ImpactLevel.CRITICAL
    elif broken_count >= 1:
        impact_level = ImpactLevel.HIGH
    elif downstream_impact >= 1:
        impact_level = ImpactLevel.MEDIUM
    else:
        impact_level = ImpactLevel.LOW

    disruption = Disruption(
        trip_id=trip_id,
        type=DisruptionType(request.type),
        label=_label_for(request.type, primary_node, request.delay_minutes),
        primary_node_id=primary_node.id,
        delay_minutes=request.delay_minutes,
        impact_level=impact_level,
        direct_impact=1,
        downstream_impact=downstream_impact,
        financial_exposure=financial.at_risk_value,
        refund_exposure=financial.potential_refund,
        detected_at=detected_at,
        resolved=False,
    )
    DisruptionRepository(db).save(disruption)

    step_order = 0
    for node_id in result.sequence:
        impact = impacts[node_id]
        if impact.status == "healthy":
            continue
        node = node_by_id[node_id]
        db.add(
            CascadeStep(
                disruption_id=disruption.id,
                sequence_order=step_order,
                description=f"{node.title}: {impact.status.replace('-', ' ')}"
                + (f" — {impact.reason}" if impact.reason else ""),
                node_id=node_id,
                timestamp=format_time(node.scheduled_start),
            )
        )
        step_order += 1

    trip.status = TripStatus.DISRUPTED
    trip.health_score = _itinerary_engine.compute_health_score(
        [to_engine_node(n) for n in nodes], [to_engine_edge(e) for e in edges], impacts
    )

    activity_repo = ActivityRepository(db)
    activity_repo.add(
        ActivityEvent(
            trip_id=trip_id,
            type=ActivityType.DISRUPTION,
            message=f"{disruption.label} triggered",
            detail="Impact analysis in progress...",
            timestamp=detected_at,
        )
    )
    if downstream_impact:
        activity_repo.add(
            ActivityEvent(
                trip_id=trip_id,
                type=ActivityType.DISRUPTION,
                message="Downstream dependencies affected",
                detail=f"{downstream_impact} booking(s) impacted by this disruption.",
                timestamp=detected_at,
            )
        )

    severity = "high" if impact_level in (ImpactLevel.HIGH, ImpactLevel.CRITICAL) else "medium"
    NotificationRepository(db).add(
        Notification(
            trip_id=trip_id,
            severity=NotificationSeverity.HIGH if severity == "high" else NotificationSeverity.MEDIUM,
            category=NotificationCategory.RISK,
            title=f"{disruption.label} detected",
            message=f"{downstream_impact} downstream booking(s) may be affected. Financial exposure: "
            f"₹{financial.at_risk_value:,.0f}.",
            timestamp=detected_at,
        )
    )

    db.commit()

    cascade_steps_out = [
        CascadeStepOut(id=s.id, description=s.description, node_id=s.node_id, timestamp=s.timestamp)
        for s in disruption.cascade_steps
    ]
    disruption_out = DisruptionOut(
        id=disruption.id,
        type=disruption.type.value,
        label=disruption.label,
        primary_node_id=disruption.primary_node_id,
        delay_minutes=disruption.delay_minutes,
        impact_level=disruption.impact_level.value,
        direct_impact=disruption.direct_impact,
        downstream_impact=disruption.downstream_impact,
        financial_exposure=disruption.financial_exposure,
        refund_exposure=disruption.refund_exposure,
        cascade_steps=cascade_steps_out,
        detected_at=format_time(disruption.detected_at),
    )
    impacts_out = [
        ImpactEntryOut(
            node_id=nid,
            status=impacts[nid].status,
            reason=impacts[nid].reason,
            caused_by=impacts[nid].caused_by,
            available_buffer_minutes=impacts[nid].available_buffer_minutes,
            required_buffer_minutes=impacts[nid].required_buffer_minutes,
        )
        for nid in result.sequence
    ]
    return PropagationResultOut(
        disruption=disruption_out, impacts=impacts_out, sequence=result.sequence, trip_health_score=trip.health_score
    )
