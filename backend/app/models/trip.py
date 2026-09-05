from sqlalchemy import Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import TripStatus
from app.models.ids import generate_id


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("trip"))
    traveler_id: Mapped[str] = mapped_column(ForeignKey("travelers.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    route: Mapped[str] = mapped_column(String, nullable=False)
    origin: Mapped[str] = mapped_column(String, nullable=False)
    destination: Mapped[str] = mapped_column(String, nullable=False)
    start_date: Mapped[str] = mapped_column(String, nullable=False)
    end_date: Mapped[str] = mapped_column(String, nullable=False)
    trip_value: Mapped[float] = mapped_column(Float, default=0)
    health_score: Mapped[int] = mapped_column(Integer, default=100)
    status: Mapped[TripStatus] = mapped_column(Enum(TripStatus), default=TripStatus.OPERATIONAL)

    traveler: Mapped["Traveler"] = relationship(back_populates="trips")
    nodes: Mapped[list["ItineraryNode"]] = relationship(
        back_populates="trip", cascade="all, delete-orphan", order_by="ItineraryNode.scheduled_start"
    )
    edges: Mapped[list["DependencyEdge"]] = relationship(back_populates="trip", cascade="all, delete-orphan")
    disruptions: Mapped[list["Disruption"]] = relationship(back_populates="trip", cascade="all, delete-orphan")
    recovery_plans: Mapped[list["RecoveryPlan"]] = relationship(back_populates="trip", cascade="all, delete-orphan")
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        back_populates="trip", cascade="all, delete-orphan", order_by="ActivityEvent.timestamp.desc()"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="trip", cascade="all, delete-orphan", order_by="Notification.timestamp.desc()"
    )
    risk_snapshots: Mapped[list["RiskSnapshot"]] = relationship(back_populates="trip", cascade="all, delete-orphan")
