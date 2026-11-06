from sqlalchemy import JSON, Boolean, String, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.ids import generate_id

DEFAULT_PREFERENCES = {
    "costVsSpeed": 50,
    "disruptionVsComfort": 50,
    "recoveryPriorities": {
        "minimizeCost": False,
        "minimizeTime": False,
        "minimizeDisruption": True,
        "maximizeComfort": False,
    },
}


class Traveler(Base):
    __tablename__ = "travelers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("traveler"))
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    home_airport: Mapped[str] = mapped_column(String, default="")
    loyalty_tier: Mapped[str] = mapped_column(String, default="Standard")
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    preferences: Mapped[dict] = mapped_column(JSON, default=lambda: dict(DEFAULT_PREFERENCES))
    # Per-traveler consent for notification emails. Defaults on (these are
    # transactional alerts about the traveler's own trips); the global
    # EMAIL_NOTIFICATIONS_ENABLED setting must also be on for anything to send.
    email_notifications_opt_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default=true())

    trips: Mapped[list["Trip"]] = relationship(back_populates="traveler", cascade="all, delete-orphan")
