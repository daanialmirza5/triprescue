from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import NotificationCategory, NotificationSeverity
from app.models.ids import generate_id


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("notif"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)

    severity: Mapped[NotificationSeverity] = mapped_column(Enum(NotificationSeverity), nullable=False)
    category: Mapped[NotificationCategory] = mapped_column(Enum(NotificationCategory), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    read: Mapped[bool] = mapped_column(Boolean, default=False)

    trip: Mapped["Trip"] = relationship(back_populates="notifications")
