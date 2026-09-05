"""Conversions between SQLAlchemy models, the ORM-free engine dataclasses, and the
camelCase API schemas. Keeping this in one place is what lets the engines stay
completely unaware of SQLAlchemy or FastAPI.
"""

from __future__ import annotations

from datetime import datetime

from app.engines.types import EngineEdge, EngineNode
from app.models.dependency_edge import DependencyEdge
from app.models.itinerary_node import ItineraryNode


def to_engine_node(node: ItineraryNode) -> EngineNode:
    return EngineNode(
        id=node.id,
        category=node.category.value,
        title=node.title,
        location=node.location,
        scheduled_start=node.scheduled_start,
        scheduled_end=node.scheduled_end,
        flexible=node.flexible,
        fixed_end=node.fixed_end,
        cost=node.cost,
        refundable=node.refundable,
        refund_percentage=node.refund_percentage,
        cancellation_deadline_hours=node.cancellation_deadline_hours,
        provider=node.provider,
        confirmation=node.confirmation,
        origin_code=node.origin_code,
        destination_code=node.destination_code,
    )


def to_engine_edge(edge: DependencyEdge) -> EngineEdge:
    return EngineEdge(
        id=edge.id,
        source=edge.source_id,
        target=edge.target_id,
        dependency_type=edge.dependency_type.value,
        min_buffer_minutes=edge.min_buffer_minutes,
        risk_buffer_minutes=edge.risk_buffer_minutes,
        upstream_reference=edge.upstream_reference,
    )


def format_time_range(start: datetime, end: datetime) -> str:
    if start.date() == end.date():
        return f"{start:%d %b} · {start:%H:%M}–{end:%H:%M}"
    return f"{start:%d %b} · {start:%H:%M} — {end:%d %b} · {end:%H:%M}"


def format_date(moment: datetime) -> str:
    return f"{moment:%d %b}"


def format_time(moment: datetime) -> str:
    return f"{moment:%H:%M}"


def refresh_dependency_counts(nodes: list[ItineraryNode], edges: list[DependencyEdge]) -> None:
    """Recomputes each node's downstream dependency count from the current edge
    set and writes it onto the (already-loaded) ORM objects. dependency_count is
    a cached/derived value - always correct after this call, but only ever set
    here rather than hand-maintained at every mutation site."""
    from app.engines.graph_engine import GraphEngine

    graph = GraphEngine([n.id for n in nodes], [(e.source_id, e.target_id) for e in edges])
    deps = graph.calculate_dependencies()
    for n in nodes:
        n.dependency_count = deps.get(n.id, 0)
