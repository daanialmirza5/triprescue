from types import SimpleNamespace

from app.services.recovery_narrative import OptionView, compare, executive_summary, rank


def view(id_="b", name="Plan B", score=70, cost=0.0, minutes=0, kept=4, total=4, risk="low"):
    return OptionView(id_, name, score, cost, minutes, kept, total, risk, True)


TOP = view("a", "Plan A", 90, cost=2000, minutes=60)


def test_states_each_trade_off_against_the_top_plan():
    text = compare(view(cost=500, minutes=185, kept=3, risk="high"), TOP)
    assert "saves ₹1,500" in text
    assert "arrives 2h 5m later" in text
    assert "keeps 3/4 bookings instead of 4" in text
    assert "leaves high residual risk" in text


def test_sooner_and_more_expensive():
    text = compare(view(cost=3000, minutes=30), TOP)
    assert "costs ₹1,000 more" in text and "arrives 30 min sooner" in text


def test_identical_trade_offs_say_so():
    assert "nearly identical trade-offs" in compare(view(cost=2000, minutes=60), TOP)


def test_rank_uses_orm_like_objects_and_skips_infeasible():
    rows = [
        SimpleNamespace(id=1, name="Low", score=40, cost_delta=None, time_impact_minutes=None, bookings_preserved=2,
                        total_bookings=4, residual_risk=SimpleNamespace(value="medium")),
        SimpleNamespace(id=2, name="High", score=95, cost_delta=0, time_impact_minutes=0, bookings_preserved=4,
                        total_bookings=4, residual_risk="low", feasible=False),
    ]
    ranked = rank(rows)
    assert [v.id for v in ranked] == ["1"]
    assert ranked[0].residual_risk == "medium" and ranked[0].cost_delta == 0.0


def test_summary_counts_alternatives():
    text = executive_summary(None, [TOP, view()])
    assert text.startswith("Recommended: “Plan A” — +₹2,000, +1h")
    assert text.endswith("1 alternative considered.")
