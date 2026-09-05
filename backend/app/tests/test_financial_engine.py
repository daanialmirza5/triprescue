from app.engines.financial_engine import FinancialEngine
from app.engines.propagation_engine import PropagationEngine
from app.tests.fixtures import ladakh_edges, ladakh_nodes
from datetime import datetime


def test_summary_with_no_impacts_has_no_at_risk_value():
    engine = FinancialEngine()
    summary = engine.summarize(ladakh_nodes())
    assert summary.at_risk_value == 0
    assert summary.total_trip_value == sum(n.cost for n in ladakh_nodes())


def test_summary_after_hero_disruption_reflects_broken_and_at_risk_nodes():
    nodes = ladakh_nodes()
    result = PropagationEngine().propagate(
        nodes=nodes,
        edges=ladakh_edges(),
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=180,
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    engine = FinancialEngine()
    summary = engine.summarize(nodes, result.impacts)

    non_healthy_ids = {nid for nid, i in result.impacts.items() if i.status != "healthy"}
    expected_at_risk = sum(n.cost for n in nodes if n.id in non_healthy_ids)
    assert summary.at_risk_value == round(expected_at_risk, 2)
    assert summary.at_risk_value > 0
    assert summary.refundable_value + summary.non_refundable_value == summary.total_trip_value
