"""Shared FastAPI dependencies.

`get_current_traveler_id` resolves the caller's identity from a bearer token
(see app/services/auth_service.py) when one is sent, and falls back to the
seeded demo traveler when NO Authorization header is sent at all - so a
client that never logs in (or an old cached frontend build) keeps working
exactly as before, while a client that DOES log in gets real per-traveler
trip filtering.

A bearer token that IS sent but fails verification (bad signature, or - since
tokens now expire, see auth_service.verify_token - simply too old) is
rejected with 401, not silently downgraded to the demo traveler. Falling back
there would mean a logged-in user whose session just expired would silently
start seeing (and could act on) the demo account's trips instead of getting
a clear "log in again" signal - exactly the ambiguous, ownership-confusing
behavior Phase 1's token-expiry requirement exists to prevent.
"""

from __future__ import annotations

from fastapi import Header, HTTPException

from app.database.seed import DEFAULT_TRAVELER_ID
from app.services.auth_service import verify_token


def get_current_traveler_id(authorization: str | None = Header(default=None)) -> str:
    if authorization is None:
        return DEFAULT_TRAVELER_ID
    if not authorization.lower().startswith("bearer "):
        return DEFAULT_TRAVELER_ID
    token = authorization[len("bearer "):].strip()
    traveler_id = verify_token(token)
    if traveler_id is None:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")
    return traveler_id
