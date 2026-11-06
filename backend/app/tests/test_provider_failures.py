from datetime import datetime

import pytest

from app.engines.propagation_engine import PropagationEngine
from app.engines.recovery_engine import RecoveryEngine
from app.providers.mock_activity_provider import MockActivityProvider
from app.providers.mock_flight_provider import MockFlightProvider
from app.providers.mock_hotel_provider import MockHotelProvider
from app.providers.mock_transfer_provider import MockTransferProvider
from app.providers.base import ProviderFailureError
from app.tests.fixtures import ladakh_edges, ladakh_nodes


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


def _engine(**overrides):
    providers = {
        "flight_provider": MockFlightProvider(),
        "hotel_provider": MockHotelProvider(),
        "activity_provider": MockActivityProvider(),
        "transfer_provider": MockTransferProvider(),
    }
    providers.update(overrides)
    return RecoveryEngine(**providers)


@pytest.mark.parametrize(
    "factory",
    [MockFlightProvider, MockHotelProvider, MockActivityProvider, MockTransferProvider],
)
def test_each_mock_provider_can_inject_timeout(factory):
    provider = factory(failure_mode="timeout")
    with pytest.raises(ProviderFailureError):
        if factory is MockFlightProvider:
            provider.get_alternatives("DEL", "IXL", datetime(2025, 9, 12, 9, 0))
        else:
            provider.get_alternatives("Leh" if factory is MockHotelProvider else ("Pangong Tso" if factory is MockActivityProvider else "Leh (IXL)"), datetime(2025, 9, 12, 9, 0))


@pytest.mark.parametrize(
    "factory,args",
    [
        (MockFlightProvider, ("DEL", "IXL", "2025-09-12")),
        (MockHotelProvider, ("Leh", "2025-09-12")),
        (MockActivityProvider, ("Pangong Tso", "2025-09-13")),
        (MockTransferProvider, ("Leh (IXL)", "2025-09-12")),
    ],
)
def test_each_mock_provider_can_inject_empty_results(factory, args):
    provider = factory(failure_mode="empty")
    assert provider.search(*args) == []


def test_flight_provider_timeout_becomes_explanatory_recovery_state():
    nodes, edges, impacts = _hero_impacts()
    plans = _engine(flight_provider=MockFlightProvider(failure_mode="timeout")).generate_plans(
        nodes, edges, impacts, "bom-del", "flight-delay", 180, datetime(2025, 9, 12, 6, 30), {}
    )
    assert len(plans) == 1
    assert plans[0].feasible is False
    assert plans[0].tag == "UNAVAILABLE"
    assert "timed out" in plans[0].provider_reason.lower()


def test_hotel_empty_result_becomes_explanatory_recovery_state():
    nodes, edges, impacts = _hero_impacts()
    # Force the hotel to be the only bookable recovery target.
    for impact in impacts.values():
        impact.status = "healthy"
    impacts["grand-dragon"].status = "at-risk"
    plans = _engine(hotel_provider=MockHotelProvider(failure_mode="empty")).generate_plans(
        nodes, edges, impacts, "grand-dragon", "hotel-conflict", None, datetime(2025, 9, 12, 6, 30), {}
    )
    assert plans and plans[0].feasible is False
    assert "no alternatives" in plans[0].provider_reason.lower()
