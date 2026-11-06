from types import SimpleNamespace

from app.services.converters import refresh_dependency_counts


def nodes(*ids):
    return [SimpleNamespace(id=i, dependency_count=99) for i in ids]


def edge(source, target):
    return SimpleNamespace(source_id=source, target_id=target)


def test_counts_every_booking_downstream():
    trip = nodes("flight", "transfer", "hotel", "tour")
    refresh_dependency_counts(trip, [edge("flight", "transfer"), edge("transfer", "hotel"), edge("hotel", "tour")])
    assert {n.id: n.dependency_count for n in trip} == {"flight": 3, "transfer": 2, "hotel": 1, "tour": 0}


def test_shared_downstream_bookings_are_counted_once():
    trip = nodes("a", "b", "c", "d")
    refresh_dependency_counts(trip, [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")])
    assert trip[0].dependency_count == 3


def test_stale_counts_are_reset_without_edges():
    trip = nodes("solo")
    refresh_dependency_counts(trip, [])
    assert trip[0].dependency_count == 0
