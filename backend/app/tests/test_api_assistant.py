import json
from types import SimpleNamespace

import pytest

from app.services.assistant_service import _breakdown_component


def _trigger_hero_disruption(client):
    return client.post(
        "/api/trips/trip-ladakh-2025/disruptions",
        json={"type": "flight-delay", "delayMinutes": 180},
    )


def test_why_question_before_recovery_is_applied_does_not_crash(client):
    """Regression test: asking a 'why' question while recovery options exist
    but none has been applied yet used to raise
    `AttributeError: 'dict' object has no attribute 'cost'` - RecoveryPlan.
    score_breakdown is a raw JSON dict on the ORM model (see
    app/models/recovery.py), never a ScoreBreakdownOut instance, and the
    pre-apply "why" branch was accessing it with attribute syntax instead of
    dict access."""
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    top = max(options, key=lambda o: o["score"])

    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"  # no ANTHROPIC_API_KEY set in tests
    assert top["name"] in body["content"]
    assert "cost score" in body["content"]
    assert "n/a" not in body["content"]  # real breakdown data was present, not a fallback
    assert any(ref["id"] == top["id"] for ref in body["references"])


def test_why_question_after_recovery_is_applied_still_works(client):
    """The post-apply branch already used dict.get() correctly - confirms the
    pre-apply fix didn't change this existing, working behavior."""
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    best = options[0]
    client.post("/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": best["id"]})

    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert best["name"] in body["content"]
    assert "was applied because it scored highest" in body["content"]


def test_assistant_with_no_active_disruption_uses_deterministic_fallback(client):
    """No ANTHROPIC_API_KEY is set in the test environment, so every request
    exercises the deterministic responder - this asserts that explicitly
    rather than only incidentally, and covers the "why" keyword on a healthy
    trip (no disruption, no recovery options) without crashing."""
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "Why is this recovery recommended?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert "healthy" in body["content"].lower()


def test_breakdown_component_handles_missing_or_partial_data_without_crashing():
    breakdown = {"cost": 42, "speed": 90}
    assert _breakdown_component(breakdown, "cost") == "42"
    assert _breakdown_component(breakdown, "risk") == "n/a"
    assert _breakdown_component({}, "cost") == "n/a"


def test_assistant_rejects_empty_or_whitespace_only_message(client):
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "   "},
    )
    assert resp.status_code == 422


def test_assistant_rejects_missing_trip_id(client):
    resp = client.post(
        "/api/assistant",
        json={"tripId": "   ", "message": "What is the status?"},
    )
    assert resp.status_code == 422


def test_assistant_rejects_excessively_long_message(client):
    oversized_message = "A" * 2001
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": oversized_message},
    )
    assert resp.status_code == 422


def test_assistant_response_has_no_proposed_recovery_without_llm(client):
    """proposedRecoveryId must default to None when no ANTHROPIC_API_KEY is
    set, since the deterministic fallback path never proposes a recovery."""
    _trigger_hero_disruption(client)
    client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-ladakh-2025", "message": "What should I do?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert "proposedRecoveryId" in body and body["proposedRecoveryId"] is None


def test_assistant_unknown_trip_returns_404(client):
    resp = client.post(
        "/api/assistant",
        json={"tripId": "trip-non-existent-9999", "message": "What is the status?"},
    )
    assert resp.status_code == 404


# ---- Tool-calling loop (fake Anthropic client; no network, no real key) --------------


class _FakeAnthropic:
    """Replays scripted turns and records every request the loop sends."""

    script: list = []
    requests: list = []

    def __init__(self, api_key=None):
        self.messages = self

    def create(self, **kwargs):
        # The loop keeps appending to one messages list; snapshot it per call.
        _FakeAnthropic.requests.append({**kwargs, "messages": list(kwargs["messages"])})
        return _FakeAnthropic.script.pop(0)


def _tool_turn(*calls):
    return SimpleNamespace(
        stop_reason="tool_use",
        content=[SimpleNamespace(type="tool_use", id=f"tu-{i}", name=name, input=args) for i, (name, args) in enumerate(calls)],
    )


def _text_turn(text):
    return SimpleNamespace(stop_reason="end_turn", content=[SimpleNamespace(type="text", text=text)])


@pytest.fixture()
def fake_llm(monkeypatch):
    import anthropic

    from app.config import Settings
    from app.services import assistant_service

    monkeypatch.setattr(assistant_service, "get_settings", lambda: Settings(_env_file=None, anthropic_api_key="test-key"))
    monkeypatch.setattr(anthropic, "Anthropic", _FakeAnthropic)
    _FakeAnthropic.script, _FakeAnthropic.requests = [], []
    return _FakeAnthropic


def _ask(client, message="What should I do about this delay?"):
    resp = client.post("/api/assistant", json={"tripId": "trip-ladakh-2025", "message": message})
    assert resp.status_code == 200
    return resp.json()


def test_tool_loop_proposes_a_recovery_without_applying_it(client, fake_llm):
    _trigger_hero_disruption(client)
    options = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()
    target = options[0]["id"]
    fake_llm.script = [
        _tool_turn(("get_impact", {}), ("list_recovery_options", {})),
        _tool_turn(("propose_apply_recovery", {"recovery_id": target})),
        _text_turn("I recommend the top option - confirm to apply it."),
    ]

    body = _ask(client)

    assert body["source"] == "llm"
    assert body["proposedRecoveryId"] == target
    # All three tools were offered, and every tool call got a matching tool_result.
    assert [t["name"] for t in fake_llm.requests[0]["tools"]] == ["get_impact", "list_recovery_options", "propose_apply_recovery"]
    results = [b for b in fake_llm.requests[1]["messages"][-1]["content"]]
    assert [r["tool_use_id"] for r in results] == ["tu-0", "tu-1"]
    listed = json.loads(results[1]["content"])
    assert target in {o["id"] for o in listed}
    proposal = json.loads(fake_llm.requests[2]["messages"][-1]["content"][0]["content"])
    assert proposal == {"recovery_id": target, "status": "awaiting_user_confirmation"}

    # Nothing was applied: the trip is still disrupted and the plan is still open.
    assert client.get("/api/trips/trip-ladakh-2025").json()["status"] != "recovered"
    still_open = client.get("/api/trips/trip-ladakh-2025/recovery-options").json()
    assert target in {o["id"] for o in still_open}
    # Listing via the tool didn't regenerate plans (ids are unchanged).
    assert [o["id"] for o in still_open] == [o["id"] for o in options]


def test_tool_loop_refuses_to_propose_an_unknown_plan(client, fake_llm):
    _trigger_hero_disruption(client)
    client.post("/api/trips/trip-ladakh-2025/recovery-options/generate")
    fake_llm.script = [
        _tool_turn(("propose_apply_recovery", {"recovery_id": "recovery-made-up"})),
        _text_turn("Sorry, that plan isn't available."),
    ]

    body = _ask(client)

    assert body["proposedRecoveryId"] is None
    refusal = json.loads(fake_llm.requests[1]["messages"][-1]["content"][0]["content"])
    assert "error" in refusal


def test_tool_failure_is_reported_to_the_model_not_the_traveler(client, fake_llm, monkeypatch):
    from app.services import assistant_service

    def boom(*args, **kwargs):
        raise RuntimeError("impact engine down")

    monkeypatch.setattr(assistant_service, "_tool_get_impact", boom)
    _trigger_hero_disruption(client)
    fake_llm.script = [_tool_turn(("get_impact", {})), _text_turn("Here is what I know so far.")]

    body = _ask(client)

    assert body["source"] == "llm" and body["content"] == "Here is what I know so far."
    assert json.loads(fake_llm.requests[1]["messages"][-1]["content"][0]["content"]) == {"error": "Tool get_impact failed"}


def test_llm_failure_or_endless_tool_use_falls_back_to_deterministic(client, fake_llm):
    _trigger_hero_disruption(client)
    # Four tool turns and never a text answer: the loop gives up after max_iterations.
    fake_llm.script = [_tool_turn(("get_impact", {})) for _ in range(4)]
    body = _ask(client)
    assert body["source"] == "deterministic" and body["proposedRecoveryId"] is None
    assert len(fake_llm.requests) == 4

    fake_llm.script = []  # the next create() raises IndexError, like an outage would
    body = _ask(client)
    assert body["source"] == "deterministic" and body["proposedRecoveryId"] is None

