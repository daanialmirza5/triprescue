from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.config import get_settings
from app.core.rate_limiting import limiter
from app.database.session import get_db
from app.schemas.digital_twin import (
    DigitalTwinApplyOut,
    DigitalTwinApplyRequest,
    DigitalTwinSimulateRequest,
    DigitalTwinSimulationOut,
)
from app.services import digital_twin_service, trip_service

router = APIRouter(prefix="/api/trips/{trip_id}/digital-twin", tags=["digital-twin"])


@router.post("/simulate", response_model=DigitalTwinSimulationOut)
@limiter.limit(lambda: get_settings().disruption_rate_limit)
def simulate(
    trip_id: str,
    payload: DigitalTwinSimulateRequest,
    request: Request,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    """Run a weather what-if against a sandboxed copy of the trip. Read-only:
    the live itinerary is not modified."""
    try:
        return digital_twin_service.simulate(db, trip_id, traveler_id, payload)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/apply", response_model=DigitalTwinApplyOut)
@limiter.limit(lambda: get_settings().recovery_rate_limit)
def apply(
    trip_id: str,
    payload: DigitalTwinApplyRequest,
    request: Request,
    db: Session = Depends(get_db),
    traveler_id: str = Depends(get_current_traveler_id),
):
    """Atomically apply one of a simulation's preemptive plans to the real itinerary."""
    try:
        return digital_twin_service.apply(db, trip_id, traveler_id, payload.simulation_id, payload.option_id)
    except trip_service.TripNotFoundError:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found")
    except digital_twin_service.SimulationNotFoundError:
        raise HTTPException(status_code=404, detail="Simulation not found or expired. Run the scenario again.")
    except digital_twin_service.StaleSimulationError:
        raise HTTPException(status_code=409, detail="The itinerary changed since this simulation. Run the scenario again.")
    except digital_twin_service.ActiveDisruptionError:
        raise HTTPException(status_code=409, detail="Resolve the active disruption before applying a preemptive weather plan.")


general_router = APIRouter(prefix="/api/twin", tags=["digital-twin"])


@general_router.get("/state")
def twin_state(traveler_id: str = Depends(get_current_traveler_id)):
    """Return digital twin engine status and operational readiness."""
    settings = get_settings()
    return {
        "status": "ready",
        "engine": "weather_digital_twin",
        "nugen_enabled": bool(settings.nugen_api_key),
        "nugen_model": settings.nugen_model_id,
        "active_simulations_cached": len(digital_twin_service._store),
    }
