from datetime import datetime
from app.core.datetime_utils import utcnow_naive

from sqlalchemy import DateTime, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.ids import generate_id


class ExternalItemLink(Base):
    """Which itinerary node came from which live/discovery provider record.

    A separate table (rather than new columns on itinerary_nodes) so existing
    databases pick it up without touching existing tables. `(trip_id, source,
    external_id)` is unique - that is what prevents duplicate adds. Links whose
    node was later deleted are treated as stale and cleaned up on the next add.
    """

    __tablename__ = "external_item_links"
    __table_args__ = (UniqueConstraint("trip_id", "source", "external_id", name="uq_external_item_trip_source_id"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: generate_id("xlink"))
    trip_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    node_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String, nullable=False)  # flight | train | hotel | attraction | event
    source: Mapped[str] = mapped_column(String, nullable=False)  # aviationstack | railradar | openstreetmap | ticketmaster
    external_id: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow_naive)
