from datetime import datetime

from app.engines.itinerary_engine import ItineraryEngine
from app.engines.types import EngineEdge, EngineNode


def node(id_, category, start, end, **kw):
    return EngineNode(id=id_, category=category, title=id_, location="Delhi (DEL)", scheduled_start=start, scheduled_end=end, **kw)


FLIGHT = node("flight", "flight", datetime(2025, 9, 12, 6, 30), datetime(2025, 9, 12, 8, 45), cost=6000)
TRANSFER = node("transfer", "transfer", datetime(2025, 9, 12, 10, 0), datetime(2025, 9, 12, 11, 0), cost=800)
HOTEL = node("hotel", "hotel", datetime(2025, 9, 12, 13, 0), datetime(2025, 9, 13, 11, 0), cost=4000)
EDGES = [
    EngineEdge("e1", "flight", "transfer", "hard", min_buffer_minutes=45, risk_buffer_minutes=30),
    EngineEdge("e2", "transfer", "hotel", "soft"),
]


def test_hard_connections_get_buffer_figures():
    snaps = {s.node_id: s for s in ItineraryEngine().compute_node_risks([FLIGHT, TRANSFER, HOTEL], EDGES)}
    transfer = snaps["transfer"]
    assert transfer.is_connection_risk
    assert (transfer.available_minutes, transfer.required_minutes, transfer.recommended_minutes) == (75, 45, 75)


def test_other_bookings_get_exposure_risk_only():
    snaps = {s.node_id: s for s in ItineraryEngine().compute_node_risks([FLIGHT, TRANSFER, HOTEL], EDGES)}
    for id_ in ("flight", "hotel"):
        assert not snaps[id_].is_connection_risk
        assert snaps[id_].available_minutes is None
        assert 0 <= snaps[id_].result.risk_percent <= 100


def test_shorter_buffers_mean_higher_connection_risk():
    tight = node("transfer", "transfer", datetime(2025, 9, 12, 9, 35), datetime(2025, 9, 12, 10, 35))
    roomy = node("transfer", "transfer", datetime(2025, 9, 12, 12, 0), datetime(2025, 9, 12, 13, 0))
    engine = ItineraryEngine()
    risk = lambda t: next(s for s in engine.compute_node_risks([FLIGHT, t], EDGES[:1]) if s.node_id == "transfer").result.risk_percent
    assert risk(tight) > risk(roomy)
