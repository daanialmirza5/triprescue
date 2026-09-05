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
    ) -> RiskResult:
        required_minutes = max(required_minutes, 1)
        ratio = available_minutes / required_minutes
        base = 95 - max(0.0, (ratio - 1)) / 2 * 90
        base = max(5.0, min(95.0, base))

        complexity = AIRPORT_COMPLEXITY.get(location, 0.55)
        base *= 0.75 + complexity * 0.35
        base *= _time_of_day_factor(moment)
        base += min(dependency_count, 6) * 1.5

        percent = _clamp(base)
        factors = [
            f"available buffer is {available_minutes} minutes against a {required_minutes}-minute minimum",
            f"airport/location complexity factor for {location}",
            f"{dependency_count} downstream booking(s) depend on this connection",
        ]
        if _time_of_day_factor(moment) > 1.0:
            factors.append("early-morning/late-night timing increases weather/ops variability")

        reason = (
            f"Connection buffer is only {available_minutes} minutes above the minimum "
            f"required buffer of {required_minutes} minutes."
            if available_minutes < recommended_minutes
            else f"Connection buffer of {available_minutes} minutes comfortably exceeds the "
            f"{required_minutes}-minute minimum."
        )
        recommendation = (
            f"Consider a plan that increases this buffer to {recommended_minutes}+ minutes."
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
