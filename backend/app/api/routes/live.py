"""Live travel data: flights (Aviationstack), Indian trains (RailRadar),
hotels + attractions (OpenStreetMap/Overpass), events (Ticketmaster), India
destination discovery, and adding any of them to an existing trip.

Provider failures map to friendly messages (see providers/live/common.py);
nothing ever falls back to simulated data.
"""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.providers.live import LiveProviderError, registry
from app.schemas.live import (
    AttractionOut,
    DestinationOut,
    ExternalItemAddOut,
    ExternalItemCreate,
    ExternalItemLinkOut,
    HotelOut,
    LiveHealthOut,
    LiveTransportOut,
    TrackedTransportOut,
    TrainsBetweenResultOut,
    TravelEventOut,
)
from app.services import live_travel_service, trip_service

router = APIRouter(prefix="/api", tags=["live-travel"])


def _fail(exc: LiveProviderError) -> HTTPException:
    return HTTPException(status_code=exc.http_status, detail=exc.message)


# ---- Live transport ---------------------------------------------------------------------


@router.get("/live/health", response_model=LiveHealthOut)
def live_health():
    return live_travel_service.health()


@router.get("/live/flights", response_model=list[LiveTransportOut])
def search_flights(
    flight_number: str | None = Query(default=None, alias="flightNumber", max_length=10),
    dep: str | None = Query(default=None, max_length=3, description="Departure airport IATA code"),
    arr: str | None = Query(default=None, max_length=3, description="Arrival airport IATA code"),
    limit: int = Query(default=20, ge=1, le=50),
    _traveler: str = Depends(get_current_traveler_id),
):
    if not (flight_number or dep or arr):
        raise HTTPException(status_code=400, detail="Search by flight number or by departure/arrival airport.")
    try:
        return registry().flights.search(flight_number=flight_number, dep_iata=dep, arr_iata=arr, limit=limit)
    except LiveProviderError as exc:
        raise _fail(exc)


@router.get("/live/flights/{flight_number}", response_model=LiveTransportOut)
def get_flight(flight_number: str, flight_date: str | None = Query(default=None, alias="date"), _traveler: str = Depends(get_current_traveler_id)):
    try:
        return registry().flights.get_flight(flight_number, flight_date)
    except LiveProviderError as exc:
        raise _fail(exc)


# `between` is declared before `{train_number}` so it isn't captured as a number.
@router.get("/live/trains/between", response_model=TrainsBetweenResultOut)
def trains_between(
    origin: str = Query(..., alias="from", max_length=5),
    destination: str = Query(..., alias="to", max_length=5),
    journey_date: str | None = Query(default=None, alias="date"),
    _traveler: str = Depends(get_current_traveler_id),
):
    try:
        return registry().trains.between(origin, destination, journey_date)
    except LiveProviderError as exc:
        raise _fail(exc)


@router.get("/live/trains/{train_number}", response_model=LiveTransportOut)
def train_live(train_number: str, journey_date: str | None = Query(default=None, alias="date"), _traveler: str = Depends(get_current_traveler_id)):
    try:
        return registry().trains.live_status(train_number, journey_date)
    except LiveProviderError as exc:
        raise _fail(exc)


# ---- Places, events, destinations -------------------------------------------------------------


@router.get("/destinations", response_model=list[DestinationOut])
def destinations(query: str | None = Query(default=None, max_length=60)):
    return live_travel_service.search_destinations(query)


def _point(city: str | None, lat: float | None, lng: float | None) -> tuple[float, float, str | None]:
    try:
        return live_travel_service.resolve_point(city, lat, lng)
    except live_travel_service.InvalidExternalItemError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/places/hotels", response_model=list[HotelOut])
def hotels(
    city: str | None = Query(default=None, max_length=80),
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    radius: int = Query(default=5000, ge=500, le=20000, description="metres"),
    query: str | None = Query(default=None, max_length=60),
    limit: int = Query(default=30, ge=1, le=60),
    _traveler: str = Depends(get_current_traveler_id),
):
    lat, lng, name = _point(city, latitude, longitude)
    try:
        return registry().places.hotels(lat, lng, radius, limit, query, name)
    except LiveProviderError as exc:
        raise _fail(exc)


@router.get("/places/attractions", response_model=list[AttractionOut])
def attractions(
    city: str | None = Query(default=None, max_length=80),
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    radius: int = Query(default=8000, ge=500, le=20000, description="metres"),
    category: str | None = Query(default=None, max_length=20),
    query: str | None = Query(default=None, max_length=60),
    limit: int = Query(default=30, ge=1, le=60),
    _traveler: str = Depends(get_current_traveler_id),
):
    lat, lng, name = _point(city, latitude, longitude)
    try:
        return registry().places.attractions(lat, lng, radius, limit, category, query, name)
    except LiveProviderError as exc:
        raise _fail(exc)


@router.get("/events", response_model=list[TravelEventOut])
def events(
    city: str | None = Query(default=None, max_length=80),
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    radius: int = Query(default=50, ge=1, le=200, description="km"),
    start_date: date | None = Query(default=None, alias="startDate"),
    end_date: date | None = Query(default=None, alias="endDate"),
    category: str | None = Query(default=None, max_length=20),
    keyword: str | None = Query(default=None, max_length=80),
    limit: int = Query(default=20, ge=1, le=50),
    _traveler: str = Depends(get_current_traveler_id),
):
    if start_date and end_date and end_date < start_date:
        raise HTTPException(status_code=400, detail="End date cannot be before start date.")
    try:
        return registry().events.search(city=city, lat=latitude, lng=longitude, radius_km=radius, start_date=start_date,
                                        end_date=end_date, category=category, keyword=keyword, limit=limit)
    except LiveProviderError as exc:
        raise _fail(exc)


# ---- Trip integration ------------------------------------------------------------------------


@router.get("/trips/{trip_id}/external-items", response_model=list[ExternalItemLinkOut])
def list_external_items(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    try:
        return live_travel_service.list_links(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")


@router.post("/trips/{trip_id}/external-items", response_model=ExternalItemAddOut)
def add_external_item(trip_id: str, payload: ExternalItemCreate, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Insert a discovered flight/train/hotel/place/event into the existing
    trip. Adding the same provider record twice returns alreadyAdded=true."""
    try:
        return live_travel_service.add_external_item(db, trip_id, traveler_id, payload)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except ValueError as exc:  # adapter or NodeCreateRequest validation
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/live/trips/{trip_id}/tracked", response_model=list[TrackedTransportOut])
def tracked(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Live status for every flight/train in the trip that came from a live provider."""
    try:
        return live_travel_service.tracked_transport(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
