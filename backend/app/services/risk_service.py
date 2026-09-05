from __future__ import annotations

from sqlalchemy.orm import Session

from app.engines.financial_engine import FinancialEngine
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.risk_engine import RiskEngine
from app.repositories.node_repository import NodeRepository
from app.schemas.risk import AlertOut, RiskAnalysisOut, RiskCardOut, RiskScoreOut
from app.services.converters import refresh_dependency_counts, to_engine_edge, to_engine_node
from app.services.trip_service import get_trip

_itinerary_engine = ItineraryEngine()
_risk_engine = RiskEngine()
_financial_engine = FinancialEngine()


def get_risk_analysis(db: Session, trip_id: str) -> RiskAnalysisOut:
    get_trip(db, trip_id)
    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    refresh_dependency_counts(nodes, edges)
    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    node_by_id = {n.id: n for n in nodes}

    snapshots = _itinerary_engine.compute_node_risks(engine_nodes, engine_edges)
    financial = _financial_engine.summarize(engine_nodes)
    exposure_ratio = financial.at_risk_value / financial.total_trip_value if financial.total_trip_value else 0
    resilience = _risk_engine.trip_resilience([s.result.risk_percent for s in snapshots], exposure_ratio)

    connection_snapshots = [s for s in snapshots if s.is_connection_risk]
    exposure_snapshots = [s for s in snapshots if not s.is_connection_risk]

    connection_risk = max((s.result.risk_percent for s in connection_snapshots), default=8)
    schedule_risk = round(
        sum(s.result.risk_percent for s in connection_snapshots) / len(connection_snapshots)
    ) if connection_snapshots else 12
    vendor_risk = round(
        sum(s.result.risk_percent for s in exposure_snapshots) / len(exposure_snapshots)
    ) if exposure_snapshots else 10
    weather_sensitive = [
        s for s in snapshots
        if node_by_id[s.node_id].scheduled_start.hour < 6 or node_by_id[s.node_id].scheduled_start.hour >= 20
    ]
    weather_risk = round(
        sum(s.result.risk_percent for s in weather_sensitive) / len(weather_sensitive)
    ) if weather_sensitive else 8

    score = RiskScoreOut(
        trip_resilience=resilience,
        connection_risk=connection_risk,
        schedule_risk=schedule_risk,
        vendor_risk=vendor_risk,
        weather_risk=weather_risk,
    )

    # Synthetic connection-marker nodes aren't real bookings - showing a
    # "cancellation window" warning on a ₹0 placeholder is misleading, so they're
    # excluded from the card list (their risk still feeds trip_resilience above).
    bookable_snapshots = [s for s in snapshots if node_by_id[s.node_id].category.value != "connection"]
    ranked = sorted(bookable_snapshots, key=lambda s: -s.result.risk_percent)
    cards: list[RiskCardOut] = []
    for snap in ranked[:5]:
        if snap.result.risk_percent < 12:
            continue
        node = node_by_id[snap.node_id]
        if snap.is_connection_risk:
            risk_type = f"{snap.result.risk_level.upper()} CONNECTION RISK"
            buffer_text = f"{snap.available_minutes} min" if snap.available_minutes is not None else None
            recommended_text = f"{snap.recommended_minutes} min+" if snap.recommended_minutes else None
        elif node.category.value == "hotel":
            risk_type = "CHECK-IN WINDOW"
            buffer_text = None
            recommended_text = None
        elif not node.refundable:
            risk_type = "STRICT CANCELLATION WINDOW"
            buffer_text = None
            recommended_text = None
        else:
            risk_type = "SCHEDULE RISK"
            buffer_text = None
            recommended_text = None

        cards.append(
            RiskCardOut(
                node_id=node.id,
                node_label=node.label,
                risk_type=risk_type,
                risk_level=snap.result.risk_level,
                risk_percent=snap.result.risk_percent,
                buffer=buffer_text,
                recommended=recommended_text,
                historical_risk="Elevated" if snap.result.risk_percent >= 50 else "Low",
                downstream_impact=node.dependency_count,
                recommendation=snap.result.recommendation,
            )
        )

    alerts: list[AlertOut] = []
    for i, snap in enumerate(ranked[:3]):
        if snap.result.risk_percent < 12:
            continue
        node = node_by_id[snap.node_id]
        severity = "high" if snap.result.risk_percent >= 60 else "medium" if snap.result.risk_percent >= 30 else "low"
        alerts.append(
            AlertOut(
                id=f"alert-{node.id}",
                severity=severity,
                title=snap.result.reason,
                reason=", ".join(snap.result.contributing_factors),
                impact=f"{node.dependency_count} downstream booking(s) could be affected."
                if node.dependency_count
                else f"₹{node.cost:,.0f} at risk if this fails.",
                action=snap.result.recommendation,
                node_id=node.id,
                timestamp="just now",
            )
        )

    return RiskAnalysisOut(score=score, cards=cards, alerts=alerts)
