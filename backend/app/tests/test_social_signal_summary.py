from app.schemas.social_signals import SocialSignalOut, SocialSignalsOut
from app.services.social_signals_service import _summarize, intensity_by_node


def signal(id_, kind, urgency, intensity, minutes_ago=5, nodes=("a",), sentiment=-0.5):
    return SocialSignalOut(id=id_, type=kind, location="Leh", node_ids=list(nodes), urgency=urgency,
                           sentiment=sentiment, intensity=intensity, text=f"{id_} text", minutes_ago=minutes_ago)


def test_most_urgent_signals_come_first():
    out = _summarize("t", [signal("low", "crowd_surge", "low", 0.2), signal("crit", "road_waterlogging", "critical", 0.9),
                           signal("high-old", "weather_warning", "high", 0.7, 30), signal("high-new", "weather_warning", "high", 0.6, 2)])
    assert [s.id for s in out.signals] == ["crit", "high-new", "high-old", "low"]
    assert out.summary == "4 ground report(s); most urgent: crit text"


def test_all_clear_reads_as_normal():
    out = _summarize("t", [signal("ok", "all_clear", "low", 0.05, sentiment=0.45)])
    assert out.summary == "Ground conditions look normal across your trip."
    assert out.overall_sentiment == 0.45


def test_no_signals():
    out = _summarize("t", [])
    assert out.signals == [] and out.overall_sentiment == 0.0


def test_each_booking_takes_its_strongest_signal_and_ignores_all_clear():
    signals = SocialSignalsOut(trip_id="t", overall_sentiment=0, summary="", signals=[
        signal("1", "crowd_surge", "medium", 0.4, nodes=("a", "b")),
        signal("2", "road_waterlogging", "high", 0.8, nodes=("b",)),
        signal("3", "all_clear", "low", 0.9, nodes=("c",)),
    ])
    assert intensity_by_node(signals) == {"a": 0.4, "b": 0.8}
