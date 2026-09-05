"""ScoringEngine: multi-criteria recovery plan scoring driven by traveler weights.

Every factor is normalized relative to the OTHER candidates being compared (min-max
scaling), so a score is always "how good is this plan relative to its alternatives"
rather than an arbitrary absolute number. The weights come entirely from traveler
preferences (see weights_from_preferences) - nothing about the ranking is decided
in the frontend.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ScoringWeights:
    cost: float
    time: float
    disruption: float
    risk: float
    comfort: float


def weights_from_preferences(preferences: dict) -> ScoringWeights:
    cost_vs_speed = preferences.get("costVsSpeed", 50)
    disruption_vs_comfort = preferences.get("disruptionVsComfort", 50)
    priorities = preferences.get("recoveryPriorities", {}) or {}

    cost_w = (100 - cost_vs_speed) / 100 + (0.5 if priorities.get("minimizeCost") else 0)
    time_w = cost_vs_speed / 100 + (0.5 if priorities.get("minimizeTime") else 0)
    disruption_w = (100 - disruption_vs_comfort) / 100 + (0.5 if priorities.get("minimizeDisruption") else 0)
    comfort_w = disruption_vs_comfort / 100 + (0.5 if priorities.get("maximizeComfort") else 0)
    risk_w = 0.6

    return ScoringWeights(cost_w, time_w, disruption_w, risk_w, comfort_w)


@dataclass
class CandidateMetrics:
    id: str
    cost_delta: float
    refund_recovered: float
    time_impact_minutes: int
    bookings_preserved: int
    total_bookings: int
    residual_risk_percent: int
    comfort_score: int


@dataclass
class ScoredCandidate:
    id: str
    score: int
    breakdown: dict[str, int]


def _normalize(values: list[float], higher_is_better: bool) -> list[int]:
    if not values:
        return []
    lo, hi = min(values), max(values)
    if hi == lo:
        return [80 for _ in values]
    if higher_is_better:
        return [round(100 * (v - lo) / (hi - lo)) for v in values]
    return [round(100 * (hi - v) / (hi - lo)) for v in values]


class ScoringEngine:
    def score_candidates(
        self, candidates: list[CandidateMetrics], weights: ScoringWeights
    ) -> list[ScoredCandidate]:
        if not candidates:
            return []

        net_costs = [c.cost_delta - c.refund_recovered for c in candidates]
        cost_scores = _normalize(net_costs, higher_is_better=False)
        speed_scores = _normalize([c.time_impact_minutes for c in candidates], higher_is_better=False)
        preservation_scores = [
            round(100 * c.bookings_preserved / max(c.total_bookings, 1)) for c in candidates
        ]
        risk_scores = [max(0, 100 - c.residual_risk_percent) for c in candidates]
        comfort_scores = [c.comfort_score for c in candidates]

        total_weight = weights.cost + weights.time + weights.disruption + weights.risk + weights.comfort or 1

        results: list[ScoredCandidate] = []
        for i, candidate in enumerate(candidates):
            breakdown = {
                "cost": cost_scores[i],
                "speed": speed_scores[i],
                "preservation": preservation_scores[i],
                "comfort": comfort_scores[i],
                "risk": risk_scores[i],
            }
            overall = (
                breakdown["cost"] * weights.cost
                + breakdown["speed"] * weights.time
                + breakdown["preservation"] * weights.disruption
                + breakdown["risk"] * weights.risk
                + breakdown["comfort"] * weights.comfort
            ) / total_weight
            results.append(ScoredCandidate(id=candidate.id, score=round(overall), breakdown=breakdown))
        return results
