"""Recovery narrative + free-text disruption extraction (no LLM key configured,
so these exercise the deterministic paths the app relies on offline)."""

from types import SimpleNamespace

import pytest

from app.services import disruption_extraction, recovery_narrative


# ---- Extraction heuristics ---------------------------------------------------------------


@pytest.mark.parametrize(
    "text, dtype, delay, flight",
    [
        ("IndiGo 6E 2173 BOM-DEL is delayed by 1 hr 35 min. We regret the inconvenience.", "flight-delay", 95, "6E 2173"),
        ("Dear customer, your flight AI-865 is now expected to depart at 11:50 instead of 10:15.", "flight-delay", 95, "AI 865"),
        ("UA901 delayed +95 mins due to ATC congestion", "flight-delay", 95, "UA 901"),
        ("We're sorry - flight G8 204 from DEL to IXL has been cancelled.", "flight-cancellation", None, "G8 204"),
        ("Your delay is approx 2.5 hours for SQ 511", "flight-delay", 150, "SQ 511"),
        ("Your cab driver did not arrive at the pickup point", "transfer-failure", None, None),
        ("Hotel reservation cancelled: Taj Hotel Agra", "hotel-cancellation", None, None),
    ],
)
def test_extracts_common_notice_formats(text, dtype, delay, flight):
    result = disruption_extraction.extract(text)
    assert result.type == dtype
    assert result.delay_minutes == delay
    assert result.flight_number == flight
    assert 0 < result.confidence <= 1


def test_gate_change_is_informational_not_a_disruption():
    result = disruption_extraction.extract("Gate change: flight 6E 2173 now departs from Gate 42B.")
    assert result.type is None
    assert result.gate == "42B"
    assert "no schedule impact" in disruption_extraction.summarize(result, None)


def test_unrelated_text_has_low_confidence():
    result = disruption_extraction.extract("Looking forward to the trip!")
    assert result.type is None
    assert result.confidence < 0.5


# ---- Narrative -----------------------------------------------------------------------


def _opt(id, name, score, cost, minutes, kept=7, risk="low"):
    return SimpleNamespace(id=id, name=name, score=score, cost_delta=cost, time_impact_minutes=minutes,
                           bookings_preserved=kept, total_bookings=7, residual_risk=risk, feasible=True)


def test_narrative_explains_ranking_against_preferences():
    options = [
        _opt("b", "Next day flight", 70, 2600, 1245, risk="medium"),
        _opt("a", "Rebook G8-208", 88, 4200, 195),
    ]
    prefs = {"costVsSpeed": 85, "disruptionVsComfort": 30, "recoveryPriorities": {"minimizeTime": True}}
    text = recovery_narrative.narrative("Flight delayed 95 min", options, prefs)
    assert text.startswith("You asked Safar Sathi to favour arriving sooner")
    assert "“Rebook G8-208” ranked first (88/100)" in text
    assert "saves ₹1,600" in text and "arrives 17h 30m later" in text
    notes = recovery_narrative.option_notes(options, prefs)
    assert set(notes) == {"a", "b"}
    summary = recovery_narrative.executive_summary("Flight delayed 95 min", options)
    assert "Recommended: “Rebook G8-208”" in summary and "1 alternative considered" in summary


def test_narrative_handles_no_feasible_options():
    infeasible = SimpleNamespace(**{**vars(_opt("x", "None", 0, 0, 0)), "feasible": False})
    assert "No feasible recovery plan" in recovery_narrative.narrative("Delay", [infeasible], None)


# ---- API --------------------------------------------------------------------------------


def _disrupt(client):
    resp = client.post("/api/trips/trip-ladakh-2025/disruptions", json={"type": "flight-delay", "delayMinutes": 180})
    assert resp.status_code == 200
    return client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").json()


def test_generated_options_carry_narratives(client):
    options = _disrupt(client)
    feasible = [o for o in options if o["feasible"]]
    assert feasible and all(o["narrative"] for o in feasible)


def test_recovery_narrative_endpoint(client):
    options = _disrupt(client)
    resp = client.post("/api/assistant/recovery-narrative", json={"tripId": "trip-ladakh-2025"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "deterministic"
    assert body["executiveSummary"] and body["narrative"]
    assert body["topOptionId"] in {o["id"] for o in options}


def _nugen(handler):
    import httpx

    from app.core.nugen_client import NugenClient

    return NugenClient(api_key="key", model_id="safar-sathi-travel-twin-v1", base_url="https://api.nugen.in",
                       http_client=httpx.Client(transport=httpx.MockTransport(handler)))


def test_recovery_narrative_uses_nugen_when_configured(client, monkeypatch):
    import httpx

    from app.services import nugen_service

    sent = {}

    def handler(request):
        sent["body"] = request.content.decode()
        return httpx.Response(200, json={"choices": [{"message": {"content": "Nugen ranking explanation."}}]})

    monkeypatch.setattr(nugen_service, "_client", _nugen(handler))
    _disrupt(client)
    body = client.post("/api/assistant/recovery-narrative", json={"tripId": "trip-ladakh-2025"}).json()
    assert body["source"] == "nugen" and body["narrative"] == "Nugen ranking explanation."
    assert "options_ranked" in sent["body"]  # grounded in the engine's ranking


def test_recovery_narrative_falls_back_when_nugen_fails(client, monkeypatch):
    import httpx

    from app.services import nugen_service

    monkeypatch.setattr(nugen_service, "_client", _nugen(lambda r: httpx.Response(503)))
    _disrupt(client)
    body = client.post("/api/assistant/recovery-narrative", json={"tripId": "trip-ladakh-2025"}).json()
    assert body["source"] == "deterministic" and body["narrative"]


def test_recovery_narrative_without_disruption(client):
    resp = client.post("/api/assistant/recovery-narrative", json={"tripId": "trip-ladakh-2025"})
    assert resp.status_code == 200
    assert "No active disruption" in resp.json()["executiveSummary"]


def test_extract_endpoint_matches_trip_booking(client):
    resp = client.post(
        "/api/assistant/extract-disruption",
        json={"text": "IndiGo 6E-3014 BOM-DEL delayed by 2 hours", "tripId": "trip-ladakh-2025"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["type"] == "flight-delay"
    assert body["delayMinutes"] == 120
    assert body["primaryNodeId"] == "bom-del"
    assert body["confidence"] >= 0.8


def test_extract_endpoint_rejects_foreign_trip_and_empty_text(client):
    assert client.post("/api/assistant/extract-disruption", json={"text": "delayed", "tripId": "nope"}).status_code == 404
    assert client.post("/api/assistant/extract-disruption", json={"text": "   "}).status_code == 422
