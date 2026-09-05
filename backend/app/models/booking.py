from sqlalchemy import Boolean, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import NodeCategory, NodeStatus
from app.models.ids import generate_id


class Booking(Base):
    """The commercial booking record backing a purchasable itinerary node."""

    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("bk"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)
    node_id: Mapped[str] = mapped_column(ForeignKey("itinerary_nodes.id"), unique=True, nullable=False)

    category: Mapped[NodeCategory] = mapped_column(Enum(NodeCategory), nullable=False)
    provider: Mapped[str] = mapped_column(String, default="")
    confirmation: Mapped[str] = mapped_column(String, default="")
    cost: Mapped[float] = mapped_column(Float, default=0)
    refundable: Mapped[bool] = mapped_column(Boolean, default=False)
    cancellation_policy: Mapped[str] = mapped_column(String, default="")
    status: Mapped[NodeStatus] = mapped_column(Enum(NodeStatus), default=NodeStatus.HEALTHY)
    risk_level: Mapped[int] = mapped_column(Integer, default=0)
    route: Mapped[str | None] = mapped_column(String, nullable=True)

    trip: Mapped["Trip"] = relationship()
    node: Mapped["ItineraryNode"] = relationship(back_populates="booking")
