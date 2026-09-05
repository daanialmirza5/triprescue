from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.schemas.activity import ActivityEventOut
from app.schemas.common import TravelerPreferences
from app.schemas.notification import NotificationOut
from app.schemas.risk import RiskAnalysisOut
from app.schemas.trip import BookingOut, TripOut, TripSummaryOut
from app.services import risk_service, trip_service

router = APIRouter(prefix="/api/trips", tags=["trips"])


@router.get("", response_model=list[TripSummaryOut])
def list_trips(db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    return trip_service.list_trip_summaries(db, traveler_id)


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.get_trip_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/graph", response_model=TripOut)
def get_trip_graph(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Same payload as GET /trips/{id} - nodes+edges ARE the graph; kept as a
    distinct endpoint since the frontend graph view addresses it separately."""
    try:
        return trip_service.get_trip_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/risks", response_model=RiskAnalysisOut)
def get_trip_risks(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        trip_service.get_trip(db, trip_id, traveler_id)
        return risk_service.get_risk_analysis(db, trip_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/bookings", response_model=list[BookingOut])
def get_trip_bookings(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.get_bookings_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/activity", response_model=list[ActivityEventOut])
def get_trip_activity(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.get_activity_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/notifications", response_model=list[NotificationOut])
def get_trip_notifications(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.get_notifications_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/{trip_id}/notifications/read", status_code=204)
def mark_notifications_read(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        trip_service.mark_notifications_read(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/preferences", response_model=TravelerPreferences)
def get_preferences(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.get_preferences(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/{trip_id}/preferences", status_code=204)
def set_preferences(
    trip_id: str,
    preferences: TravelerPreferences,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        trip_service.set_preferences(db, trip_id, preferences, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/{trip_id}/reset", response_model=TripOut)
def reset_trip(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.reset_trip_out(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found or cannot be reset")
