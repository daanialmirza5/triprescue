from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import ActivityEvent
from app.models.notification import Notification


class ActivityRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_trip(self, trip_id: str, limit: int = 100) -> list[ActivityEvent]:
        stmt = (
            select(ActivityEvent)
            .where(ActivityEvent.trip_id == trip_id)
            .order_by(ActivityEvent.timestamp.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt))

    def add(self, event: ActivityEvent) -> ActivityEvent:
        self.db.add(event)
        self.db.flush()
        return event


class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_trip(self, trip_id: str) -> list[Notification]:
        stmt = (
            select(Notification).where(Notification.trip_id == trip_id).order_by(Notification.timestamp.desc())
        )
        return list(self.db.scalars(stmt))

    def add(self, notification: Notification) -> Notification:
        self.db.add(notification)
        self.db.flush()
        return notification

    def mark_all_read(self, trip_id: str) -> None:
        for n in self.list_for_trip(trip_id):
            n.read = True
