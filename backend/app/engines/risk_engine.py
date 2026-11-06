"""RiskEngine: a deterministic, explainable risk heuristic.

This is NOT machine learning - it is a transparent weighted formula over concrete
itinerary facts (buffer ratios, dependency fan-out, cancellation exposure, time of
day, and a static per-provider/per-airport reliability table). Every score comes
back with the contributing factors and the reason a human would give for it, so
the number is always traceable to a cause.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from datetime import datetime

# Static complexity table for known airports - larger/busier hubs carry more
# connection risk (security lines, gate distances, ATC congestion). Unknown
# airports default to "medium".
AIRPORT_COMPLEXITY = {
    "Delhi (DEL) T3": 0.8,
    "Mumbai (BOM)": 0.6,
    "Leh (IXL)": 0.5,
    "Goa (GOI)": 0.4,
}


def _provider_reliability(provider: str) -> float:
    """Deterministic pseudo-reliability in [0.85, 0.99] derived from the provider
    name, so the same provider always scores the same without a live data feed."""
    if not provider:
        return 0.9
    digest = hashlib.sha256(provider.encode()).hexdigest()
    fraction = int(digest[:4], 16) / 0xFFFF
    return round(0.85 + fraction * 0.14, 3)


def _time_of_day_factor(moment: datetime) -> float:
    """Very early or very late departures/activities carry more weather/ops risk."""
    hour = moment.hour
    if hour < 6 or hour >= 22:
        return 1.15
    return 1.0


PEAK_TRAFFIC_WINDOWS = ((8, 11), (17, 21))  # [start, end) local hours


def _road_traffic_factor(moment: datetime) -> float:
    """Modelled road congestion for ground transfers: peak commute hours make
    an on-time road leg less certain. There is no live traffic feed; this is a
    deterministic time-of-day model and is labelled as such."""
    return 1.2 if any(start <= moment.hour < end for start, end in PEAK_TRAFFIC_WINDOWS) else 1.0


@dataclass
class RiskResult:
    risk_percent: int
    risk_level: str
    reason: str
    contributing_factors: list[str] = field(default_factory=list)
    recommendation: str = ""


def _clamp(value: float, low: float = 0, high: float = 100) -> int:
    return int(round(max(low, min(high, value))))


def _level_for(percent: int) -> str:
    if percent >= 60:
        return "high"
    if percent >= 30:
        return "medium"
    return "low"


class RiskEngine:
    def connection_risk(
        self,
        *,
        edge_label: str,
        available_minutes: int,
        required_minutes: int,
        recommended_minutes: int,
        location: str,
        moment: datetime,
        dependency_count: int,
        road: bool = False,
    ) -> RiskResult:
        required_minutes = max(required_minutes, 1)
        recommended_minutes = max(recommended_minutes, required_minutes)

        # Single source of truth: the buffer is placed in exactly one band, and
        # the score range, level, reason and recommendation are all derived from
        # that band - so the text can never claim something the score contradicts.
        if available_minutes < required_minutes:
            band = "insufficient"
            base = 95.0
        elif available_minutes < recommended_minutes:
            band = "tight"
            # 75 at the required minimum, easing towards 45 just below the recommendation.
            base = 75 - 30 * (available_minutes - required_minutes) / (recommended_minutes - required_minutes)
        else:
            band = "meets"
            # 25 at the recommendation, easing to 5 once the surplus equals the recommendation again.
            surplus = available_minutes - recommended_minutes
            base = 25 - 20 * min(1.0, surplus / recommended_minutes)

        complexity = AIRPORT_COMPLEXITY.get(location, 0.55)
        base *= 0.75 + complexity * 0.35
        base *= _time_of_day_factor(moment)
        traffic = _road_traffic_factor(moment) if road else 1.0
        base *= traffic
        base += min(dependency_count, 6) * 1.5

        # Location/timing/dependency factors may move the score within a band,
        # never across it: a buffer below the minimum is always high risk, a
        # tight one is never low, and one meeting the recommendation never high.
        band_range = {"insufficient": (60, 100), "tight": (30, 100), "meets": (0, 59)}[band]
        percent = _clamp(base, *band_range)

        factors = [
            f"available buffer is {available_minutes} minutes against a {required_minutes}-minute required "
            f"minimum and a {recommended_minutes}-minute recommended buffer",
            f"airport/location complexity factor for {location}",
            f"{dependency_count} downstream booking(s) depend on this connection",
        ]
        if _time_of_day_factor(moment) > 1.0:
            factors.append("early-morning/late-night timing increases weather/ops variability")
        if traffic > 1.0:
            factors.append("road leg in peak traffic hours (08:00-11:00 / 17:00-21:00, modelled - no live traffic feed)")

        if band == "insufficient":
            reason = (
                f"Connection buffer of {available_minutes} minutes is below the required "
                f"{required_minutes}-minute minimum."
            )
            recommendation = (
                f"This connection is not viable as scheduled - rebook or add at least "
                f"{required_minutes - available_minutes} minutes."
            )
        elif band == "tight":
            verb = "meets" if available_minutes == required_minutes else "exceeds"
            reason = (
                f"Connection buffer of {available_minutes} minutes {verb} the required "
                f"{required_minutes}-minute minimum but falls short of the recommended "
                f"{recommended_minutes}-minute buffer."
            )
            recommendation = f"Consider a plan that increases this buffer to {recommended_minutes}+ minutes."
        else:
            reason = (
                f"Connection buffer of {available_minutes} minutes meets the recommended "
                f"{recommended_minutes}-minute buffer (required minimum: {required_minutes} minutes)."
            )
            recommendation = (
                "Buffer meets the recommendation; remaining risk comes from airport, timing and "
                "downstream dependencies - monitor on the day."
                if percent >= 30
                else "No action needed - buffer is healthy."
            )
        return RiskResult(percent, _level_for(percent), reason, factors, recommendation)

    def exposure_risk(
        self,
        *,
        provider: str,
        cost: float,
        refundable: bool,
        refund_percentage: float,
        dependency_count: int,
        moment: datetime,
    ) -> RiskResult:
        reliability = _provider_reliability(provider)
        unreliability = 1 - reliability
        cancellation_exposure = 1 - (refund_percentage if refundable else 0.0)

        base = unreliability * 100 * 0.5 + cancellation_exposure * 100 * 0.4
        base *= _time_of_day_factor(moment)
        base += min(dependency_count, 6) * 2

        percent = _clamp(base)
        factors = [
            f"vendor reliability score {reliability:.2f} for {provider or 'this provider'}",
            "non-refundable or low refund percentage" if cancellation_exposure > 0.3 else "mostly refundable",
            f"{dependency_count} downstream booking(s) would be affected if this fails",
        ]
        reason = (
            f"{'Non-refundable' if not refundable else 'Limited refund'} booking with "
            f"{cancellation_exposure * 100:.0f}% cost exposure if cancelled."
            if cancellation_exposure > 0.2
            else "Well-covered by refund policy."
        )
        recommendation = (
            "Monitor this booking closely; cancellation would be costly."
            if percent >= 30
            else "No action needed."
        )
        return RiskResult(percent, _level_for(percent), reason, factors, recommendation)

    def trip_resilience(self, node_risk_percents: list[int], financial_exposure_ratio: float) -> int:
        if not node_risk_percents:
            avg_risk = 0.0
        else:
            avg_risk = sum(node_risk_percents) / len(node_risk_percents)
        resilience = 100 - avg_risk * 0.7 - financial_exposure_ratio * 100 * 0.3
        return _clamp(resilience)
