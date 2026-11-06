"""Regression tests for fixes that previously had no automated coverage:
connection-risk band consistency, refund notice, simulated-data labelling,
missing-traveler auth, resettable trips and exposed dependency data."""

from datetime import datetime

import pytest

import app.engines.recovery_engine as recovery_engine_module
from app.database.seed import DEFAULT_TRAVELER_ID
from app.database.session import get_db
from app.engines.financial_engine import FinancialEngine
from app.engines.propagation_engine import PropagationEngine
from app.engines.risk_engine import RiskEngine
from app.main import app
from app.models.traveler import DEFAULT_PREFERENCES, Traveler
from app.providers.mock_activity_provider import MockActivityProvider
from app.providers.mock_flight_provider import MockFlightProvider
from app.providers.mock_hotel_provider import MockHotelProvider
from app.providers.mock_transfer_provider import MockTransferProvider
from app.tests.fixtures import ladakh_edges, ladakh_nodes

TRIP = "trip-ladakh-2025"
DETECTED = datetime(2025, 9, 12, 6, 30)


@pytest.mark.parametrize("available", [30, 59, 60, 61, 75, 89, 90, 91, 120, 180, 240])
@pytest.mark.parametrize(
    ("location", "moment", "dependencies"),
    [("Leh (IXL)", datetime(2025, 9, 12, 10, 15), 0), ("Delhi (DEL) T3", datetime(2025, 9, 12, 23, 0), 6)],
)
def test_connection_risk_text_never_contradicts_its_level(available, location, moment, dependencies):
    result = RiskEngine().connection_risk(
        edge_label="e",
        available_minutes=available,
        required_minutes=60,
        recommended_minutes=90,
        location=location,
        moment=moment,
        dependency_count=dependencies,
    )
    if available < 60:
        assert result.risk_level == "high"
        assert "below the required" in result.reason
    elif available < 90:
        assert result.risk_level != "low"
        assert "falls short of the recommended" in result.reason
        assert "increases this buffer" in result.recommendation
    else:
        assert result.risk_level != "high"
        assert "meets the recommended" in result.reason
        assert "increases this buffer" not in result.recommendation


def _hero_plans(del_leh_refund_percentage: float, deadline_hours: int):
    nodes, edges = ladakh_nodes(), ladakh_edges()
    target = next(n for n in nodes if n.id == "del-leh")
    target.refundable, target.refund_percentage = True, del_leh_refund_percentage
    target.cancellation_deadline_hours = deadline_hours
    impacts = PropagationEngine().propagate(
        nodes=nodes, edges=edges, disrupted_node_id="bom-del", disruption_type="flight-delay",
        delay_minutes=180, detected_at=DETECTED,
    ).impacts
    engine = recovery_engine_module.RecoveryEngine(
        flight_provider=MockFlightProvider(), hotel_provider=MockHotelProvider(),
        activity_provider=MockActivityProvider(), transfer_provider=MockTransferProvider(),
    )
    return engine.generate_plans(nodes, edges, impacts, "bom-del", "flight-delay", 180, DETECTED, dict(DEFAULT_PREFERENCES))


def test_recovery_refund_uses_real_notice_not_zero():
    # del-leh (9200) departs 10:15; detected 06:30 -> 3.75h notice.
    within_deadline = _hero_plans(0.5, deadline_hours=3)
    late = _hero_plans(0.5, deadline_hours=5)
    assert {p.refund_recovered for p in within_deadline if p.feasible} == {4600.0}
    assert {p.refund_recovered for p in late if p.feasible} == {2300.0}


def test_financial_refund_exposure_uses_detection_time():
    nodes, edges = ladakh_nodes(), ladakh_edges()
    impacts = PropagationEngine().propagate(
        nodes=nodes, edges=edges, disrupted_node_id="bom-del", disruption_type="flight-delay",
        delay_minutes=180, detected_at=DETECTED,
    ).impacts
    engine = FinancialEngine()
    assert engine.summarize(nodes, impacts, DETECTED).potential_refund > engine.summarize(nodes, impacts).potential_refund


def test_recovery_options_are_labelled_simulated_under_mock_provider(client):
    client.post(f"/api/trips/{TRIP}/disruptions", json={"type": "flight-delay", "delayMinutes": 180})
    options = client.post(f"/api/trips/{TRIP}/recovery-options/generate").json()
    assert options
    assert {o["dataSource"] for o in options} == {"simulated"}


def test_anonymous_request_gets_401_when_demo_traveler_does_not_exist(client):
    db = next(app.dependency_overrides[get_db]())
    db.delete(db.get(Traveler, DEFAULT_TRAVELER_ID))
    db.commit()

    body = {"name": "X", "origin": "A", "destination": "B", "startDate": "2026-12-01", "endDate": "2026-12-03"}
    assert client.post("/api/trips", json=body).status_code == 401
    assert client.get("/api/trips").status_code == 401


def test_only_seeded_trips_are_resettable(client):
    assert client.get(f"/api/trips/{TRIP}").json()["resettable"] is True
    created = client.post(
        "/api/trips",
        json={"name": "Mine", "origin": "A", "destination": "B", "startDate": "2026-12-01", "endDate": "2026-12-03"},
    ).json()
    assert created["resettable"] is False


def test_edges_expose_hard_soft_dependency_and_min_buffer(client):
    edges = {(e["source"], e["target"]): e for e in client.get(f"/api/trips/{TRIP}").json()["edges"]}
    connection = edges[("del-connection", "del-leh")]
    assert connection["dependencyType"] == "hard"
    assert connection["minBufferMinutes"] == 60
    assert {e["dependencyType"] for e in edges.values()} <= {"hard", "soft"}
