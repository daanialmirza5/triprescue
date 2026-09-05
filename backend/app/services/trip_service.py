from __future__ import annotations

from sqlalchemy.orm import Session

from app.database import seed as seed_module
from app.engines.itinerary_engine import ItineraryEngine
from app.models.activity import ActivityEvent
from app.models.dependency_edge import DependencyEdge
from app.models.enums import ActivityType
from app.models.itinerary_node import ItineraryNode
from app.models.trip import Trip
from app.repositories.activity_repository import ActivityRepository, NotificationRepository
from app.repositories.node_repository import NodeRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.activity import ActivityEventOut
from app.schemas.common import TravelerPreferences
from app.schemas.notification import NotificationOut
from app.schemas.trip import BookingOut, EdgeOut, NodeOut, TripDayOut, TripOut, TripSummaryOut
from app.services.converters import (
    format_date,
    format_time,
    format_time_range,
    refresh_dependency_counts,
    to_engine_edge,
    to_engine_node,
)

_itinerary_engine = ItineraryEngine()


class TripNotFoundError(Exception):
    pass


def _node_to_out(node: ItineraryNode, risk_percent: int) -> NodeOut:
    buffer_text = None
    if node.category.value == "connection":
        buffer_text = None
    actual_time = None
    if node.actual_start and node.actual_end and (
        node.actual_start != node.scheduled_start or node.actual_end != node.scheduled_end
    ):
        actual_time = format_time_range(node.actual_start, node.actual_end)

    return NodeOut(
        id=node.id,
        category=node.category.value,
        label=node.label,
        title=node.title,
        subtitle=node.subtitle,
        location=node.location,
        scheduled_time=format_time_range(node.scheduled_start, node.scheduled_end),
        actual_time=actual_time,
        buffer=buffer_text,
        provider=node.provider,
        confirmation=node.confirmation,
        cost=node.cost,
        cancellation_policy=node.cancellation_policy,
        refundable=node.refundable,
        risk_level=risk_percent,
        dependency_count=node.dependency_count,
        status=node.status.value,
        day=node.day,
        icon=node.icon,
        description=node.description,
        refund_amount=round(node.cost * node.refund_percentage, 2) if node.refundable else 0,
        lat=node.lat,
        lng=node.lng,
        reason=node.status_reason,
        caused_by=node.caused_by,
        scheduled_start=node.scheduled_start,
        scheduled_end=node.scheduled_end,
        actual_start=node.actual_start,
        actual_end=node.actual_end,
    )


def _edge_to_out(edge: DependencyEdge) -> EdgeOut:
    return EdgeOut(
        id=edge.id,
        source=edge.source_id,
        target=edge.target_id,
        status=edge.status.value,
        label=edge.label,
        type="dependency",
        animated=edge.animated,
    )


def _build_days(nodes: list[ItineraryNode]) -> list[TripDayOut]:
    by_day: dict[int, list[ItineraryNode]] = {}
    for n in nodes:
        by_day.setdefault(n.day, []).append(n)

    titles = {
        1: "Arrival & check-in",
        2: "Excursion day",
        3: "Excursion day",
        4: "Local exploration",
        5: "Return journey",
    }
    days = []
    for day_num in sorted(by_day):
        day_nodes = [n for n in by_day[day_num] if n.category.value != "connection"]
        date_label = format_date(day_nodes[0].scheduled_start) if day_nodes else ""
        days.append(
            TripDayOut(
                day=day_num,
                date=date_label,
                title=titles.get(day_num, f"Day {day_num}"),
                summary=", ".join(n.title for n in day_nodes) if day_nodes else "Free day",
                node_ids=[n.id for n in day_nodes],
            )
        )
    return days


def get_trip(db: Session, trip_id: str, traveler_id: str | None = None) -> Trip:
    trip = TripRepository(db).get(trip_id)
    if trip is None:
        raise TripNotFoundError(trip_id)
    if traveler_id is not None and trip.traveler_id != traveler_id:
        # Treat someone else's trip as "not found" rather than 403, so a guessed
        # id doesn't confirm that trip exists at all.
        raise TripNotFoundError(trip_id)
    return trip


def get_trip_out(db: Session, trip_id: str, traveler_id: str | None = None) -> TripOut:
    trip = get_trip(db, trip_id, traveler_id)
    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    refresh_dependency_counts(nodes, edges)

    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    risk_snapshots = {s.node_id: s.result.risk_percent for s in _itinerary_engine.compute_node_risks(engine_nodes, engine_edges)}

    return TripOut(
        id=trip.id,
        name=trip.name,
        traveler_name=trip.traveler.name,
        route=trip.route,
        origin=trip.origin,
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        nodes=[_node_to_out(n, risk_snapshots.get(n.id, 0)) for n in nodes],
        edges=[_edge_to_out(e) for e in edges],
        trip_value=trip.trip_value,
        health_score=trip.health_score,
        status=trip.status.value,
        days=_build_days(nodes),
    )


def list_trip_summaries(db: Session, traveler_id: str | None = None) -> list[TripSummaryOut]:
    repo = TripRepository(db)
    trips = repo.list_by_traveler(traveler_id) if traveler_id is not None else repo.list_all()
    out = []
    for trip in trips:
        node_repo = NodeRepository(db)
        nodes = node_repo.list_for_trip(trip.id)
        edges = node_repo.list_edges_for_trip(trip.id)
        out.append(
            TripSummaryOut(
                id=trip.id,
                name=trip.name,
                route=trip.route,
                start_date=trip.start_date,
                end_date=trip.end_date,
                trip_value=trip.trip_value,
                health_score=trip.health_score,
                status=trip.status.value,
                node_count=len(nodes),
                edge_count=len(edges),
            )
        )
    return out


def get_bookings_out(db: Session, trip_id: str, traveler_id: str | None = None) -> list[BookingOut]:
    from app.models.booking import Booking as BookingModel
    from sqlalchemy import select

    get_trip(db, trip_id, traveler_id)
    bookings = list(db.scalars(select(BookingModel).where(BookingModel.trip_id == trip_id)))
    node_by_id = {n.id: n for n in NodeRepository(db).list_for_trip(trip_id)}
    out = []
    for b in bookings:
        node = node_by_id.get(b.node_id)
        date = format_date(node.scheduled_start) if node else ""
        time = format_time_range(node.scheduled_start, node.scheduled_end) if node else ""
        out.append(
            BookingOut(
                id=b.id,
                category=b.category.value,
                provider=b.provider,
                confirmation=b.confirmation,
                date=date,
                time=time.split("· ")[-1] if "·" in time else time,
                cost=b.cost,
                refundable=b.refundable,
                cancellation_policy=b.cancellation_policy,
                status=b.status.value,
                risk_level=b.risk_level,
                route=b.route,
                node_id=b.node_id,
            )
        )
    return out


def get_activity_out(db: Session, trip_id: str, traveler_id: str | None = None) -> list[ActivityEventOut]:
    get_trip(db, trip_id, traveler_id)
    events = ActivityRepository(db).list_for_trip(trip_id)
    return [
        ActivityEventOut(id=e.id, timestamp=format_time(e.timestamp), type=e.type.value, message=e.message, detail=e.detail)
        for e in events
    ]


def get_notifications_out(db: Session, trip_id: str, traveler_id: str | None = None) -> list[NotificationOut]:
    get_trip(db, trip_id, traveler_id)
    notifications = NotificationRepository(db).list_for_trip(trip_id)
    return [
        NotificationOut(
            id=n.id,
            severity=n.severity.value,
            category=n.category.value,
            title=n.title,
            message=n.message,
            timestamp=format_time(n.timestamp),
            read=n.read,
        )
        for n in notifications
    ]


def mark_notifications_read(db: Session, trip_id: str, traveler_id: str | None = None) -> None:
    get_trip(db, trip_id, traveler_id)
    NotificationRepository(db).mark_all_read(trip_id)
    db.commit()


def set_preferences(db: Session, trip_id: str, preferences: TravelerPreferences, traveler_id: str | None = None) -> None:
    trip = get_trip(db, trip_id, traveler_id)
    trip.traveler.preferences = preferences.model_dump()
    db.commit()


def get_preferences(db: Session, trip_id: str, traveler_id: str | None = None) -> dict:
    trip = get_trip(db, trip_id, traveler_id)
    return trip.traveler.preferences


def reset_trip_out(db: Session, trip_id: str, traveler_id: str | None = None) -> TripOut:
    get_trip(db, trip_id, traveler_id)  # ownership check before mutating
    trip = seed_module.reset_trip(db, trip_id)
    if trip is None:
        raise TripNotFoundError(trip_id)
    db.add(
        ActivityEvent(
            trip_id=trip_id,
            type=ActivityType.SYSTEM,
            message="Trip reset",
            detail="Itinerary restored to its original healthy state.",
        )
    )
    db.commit()
    return get_trip_out(db, trip_id)
