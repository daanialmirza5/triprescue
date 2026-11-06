from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.risk import RiskSnapshot


class RiskSnapshotRepository:
    def __init__(self, db: Session):
        self.db = db

    def latest_for_trip(self, trip_id: str) -> list[RiskSnapshot]:
        rn_col = (
            func.row_number()
            .over(
                partition_by=(RiskSnapshot.node_id, RiskSnapshot.risk_type),
                order_by=(RiskSnapshot.created_at.desc(), RiskSnapshot.id.desc()),
            )
            .label("rn")
        )
        subq = (
            select(RiskSnapshot.id, rn_col)
            .where(RiskSnapshot.trip_id == trip_id)
            .subquery()
        )
        stmt = (
            select(RiskSnapshot)
            .join(subq, RiskSnapshot.id == subq.c.id)
            .where(subq.c.rn == 1)
        )
        return list(self.db.scalars(stmt))

    def save_batch(self, snapshots: list[RiskSnapshot]) -> None:
        self.db.add_all(snapshots)
        self.db.flush()
