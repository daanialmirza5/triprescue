import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import assistant, auth, disruptions, health, recovery, trips
from app.config import get_settings
from app.database.base import Base
from app.database.seed import seed_if_empty
from app.database.session import SessionLocal, engine

# Import models so they register on Base.metadata before create_all runs.
from app import models  # noqa: F401

logger = logging.getLogger("triprescue")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    if settings.uses_insecure_default_auth_secret:
        logger.warning(
            "AUTH_SECRET is still the insecure development default ('dev-secret-change-me'). "
            "Session tokens are forgeable. Set a real AUTH_SECRET before deploying anywhere "
            "other than local development."
        )
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="TripRescue API", version="0.1.0", lifespan=lifespan)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error. Please try again."})


app.include_router(health.router)
app.include_router(trips.router)
app.include_router(disruptions.router)
app.include_router(recovery.router)
app.include_router(assistant.router)
app.include_router(auth.router)
