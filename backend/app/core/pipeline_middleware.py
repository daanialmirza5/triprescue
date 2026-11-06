"""Attach a pipeline trace run to a request carrying `X-Pipeline-Run`.

Pure ASGI (not BaseHTTPMiddleware) so the context variable set here is the one
the routed endpoint sees. Emits the API, router and response stages from the
real request: the matched route template, the endpoint function, whether it
requires the traveller dependency, its request/response schemas and the final
HTTP status. Requests without the header (or with an unknown run id) are passed
through untouched.
"""

from __future__ import annotations

import asyncio
import time
import uuid
from typing import Any

from starlette.routing import Match

from app.core import pipeline_trace

HEADER = b"x-pipeline-run"


def _route_info(app: Any, scope: dict) -> dict[str, Any] | None:
    router = getattr(app, "router", None)
    for route in getattr(router, "routes", []):
        match, _ = route.matches(scope)
        if match == Match.FULL and hasattr(route, "endpoint"):
            dependant = getattr(route, "dependant", None)
            deps = [getattr(d.call, "__name__", "") for d in getattr(dependant, "dependencies", [])] if dependant else []
            body = getattr(route, "body_field", None)
            response_model = getattr(route, "response_model", None)
            src = pipeline_trace.source_of(route.endpoint)
            return {
                "path": route.path,
                "methods": sorted(getattr(route, "methods", []) or []),
                "endpoint": route.endpoint.__name__,
                "module": route.endpoint.__module__,
                "file": src["file"],
                "line": src["line"],
                "auth": "get_current_traveler_id" in deps,
                "requestSchema": getattr(getattr(body, "type_", None), "__name__", None) if body else None,
                "responseSchema": getattr(response_model, "__name__", str(response_model)) if response_model else None,
            }
    return None


class PipelineTraceMiddleware:
    def __init__(self, app: Any):
        self.app = app

    async def __call__(self, scope: dict, receive: Any, send: Any) -> None:
        if scope.get("type") != "http":
            await self.app(scope, receive, send)
            return
        run_id = next((v.decode() for k, v in scope.get("headers", []) if k == HEADER), None)
        run = pipeline_trace.get_run(run_id)
        if run is None:
            await self.app(scope, receive, send)
            return

        method, path = scope.get("method", "GET"), scope.get("path", "")
        info = _route_info(scope.get("app"), scope) or {}
        api_component = f"api:{method} {info.get('path', path)}"
        span_id = uuid.uuid4().hex[:8]
        if run.pace_ms:
            await asyncio.sleep(run.pace_ms / 1000)
            run.paced_total += run.pace_ms / 1000
        run.emit(type="stage", spanId=span_id, stage="api", component=api_component, function=f"{method} {path}",
                 status="running", message=f"{method} {info.get('path', path)} received", detail={"auth": info.get("auth")})
        if info:
            run.emit(type="stage", spanId=uuid.uuid4().hex[:8], stage="router", component=f"module:{info['module']}",
                     function=info["endpoint"], file=info["file"], line=info["line"], status="completed", durationMs=0.0,
                     message=f"Routed to {info['module'].rsplit('.', 1)[-1]}.{info['endpoint']}()",
                     detail={k: info[k] for k in ("path", "auth", "requestSchema", "responseSchema")})

        status_holder: dict[str, int] = {}

        async def capture(message: dict) -> None:
            if message.get("type") == "http.response.start":
                status_holder["status"] = message.get("status", 0)
            await send(message)

        token = pipeline_trace.activate(run)
        started, paced_before = time.perf_counter(), run.paced_total
        try:
            await self.app(scope, receive, capture)
        finally:
            pipeline_trace.deactivate(token)
            status = status_holder.get("status", 500)
            duration = round(max(0.0, time.perf_counter() - started - (run.paced_total - paced_before)) * 1000, 2)
            run.emit(type="stage", spanId=span_id, stage="api", component=api_component, function=f"{method} {path}",
                     status="completed" if status < 400 else "failed", durationMs=duration, httpStatus=status,
                     message=f"{method} {info.get('path', path)} → HTTP {status}")
            run.emit(type="stage", spanId=uuid.uuid4().hex[:8], stage="response", component=api_component,
                     function="response", status="completed" if status < 400 else "failed", durationMs=0.0,
                     httpStatus=status, message=f"Response HTTP {status} returned")
