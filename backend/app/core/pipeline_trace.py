"""Execution trace for the Live Journey Pipeline demo.

A run is activated per request by the `X-Pipeline-Run` header (see
PipelineTraceMiddleware) or per worker thread by the pipeline runner. While a
run is active, instrumented functions (`@traced`) emit real start/finish events
with durations, the propagation engine emits one event per journey node with
the engine's own status and reason, and every SQLAlchemy flush is reported as a
database write. With no active run, `@traced` is a plain pass-through call, so
normal traffic pays only a context-variable lookup.

Nothing here invents events: each one is emitted by code as it executes.
"""

from __future__ import annotations

import contextvars
import functools
import inspect
import threading
import time
import uuid
from collections import OrderedDict
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Iterator

from sqlalchemy import event as sa_event
from sqlalchemy.orm import Session

PIPELINE_DEMO_TRIP_ID = "trip-pipeline-demo"
_REPO_ROOT = Path(__file__).resolve().parents[3]
_current: contextvars.ContextVar["TraceRun | None"] = contextvars.ContextVar("pipeline_run", default=None)


def source_of(obj: Any) -> dict[str, Any]:
    """Repo-relative file + line of a function/class (for the UI's source panel)."""
    target = inspect.unwrap(obj)
    try:
        file = Path(inspect.getsourcefile(target) or "")
        line = inspect.getsourcelines(target)[1]
    except (OSError, TypeError):
        return {"file": None, "line": None}
    try:
        rel = file.resolve().relative_to(_REPO_ROOT).as_posix()
    except ValueError:
        rel = file.name
    return {"file": rel, "line": line}


class TraceRun:
    def __init__(self, workflow: str, mode: str, data_source: str, pace_ms: int = 0, fault: str | None = None, params: dict | None = None):
        self.id = f"run_{uuid.uuid4().hex[:12]}"
        self.workflow = workflow
        self.mode = mode  # "live" (writes the demo journey) | "simulation" (dry run)
        self.data_source = data_source  # "demo" (fixture journey / simulated inventory) | "live" (real provider)
        self.pace_ms = max(0, min(pace_ms, 2000))
        self.fault = fault
        self.params = params or {}
        self.events: list[dict[str, Any]] = []
        self.done = False
        self.error: str | None = None
        self.result: dict[str, Any] | None = None
        self.propagation_passes = 0
        self.paced_total = 0.0  # seconds spent in presentation pauses (excluded from durations)
        self.started_at = datetime.now(timezone.utc)
        self._t0 = time.perf_counter()
        self._cond = threading.Condition()

    def emit(self, **event: Any) -> dict[str, Any]:
        with self._cond:
            event.update(
                runId=self.id,
                seq=len(self.events),
                timestamp=datetime.now(timezone.utc).isoformat(),
                elapsedMs=round((time.perf_counter() - self._t0) * 1000, 1),
            )
            self.events.append(event)
            self._cond.notify_all()
        return event

    def finish(self, result: dict[str, Any] | None = None, error: str | None = None) -> None:
        with self._cond:
            self.result = result
            self.error = error
            self.done = True
            self._cond.notify_all()

    def wait(self, after: int, timeout: float) -> tuple[list[dict[str, Any]], bool]:
        deadline = time.monotonic() + timeout
        with self._cond:
            while len(self.events) <= after and not self.done:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    break
                self._cond.wait(remaining)
            return list(self.events[after:]), self.done

    def summary(self) -> dict[str, Any]:
        return {"runId": self.id, "workflow": self.workflow, "mode": self.mode, "dataSource": self.data_source,
                "paceMs": self.pace_ms, "fault": self.fault, "done": self.done, "error": self.error,
                "startedAt": self.started_at.isoformat()}


_runs: "OrderedDict[str, TraceRun]" = OrderedDict()
_runs_lock = threading.Lock()


def create_run(**kwargs: Any) -> TraceRun:
    run = TraceRun(**kwargs)
    with _runs_lock:
        _runs[run.id] = run
        while len(_runs) > 40:
            _runs.popitem(last=False)
    return run


def get_run(run_id: str | None) -> TraceRun | None:
    if not run_id:
        return None
    with _runs_lock:
        return _runs.get(run_id)


def current() -> TraceRun | None:
    return _current.get()


def activate(run: TraceRun | None) -> contextvars.Token:
    return _current.set(run)


def deactivate(token: contextvars.Token) -> None:
    _current.reset(token)


def current_fault(trip_id: str) -> str | None:
    """Provider fault requested by the active demo run - honoured only for the
    isolated demo trip, never for a traveller's own trips."""
    run = current()
    return run.fault if run is not None and trip_id == PIPELINE_DEMO_TRIP_ID else None


@contextmanager
def span(stage: str, component: str, function: str, *, file: str | None = None, line: int | None = None,
         message: str | None = None) -> Iterator[dict[str, Any] | None]:
    """Emit running -> completed/failed events around a block. Yields a dict the
    caller can fill with result details (or None when no run is active)."""
    run = current()
    if run is None:
        yield None
        return
    if run.pace_ms:
        time.sleep(run.pace_ms / 1000)  # presentation pacing: a real pause, reported as such (paceMs)
        run.paced_total += run.pace_ms / 1000
    span_id = uuid.uuid4().hex[:8]
    base = dict(type="stage", spanId=span_id, stage=stage, component=component, function=function, file=file, line=line, message=message)
    run.emit(**base, status="running")
    started, paced_before = time.perf_counter(), run.paced_total
    info: dict[str, Any] = {}

    def work_ms() -> float:  # wall time minus presentation pauses taken by nested stages
        return round(max(0.0, time.perf_counter() - started - (run.paced_total - paced_before)) * 1000, 2)

    try:
        yield info
    except Exception as exc:
        run.emit(**base, status="failed", durationMs=work_ms(), error=exc.__class__.__name__, detail=info or None)
        raise
    run.emit(**base, status="completed", durationMs=work_ms(), detail=info or None)


def traced(stage: str, message: str | Callable[..., str] | None = None,
           detail: Callable[[Any, tuple, dict], dict] | None = None,
           after: Callable[[Any, tuple, dict], None] | None = None) -> Callable:
    """Instrument a function as a pipeline stage. No-op without an active run."""

    def decorate(fn: Callable) -> Callable:
        src = source_of(fn)
        component = f"module:{fn.__module__}"

        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            if _current.get() is None:
                return fn(*args, **kwargs)
            text = message(*args, **kwargs) if callable(message) else message
            with span(stage, component, fn.__qualname__, file=src["file"], line=src["line"], message=text) as info:
                result = fn(*args, **kwargs)
                if info is not None and detail is not None:
                    try:
                        info.update(detail(result, args, kwargs))
                    except Exception:  # details are best-effort; never break the traced call
                        pass
            if after is not None:
                try:
                    after(result, args, kwargs)
                except Exception:
                    pass
            return result

        return wrapper

    return decorate


# ---- Propagation: one event per journey node, from the engine's own result -----------------


def emit_propagation(result: Any, args: tuple, kwargs: dict) -> None:
    """After PropagationEngine.propagate: status + reason for every node, and for
    untouched nodes *why* (no dependency path vs. buffer absorbed the change)."""
    run = current()
    if run is None:
        return
    run.propagation_passes += 1
    if run.propagation_passes > 1:
        # Later passes are the recovery engine re-simulating candidate plans;
        # the journey's state is the first (the disruption's own) propagation.
        return
    names = ("nodes", "edges", "disrupted_node_id", "disruption_type", "delay_minutes")
    values = dict(zip(names, args[1:]))  # args[0] is the engine instance
    values.update({k: v for k, v in kwargs.items() if k in names})
    nodes, edges, primary = values.get("nodes") or [], values.get("edges") or [], values.get("disrupted_node_id")
    by_id = {n.id: n for n in nodes}
    downstream: dict[str, list[str]] = {}
    for e in edges:
        downstream.setdefault(e.source, []).append(e.target)
    reachable: set[str] = set()
    stack = [primary]
    while stack:
        for nxt in downstream.get(stack.pop(), []):
            if nxt not in reachable:
                reachable.add(nxt)
                stack.append(nxt)
    incoming = {e.target: e for e in edges}

    for node_id in result.sequence:
        impact = result.impacts[node_id]
        node = by_id.get(node_id)
        path, cursor = [], node_id
        while cursor is not None and cursor not in path:
            path.insert(0, cursor)
            cursor = result.impacts[cursor].caused_by if cursor in result.impacts else None
        if node_id == primary:
            reason = impact.reason or f"Directly hit by the {values.get('disruption_type')} event."
            relation = "disrupted"
        elif impact.status != "healthy":
            reason = impact.reason or "Affected through its dependencies."
            relation = "affected"
        elif node_id not in reachable:
            reason = f"No dependency path from {by_id[primary].title if primary in by_id else 'the disrupted booking'}."
            relation = "no_dependency_path"
        else:
            edge = incoming.get(node_id)
            if impact.available_buffer_minutes is not None and impact.required_buffer_minutes is not None:
                reason = f"Downstream, but its {impact.available_buffer_minutes}-min buffer covers the {impact.required_buffer_minutes} min it needs."
            else:
                reason = "Downstream, but scheduled far enough ahead that the disruption does not reach it."
            relation = "buffer_absorbed" if edge is not None else "no_dependency_path"
        run.emit(
            type="node",
            stage="dependency_graph",
            nodeId=node_id,
            title=node.title if node else node_id,
            category=str(getattr(node, "category", "")),
            status=impact.status,
            relation=relation,
            reason=reason,
            causedBy=impact.caused_by,
            path=[by_id[p].title if p in by_id else p for p in path],
            delayMinutes=impact.delay_minutes or (values.get("delay_minutes") if node_id == primary else 0) or 0,
            availableBufferMinutes=impact.available_buffer_minutes,
            requiredBufferMinutes=impact.required_buffer_minutes,
        )


# ---- Database writes: every flush while a run is active --------------------------------------


def _after_flush(session: Session, flush_context: Any) -> None:
    run = current()
    if run is None:
        return
    counts: dict[str, dict[str, int]] = {}
    for op, objects in (("insert", session.new), ("update", [o for o in session.dirty if session.is_modified(o)]), ("delete", session.deleted)):
        for obj in objects:
            table = getattr(obj, "__tablename__", type(obj).__name__)
            counts.setdefault(table, {}).setdefault(op, 0)
            counts[table][op] += 1
    if counts:
        run.emit(type="stage", spanId=uuid.uuid4().hex[:8], stage="database", component="database:sqlalchemy",
                 function="Session.flush", status="completed", durationMs=0.0, message="Database write",
                 detail={"operation": "write", "tables": counts})


if not sa_event.contains(Session, "after_flush", _after_flush):
    sa_event.listen(Session, "after_flush", _after_flush)
