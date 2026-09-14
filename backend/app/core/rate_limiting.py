"""Shared rate limiter for the auth endpoints.

A single in-memory `Limiter`, keyed by client IP. In-memory is fine for a
single-instance deployment (this app has no multi-instance/horizontal scaling
story yet); it just means limits reset on process restart, which is an
acceptable tradeoff for "stop obvious brute-force/spam," not a hard security
boundary.
"""

from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)


def reset_rate_limits() -> None:
    """Clears all recorded attempts. Test-only - keeps rate-limit state from
    one test bleeding into the next, since `limiter` is a module-level
    singleton shared across the whole test process."""
    limiter.reset()
