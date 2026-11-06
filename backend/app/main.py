import asyncio
import logging
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.api.routes import assistant, auth, digital_twin, disruptions, health, live, pipeline, recovery, social_signals, trips, weather
from app.config import get_settings
from app.core.logging import configure_logging, init_sentry
from app.core.middleware import RequestTimingMiddleware
from app.core.pipeline_middleware import PipelineTraceMiddleware
from app.core.pipeline_ui import mount_pipeline_ui
from app.core.rate_limiting import limiter
from app.database.base import Base
from app.database.seed import seed_if_empty
from app.database.session import SessionLocal, engine, resolved_url

# Import models so they register on Base.metadata before create_all runs.
from app import models  # noqa: F401

logger = logging.getLogger("safarsathi")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    settings.enforce_secure_auth_secret()  # fails closed outside development, see config.py
    if settings.uses_insecure_default_auth_secret:
        logger.warning(
            "AUTH_SECRET is still the insecure development default ('dev-secret-change-me'). "
            "Session tokens are forgeable. Set a real AUTH_SECRET before deploying anywhere "
            "other than local development."
        )
    if resolved_url.startswith("sqlite"):
        # SQLite dev convenience only. Postgres schema is Alembic-managed -
        # see backend/alembic/ - `create_all` must never run against it, so
        # a fresh deploy doesn't silently create an out-of-band schema that
        # alembic then thinks is already at some unknown revision.
        Base.metadata.create_all(bind=engine)
    if settings.should_seed_demo_data:
        db = SessionLocal()
        try:
            seed_if_empty(db)
        finally:
            db.close()

    stop_event = asyncio.Event()
    risk_task: asyncio.Task | None = None
    if settings.risk_prediction_enabled:
        from app.services.risk_prediction_service import risk_prediction_loop

        risk_task = asyncio.create_task(
            risk_prediction_loop(SessionLocal, settings.risk_prediction_interval_minutes, stop_event),
            name="risk-prediction",
        )
        logger.info("Risk prediction scheduler started (every %s min)", settings.risk_prediction_interval_minutes)
    try:
        yield
    finally:
        if risk_task is not None:
            stop_event.set()
            risk_task.cancel()
            with suppress(asyncio.CancelledError, Exception):
                await risk_task
            logger.info("Risk prediction scheduler stopped")


settings = get_settings()
configure_logging(settings.log_format, settings.log_level)
init_sentry(settings.sentry_dsn, settings.environment, settings.sentry_traces_sample_rate)

app = FastAPI(title="SafarSathi API", version="0.1.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_middleware(RequestTimingMiddleware)
app.add_middleware(PipelineTraceMiddleware)  # no-op unless a request carries X-Pipeline-Run

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Too many attempts. Please wait and try again."})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Log with the request id (and report to Sentry when configured) - this
    # handler used to swallow errors silently, leaving no trace of a 500.
    logger.error("Unhandled exception on %s %s", request.method, request.url.path, exc_info=exc)
    if settings.sentry_dsn:
        with suppress(Exception):
            import sentry_sdk

            sentry_sdk.capture_exception(exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


@app.get("/", tags=["root"])
async def root():
    return {
        "service": "SafarSathi API",
        "status": "ok",
        "docs": "/docs",
        "health": "/api/health",
    }


app.include_router(health.router)
app.include_router(trips.router)
app.include_router(trips.geocode_router)
app.include_router(disruptions.router)
app.include_router(recovery.router)
app.include_router(assistant.router)
app.include_router(auth.router)
app.include_router(weather.router)
app.include_router(digital_twin.router)
app.include_router(digital_twin.general_router)
app.include_router(social_signals.router)
app.include_router(live.router)
app.include_router(pipeline.router)
mount_pipeline_ui(app)  # standalone Live Journey Pipeline page at /pipeline/
