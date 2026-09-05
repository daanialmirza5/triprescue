from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import ChangeType, RiskLevel
from app.models.ids import generate_id


class RecoveryPlan(Base):
    __tablename__ = "recovery_plans"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("recovery"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)
    disruption_id: Mapped[str] = mapped_column(ForeignKey("disruptions.id"), nullable=False)

    name: Mapped[str] = mapped_column(String, nullable=False)
    tag: Mapped[str] = mapped_column(String, default="")
    tag_color: Mapped[str] = mapped_column(String, default="cyan")
    description: Mapped[str] = mapped_column(String, default="")

    cost_delta: Mapped[float] = mapped_column(Float, default=0)
    time_impact_minutes: Mapped[int] = mapped_column(Integer, default=0)
    bookings_preserved: Mapped[int] = mapped_column(Integer, default=0)
    total_bookings: Mapped[int] = mapped_column(Integer, default=0)
    refund_recovered: Mapped[float] = mapped_column(Float, default=0)
    residual_risk: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), default=RiskLevel.LOW)

    score: Mapped[int] = mapped_column(Integer, default=0)
    score_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)
    explanation: Mapped[str] = mapped_column(String, default="")

    feasible: Mapped[bool] = mapped_column(Boolean, default=True)
    applied: Mapped[bool] = mapped_column(Boolean, default=False)
    applied_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    trip: Mapped["Trip"] = relationship(back_populates="recovery_plans")
    disruption: Mapped["Disruption"] = relationship(back_populates="recovery_plans")
    actions: Mapped[list["RecoveryAction"]] = relationship(
        back_populates="recovery_plan", cascade="all, delete-orphan"
    )


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("action"))
    recovery_plan_id: Mapped[str] = mapped_column(ForeignKey("recovery_plans.id"), nullable=False)
    node_id: Mapped[str] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=False)

    change_type: Mapped[ChangeType] = mapped_column(Enum(ChangeType), nullable=False)
    description: Mapped[str] = mapped_column(String, default="")

    new_scheduled_start: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    new_scheduled_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    new_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    new_provider: Mapped[str | None] = mapped_column(String, nullable=True)
    new_confirmation: Mapped[str | None] = mapped_column(String, nullable=True)

    recovery_plan: Mapped["RecoveryPlan"] = relationship(back_populates="actions")
    node: Mapped["ItineraryNode"] = relationship()
