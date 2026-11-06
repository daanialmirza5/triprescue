"""Pipeline trace layer: pass-through without a run, real events with one."""

import pytest

from app.core import pipeline_trace
from app.core.pipeline_trace import create_run, source_of, traced


@traced("service", "Adding numbers", detail=lambda r, a, k: {"sum": r})
def _add(a, b):
    return a + b


@traced("service", "Always fails")
def _boom():
    raise ValueError("nope")


def test_without_a_run_it_is_a_plain_call():
    assert pipeline_trace.current() is None
    assert _add(2, 3) == 5


def test_with_a_run_it_emits_running_and_completed_events():
    run = create_run(workflow="test", mode="live", data_source="demo")
    token = pipeline_trace.activate(run)
    try:
        assert _add(2, 3) == 5
        with pytest.raises(ValueError):
            _boom()
    finally:
        pipeline_trace.deactivate(token)
    statuses = [(e["function"], e["status"]) for e in run.events]
    assert statuses == [("_add", "running"), ("_add", "completed"), ("_boom", "running"), ("_boom", "failed")]
    done = run.events[1]
    assert done["detail"] == {"sum": 5} and done["durationMs"] >= 0
    assert done["file"] == "backend/app/tests/test_pipeline_trace.py" and done["line"] > 0
    assert run.events[3]["error"] == "ValueError"


def test_source_of_reports_repo_relative_location():
    src = source_of(_add)
    assert src["file"].startswith("backend/app/") and isinstance(src["line"], int)
