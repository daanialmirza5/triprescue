import html
import logging

from sqlalchemy import event, select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.activity import ActivityEvent
from app.models.notification import Notification
from app.repositories.trip_repository import TripRepository
from app.services.email_service import send_notification_email

logger = logging.getLogger("safarsathi.email")

# Notification emails queued on a session, sent only once that session's
# transaction commits - so a rolled-back notification never emails anyone.
_PENDING_EMAILS_KEY = "pending_notification_emails"


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
        self._queue_email(notification)
        return notification

    def _queue_email(self, notification: Notification) -> None:
        # Email is a side effect: nothing here may fail the notification write.
        if not get_settings().email_notifications_enabled:
            return
        try:
            # Look the recipient up now - SQL can't be emitted from after_commit.
            trip = TripRepository(self.db).get(notification.trip_id)
            if trip is None or not trip.traveler.email or not trip.traveler.email_notifications_opt_in:
                return
            body = f"<p>{html.escape(notification.message)}</p>"
            self.db.info.setdefault(_PENDING_EMAILS_KEY, []).append((trip.traveler.email, notification.title, body))
        except Exception:
            logger.warning("Could not queue email for notification %s.", notification.id, exc_info=True)

    def mark_all_read(self, trip_id: str) -> None:
        for n in self.list_for_trip(trip_id):
            n.read = True


@event.listens_for(Session, "after_commit")
def _send_pending_notification_emails(session: Session) -> None:
    for to_email, subject, body in session.info.pop(_PENDING_EMAILS_KEY, []):
        try:
            send_notification_email(to_email, subject, body)
        except Exception:
            logger.warning("Notification email to %s raised unexpectedly.", to_email, exc_info=True)


@event.listens_for(Session, "after_rollback")
def _discard_pending_notification_emails(session: Session) -> None:
    session.info.pop(_PENDING_EMAILS_KEY, None)
