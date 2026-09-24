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


def format_utc_iso(dt: Optional[datetime]) -> Optional[str]:
    """Format a datetime into an ISO 8601 UTC string (with 'Z' suffix)."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")
