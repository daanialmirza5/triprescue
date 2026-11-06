"""Live Journey Pipeline: run real workflows on the isolated demo journey and
stream their execution trace; serve the source-derived architecture map."""

from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from pydantic import Field
from sqlalchemy.orm import Session, sessionmaker

from app.api.deps import get_current_traveler_id
from app.config import get_settings
from app.core import pipeline_trace
from app.core.rate_limiting import limiter
from app.database.session import get_db
from app.schemas.base import CamelModel
from app.services import architecture_service, pipeline_service

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])


def pipeline_access(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> None:
    """The pipeline only reads and writes the isolated demo trip, so the
    standalone demo page may use it without logging in - unless the server
    runs with REQUIRE_AUTHENTICATION, then the normal traveller auth applies."""
    if get_settings().require_authentication:
        get_current_traveler_id(authorization, db)


class RunRequest(CamelModel):
    workflow: str = Field(..., max_length=40)
    params: dict[str, Any] = Field(default_factory=dict)
    # Presentation pacing: a real server-side pause before each stage so people
    # can follow along. 0 = full speed. Reported on the run as paceMs.
    pace_ms: int = Field(default=0, ge=0, le=2000)


@router.get("/demo")
def demo(db: Session = Depends(get_db), _access: None = Depends(pipeline_access)):
    trip = pipeline_service.demo_trip_out(db)
    return {
        "trip": trip.model_dump(by_alias=True, mode="json"),
        "traveller": "Demo Traveller",
        "workflows": pipeline_service.workflows_out(),
    }


@router.post("/runs")
@limiter.limit(lambda: get_settings().disruption_rate_limit)
def start_run(payload: RunRequest, request: Request, wait: bool = Query(default=False),
              db: Session = Depends(get_db), _access: None = Depends(pipeline_access)):
    if payload.workflow not in pipeline_service.WORKFLOWS:
        raise HTTPException(status_code=400, detail=f"Unknown workflow '{payload.workflow}'.")
    if payload.workflow == "apply_recovery" and not payload.params.get("recoveryId"):
        raise HTTPException(status_code=400, detail="Choose a recovery plan to apply.")
    pipeline_service.ensure_demo_trip(db)
    factory = sessionmaker(bind=db.get_bind(), autoflush=False)
    try:
        run = pipeline_service.start_run(payload.workflow, payload.params, payload.pace_ms, str(request.base_url), factory, wait=wait)
    except pipeline_service.PipelineBusyError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    return {**run.summary(), "events": run.events if wait else [], "result": run.result if wait else None}


@router.get("/runs/{run_id}/events")
def run_events(run_id: str, after: int = Query(default=0, ge=0), wait: float = Query(default=8.0, ge=0, le=15),
               _access: None = Depends(pipeline_access)):
    """Long-poll: returns as soon as new events exist (or the run ends / `wait` elapses)."""
    run = pipeline_trace.get_run(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Run not found or expired.")
    events, done = run.wait(after, wait)
    return {**run.summary(), "events": events, "done": done, "result": run.result if done else None}


@router.get("/architecture")
def architecture(request: Request, _access: None = Depends(pipeline_access)):
    return architecture_service.architecture(request.app)
