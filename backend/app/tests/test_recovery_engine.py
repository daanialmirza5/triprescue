from datetime import datetime

from app.engines.propagation_engine import PropagationEngine
from app.engines.recovery_engine import RecoveryEngine
from app.engines.types import EngineEdge, EngineNode
from app.providers.base import ActivityProvider, CancellationPolicy, ProviderAlternative
from app.providers.mock_activity_provider import MockActivityProvider
from app.providers.mock_flight_provider import MockFlightProvider
from app.providers.mock_hotel_provider import MockHotelProvider
from app.providers.mock_transfer_provider import MockTransferProvider
from app.tests.fixtures import ladakh_edges, ladakh_nodes

DEFAULT_PREFERENCES = {
    "costVsSpeed": 50,
    "disruptionVsComfort": 50,
    "recoveryPriorities": {
        "minimizeCost": False,
        "minimizeTime": False,
        "minimizeDisruption": True,
        "maximizeComfort": False,
    },
}


def _engine() -> RecoveryEngine:
    return RecoveryEngine(
        flight_provider=MockFlightProvider(),
        hotel_provider=MockHotelProvider(),
        activity_provider=MockActivityProvider(),
        transfer_provider=MockTransferProvider(),
    )


def _hero_impacts():
    nodes = ladakh_nodes()
    edges = ladakh_edges()
    result = PropagationEngine().propagate(
        nodes=nodes,
        edges=edges,
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=180,
        detected_at=datetime(2025, 9, 12, 6, 30),
    )
    return nodes, edges, result.impacts


def test_generates_at_least_three_feasible_plans_for_the_hero_scenario():
    nodes, edges, impacts = _hero_impacts()
    plans = _engine().generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    assert len(plans) >= 3
    assert all(p.feasible for p in plans)
    assert all(p.score > 0 for p in plans)


def test_plans_are_deterministic():
    nodes, edges, impacts = _hero_impacts()
    engine = _engine()
    plans_a = engine.generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    nodes2, edges2, impacts2 = _hero_impacts()
    plans_b = engine.generate_plans(
        nodes2, edges2, impacts2, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    assert [p.key for p in plans_a] == [p.key for p in plans_b]
    assert [p.score for p in plans_a] == [p.score for p in plans_b]


def test_premium_option_preserves_all_bookings():
    nodes, edges, impacts = _hero_impacts()
    plans = _engine().generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    premium = next(p for p in plans if "AI-445" in p.key)
    assert premium.bookings_preserved == premium.total_bookings


def test_overnight_option_reschedules_pangong_via_coordinated_action():
    nodes, edges, impacts = _hero_impacts()
    plans = _engine().generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    overnight = next(p for p in plans if "G8-201" in p.key)
    reschedule_actions = [a for a in overnight.actions if a.node_id == "pangong-tour"]
    assert reschedule_actions, "expected pangong-tour to have a coordinated reschedule action"
    assert reschedule_actions[0].change_type == "rescheduled"


def test_cost_preference_favors_cheaper_plan():
    nodes, edges, impacts = _hero_impacts()
    engine = _engine()
    cost_first_prefs = {**DEFAULT_PREFERENCES, "costVsSpeed": 0}
    plans = engine.generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), cost_first_prefs
    )
    assert "G8-201" in plans[0].key or "G8-208" in plans[0].key


def test_speed_preference_favors_faster_plan():
    nodes, edges, impacts = _hero_impacts()
    engine = _engine()
    speed_first_prefs = {**DEFAULT_PREFERENCES, "costVsSpeed": 100}
    plans = engine.generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), speed_first_prefs
    )
    assert "AI-445" in plans[0].key


def test_preference_shift_actually_changes_the_ranking():
    nodes, edges, impacts = _hero_impacts()
    engine = _engine()
    cost_prefs = {**DEFAULT_PREFERENCES, "costVsSpeed": 0}
    speed_prefs = {**DEFAULT_PREFERENCES, "costVsSpeed": 100}
    cost_ranked = engine.generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), cost_prefs
    )
    speed_ranked = engine.generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), speed_prefs
    )
    assert [p.key for p in cost_ranked] != [p.key for p in speed_ranked]


class _ChainActivityProvider(ActivityProvider):
    """A minimal activity provider whose two locations each have exactly one
    later alternative, used to force a two-hop chain: rescheduling the first
    activity is what creates the second activity's conflict."""

    _CATALOGUE: dict[str, list[ProviderAlternative]] = {
        "Site A": [
            ProviderAlternative(
                id="site-a-2",
                provider="Chain Tours",
                confirmation_hint="CA-2",
                origin="",
                destination="Site A",
                departure=datetime(2025, 9, 13, 15, 0),
                arrival=datetime(2025, 9, 13, 18, 0),
                cost=1000,
                tier="standard",
                refundable=False,
                refund_percentage=0.0,
                cancellation_deadline_hours=24,
            ),
        ],
        "Site B": [
            ProviderAlternative(
                id="site-b-2",
                provider="Chain Tours",
                confirmation_hint="CB-2",
                origin="",
                destination="Site B",
                departure=datetime(2025, 9, 13, 19, 0),
                arrival=datetime(2025, 9, 13, 22, 0),
                cost=1000,
                tier="standard",
                refundable=False,
                refund_percentage=0.0,
                cancellation_deadline_hours=24,
            ),
        ],
    }

    def search(self, location: str, date: str) -> list[ProviderAlternative]:
        return list(self._CATALOGUE.get(location, []))

    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]:
        return sorted(
            [o for o in self._CATALOGUE.get(location, []) if o.departure >= after], key=lambda o: o.departure
        )

    def get_booking(self, confirmation: str) -> ProviderAlternative | None:
        return None

    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy:
        return CancellationPolicy(False, 0.0, 0, "n/a")


def _chained_conflict_graph():
    """flight-x (delayed) -> activity-a (soft, tight buffer -> at-risk) ->
    activity-b (soft, comfortable buffer against activity-a's ORIGINAL timing).
    Moving activity-a to its next available slot (6h later) is what pushes
    activity-b into conflict - that only shows up in the re-propagation after
    activity-a's move, not in the impacts the resolver started with."""
    nodes = [
        EngineNode(
            id="flight-x",
            category="flight",
            title="Flight X",
            location="Origin",
            scheduled_start=datetime(2025, 9, 13, 6, 0),
            scheduled_end=datetime(2025, 9, 13, 7, 0),
            flexible=False,
            origin_code="AAA",
            destination_code="BBB",
        ),
        EngineNode(
            id="activity-a",
            category="activity",
            title="Activity A",
            location="Site A",
            scheduled_start=datetime(2025, 9, 13, 9, 0),
            scheduled_end=datetime(2025, 9, 13, 12, 0),
            flexible=False,
        ),
        EngineNode(
            id="activity-b",
            category="activity",
            title="Activity B",
            location="Site B",
            scheduled_start=datetime(2025, 9, 13, 13, 0),
            scheduled_end=datetime(2025, 9, 13, 16, 0),
            flexible=False,
        ),
    ]
    edges = [
        EngineEdge("e1", "flight-x", "activity-a", "soft", min_buffer_minutes=60),
        EngineEdge("e2", "activity-a", "activity-b", "soft", min_buffer_minutes=15),
    ]
    return nodes, edges


def test_activity_conflict_resolution_converges_on_chained_conflicts():
    nodes, edges = _chained_conflict_graph()
    detected_at = datetime(2025, 9, 13, 6, 0)
    result = PropagationEngine().propagate(
        nodes=nodes,
        edges=edges,
        disrupted_node_id="flight-x",
        disruption_type="flight-delay",
        delay_minutes=90,
        detected_at=detected_at,
    )
    impacts = dict(result.impacts)
    # Sanity check on the fixture: only activity-a should start out at-risk;
    # activity-b's dependency on activity-a's ORIGINAL schedule is still fine.
    assert impacts["activity-a"].status == "at-risk"
    assert impacts["activity-b"].status != "at-risk"

    engine = RecoveryEngine(
        flight_provider=MockFlightProvider(),
        hotel_provider=MockHotelProvider(),
        activity_provider=_ChainActivityProvider(),
        transfer_provider=MockTransferProvider(),
    )
    working_nodes = {n.id: n for n in nodes}
    actions, final_nodes, final_impacts = engine._resolve_activity_conflicts(
        working_nodes, edges, impacts, "flight-x", "flight-delay", 90, detected_at
    )

    resolved_ids = {a.node_id for a in actions}
    assert resolved_ids == {"activity-a", "activity-b"}, (
        "expected a second pass to catch the conflict activity-a's own move created for activity-b"
    )
    assert final_impacts["activity-a"].status != "at-risk"
    assert final_impacts["activity-b"].status != "at-risk"


def test_no_recovery_needed_when_nothing_is_broken():
    nodes = ladakh_nodes()
    edges = ladakh_edges()
    healthy_impacts = PropagationEngine().propagate(
        nodes=nodes,
        edges=edges,
        disrupted_node_id="bom-del",
        disruption_type="flight-delay",
        delay_minutes=0,
        detected_at=datetime(2025, 9, 12, 6, 30),
    ).impacts
    plans = _engine().generate_plans(
        nodes, edges, healthy_impacts, "bom-del", "flight-delay", 0, datetime(2025, 9, 12, 6, 30), DEFAULT_PREFERENCES
    )
    assert plans == []
