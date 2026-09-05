from datetime import datetime

from app.engines.itinerary_engine import ItineraryEngine
from app.engines.risk_engine import RiskEngine
from app.tests.fixtures import ladakh_edges, ladakh_nodes


def test_tight_buffer_scores_higher_risk_than_generous_buffer():
    engine = RiskEngine()
    tight = engine.connection_risk(
        edge_label="e",
        available_minutes=65,
        required_minutes=60,
        recommended_minutes=90,
        location="Delhi (DEL) T3",
        moment=datetime(2025, 9, 12, 10, 15),
        dependency_count=4,
    )
    generous = engine.connection_risk(
        edge_label="e",
        available_minutes=240,
        required_minutes=60,
        recommended_minutes=90,
        location="Delhi (DEL) T3",
        moment=datetime(2025, 9, 12, 10, 15),
        dependency_count=4,
    )
    assert tight.risk_percent > generous.risk_percent
    assert tight.risk_level in ("medium", "high")
    assert generous.risk_level == "low"


def test_non_refundable_booking_has_higher_exposure_risk():
    engine = RiskEngine()
    non_refundable = engine.exposure_risk(
        provider="Ladakh Adventures",
        cost=4800,
        refundable=False,
        refund_percentage=0.0,
        dependency_count=0,
        moment=datetime(2025, 9, 13, 6, 0),
    )
    refundable = engine.exposure_risk(
        provider="Ladakh Adventures",
        cost=4800,
        refundable=True,
        refund_percentage=1.0,
        dependency_count=0,
        moment=datetime(2025, 9, 13, 6, 0),
    )
    assert non_refundable.risk_percent > refundable.risk_percent


def test_trip_resilience_drops_as_average_risk_and_exposure_rise():
    engine = RiskEngine()
    calm = engine.trip_resilience([10, 15, 20], financial_exposure_ratio=0.1)
    stressed = engine.trip_resilience([70, 80, 90], financial_exposure_ratio=0.8)
    assert calm > stressed


def test_itinerary_engine_health_score_is_not_hardcoded_and_reacts_to_disruption():
    from app.engines.propagation_engine import PropagationEngine

    nodes = ladakh_nodes()
    edges = ladakh_edges()
    itinerary_engine = ItineraryEngine()

    healthy_score = itinerary_engine.compute_health_score(nodes, edges)

    disrupted = PropagationEngine().propagate(
        nodes=nodes,
        edges=edges,
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=180,
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    disrupted_score = itinerary_engine.compute_health_score(nodes, edges, disrupted.impacts)

    assert 0 <= healthy_score <= 100
    assert 0 <= disrupted_score <= 100
    assert disrupted_score < healthy_score
