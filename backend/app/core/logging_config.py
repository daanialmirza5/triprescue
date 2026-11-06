"""JSON-structured logging, stdlib only.

One JSON object per line (timestamp, level, logger, message, plus the
traceback when there is one), so a log aggregator can filter by field instead
of regex-parsing free text.
"""

from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone

# uvicorn installs its own plain-text handlers on these and stops propagation;
# they're rerouted to the root JSON handler so access/error logs match.
_UVICORN_LOGGERS = ("uvicorn", "uvicorn.error", "uvicorn.access")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        entry = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(entry, ensure_ascii=False)


def configure_logging(level: int = logging.INFO) -> None:
    """Idempotent: replaces existing root handlers rather than stacking new ones."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level)

    for name in _UVICORN_LOGGERS:
        uvicorn_logger = logging.getLogger(name)
        uvicorn_logger.handlers = []
        uvicorn_logger.propagate = True
