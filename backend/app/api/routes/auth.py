"""Minimal local-dev auth endpoints.

The frontend's LoginScreen exercises these routes. Every other endpoint
resolves the caller via `get_current_traveler_id` (see app/api/deps.py):
a valid bearer token gets real per-traveler trip scoping, and no
Authorization header at all falls back to the single seeded demo traveler -
so an anonymous client keeps working exactly as before. A token that IS
sent but fails verification is rejected with 401 rather than silently
downgraded to the demo account.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.config import get_settings
from app.core.rate_limiting import limiter
from app.database.seed import DEFAULT_TRAVELER_ID
from app.database.session import get_db
from app.models.traveler import Traveler
from app.schemas.base import CamelModel
from app.services.auth_service import create_token, hash_password, password_problems, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterRequest(CamelModel):
    name: str
    email: str
    password: str


class LoginRequest(CamelModel):
    email: str
    password: str


class AuthResponse(CamelModel):
    token: str
    traveler_id: str
    name: str
    email: str


class TravelerOut(CamelModel):
    traveler_id: str
    name: str
    email: str
    home_airport: str
    loyalty_tier: str
    email_notifications_opt_in: bool


class TravelerUpdateRequest(CamelModel):
    email_notifications_opt_in: bool


def _traveler_out(traveler: Traveler) -> TravelerOut:
    return TravelerOut(
        traveler_id=traveler.id,
        name=traveler.name,
        email=traveler.email,
        home_airport=traveler.home_airport,
        loyalty_tier=traveler.loyalty_tier,
        email_notifications_opt_in=traveler.email_notifications_opt_in,
    )


def _auth_response(traveler: Traveler) -> AuthResponse:
    return AuthResponse(token=create_token(traveler.id), traveler_id=traveler.id, name=traveler.name, email=traveler.email)


@router.post("/register", response_model=AuthResponse)
@limiter.limit(lambda: get_settings().register_rate_limit)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    # `request` must be the literal parameter name here (and stay typed as
    # Request) - slowapi's limiter decorator looks it up from kwargs by that
    # exact name at call time to find the client's IP.
    problems = password_problems(payload.password)
    if problems:
        raise HTTPException(status_code=422, detail="Choose a stronger password - it needs " + ", ".join(problems) + ".")
    existing = db.query(Traveler).filter(Traveler.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    traveler = Traveler(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(traveler)
    db.commit()
    return _auth_response(traveler)


@router.post("/login", response_model=AuthResponse)
@limiter.limit(lambda: get_settings().login_rate_limit)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    traveler = db.query(Traveler).filter(Traveler.email == payload.email).first()
    if not traveler or not verify_password(payload.password, traveler.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return _auth_response(traveler)


@router.get("/demo-account", response_model=AuthResponse)
def demo_account(db: Session = Depends(get_db)):
    """Returns a token for the seeded demo traveler, for local development."""
    traveler = db.get(Traveler, DEFAULT_TRAVELER_ID)
    if not traveler:
        raise HTTPException(status_code=404, detail="Demo account not seeded yet.")
    return _auth_response(traveler)


@router.get("/me", response_model=TravelerOut)
def me(db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)):
    traveler = db.get(Traveler, traveler_id)
    if not traveler:
        raise HTTPException(status_code=404, detail="Traveler not found.")
    return _traveler_out(traveler)


@router.patch("/me", response_model=TravelerOut)
def update_me(
    payload: TravelerUpdateRequest, db: Session = Depends(get_db), traveler_id: str = Depends(get_current_traveler_id)
):
    traveler = db.get(Traveler, traveler_id)
    if not traveler:
        raise HTTPException(status_code=404, detail="Traveler not found.")
    traveler.email_notifications_opt_in = payload.email_notifications_opt_in
    db.commit()
    return _traveler_out(traveler)
