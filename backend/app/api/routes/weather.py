from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.session import get_db
from app.schemas.weather import TripWeatherOut, WeatherForecastOut
from app.services import trip_service, weather_service

router = APIRouter(prefix="/api", tags=["weather"])


@router.get("/weather", response_model=WeatherForecastOut)
def weather_at(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    hours: int = Query(48, ge=1, le=168),
    traveler_id: str = Depends(get_current_traveler_id),
):
    """Current conditions + hourly forecast (Open-Meteo, 15-min cache, offline fallback)."""
    return weather_service.forecast_out(lat, lng, hours)


@router.get("/weather/current", response_model=WeatherForecastOut)
def weather_current(
    lat: float = Query(28.6139, ge=-90, le=90),
    lng: float = Query(77.2090, ge=-180, le=180),
    hours: int = Query(24, ge=1, le=168),
    traveler_id: str = Depends(get_current_traveler_id),
):
    """Current weather probe endpoint with default coordinates."""
    return weather_service.forecast_out(lat, lng, hours)


@router.get("/trips/{trip_id}/weather", response_model=TripWeatherOut)
def trip_weather(trip_id: str, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    """Forecast at every booking's scheduled time, with its Weather Vulnerability Index."""
    try:
        return weather_service.trip_weather(db, trip_id, traveler_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
