from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import DependencyType, EdgeStatus
from app.models.ids import generate_id


class DependencyEdge(Base):
    """A directed dependency between two itinerary nodes.

    HARD edges represent constraints that make the target infeasible outright when
    violated (e.g. a flight connection). SOFT edges represent sequencing that can
    absorb delay up to a point before only becoming at-risk (e.g. a hotel check-in).
    """

    __tablename__ = "dependency_edges"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("edge"))
    trip_id: Mapped[str] = mapped_column(ForeignKey("trips.id"), nullable=False)
    source_id: Mapped[str] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=False)
    target_id: Mapped[str] = mapped_column(ForeignKey("itinerary_nodes.id"), nullable=False)

    dependency_type: Mapped[DependencyType] = mapped_column(Enum(DependencyType), default=DependencyType.SOFT)
    min_buffer_minutes: Mapped[int] = mapped_column(Integer, default=0)
    risk_buffer_minutes: Mapped[int] = mapped_column(Integer, default=0)
    upstream_reference: Mapped[str] = mapped_column(String, default="end")

    status: Mapped[EdgeStatus] = mapped_column(Enum(EdgeStatus), default=EdgeStatus.HEALTHY)
    label: Mapped[str | None] = mapped_column(String, nullable=True)
    animated: Mapped[bool] = mapped_column(Boolean, default=False)

    trip: Mapped["Trip"] = relationship(back_populates="edges")
    source: Mapped["ItineraryNode"] = relationship(foreign_keys=[source_id], back_populates="outgoing_edges")
    target: Mapped["ItineraryNode"] = relationship(foreign_keys=[target_id], back_populates="incoming_edges")
