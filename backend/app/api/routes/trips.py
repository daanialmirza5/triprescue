from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.config import get_settings
from app.core.rate_limiting import limiter
from app.database.session import get_db
from app.providers.geocoding_provider import NominatimGeocodingProvider
from app.schemas.base import CamelModel
from app.schemas.activity import ActivityEventOut
from app.schemas.common import TravelerPreferences
from app.schemas.notification import NotificationOut
from app.schemas.risk import RiskAnalysisOut
from app.schemas.trip import BookingOut, NodeCreateRequest, TripCreateRequest, TripExportOut, TripOut, TripSummaryOut
from app.services.converters import format_time
from app.services import risk_prediction_service, risk_service, trip_service

router = APIRouter(prefix="/api/trips", tags=["trips"])
# Geocoding isn't trip-scoped, so it lives on its own router to get the
# /api/geocode path rather than /api/trips/geocode.
geocode_router = APIRouter(prefix="/api", tags=["geocoding"])
_geocoding_provider = NominatimGeocodingProvider(
    timeout_seconds=get_settings().geocoding_request_timeout_seconds, contact=get_settings().geocoding_contact
)


class GeocodeRequest(CamelModel):
    query: str = Field(min_length=1, max_length=300)


class GeocodeResponse(CamelModel):
    lat: float
    lng: float


@geocode_router.post("/geocode", response_model=GeocodeResponse)
@limiter.limit(lambda: get_settings().disruption_rate_limit)
def geocode(payload: GeocodeRequest, request: Request, traveler_id: str = Depends(get_current_traveler_id)):
    coords = _geocoding_provider.geocode(payload.query)
    if coords is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return GeocodeResponse(lat=coords[0], lng=coords[1])


@router.get("", response_model=list[TripSummaryOut])
def list_trips(db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    return trip_service.list_trip_summaries(db, traveler_id)


@router.post("", response_model=TripOut, status_code=201)
def create_trip(
    request: TripCreateRequest,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    # traveler_id comes exclusively from the auth dependency above - never
    # from `request`, which has no traveler/owner field at all - so a client
    # cannot create a trip on another traveler's behalf.
    return trip_service.create_trip(
        db,
        traveler_id,
        request.name,
        request.origin,
        request.destination,
        request.start_date,
        request.end_date,
    )


@router.post("/{trip_id}/nodes", response_model=TripOut, status_code=201)
def add_node(
    trip_id: str,
    request: NodeCreateRequest,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        return trip_service.add_node(db, trip_id, traveler_id, request)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.delete("/{trip_id}/nodes/{node_id}", response_model=TripOut)
def delete_node(
    trip_id: str,
    node_id: str,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        return trip_service.delete_node(db, trip_id, node_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except trip_service.NodeNotFoundError:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found in trip '{trip_id}'")


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


@router.get("/{trip_id}/export", response_model=TripExportOut)
def export_trip(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return trip_service.export_trip(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.get("/{trip_id}/risks", response_model=RiskAnalysisOut)
def get_trip_risks(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        trip_service.get_trip(db, trip_id, traveler_id)
        return risk_service.get_risk_analysis(db, trip_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/{trip_id}/risk/poll-once", response_model=list[NotificationOut])
def poll_risk_once(
    trip_id: str,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    try:
        trip = trip_service.get_trip(db, trip_id, traveler_id)
        result = risk_prediction_service.predict_trip(db, trip)
        notifications = result if isinstance(result, list) else ([result] if result is not None else [])
        return [
            NotificationOut(
                id=n.id,
                severity=n.severity.value,
                category=n.category.value,
                title=n.title,
                message=n.message,
                timestamp=format_time(n.timestamp),
                read=n.read,
            )
            for n in notifications
        ]
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
