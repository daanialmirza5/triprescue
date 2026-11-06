from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.config import get_settings
from app.core.rate_limiting import limiter
from app.database.session import get_db
from app.schemas.recovery import ApplyRecoveryRequest, ApplyRecoveryResult, RecoveryOptionOut
from app.services import recovery_service, trip_service

router = APIRouter(prefix="/api/trips/{trip_id}", tags=["recovery"])


@router.post("/recovery-options/generate", response_model=list[RecoveryOptionOut])
@limiter.limit(lambda: get_settings().recovery_rate_limit)
def generate_recovery_options(
    trip_id: str, request: Request, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)
):
    try:
        return recovery_service.generate_recovery_options(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except recovery_service.NoActiveDisruptionError:
        raise HTTPException(status_code=400, detail="No active disruption for this trip.")


@router.get("/recovery-options", response_model=list[RecoveryOptionOut])
def list_recovery_options(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Plans already generated for the active disruption (read-only)."""
    try:
        return recovery_service.list_recovery_options(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/recovery/apply", response_model=ApplyRecoveryResult)
@limiter.limit(lambda: get_settings().recovery_rate_limit)
def apply_recovery(
    trip_id: str,
    payload: ApplyRecoveryRequest,
    request: Request,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        trip, plan, activity, notification = recovery_service.apply_recovery(db, trip_id, payload.recovery_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except recovery_service.RecoveryPlanNotFoundError:
        raise HTTPException(status_code=404, detail=f"Recovery plan '{payload.recovery_id}' not found")
    except (recovery_service.RecoveryPlanUnavailableError, recovery_service.RecoveryPlanConflictError) as exc:
        raise HTTPException(status_code=409, detail=str(exc))

    from app.schemas.activity import ActivityEventOut
    from app.schemas.notification import NotificationOut
    from app.services.converters import format_time

    return ApplyRecoveryResult(
        trip=trip,
        applied_recovery=plan,
        activity_event=ActivityEventOut(
            id=activity.id, timestamp=format_time(activity.timestamp), type=activity.type.value,
            message=activity.message, detail=activity.detail,
        ),
        notification=NotificationOut(
            id=notification.id, severity=notification.severity.value, category=notification.category.value,
            title=notification.title, message=notification.message, timestamp=format_time(notification.timestamp),
            read=notification.read,
        ),
    )
