"""Minimal local-development authentication.

Not an enterprise auth system - just enough to satisfy "never store plaintext
passwords" and give the API a real (if simple) session mechanism. Passwords are
hashed with salted PBKDF2-HMAC-SHA256 (stdlib only, no extra dependency).
Sessions are a small HMAC-signed token, not a JWT library, to keep the
dependency footprint minimal for a local-dev feature.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import time

from app.config import get_settings

_ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split("$", 1)
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    expected = bytes.fromhex(digest_hex)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return hmac.compare_digest(expected, actual)


def create_token(traveler_id: str) -> str:
    secret = get_settings().auth_secret.encode()
    payload = f"{traveler_id}:{int(time.time())}"
    signature = hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()
    token = f"{payload}:{signature}"
    return base64.urlsafe_b64encode(token.encode()).decode()


def verify_token(token: str) -> str | None:
    secret = get_settings().auth_secret.encode()
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        traveler_id, ts, signature = decoded.rsplit(":", 2)
    except Exception:
        return None
    payload = f"{traveler_id}:{ts}"
    expected = hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        return None
    return traveler_id
