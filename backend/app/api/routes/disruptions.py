from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.node_repository import NodeRepository
from app.schemas.disruption import DisruptionRequest, ImpactEntryOut, PropagationResultOut
from app.services import disruption_service, trip_service
from app.services.converters import format_time, to_engine_edge, to_engine_node
from app.engines.financial_engine import FinancialEngine
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.propagation_engine import PropagationEngine

router = APIRouter(prefix="/api/trips/{trip_id}", tags=["disruptions"])
_propagation_engine = PropagationEngine()
_financial_engine = FinancialEngine()
_itinerary_engine = ItineraryEngine()


@router.post("/disruptions", response_model=PropagationResultOut)
def trigger_disruption(
    trip_id: str,
    request: DisruptionRequest,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        return disruption_service.trigger_disruption(db, trip_id, request, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except disruption_service.InvalidDisruptionError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/propagate", response_model=PropagationResultOut)
def repropagate(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Re-run propagation for the currently active disruption without creating a
    new one - useful after external state changes."""
    try:
        trip_service.get_trip(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")

    disruption = DisruptionRepository(db).latest_unresolved(trip_id)
    if disruption is None:
        raise HTTPException(status_code=400, detail="No active disruption to propagate.")

    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    result = _propagation_engine.propagate(
        nodes=[to_engine_node(n) for n in nodes],
        edges=[to_engine_edge(e) for e in edges],
        disrupted_node_id=disruption.primary_node_id,
        disruption_type=disruption.type.value,
        delay_minutes=disruption.delay_minutes,
        detected_at=disruption.detected_at,
    )
    from app.schemas.disruption import CascadeStepOut, DisruptionOut

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
        cascade_steps=[
            CascadeStepOut(id=s.id, description=s.description, node_id=s.node_id, timestamp=s.timestamp)
            for s in disruption.cascade_steps
        ],
        detected_at=format_time(disruption.detected_at),
    )
    impacts_out = [
        ImpactEntryOut(
            node_id=nid,
            status=result.impacts[nid].status,
            reason=result.impacts[nid].reason,
            caused_by=result.impacts[nid].caused_by,
            available_buffer_minutes=result.impacts[nid].available_buffer_minutes,
            required_buffer_minutes=result.impacts[nid].required_buffer_minutes,
        )
        for nid in result.sequence
    ]
    trip = trip_service.get_trip(db, trip_id, traveler_id)
    return PropagationResultOut(
        disruption=disruption_out, impacts=impacts_out, sequence=result.sequence, trip_health_score=trip.health_score
    )


@router.post("/simulate", response_model=PropagationResultOut)
def simulate_disruption(
    trip_id: str,
    request: DisruptionRequest,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    """Dry-run preview: computes the propagation the same way /disruptions does,
    but writes nothing to the database. Used by the disruption picker UI."""
    try:
        trip_service.get_trip(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")

    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    if not nodes:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    edges = node_repo.list_edges_for_trip(trip_id)

    try:
        from app.services.disruption_service import _label_for, _resolve_primary_node
        from app.models.enums import DisruptionType

        if request.type not in DisruptionType._value2member_map_:
            raise disruption_service.InvalidDisruptionError(f"Unknown disruption type: {request.type}")
        primary_node = _resolve_primary_node(nodes, request.type, request.primary_node_id)
    except disruption_service.InvalidDisruptionError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    detected_at = primary_node.scheduled_start
    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    result = _propagation_engine.propagate(
        nodes=engine_nodes,
        edges=engine_edges,
        disrupted_node_id=primary_node.id,
        disruption_type=request.type,
        delay_minutes=request.delay_minutes,
        detected_at=detected_at,
    )
    non_healthy = [n for n in nodes if result.impacts[n.id].status != "healthy" and n.id != primary_node.id]
    financial = _financial_engine.summarize(engine_nodes, result.impacts)
    preview_health_score = _itinerary_engine.compute_health_score(engine_nodes, engine_edges, result.impacts)
    from app.schemas.disruption import DisruptionOut

    disruption_out = DisruptionOut(
        id="preview",
        type=request.type,
        label=_label_for(request.type, primary_node, request.delay_minutes),
        primary_node_id=primary_node.id,
        delay_minutes=request.delay_minutes,
        impact_level="high" if non_healthy else "low",
        direct_impact=1,
        downstream_impact=len(non_healthy),
        financial_exposure=financial.at_risk_value,
        refund_exposure=financial.potential_refund,
        cascade_steps=[],
        detected_at=format_time(detected_at),
    )
    impacts_out = [
        ImpactEntryOut(
            node_id=nid,
            status=result.impacts[nid].status,
            reason=result.impacts[nid].reason,
            caused_by=result.impacts[nid].caused_by,
            available_buffer_minutes=result.impacts[nid].available_buffer_minutes,
            required_buffer_minutes=result.impacts[nid].required_buffer_minutes,
        )
        for nid in result.sequence
    ]
    return PropagationResultOut(
        disruption=disruption_out, impacts=impacts_out, sequence=result.sequence, trip_health_score=preview_health_score
    )
