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

When `Settings.require_authentication` is True, the no-header demo fallback
is disabled and anonymous requests are rejected with 401 instead. Either way,
an id is only returned for a traveler that actually exists - e.g. with
SEED_DEMO_DATA off there is no demo traveler to fall back to - so no request
can create data owned by a nonexistent traveler.
"""

from __future__ import annotations

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database.seed import DEFAULT_TRAVELER_ID
from app.database.session import get_db
from app.models.traveler import Traveler
from app.services.auth_service import verify_token


def get_current_traveler_id(
    authorization: str | None = Header(default=None), db: Session = Depends(get_db)
) -> str:
    if authorization is None or not authorization.lower().startswith("bearer "):
        if get_settings().require_authentication or db.get(Traveler, DEFAULT_TRAVELER_ID) is None:
            raise HTTPException(status_code=401, detail="Authentication required.")
        return DEFAULT_TRAVELER_ID
    token = authorization[len("bearer "):].strip()
    traveler_id = verify_token(token)
    if traveler_id is None or db.get(Traveler, traveler_id) is None:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please log in again.")
    return traveler_id
