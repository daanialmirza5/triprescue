from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import NodeCategory, NodeStatus
from app.models.ids import generate_id


class ItineraryNode(Base):
    """A single stop/booking in the itinerary dependency graph."""

    __tablename__ = "itinerary_nodes"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("node"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)

    category: Mapped[NodeCategory] = mapped_column(Enum(NodeCategory), nullable=False)
    label: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    subtitle: Mapped[str] = mapped_column(String, default="")
    location: Mapped[str] = mapped_column(String, default="")

    scheduled_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    actual_start: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    actual_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Whether this node's own timing can flex to absorb upstream delay (e.g. a hotel
    # check-in window) vs. being fixed to a hard external schedule (e.g. a flight departure).
    flexible: Mapped[bool] = mapped_column(Boolean, default=False)
    fixed_end: Mapped[bool] = mapped_column(Boolean, default=False)

    provider: Mapped[str] = mapped_column(String, default="")
    confirmation: Mapped[str | None] = mapped_column(String, nullable=True)
    cost: Mapped[float] = mapped_column(Float, default=0)
    cancellation_policy: Mapped[str] = mapped_column(String, default="")
    refundable: Mapped[bool] = mapped_column(Boolean, default=False)
    refund_percentage: Mapped[float] = mapped_column(Float, default=0)
    cancellation_deadline_hours: Mapped[int] = mapped_column(Integer, default=0)

    risk_level: Mapped[int] = mapped_column(Integer, default=0)
    dependency_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[NodeStatus] = mapped_column(Enum(NodeStatus), default=NodeStatus.HEALTHY)
    status_reason: Mapped[str | None] = mapped_column(String, nullable=True)
    caused_by: Mapped[str | None] = mapped_column(String, nullable=True)

    day: Mapped[int] = mapped_column(Integer, default=1)
    icon: Mapped[str] = mapped_column(String, default="map-pin")
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    origin_code: Mapped[str | None] = mapped_column(String, nullable=True)
    destination_code: Mapped[str | None] = mapped_column(String, nullable=True)

    trip: Mapped["Trip"] = relationship(back_populates="nodes")
    booking: Mapped["Booking | None"] = relationship(
        back_populates="node", cascade="all, delete-orphan", uselist=False
    )
    outgoing_edges: Mapped[list["DependencyEdge"]] = relationship(
        back_populates="source", foreign_keys="DependencyEdge.source_id", cascade="all, delete-orphan"
    )
    incoming_edges: Mapped[list["DependencyEdge"]] = relationship(
        back_populates="target", foreign_keys="DependencyEdge.target_id"
    )
