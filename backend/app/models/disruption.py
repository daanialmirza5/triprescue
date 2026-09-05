from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import DisruptionType, ImpactLevel
from app.models.ids import generate_id


class Disruption(Base):
    __tablename__ = "disruptions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("disruption"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)

    type: Mapped[DisruptionType] = mapped_column(Enum(DisruptionType), nullable=False)
    label: Mapped[str] = mapped_column(String, nullable=False)
    primary_node_id: Mapped[str] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=False)
    delay_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    impact_level: Mapped[ImpactLevel] = mapped_column(Enum(ImpactLevel), default=ImpactLevel.LOW)
    direct_impact: Mapped[int] = mapped_column(Integer, default=0)
    downstream_impact: Mapped[int] = mapped_column(Integer, default=0)
    financial_exposure: Mapped[float] = mapped_column(Float, default=0)
    refund_exposure: Mapped[float] = mapped_column(Float, default=0)

    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)

    trip: Mapped["Trip"] = relationship(back_populates="disruptions")
    primary_node: Mapped["ItineraryNode"] = relationship()
    cascade_steps: Mapped[list["CascadeStep"]] = relationship(
        back_populates="disruption", cascade="all, delete-orphan", order_by="CascadeStep.sequence_order"
    )
    recovery_plans: Mapped[list["RecoveryPlan"]] = relationship(back_populates="disruption")


class CascadeStep(Base):
    __tablename__ = "cascade_steps"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("cascade"))
    disruption_id: Mapped[str] = mapped_column(ForeignKey("disruptions.id"), nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str] = mapped_column(String, nullable=False)
    node_id: Mapped[str | None] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=True)
    timestamp: Mapped[str] = mapped_column(String, default="")

    disruption: Mapped["Disruption"] = relationship(back_populates="cascade_steps")
