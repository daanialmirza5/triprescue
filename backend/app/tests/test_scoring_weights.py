from app.engines.scoring_engine import weights_from_preferences


def test_balanced_preferences_give_equal_trade_off_weights():
    w = weights_from_preferences({})
    assert w.cost == w.time == 0.5
    assert w.disruption == w.comfort == 0.5
    assert w.risk == 0.6


def test_speed_slider_moves_weight_from_cost_to_time():
    w = weights_from_preferences({"costVsSpeed": 90})
    assert w.time > w.cost
    assert round(w.time + w.cost, 6) == 1.0


def test_priority_toggles_add_extra_weight():
    w = weights_from_preferences({"recoveryPriorities": {"minimizeCost": True, "maximizeComfort": True}})
    assert w.cost == 1.0 and w.time == 0.5
    assert w.comfort == 1.0 and w.disruption == 0.5


def test_missing_priorities_are_treated_as_off():
    assert weights_from_preferences({"recoveryPriorities": None}) == weights_from_preferences({})
