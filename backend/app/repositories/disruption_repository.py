from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.disruption import Disruption
from app.core.pipeline_trace import traced


class DisruptionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, disruption_id: str) -> Disruption | None:
        return self.db.get(Disruption, disruption_id)

    @traced("database", "Read active disruption", detail=lambda r, a, k: {"operation": "read", "table": "disruptions", "rows": int(r is not None)})
    def latest_unresolved(self, trip_id: str) -> Disruption | None:
        stmt = (
            select(Disruption)
            .where(Disruption.trip_id == trip_id, Disruption.resolved == False)  # noqa: E712
            .order_by(Disruption.detected_at.desc())
        )
        return self.db.scalars(stmt).first()

    def save(self, disruption: Disruption) -> Disruption:
        self.db.add(disruption)
        self.db.flush()
        return disruption
