"""Timezone normalization and safe ISO 8601 datetime parsing utilities."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional


def parse_iso_datetime(value: Optional[str]) -> Optional[datetime]:
    """Safely parse an ISO 8601 string into a timezone-aware UTC datetime.

    Returns None if value is None, empty, or unparseable.
    """
    if not value or not isinstance(value, str):
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except (ValueError, TypeError):
        return None


def utcnow_naive() -> datetime:
    """Current UTC time as a naive datetime (no tzinfo).

    Every scheduled/detected/expiry timestamp elsewhere in this codebase
    (EngineNode.scheduled_start, Disruption.detected_at, cached expiry
    times, etc.) is naive-but-UTC by convention, so this must stay naive
    too or every comparison against those fields breaks with "can't
    compare offset-naive and offset-aware datetimes". This exists only to
    replace the deprecated ``datetime.utcnow()`` (removed in a future
    Python version) without changing that convention - it is NOT a
    general-purpose "give me an aware UTC now", which is what
    ``datetime.now(timezone.utc)`` is for at the JSON/API boundary (see
    ``format_utc_iso`` / ``parse_iso_datetime`` above).
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)


def format_utc_iso(dt: Optional[datetime]) -> Optional[str]:
    """Format a datetime into an ISO 8601 UTC string (with 'Z' suffix)."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")
