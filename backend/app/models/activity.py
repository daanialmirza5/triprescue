from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import ActivityType
from app.models.ids import generate_id


class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("evt"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)

    type: Mapped[ActivityType] = mapped_column(Enum(ActivityType), nullable=False)
    message: Mapped[str] = mapped_column(String, nullable=False)
    detail: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    trip: Mapped["Trip"] = relationship(back_populates="activity_events")
