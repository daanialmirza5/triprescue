from datetime import datetime

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import RiskLevel, SnapshotType
from app.models.ids import generate_id


class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("risk"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)
    node_id: Mapped[str | None] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=True)

    snapshot_type: Mapped[SnapshotType] = mapped_column(Enum(SnapshotType), default=SnapshotType.NODE)
    risk_type: Mapped[str] = mapped_column(String, default="")
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), default=RiskLevel.LOW)
    risk_percent: Mapped[int] = mapped_column(Integer, default=0)
    reason: Mapped[str] = mapped_column(String, default="")
    contributing_factors: Mapped[list] = mapped_column(JSON, default=list)
    recommendation: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    trip: Mapped["Trip"] = relationship(back_populates="risk_snapshots")
    node: Mapped["ItineraryNode | None"] = relationship()
