from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.schemas.recovery import ApplyRecoveryRequest, ApplyRecoveryResult, RecoveryOptionOut
from app.services import recovery_service, trip_service

router = APIRouter(prefix="/api/trips/{trip_id}", tags=["recovery"])


@router.post("/recovery-options/generate", response_model=list[RecoveryOptionOut])
def generate_recovery_options(
    trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)
):
    try:
        return recovery_service.generate_recovery_options(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except recovery_service.NoActiveDisruptionError:
        raise HTTPException(status_code=400, detail="No active disruption for this trip.")


@router.post("/recovery/apply", response_model=ApplyRecoveryResult)
def apply_recovery(
    trip_id: str,
    request: ApplyRecoveryRequest,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        trip, plan, activity, notification = recovery_service.apply_recovery(db, trip_id, request.recovery_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except recovery_service.RecoveryPlanNotFoundError:
        raise HTTPException(status_code=404, detail=f"Recovery plan '{request.recovery_id}' not found")

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
