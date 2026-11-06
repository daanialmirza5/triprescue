"""Background risk prediction.

Every RISK_PREDICTION_INTERVAL_MINUTES the scheduler re-scores every active
trip (DISRUPTED and RECOVERED trips are skipped - an open disruption already
has the traveler's attention), compares the result
with the trip's latest RiskSnapshots and raises a RISK notification plus a
MONITORING activity event when things got worse:

- a risk card that wasn't there before, or one whose percentage rose >= 10;
- the trip's overall weather risk rising >= 15 points.

The first cycle for a trip only records a baseline. Each cycle appends a new
batch of snapshots, so RiskSnapshotRepository.latest_for_trip() always holds
the most recent reading per (node, risk type). One trip's failure is logged and
skipped; it never stops the other trips or the loop.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from app.core.datetime_utils import utcnow_naive

from sqlalchemy.orm import Session

from app.models.activity import ActivityEvent
from app.models.enums import ActivityType, NotificationCategory, NotificationSeverity, RiskLevel, SnapshotType
from app.models.notification import Notification
from app.models.risk import RiskSnapshot
from app.models.trip import Trip
from app.repositories.activity_repository import ActivityRepository, NotificationRepository
from app.repositories.risk_snapshot_repository import RiskSnapshotRepository
from app.repositories.trip_repository import TripRepository
from app.services.risk_service import get_risk_analysis

logger = logging.getLogger("safarsathi.risk_prediction")

CARD_WORSENING_POINTS = 10
WEATHER_WORSENING_POINTS = 15

def _level(value: str) -> RiskLevel:
    value = value.lower()
    return RiskLevel(value) if value in RiskLevel._value2member_map_ else RiskLevel.LOW


def predict_trip(db: Session, trip: Trip) -> list[Notification]:
    """Re-score one trip against its latest snapshots, record the new
    snapshots and return the notifications raised (if risk worsened)."""
    from app.models.enums import TripStatus

    if trip.status in (TripStatus.DISRUPTED, TripStatus.RECOVERED):
        return []

    snapshot_repo = RiskSnapshotRepository(db)
    analysis = get_risk_analysis(db, trip.id)
    last = snapshot_repo.latest_for_trip(trip.id)
    last_cards = {(s.node_id, s.risk_type): s for s in last if s.node_id is not None}
    last_weather = next((s for s in last if s.snapshot_type == SnapshotType.TRIP and s.risk_type == "weather_risk"), None)

    reasons: list[str] = []
    high = False
    if last:
        for card in analysis.cards:
            prior = last_cards.get((card.node_id, card.risk_type))
            if prior is None:
                reasons.append(f"{card.node_label}: new risk card ({card.risk_type}, {card.risk_percent}%)")
            elif card.risk_percent - prior.risk_percent >= CARD_WORSENING_POINTS:
                reasons.append(
                    f"{card.node_label}: {card.risk_type} increased by {card.risk_percent - prior.risk_percent}% (now {card.risk_percent}%)"
                )
            else:
                continue
            high = high or card.risk_percent >= 50 or card.risk_level.lower() == "high"
        if last_weather is not None:
            diff = analysis.score.weather_risk - last_weather.risk_percent
            if diff >= WEATHER_WORSENING_POINTS:
                reasons.append(f"Overall weather risk increased by {diff}% (now {analysis.score.weather_risk}%)")
                high = high or analysis.score.weather_risk >= 50

    notifications: list[Notification] = []
    now = utcnow_naive()
    if reasons:
        summary = "; ".join(reasons)
        notification = Notification(
            trip_id=trip.id,
            severity=NotificationSeverity.HIGH if high else NotificationSeverity.MEDIUM,
            category=NotificationCategory.RISK,
            title="Risk level increased",
            message=summary,
            timestamp=now,
        )
        NotificationRepository(db).add(notification)
        ActivityRepository(db).add(
            ActivityEvent(trip_id=trip.id, type=ActivityType.MONITORING, message="Elevated risk detected", detail=summary, timestamp=now)
        )
        notifications.append(notification)

    snapshots = [
        RiskSnapshot(
            trip_id=trip.id,
            node_id=card.node_id,
            snapshot_type=SnapshotType.NODE,
            risk_type=card.risk_type,
            risk_level=_level(card.risk_level),
            risk_percent=card.risk_percent,
            reason=card.node_label,
            recommendation=card.recommendation or "",
            created_at=now,
        )
        for card in analysis.cards
    ]
    weather = analysis.score.weather_risk
    snapshots.append(
        RiskSnapshot(
            trip_id=trip.id,
            node_id=None,
            snapshot_type=SnapshotType.TRIP,
            risk_type="weather_risk",
            risk_level=RiskLevel.HIGH if weather >= 60 else RiskLevel.MEDIUM if weather >= 30 else RiskLevel.LOW,
            risk_percent=weather,
            reason="Trip weather risk score",
            recommendation="",
            created_at=now,
        )
    )
    snapshot_repo.save_batch(snapshots)
    db.commit()
    return notifications


def run_risk_prediction_cycle(db: Session, trip_id: str | None = None) -> list[Notification]:
    """Scan one trip (`trip_id`) or every active trip once; returns the
    notifications raised."""
    repo = TripRepository(db)
    if trip_id is not None:
        trips = [t for t in [repo.get(trip_id)] if t is not None]
    else:
        trips = repo.list_active()
    raised: list[Notification] = []
    failed = 0
    for trip in trips:
        try:
            res = predict_trip(db, trip)
            if isinstance(res, list):
                raised.extend(res)
            elif res is not None:
                raised.append(res)
        except Exception:
            db.rollback()
            failed += 1
            logger.warning("Risk prediction failed for trip %s", trip.id, exc_info=True)
    logger.info("Risk prediction cycle complete", extra={"scanned": len(trips), "alerts": len(raised), "failed": failed})
    return raised


async def risk_prediction_loop(session_factory, interval_minutes: int, stop: asyncio.Event) -> None:
    """Run cycles until `stop` is set. The DB work happens in a worker thread so
    the event loop keeps serving requests."""
    interval = max(1, interval_minutes) * 60

    def one_cycle() -> None:
        db = session_factory()
        try:
            run_risk_prediction_cycle(db)
        finally:
            db.close()

    while not stop.is_set():
        try:
            await asyncio.to_thread(one_cycle)
        except Exception:
            logger.warning("Risk prediction cycle crashed", exc_info=True)
        try:
            await asyncio.wait_for(stop.wait(), timeout=interval)
        except asyncio.TimeoutError:
            continue
