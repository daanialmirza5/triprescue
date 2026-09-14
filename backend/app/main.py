import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.api.routes import assistant, auth, disruptions, health, recovery, trips
from app.config import get_settings
from app.core.rate_limiting import limiter
from app.database.base import Base
from app.database.seed import seed_if_empty
from app.database.session import SessionLocal, engine, resolved_url

# Import models so they register on Base.metadata before create_all runs.
from app import models  # noqa: F401

logger = logging.getLogger("triprescue")


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
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="TripRescue API", version="0.1.0", lifespan=lifespan)
app.state.limiter = limiter

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Too many attempts. Please wait and try again."})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


app.include_router(health.router)
app.include_router(trips.router)
app.include_router(disruptions.router)
app.include_router(recovery.router)
app.include_router(assistant.router)
app.include_router(auth.router)
