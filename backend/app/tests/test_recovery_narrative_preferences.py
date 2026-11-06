from app.services.recovery_narrative import describe_preferences

NOTHING_ON = {"recoveryPriorities": {"minimizeDisruption": False}}


def test_defaults_favour_keeping_bookings():
    # DEFAULT_PREFERENCES switches minimizeDisruption on.
    assert describe_preferences(None) == "changing as few bookings as possible"


def test_neutral_sliders_with_no_priorities_describe_a_balance():
    assert describe_preferences(NOTHING_ON) == "a balance of speed, cost and comfort"


def test_speed_and_comfort_sliders():
    text = describe_preferences({"costVsSpeed": 80, "disruptionVsComfort": 80})
    assert text == "arriving sooner and a more comfortable journey"


def test_cost_and_fewest_changes():
    text = describe_preferences({"costVsSpeed": 20, "disruptionVsComfort": 20})
    assert text == "keeping extra cost low and changing as few bookings as possible"


def test_partial_priorities_keep_the_other_defaults():
    text = describe_preferences({"recoveryPriorities": {"minimizeTime": True}})
    assert text == "arriving sooner and changing as few bookings as possible"
