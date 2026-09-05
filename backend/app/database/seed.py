"""Seed data: Aisha's Ladakh Expedition (the hero trip) plus two additional
itineraries (Goa, Rajasthan) that exercise branching/converging dependencies
rather than a simple chain. Also seeds the single demo traveler.

Each trip has a dedicated `build_*_trip` function that fully (re)creates that
trip's nodes/edges/bookings. `reset_trip` calls the matching builder again,
which is what gives the "Reset" action a genuinely clean restore rather than
trying to patch mutated rows back to their original values.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import ActivityEvent
from app.models.booking import Booking
from app.models.dependency_edge import DependencyEdge
from app.models.disruption import CascadeStep, Disruption
from app.models.enums import ActivityType, NodeCategory, NotificationCategory, NotificationSeverity, TripStatus
from app.models.itinerary_node import ItineraryNode
from app.models.notification import Notification
from app.models.recovery import RecoveryAction, RecoveryPlan
from app.models.traveler import Traveler
from app.models.trip import Trip
from app.services.auth_service import hash_password

DEFAULT_TRAVELER_ID = "traveler-aisha"
LADAKH_TRIP_ID = "trip-ladakh-2025"
GOA_TRIP_ID = "trip-goa-2026"
RAJASTHAN_TRIP_ID = "trip-rajasthan-2026"


def _clear_trip_data(db: Session, trip_id: str) -> None:
    for model in (RecoveryAction,):
        pass  # cascades via RecoveryPlan delete below
    plan_ids = [p.id for p in db.scalars(select(RecoveryPlan).where(RecoveryPlan.trip_id == trip_id))]
    for plan_id in plan_ids:
        for action in db.scalars(select(RecoveryAction).where(RecoveryAction.recovery_plan_id == plan_id)):
            db.delete(action)
    for plan in db.scalars(select(RecoveryPlan).where(RecoveryPlan.trip_id == trip_id)):
        db.delete(plan)

    disruption_ids = [d.id for d in db.scalars(select(Disruption).where(Disruption.trip_id == trip_id))]
    for disruption_id in disruption_ids:
        for step in db.scalars(select(CascadeStep).where(CascadeStep.disruption_id == disruption_id)):
            db.delete(step)
    for disruption in db.scalars(select(Disruption).where(Disruption.trip_id == trip_id)):
        db.delete(disruption)

    for booking in db.scalars(select(Booking).where(Booking.trip_id == trip_id)):
        db.delete(booking)
    for edge in db.scalars(select(DependencyEdge).where(DependencyEdge.trip_id == trip_id)):
        db.delete(edge)
    for node in db.scalars(select(ItineraryNode).where(ItineraryNode.trip_id == trip_id)):
        db.delete(node)
    for event in db.scalars(select(ActivityEvent).where(ActivityEvent.trip_id == trip_id)):
        db.delete(event)
    for notif in db.scalars(select(Notification).where(Notification.trip_id == trip_id)):
        db.delete(notif)
    db.flush()


def _make_node(trip_id: str, **kwargs) -> ItineraryNode:
    return ItineraryNode(trip_id=trip_id, **kwargs)


def _make_booking(trip_id: str, node: ItineraryNode, route: str | None = None) -> Booking:
    return Booking(
        trip_id=trip_id,
        node_id=node.id,
        category=node.category,
        provider=node.provider,
        confirmation=node.confirmation or "",
        cost=node.cost,
        refundable=node.refundable,
        cancellation_policy=node.cancellation_policy,
        status=node.status,
        risk_level=node.risk_level,
        route=route,
    )


def build_ladakh_trip(db: Session, traveler_id: str) -> Trip:
    _clear_trip_data(db, LADAKH_TRIP_ID)
    trip = db.get(Trip, LADAKH_TRIP_ID)
    if trip is None:
        trip = Trip(id=LADAKH_TRIP_ID, traveler_id=traveler_id)
        db.add(trip)

    trip.name = "Aisha's Ladakh Expedition"
    trip.route = "Mumbai → Delhi → Leh"
    trip.origin = "Mumbai"
    trip.destination = "Leh"
    trip.start_date = "12 Sep 2025"
    trip.end_date = "16 Sep 2025"
    trip.trip_value = 42800
    trip.health_score = 87
    trip.status = TripStatus.OPERATIONAL

    nodes = [
        _make_node(
            LADAKH_TRIP_ID,
            id="bom-del",
            category=NodeCategory.FLIGHT,
            label="BOM → DEL",
            title="Mumbai → Delhi",
            subtitle="IndiGo 6E-3014",
            location="Mumbai (BOM)",
            scheduled_start=datetime(2025, 9, 12, 6, 30),
            scheduled_end=datetime(2025, 9, 12, 8, 45),
            flexible=False,
            provider="IndiGo",
            confirmation="6E-3014-XK8",
            cost=6800,
            cancellation_policy="Refundable up to 24h before departure",
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=24,
            day=1,
            icon="plane",
            lat=19.0896,
            lng=72.8656,
            origin_code="BOM",
            destination_code="DEL",
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="del-connection",
            category=NodeCategory.CONNECTION,
            label="DEL Connection",
            title="Delhi Connection",
            subtitle="Minimum connection window",
            location="Delhi (DEL) T3",
            scheduled_start=datetime(2025, 9, 12, 8, 45),
            scheduled_end=datetime(2025, 9, 12, 8, 45),
            flexible=True,
            provider="Indira Gandhi Intl",
            cost=0,
            cancellation_policy="N/A",
            refundable=False,
            day=1,
            icon="timer",
            lat=28.5562,
            lng=77.1,
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="del-leh",
            category=NodeCategory.FLIGHT,
            label="DEL → IXL",
            title="Delhi → Leh",
            subtitle="Go First G8-204",
            location="Delhi (DEL)",
            scheduled_start=datetime(2025, 9, 12, 10, 15),
            scheduled_end=datetime(2025, 9, 12, 11, 30),
            flexible=False,
            provider="Go First",
            confirmation="G8-204",
            cost=9200,
            cancellation_policy="Non-refundable. Credit available.",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
            day=1,
            icon="plane",
            lat=28.5562,
            lng=77.1,
            origin_code="DEL",
            destination_code="IXL",
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="airport-transfer",
            category=NodeCategory.TRANSFER,
            label="Airport Transfer",
            title="Airport Transfer",
            subtitle="Leh Airport → Hotel",
            location="Leh (IXL)",
            scheduled_start=datetime(2025, 9, 12, 11, 50),
            scheduled_end=datetime(2025, 9, 12, 12, 10),
            flexible=True,
            provider="MakeMyTrip Transfers",
            confirmation="MMT-TR-882",
            cost=1200,
            cancellation_policy="Free cancellation up to 2h before",
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=2,
            day=1,
            icon="car",
            lat=34.1359,
            lng=77.4466,
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="grand-dragon",
            category=NodeCategory.HOTEL,
            label="Grand Dragon",
            title="Grand Dragon Ladakh",
            subtitle="Check-in 13:00",
            location="Leh",
            scheduled_start=datetime(2025, 9, 12, 13, 0),
            scheduled_end=datetime(2025, 9, 16, 11, 0),
            flexible=True,
            fixed_end=True,
            provider="Grand Dragon Ladakh",
            confirmation="GDL-8843",
            cost=14400,
            cancellation_policy="Free until 10 Sep. 1 night charge after.",
            refundable=True,
            refund_percentage=0.75,
            cancellation_deadline_hours=48,
            day=1,
            icon="bed",
            lat=34.1526,
            lng=77.5833,
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="pangong-tour",
            category=NodeCategory.ACTIVITY,
            label="Pangong Lake",
            title="Pangong Lake Tour",
            subtitle="13 Sep · 06:00 departure",
            location="Pangong Tso",
            scheduled_start=datetime(2025, 9, 13, 6, 0),
            scheduled_end=datetime(2025, 9, 13, 18, 0),
            flexible=False,
            provider="Ladakh Adventures",
            confirmation="LA-PG-441",
            cost=4800,
            cancellation_policy="Strict. No refund within 24h.",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
            day=2,
            icon="mountain",
            lat=33.75,
            lng=78.9,
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="nubra-valley",
            category=NodeCategory.ACTIVITY,
            label="Nubra Valley",
            title="Nubra Valley Excursion",
            subtitle="14 Sep · 07:00 departure",
            location="Nubra Valley",
            scheduled_start=datetime(2025, 9, 14, 7, 0),
            scheduled_end=datetime(2025, 9, 14, 19, 0),
            flexible=False,
            provider="Ladakh Adventures",
            confirmation="LA-NV-442",
            cost=5200,
            cancellation_policy="Moderate. 50% refund within 48h.",
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=48,
            day=3,
            icon="mountain",
            lat=34.6,
            lng=77.55,
        ),
        _make_node(
            LADAKH_TRIP_ID,
            id="leh-return",
            category=NodeCategory.RETURN,
            label="Return",
            title="Leh → Delhi → Mumbai",
            subtitle="16 Sep · Return journey",
            location="Leh (IXL)",
            scheduled_start=datetime(2025, 9, 16, 12, 0),
            scheduled_end=datetime(2025, 9, 16, 16, 30),
            flexible=False,
            provider="IndiGo",
            confirmation="6E-3015-QR2",
            cost=1200,
            cancellation_policy="Refundable up to 24h before departure",
            refundable=True,
            refund_percentage=1.0,
            cancellation_deadline_hours=24,
            day=5,
            icon="plane",
            lat=34.1359,
            lng=77.4466,
            origin_code="IXL",
            destination_code="BOM",
        ),
    ]
    for n in nodes:
        db.add(n)
    db.flush()

    edges = [
        DependencyEdge(
            id="e1", trip_id=LADAKH_TRIP_ID, source_id="bom-del", target_id="del-connection",
            dependency_type="soft", min_buffer_minutes=0, risk_buffer_minutes=0, upstream_reference="end",
        ),
        DependencyEdge(
            id="e2", trip_id=LADAKH_TRIP_ID, source_id="del-connection", target_id="del-leh",
            dependency_type="hard", min_buffer_minutes=60, risk_buffer_minutes=30, upstream_reference="end",
        ),
        DependencyEdge(
            id="e3", trip_id=LADAKH_TRIP_ID, source_id="del-leh", target_id="airport-transfer",
            dependency_type="soft", min_buffer_minutes=20, risk_buffer_minutes=10, upstream_reference="end",
        ),
        DependencyEdge(
            id="e4", trip_id=LADAKH_TRIP_ID, source_id="airport-transfer", target_id="grand-dragon",
            dependency_type="soft", min_buffer_minutes=10, risk_buffer_minutes=10, upstream_reference="end",
        ),
        DependencyEdge(
            id="e5", trip_id=LADAKH_TRIP_ID, source_id="grand-dragon", target_id="pangong-tour",
            dependency_type="soft", min_buffer_minutes=0, risk_buffer_minutes=0, upstream_reference="start",
        ),
        DependencyEdge(
            id="e6", trip_id=LADAKH_TRIP_ID, source_id="grand-dragon", target_id="nubra-valley",
            dependency_type="soft", min_buffer_minutes=0, risk_buffer_minutes=0, upstream_reference="start",
        ),
        DependencyEdge(
            id="e7", trip_id=LADAKH_TRIP_ID, source_id="grand-dragon", target_id="leh-return",
            dependency_type="soft", min_buffer_minutes=0, risk_buffer_minutes=0, upstream_reference="end",
        ),
    ]
    for e in edges:
        db.add(e)

    routes = {"bom-del": "BOM → DEL", "del-leh": "DEL → IXL", "leh-return": "IXL → DEL → BOM"}
    for n in nodes:
        if n.category == NodeCategory.CONNECTION:
            continue
        db.add(_make_booking(LADAKH_TRIP_ID, n, routes.get(n.id)))

    db.add(
        ActivityEvent(
            trip_id=LADAKH_TRIP_ID,
            type=ActivityType.SYSTEM,
            message="TripRescue engine initialized",
            detail="AI disruption detection active",
            timestamp=datetime(2025, 9, 12, 5, 0),
        )
    )
    db.add(
        ActivityEvent(
            trip_id=LADAKH_TRIP_ID,
            type=ActivityType.MONITORING,
            message="Trip monitoring active",
            detail="All 8 nodes being tracked in real-time",
            timestamp=datetime(2025, 9, 12, 5, 5),
        )
    )
    db.flush()
    return trip


def build_goa_trip(db: Session, traveler_id: str) -> Trip:
    _clear_trip_data(db, GOA_TRIP_ID)
    trip = db.get(Trip, GOA_TRIP_ID)
    if trip is None:
        trip = Trip(id=GOA_TRIP_ID, traveler_id=traveler_id)
        db.add(trip)

    trip.name = "Goa Getaway"
    trip.route = "Mumbai → Goa"
    trip.origin = "Mumbai"
    trip.destination = "Goa"
    trip.start_date = "10 Jan 2026"
    trip.end_date = "13 Jan 2026"
    trip.trip_value = 21400
    trip.health_score = 92
    trip.status = TripStatus.OPERATIONAL

    nodes = [
        _make_node(
            GOA_TRIP_ID, id="bom-goi", category=NodeCategory.FLIGHT, label="BOM → GOI", title="Mumbai → Goa",
            subtitle="IndiGo 6E-701", location="Mumbai (BOM)",
            scheduled_start=datetime(2026, 1, 10, 14, 0), scheduled_end=datetime(2026, 1, 10, 15, 15),
            provider="IndiGo", confirmation="6E-701", cost=4200,
            cancellation_policy="Refundable up to 24h before departure", refundable=True, refund_percentage=0.7,
            cancellation_deadline_hours=24, day=1, icon="plane", lat=19.0896, lng=72.8656,
            origin_code="BOM", destination_code="GOI",
        ),
        _make_node(
            GOA_TRIP_ID, id="goa-transfer", category=NodeCategory.TRANSFER, label="Airport Transfer",
            title="Goa Airport Transfer", subtitle="GOI Airport → Resort", location="Goa (GOI)",
            scheduled_start=datetime(2026, 1, 10, 15, 45), scheduled_end=datetime(2026, 1, 10, 16, 30),
            flexible=True, provider="GoaCabs", confirmation="GC-2291", cost=900,
            cancellation_policy="Free cancellation up to 1h before", refundable=True, refund_percentage=0.8,
            cancellation_deadline_hours=1, day=1, icon="car", lat=15.3800, lng=73.8310,
        ),
        _make_node(
            GOA_TRIP_ID, id="beach-resort", category=NodeCategory.HOTEL, label="Beach Resort",
            title="Candolim Beach Resort", subtitle="Check-in 16:30", location="Candolim",
            scheduled_start=datetime(2026, 1, 10, 16, 30), scheduled_end=datetime(2026, 1, 13, 11, 0),
            flexible=True, fixed_end=True, provider="Candolim Beach Resort", confirmation="CBR-5521",
            cost=9600, cancellation_policy="Free until 8 Jan. 1 night charge after.", refundable=True,
            refund_percentage=0.8, cancellation_deadline_hours=48, day=1, icon="bed", lat=15.5185, lng=73.7631,
        ),
        _make_node(
            GOA_TRIP_ID, id="scuba-activity", category=NodeCategory.ACTIVITY, label="Scuba Diving",
            title="Grande Island Scuba Diving", subtitle="11 Jan · 09:00 departure", location="Grande Island",
            scheduled_start=datetime(2026, 1, 11, 9, 0), scheduled_end=datetime(2026, 1, 11, 13, 0),
            flexible=False, provider="Goa Dive Co.", confirmation="GDC-118", cost=3800,
            cancellation_policy="Strict. No refund within 24h.", refundable=False, refund_percentage=0.0,
            cancellation_deadline_hours=24, day=2, icon="mountain", lat=15.3627, lng=73.7998,
        ),
        _make_node(
            GOA_TRIP_ID, id="sunset-cruise", category=NodeCategory.ACTIVITY, label="Sunset Cruise",
            title="Mandovi Sunset Cruise", subtitle="12 Jan · 17:30 departure", location="Panjim",
            scheduled_start=datetime(2026, 1, 12, 17, 30), scheduled_end=datetime(2026, 1, 12, 19, 30),
            flexible=False, provider="Goa River Cruises", confirmation="GRC-874", cost=1500,
            cancellation_policy="Moderate. 50% refund within 24h.", refundable=True, refund_percentage=0.5,
            cancellation_deadline_hours=24, day=3, icon="mountain", lat=15.4989, lng=73.8278,
        ),
        _make_node(
            GOA_TRIP_ID, id="goi-bom", category=NodeCategory.RETURN, label="Return", title="Goa → Mumbai",
            subtitle="13 Jan · Return journey", location="Goa (GOI)",
            scheduled_start=datetime(2026, 1, 13, 12, 30), scheduled_end=datetime(2026, 1, 13, 13, 45),
            flexible=False, provider="IndiGo", confirmation="6E-705", cost=2100,
            cancellation_policy="Refundable up to 24h before departure", refundable=True, refund_percentage=0.7,
            cancellation_deadline_hours=24, day=3, icon="plane", lat=15.3800, lng=73.8310,
            origin_code="GOI", destination_code="BOM",
        ),
    ]
    for n in nodes:
        db.add(n)
    db.flush()

    edges = [
        DependencyEdge(id="goa-e1", trip_id=GOA_TRIP_ID, source_id="bom-goi", target_id="goa-transfer",
                        dependency_type="hard", min_buffer_minutes=20, risk_buffer_minutes=15),
        DependencyEdge(id="goa-e2", trip_id=GOA_TRIP_ID, source_id="goa-transfer", target_id="beach-resort",
                        dependency_type="soft", min_buffer_minutes=0, risk_buffer_minutes=0),
        # Branch: two independent activities both depend on check-in, not on each other.
        DependencyEdge(id="goa-e3", trip_id=GOA_TRIP_ID, source_id="beach-resort", target_id="scuba-activity",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="start"),
        DependencyEdge(id="goa-e4", trip_id=GOA_TRIP_ID, source_id="beach-resort", target_id="sunset-cruise",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="start"),
        DependencyEdge(id="goa-e5", trip_id=GOA_TRIP_ID, source_id="beach-resort", target_id="goi-bom",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="end"),
    ]
    for e in edges:
        db.add(e)

    routes = {"bom-goi": "BOM → GOI", "goi-bom": "GOI → BOM"}
    for n in nodes:
        db.add(_make_booking(GOA_TRIP_ID, n, routes.get(n.id)))
    db.flush()
    return trip


def build_rajasthan_trip(db: Session, traveler_id: str) -> Trip:
    _clear_trip_data(db, RAJASTHAN_TRIP_ID)
    trip = db.get(Trip, RAJASTHAN_TRIP_ID)
    if trip is None:
        trip = Trip(id=RAJASTHAN_TRIP_ID, traveler_id=traveler_id)
        db.add(trip)

    trip.name = "Rajasthan Heritage Circuit"
    trip.route = "Delhi → Jaipur → Agra"
    trip.origin = "Delhi"
    trip.destination = "Agra"
    trip.start_date = "05 Feb 2026"
    trip.end_date = "09 Feb 2026"
    trip.trip_value = 38900
    trip.health_score = 90
    trip.status = TripStatus.OPERATIONAL

    nodes = [
        _make_node(
            RAJASTHAN_TRIP_ID, id="del-jaipur", category=NodeCategory.FLIGHT, label="DEL → JAI",
            title="Delhi → Jaipur", subtitle="Vistara UK-991", location="Delhi (DEL)",
            scheduled_start=datetime(2026, 2, 5, 9, 0), scheduled_end=datetime(2026, 2, 5, 10, 5),
            provider="Vistara", confirmation="UK-991", cost=5200,
            cancellation_policy="Refundable up to 24h before departure", refundable=True, refund_percentage=0.6,
            cancellation_deadline_hours=24, day=1, icon="plane", lat=28.5562, lng=77.1,
            origin_code="DEL", destination_code="JAI",
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="jaipur-hotel", category=NodeCategory.HOTEL, label="Jaipur Hotel",
            title="Fairmont Jaipur", subtitle="Check-in 11:00", location="Jaipur",
            scheduled_start=datetime(2026, 2, 5, 11, 0), scheduled_end=datetime(2026, 2, 7, 11, 0),
            flexible=True, fixed_end=True, provider="Fairmont Jaipur", confirmation="FMJ-3390", cost=13200,
            cancellation_policy="Free until 1 Feb. 1 night charge after.", refundable=True, refund_percentage=0.8,
            cancellation_deadline_hours=72, day=1, icon="bed", lat=26.9124, lng=75.7873,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="amber-fort", category=NodeCategory.ACTIVITY, label="Amber Fort",
            title="Amber Fort Tour", subtitle="6 Feb · 09:00 departure", location="Jaipur",
            scheduled_start=datetime(2026, 2, 6, 9, 0), scheduled_end=datetime(2026, 2, 6, 13, 0),
            flexible=False, provider="Rajasthan Heritage Tours", confirmation="RHT-201", cost=2400,
            cancellation_policy="Moderate. 50% refund within 24h.", refundable=True, refund_percentage=0.5,
            cancellation_deadline_hours=24, day=2, icon="mountain", lat=26.9855, lng=75.8513,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="city-palace", category=NodeCategory.ACTIVITY, label="City Palace",
            title="City Palace & Markets", subtitle="6 Feb · 14:00 departure", location="Jaipur",
            scheduled_start=datetime(2026, 2, 6, 14, 0), scheduled_end=datetime(2026, 2, 6, 17, 0),
            flexible=False, provider="Rajasthan Heritage Tours", confirmation="RHT-202", cost=1800,
            cancellation_policy="Moderate. 50% refund within 24h.", refundable=True, refund_percentage=0.5,
            cancellation_deadline_hours=24, day=2, icon="mountain", lat=26.9258, lng=75.8237,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="jaipur-agra-transfer", category=NodeCategory.TRANSFER, label="Jaipur → Agra",
            title="Jaipur → Agra Transfer", subtitle="7 Feb · 09:00 departure", location="Jaipur",
            scheduled_start=datetime(2026, 2, 7, 9, 0), scheduled_end=datetime(2026, 2, 7, 14, 0),
            flexible=True, provider="Rajasthan Roadways", confirmation="RR-664", cost=4800,
            cancellation_policy="Free cancellation up to 4h before", refundable=True, refund_percentage=0.7,
            cancellation_deadline_hours=4, day=3, icon="car", lat=26.9124, lng=75.7873,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="agra-hotel", category=NodeCategory.HOTEL, label="Agra Hotel",
            title="Oberoi Amarvilas", subtitle="Check-in 15:00", location="Agra",
            scheduled_start=datetime(2026, 2, 7, 15, 0), scheduled_end=datetime(2026, 2, 9, 11, 0),
            flexible=True, fixed_end=True, provider="Oberoi Amarvilas", confirmation="OAV-5510", cost=15800,
            cancellation_policy="Free until 3 Feb. 1 night charge after.", refundable=True, refund_percentage=0.8,
            cancellation_deadline_hours=72, day=3, icon="bed", lat=27.1740, lng=78.0421,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="taj-mahal", category=NodeCategory.ACTIVITY, label="Taj Mahal",
            title="Taj Mahal Sunrise Tour", subtitle="8 Feb · 06:00 departure", location="Agra",
            scheduled_start=datetime(2026, 2, 8, 6, 0), scheduled_end=datetime(2026, 2, 8, 9, 0),
            flexible=False, provider="Rajasthan Heritage Tours", confirmation="RHT-330", cost=2200,
            cancellation_policy="Strict. No refund within 24h.", refundable=False, refund_percentage=0.0,
            cancellation_deadline_hours=24, day=4, icon="mountain", lat=27.1751, lng=78.0421,
        ),
        _make_node(
            RAJASTHAN_TRIP_ID, id="agra-del-return", category=NodeCategory.RETURN, label="Return",
            title="Agra → Delhi", subtitle="9 Feb · Return journey", location="Agra",
            scheduled_start=datetime(2026, 2, 9, 12, 0), scheduled_end=datetime(2026, 2, 9, 15, 0),
            flexible=False, provider="Rajasthan Roadways", confirmation="RR-665", cost=3500,
            cancellation_policy="Free cancellation up to 4h before", refundable=True, refund_percentage=0.7,
            cancellation_deadline_hours=4, day=5, icon="car", lat=27.1740, lng=78.0421,
        ),
    ]
    for n in nodes:
        db.add(n)
    db.flush()

    edges = [
        DependencyEdge(id="raj-e1", trip_id=RAJASTHAN_TRIP_ID, source_id="del-jaipur", target_id="jaipur-hotel",
                        dependency_type="soft", min_buffer_minutes=30, risk_buffer_minutes=15),
        # Fork: two independent activities both depend on the hotel check-in.
        DependencyEdge(id="raj-e2", trip_id=RAJASTHAN_TRIP_ID, source_id="jaipur-hotel", target_id="amber-fort",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="start"),
        DependencyEdge(id="raj-e3", trip_id=RAJASTHAN_TRIP_ID, source_id="jaipur-hotel", target_id="city-palace",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="start"),
        # Join: the transfer needs BOTH activities to have concluded.
        DependencyEdge(id="raj-e4", trip_id=RAJASTHAN_TRIP_ID, source_id="amber-fort",
                        target_id="jaipur-agra-transfer", dependency_type="soft", min_buffer_minutes=0),
        DependencyEdge(id="raj-e5", trip_id=RAJASTHAN_TRIP_ID, source_id="city-palace",
                        target_id="jaipur-agra-transfer", dependency_type="soft", min_buffer_minutes=0),
        DependencyEdge(id="raj-e6", trip_id=RAJASTHAN_TRIP_ID, source_id="jaipur-agra-transfer",
                        target_id="agra-hotel", dependency_type="soft", min_buffer_minutes=0),
        DependencyEdge(id="raj-e7", trip_id=RAJASTHAN_TRIP_ID, source_id="agra-hotel", target_id="taj-mahal",
                        dependency_type="soft", min_buffer_minutes=0, upstream_reference="start"),
        DependencyEdge(id="raj-e8", trip_id=RAJASTHAN_TRIP_ID, source_id="agra-hotel",
                        target_id="agra-del-return", dependency_type="soft", min_buffer_minutes=0,
                        upstream_reference="end"),
    ]
    for e in edges:
        db.add(e)

    for n in nodes:
        db.add(_make_booking(RAJASTHAN_TRIP_ID, n))
    db.flush()
    return trip


def seed_if_empty(db: Session) -> None:
    existing = db.get(Traveler, DEFAULT_TRAVELER_ID)
    if existing is not None:
        return

    traveler = Traveler(
        id=DEFAULT_TRAVELER_ID,
        name="Aisha Khan",
        email="aisha.khan@email.com",
        home_airport="Mumbai (BOM)",
        loyalty_tier="Premium",
        password_hash=hash_password("triprescue-demo"),
    )
    db.add(traveler)
    db.flush()

    build_ladakh_trip(db, traveler.id)
    build_goa_trip(db, traveler.id)
    build_rajasthan_trip(db, traveler.id)
    db.commit()


def reset_trip(db: Session, trip_id: str) -> Trip | None:
    traveler_id = DEFAULT_TRAVELER_ID
    builders = {
        LADAKH_TRIP_ID: build_ladakh_trip,
        GOA_TRIP_ID: build_goa_trip,
        RAJASTHAN_TRIP_ID: build_rajasthan_trip,
    }
    builder = builders.get(trip_id)
    if builder is None:
        return None
    trip = builder(db, traveler_id)
    db.commit()
    return trip
