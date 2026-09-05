from datetime import datetime

from app.engines.propagation_engine import PropagationEngine
from app.tests.fixtures import ladakh_edges, ladakh_nodes


def _propagate(**overrides):
    engine = PropagationEngine()
    kwargs = dict(
        nodes=ladakh_nodes(),
        edges=ladakh_edges(),
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=180,
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    kwargs.update(overrides)
    return engine.propagate(**kwargs)


def test_no_disruption_leaves_everything_healthy():
    engine = PropagationEngine()
    result = engine.propagate(
        nodes=ladakh_nodes(),
        edges=ladakh_edges(),
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=0,
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    assert all(impact.status == "healthy" for impact in result.impacts.values())


def test_hero_scenario_bom_del_delayed_three_hours():
    """The full hero cascade from the spec, discovered by the engine - not hardcoded."""
    result = _propagate()
    impacts = result.impacts

    assert impacts["bom-del"].status == "delayed"
    assert impacts["bom-del"].delay_minutes == 180

    assert impacts["del-connection"].status == "delayed"

    leh = impacts["del-leh"]
    assert leh.status == "broken"
    assert leh.caused_by == "del-connection"
    assert leh.available_buffer_minutes == 0
    assert leh.required_buffer_minutes == 60
    assert "60 minutes" in leh.reason
    assert "0 minutes" in leh.reason

    assert impacts["airport-transfer"].status == "at-risk"
    assert impacts["airport-transfer"].caused_by == "del-leh"

    assert impacts["grand-dragon"].status == "at-risk"
    assert impacts["grand-dragon"].caused_by == "airport-transfer"

    assert impacts["pangong-tour"].status == "at-risk"

    # Far enough in the future to plausibly resolve before they matter.
    assert impacts["nubra-valley"].status == "healthy"
    assert impacts["leh-return"].status == "healthy"


def test_short_delay_does_not_break_the_connection():
    result = _propagate(delay_minutes=15)
    # Nominal gap is 90 minutes and the hard minimum is 60, so 15 minutes of
    # slippage is well within tolerance.
    assert result.impacts["del-leh"].status == "healthy"
    assert result.impacts["pangong-tour"].status == "healthy"


def test_flight_cancellation_breaks_hard_dependents():
    result = _propagate(disruption_type="flight-cancellation", delay_minutes=None)
    assert result.impacts["bom-del"].status == "cancelled"
    assert result.impacts["del-leh"].status == "broken"


def test_hotel_checkin_conflict_is_at_risk_not_broken():
    engine = PropagationEngine()
    result = engine.propagate(
        nodes=ladakh_nodes(),
        edges=ladakh_edges(),
        disrupted_node_id="grand-dragon",
        disruption_type="hotel-conflict",
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    assert result.impacts["grand-dragon"].status == "at-risk"
    # A check-in conflict is a small-blast-radius disruption: check-in still happens
    # close to schedule, so onward activities are unaffected - unlike a broken
    # flight, which leaves genuinely unknown arrival timing.
    assert result.impacts["pangong-tour"].status == "healthy"
    assert result.impacts["nubra-valley"].status == "healthy"


def test_activity_cancellation_only_affects_that_node():
    engine = PropagationEngine()
    result = engine.propagate(
        nodes=ladakh_nodes(),
        edges=ladakh_edges(),
        disrupted_node_id="pangong-tour",
        disruption_type="activity-cancellation",
        detected_at=datetime(2025, 9, 13, 6, 0),
    )
    assert result.impacts["pangong-tour"].status == "cancelled"
    # Pangong is a leaf node - nothing depends on it.
    assert result.impacts["nubra-valley"].status == "healthy"
    assert result.impacts["leh-return"].status == "healthy"


def test_transfer_failure_is_hard_break_but_does_not_reach_activities_two_days_out():
    engine = PropagationEngine()
    result = engine.propagate(
        nodes=ladakh_nodes(),
        edges=ladakh_edges(),
        disrupted_node_id="airport-transfer",
        disruption_type="transfer-failure",
        detected_at=datetime(2025, 9, 12, 11, 50),
    )
    assert result.impacts["airport-transfer"].status == "broken"
    assert result.impacts["grand-dragon"].status == "at-risk"
    assert result.impacts["nubra-valley"].status == "healthy"


def test_sequence_is_topologically_ordered():
    result = _propagate()
    seq = result.sequence
    assert seq.index("bom-del") < seq.index("del-connection") < seq.index("del-leh")
    assert seq.index("del-leh") < seq.index("airport-transfer") < seq.index("grand-dragon")
