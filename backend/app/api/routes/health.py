import time
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database.session import get_db

router = APIRouter(tags=["health"])


@router.get("/healthz")
def liveness():
    """Kubernetes / Cloud provider liveness probe."""
    return {"status": "alive"}


@router.get("/readyz")
@router.get("/api/health/ready")
def readiness(response: Response, db: Session = Depends(get_db)):
    """Deep readiness probe verifying database connectivity and latency."""
    settings = get_settings()
    start_time = time.perf_counter()
    try:
        db.execute(text("SELECT 1"))
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        db_status = "ok"
    except Exception as exc:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        db_status = f"unreachable: {str(exc)}"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    is_ready = db_status == "ok"
    return {
        "status": "ready" if is_ready else "not_ready",
        "database": {
            "status": db_status,
            "latencyMs": latency_ms,
            "engine": db.bind.dialect.name if db.bind else "unknown",
        },
        "environment": settings.environment,
    }


@router.get("/api/health")
def health(db: Session = Depends(get_db)):
    settings = get_settings()
    try:
        db.execute(text("SELECT 1"))
        database_status = "ok"
    except Exception:
        database_status = "unreachable"

    return {
        "status": "ok" if database_status == "ok" else "degraded",
        "database": database_status,
        "environment": settings.environment,
    }
