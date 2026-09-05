"""Shared FastAPI dependencies.

`get_current_traveler_id` resolves the caller's identity from a bearer token
(see app/services/auth_service.py) when one is sent, and falls back to the
seeded demo traveler when it isn't - so a client that never logs in (or an
old cached frontend build) keeps working exactly as before, while a client
that DOES log in gets real per-traveler trip filtering.
"""

from __future__ import annotations

from fastapi import Header

from app.database.seed import DEFAULT_TRAVELER_ID
from app.services.auth_service import verify_token


def get_current_traveler_id(authorization: str | None = Header(default=None)) -> str:
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[len("bearer "):].strip()
        traveler_id = verify_token(token)
        if traveler_id:
            return traveler_id
    return DEFAULT_TRAVELER_ID
