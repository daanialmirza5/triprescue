from sqlalchemy import JSON, String
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

    trips: Mapped[list["Trip"]] = relationship(back_populates="traveler", cascade="all, delete-orphan")
