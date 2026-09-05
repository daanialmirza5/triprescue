"""Minimal local-dev auth endpoints.

Nothing else in the API requires a token - the existing frontend has no login
screen, so every trip endpoint operates against the single seeded demo
traveler. These endpoints exist so a real login flow can be wired up later
without redesigning the backend (see docs/FUTURE_ROADMAP.md).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_traveler_id
from app.database.seed import DEFAULT_TRAVELER_ID
from app.database.session import get_db
from app.models.traveler import Traveler
from app.schemas.base import CamelModel
from app.services.auth_service import create_token, hash_password, verify_password

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


def _auth_response(traveler: Traveler) -> AuthResponse:
    return AuthResponse(token=create_token(traveler.id), traveler_id=traveler.id, name=traveler.name, email=traveler.email)


@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(Traveler).filter(Traveler.email == request.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    traveler = Traveler(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
    )
    db.add(traveler)
    db.commit()
    return _auth_response(traveler)


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    traveler = db.query(Traveler).filter(Traveler.email == request.email).first()
    if not traveler or not verify_password(request.password, traveler.password_hash):
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
    return TravelerOut(
        traveler_id=traveler.id,
        name=traveler.name,
        email=traveler.email,
        home_airport=traveler.home_airport,
        loyalty_tier=traveler.loyalty_tier,
    )
