from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.recovery import RecoveryPlan


class RecoveryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, plan_id: str) -> RecoveryPlan | None:
        return self.db.get(RecoveryPlan, plan_id)

    def list_for_disruption(self, disruption_id: str) -> list[RecoveryPlan]:
        stmt = select(RecoveryPlan).where(RecoveryPlan.disruption_id == disruption_id)
        return list(self.db.scalars(stmt))

    def save(self, plan: RecoveryPlan) -> RecoveryPlan:
        self.db.add(plan)
        self.db.flush()
        return plan
