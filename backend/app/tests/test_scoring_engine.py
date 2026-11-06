from app.engines.scoring_engine import CandidateMetrics, ScoringEngine, ScoringWeights, weights_from_preferences


def candidate(id_, cost=0.0, refund=0.0, minutes=0, kept=4, total=4, risk=10, comfort=60):
    return CandidateMetrics(id_, cost, refund, minutes, kept, total, risk, comfort)


def scores(candidates, prefs=None):
    return {s.id: s for s in ScoringEngine().score_candidates(candidates, weights_from_preferences(prefs or {}))}


def test_no_candidates_scores_nothing():
    assert ScoringEngine().score_candidates([], ScoringWeights(1, 1, 1, 1, 1)) == []


def test_cost_and_speed_are_relative_to_the_other_plans():
    result = scores([candidate("cheap", cost=0, minutes=300), candidate("fast", cost=9000, minutes=30)])
    assert result["cheap"].breakdown["cost"] == 100 and result["fast"].breakdown["cost"] == 0
    assert result["fast"].breakdown["speed"] == 100 and result["cheap"].breakdown["speed"] == 0


def test_refunds_reduce_the_net_cost():
    result = scores([candidate("a", cost=5000, refund=4000), candidate("b", cost=2000)])
    assert result["a"].breakdown["cost"] > result["b"].breakdown["cost"]


def test_identical_plans_get_the_same_neutral_score():
    result = scores([candidate("a"), candidate("b")])
    assert result["a"].breakdown == result["b"].breakdown
    assert result["a"].breakdown["cost"] == 80


def test_preferences_change_the_winner():
    plans = [candidate("cheap", cost=0, minutes=300), candidate("fast", cost=9000, minutes=30)]
    by_speed = scores(plans, {"costVsSpeed": 95, "recoveryPriorities": {"minimizeTime": True}})
    by_cost = scores(plans, {"costVsSpeed": 5, "recoveryPriorities": {"minimizeCost": True}})
    assert by_speed["fast"].score > by_speed["cheap"].score
    assert by_cost["cheap"].score > by_cost["fast"].score


def test_preservation_and_risk_are_absolute():
    result = scores([candidate("a", kept=1, total=4, risk=70), candidate("b", kept=0, total=0, risk=120)])
    assert result["a"].breakdown["preservation"] == 25
    assert result["a"].breakdown["risk"] == 30
    assert result["b"].breakdown["preservation"] == 0
    assert result["b"].breakdown["risk"] == 0
