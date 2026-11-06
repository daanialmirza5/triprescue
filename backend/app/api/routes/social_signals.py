from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.schemas.social_signals import SocialSignalsOut
from app.services import social_signals_service, trip_service

router = APIRouter(prefix="/api/trips/{trip_id}", tags=["social-signals"])


@router.get("/social-signals", response_model=SocialSignalsOut)
def social_signals(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Ground/crowd signals at the trip's hubs, synthesized from live weather (labelled simulated)."""
    try:
        return social_signals_service.trip_signals(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
