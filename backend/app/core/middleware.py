"""HTTP request correlation ID and response duration middleware."""

from __future__ import annotations

import logging
import time
import uuid
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import request_id_var

logger = logging.getLogger("safarsathi.http")


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """Injects X-Process-Time-Ms and X-Request-ID headers into outgoing responses.

    Makes the unique request correlation ID available to all contextual logging handlers
    (via `request_id_var`) and logs structured HTTP metrics for each completed request.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:

        request_id = request.headers.get("X-Request-ID") or f"req_{uuid.uuid4().hex[:12]}"
        token = request_id_var.set(request_id)
        start_time = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            logger.exception("Unhandled error", extra={"method": request.method, "path": request.url.path})
            raise
        finally:
            process_time_ms = (time.perf_counter() - start_time) * 1000.0
        response.headers["X-Process-Time-Ms"] = f"{process_time_ms:.2f}"
        response.headers["X-Request-ID"] = request_id
        logger.info(
            "%s %s -> %s (%.1f ms)",
            request.method,
            request.url.path,
            response.status_code,
            process_time_ms,
            extra={"method": request.method, "path": request.url.path, "status": response.status_code, "duration_ms": round(process_time_ms, 2)},
        )
        request_id_var.reset(token)
        return response
