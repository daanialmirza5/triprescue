"""Structured logging with request-id correlation, plus optional Sentry.

`configure_logging()` installs one root handler whose formatter is either
human-readable (LOG_FORMAT=console, the default) or one-JSON-object-per-line
(LOG_FORMAT=json, what log aggregators expect). Every record carries the id of
the HTTP request that produced it - RequestTimingMiddleware stores it in a
context variable - so all lines from one request can be joined up.
"""

from __future__ import annotations

import json
import logging
import sys
from contextvars import ContextVar
from datetime import datetime, timezone

request_id_var: ContextVar[str] = ContextVar("request_id", default="-")

_RESERVED = set(vars(logging.makeLogRecord({}))) | {"message", "asctime", "request_id"}


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get()
        return True


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": getattr(record, "request_id", "-"),
        }
        # Structured extras passed via `logger.info(..., extra={...})`.
        for key, value in vars(record).items():
            if key not in _RESERVED and not key.startswith("_"):
                payload[key] = value if isinstance(value, (str, int, float, bool, type(None))) else str(value)
        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


CONSOLE_FORMAT = "%(asctime)s %(levelname)-7s [%(request_id)s] %(name)s: %(message)s"


def configure_logging(log_format: str = "console", level: str = "INFO") -> None:
    # Messages contain ₹ and →; a legacy Windows console (cp1252) can't encode
    # them and every such log line would fail with a "--- Logging error ---".
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        try:
            reconfigure(errors="backslashreplace")
        except (ValueError, OSError):
            pass
    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(RequestIdFilter())
    handler.setFormatter(JsonFormatter() if log_format == "json" else logging.Formatter(CONSOLE_FORMAT))
    root = logging.getLogger()
    # Replace only handlers we installed, leaving pytest's/uvicorn's own alone.
    for existing in list(root.handlers):
        if getattr(existing, "_safarsathi", False):
            root.removeHandler(existing)
    handler._safarsathi = True  # type: ignore[attr-defined]
    root.addHandler(handler)
    root.setLevel(level.upper())


def init_sentry(dsn: str | None, environment: str, traces_sample_rate: float = 0.0) -> bool:
    """Initialise Sentry when a DSN is configured. Returns whether it is active.
    A missing SDK or bad DSN is logged, never fatal."""
    if not dsn:
        return False
    try:
        import sentry_sdk

        sentry_sdk.init(dsn=dsn, environment=environment, traces_sample_rate=traces_sample_rate, send_default_pii=False)
        logging.getLogger("safarsathi").info("Sentry error tracking enabled")
        return True
    except Exception:
        logging.getLogger("safarsathi").warning("Sentry initialisation failed; continuing without it.", exc_info=True)
        return False
