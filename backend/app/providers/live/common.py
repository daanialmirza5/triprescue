"""Shared plumbing for the live travel-data providers (Aviationstack,
RailRadar, OpenStreetMap/Overpass, Ticketmaster).

Rules every live provider follows:
- Never fabricate: a failure raises LiveProviderError; nothing falls back to
  simulated data.
- Never leak: provider error bodies and API keys never reach the user or the
  logs (httpx logs request URLs, which carry query-string keys, so they are
  redacted below).
- Be frugal: short-lived TTL caches in front of every call.
"""

from __future__ import annotations

import logging
import re
import threading
import time
from collections import OrderedDict
from typing import Any, Callable, TypeVar
from urllib.parse import urlparse

import httpx

T = TypeVar("T")

# Friendly, provider-agnostic messages (never the provider's raw error text).
MESSAGES = {
    "not_configured": "Live provider authentication is not configured.",
    "auth": "Live provider authentication is not configured.",
    "not_found": "No live record found.",
    "rate_limited": "Live provider request limit reached. Please try again shortly.",
    "unavailable": "Live provider temporarily unavailable.",
    "bad_request": "The live provider could not understand this search.",
    "bad_response": "The live provider returned data we could not read.",
}
# HTTP status our API answers with for each failure kind.
HTTP_STATUS = {
    "not_configured": 503,
    "auth": 503,
    "not_found": 404,
    "rate_limited": 429,
    "unavailable": 503,
    "bad_request": 400,
    "bad_response": 502,
}


class LiveProviderError(Exception):
    def __init__(self, provider: str, kind: str):
        self.provider = provider
        self.kind = kind if kind in MESSAGES else "unavailable"
        super().__init__(f"{provider}: {self.kind}")

    @property
    def message(self) -> str:
        return MESSAGES[self.kind]

    @property
    def http_status(self) -> int:
        return HTTP_STATUS[self.kind]


def kind_for_status(status: int) -> str:
    if status in (401, 403):
        return "auth"
    if status == 404:
        return "not_found"
    if status == 429:
        return "rate_limited"
    if status in (400, 422):
        return "bad_request"
    return "unavailable"


def request_json(
    provider: str,
    client: httpx.Client | None,
    method: str,
    url: str,
    timeout: float | httpx.Timeout,
    **kwargs: Any,
) -> Any:
    """One HTTP call with provider-safe error mapping. Returns parsed JSON."""
    try:
        if client is not None:
            response = client.request(method, url, timeout=timeout, **kwargs)
        else:
            response = httpx.request(method, url, timeout=timeout, **kwargs)
    except httpx.TimeoutException as exc:
        raise LiveProviderError(provider, "unavailable") from exc
    except httpx.HTTPError as exc:
        raise LiveProviderError(provider, "unavailable") from exc
    if response.status_code >= 400:
        raise LiveProviderError(provider, kind_for_status(response.status_code))
    try:
        return response.json()
    except ValueError as exc:
        raise LiveProviderError(provider, "bad_response") from exc


class TTLCache:
    """Small thread-safe LRU cache with per-entry expiry."""

    def __init__(self, ttl_seconds: float, max_entries: int = 256):
        self.ttl = ttl_seconds
        self.max_entries = max_entries
        self._data: OrderedDict[Any, tuple[float, Any]] = OrderedDict()
        self._lock = threading.Lock()

    def get_or_set(self, key: Any, compute: Callable[[], T]) -> T:
        now = time.monotonic()
        with self._lock:
            hit = self._data.get(key)
            if hit and hit[0] > now:
                self._data.move_to_end(key)
                return hit[1]
        value = compute()  # errors propagate and are never cached
        with self._lock:
            self._data[key] = (time.monotonic() + self.ttl, value)
            self._data.move_to_end(key)
            while len(self._data) > self.max_entries:
                self._data.popitem(last=False)
        return value

    def clear(self) -> None:
        with self._lock:
            self._data.clear()


def safe_url(value: Any) -> str | None:
    """Only plain http(s) links from providers are passed on to the UI."""
    if not isinstance(value, str) or len(value) > 2048:
        return None
    parsed = urlparse(value.strip())
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return None
    return value.strip()


def as_float(value: Any) -> float | None:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if number == number else None  # drop NaN


def as_int(value: Any) -> int | None:
    number = as_float(value)
    return int(round(number)) if number is not None else None


# ---- Secret redaction for logs ------------------------------------------------------

_SECRET_PARAM_RE = re.compile(r"((?:access_key|apikey|api_key|key)=)[^&\s\"']+", re.I)


class RedactSecretsFilter(logging.Filter):
    """httpx logs every request URL at INFO; Aviationstack and Ticketmaster
    take their keys as query parameters. Strip them before anything is written."""

    def filter(self, record: logging.LogRecord) -> bool:
        try:
            message = record.getMessage()
        except Exception:
            return True
        if _SECRET_PARAM_RE.search(message):
            record.msg = _SECRET_PARAM_RE.sub(r"\1[redacted]", message)
            record.args = ()
        return True


def install_log_redaction() -> None:
    for name in ("httpx", "httpcore"):
        logger = logging.getLogger(name)
        if not any(isinstance(f, RedactSecretsFilter) for f in logger.filters):
            logger.addFilter(RedactSecretsFilter())


install_log_redaction()
