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


def _road_risk(hour, road=True, available=100):
    from datetime import datetime as _dt

    from app.engines.risk_engine import RiskEngine as _RE

    return _RE().connection_risk(
        edge_label="e", available_minutes=available, required_minutes=60, recommended_minutes=90,
        location="Leh", moment=_dt(2026, 1, 5, hour, 0), dependency_count=1, road=road,
    )


def test_peak_hour_road_traffic_raises_transfer_risk_and_says_it_is_modelled():
    peak, off_peak = _road_risk(9), _road_risk(14)
    assert peak.risk_percent > off_peak.risk_percent
    assert any("peak traffic hours" in f and "modelled" in f for f in peak.contributing_factors)
    assert not any("peak traffic" in f for f in off_peak.contributing_factors)


def test_traffic_model_only_applies_to_road_legs():
    assert _road_risk(9, road=False).risk_percent == _road_risk(14, road=False).risk_percent


def test_traffic_never_moves_a_score_across_its_band():
    # A buffer that meets the recommendation stays below "high" even at rush hour.
    assert _road_risk(18, available=200).risk_percent <= 59
