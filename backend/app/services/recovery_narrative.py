"""Deterministic recovery narratives.

Explains *why* the recovery engine ranked its options the way it did, in terms
of the traveler's own preferences. Pure functions over plain option data, so
they work identically for ORM rows (RecoveryPlan) and API models
(RecoveryOptionOut), and never need network access - the LLM layer in
assistant_service only rephrases what these functions can already state.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable

from app.models.traveler import DEFAULT_PREFERENCES


@dataclass(frozen=True)
class OptionView:
    id: str
    name: str
    score: int
    cost_delta: float
    time_impact_minutes: int
    bookings_preserved: int
    total_bookings: int
    residual_risk: str
    feasible: bool


def _risk_value(value: Any) -> str:
    return str(getattr(value, "value", value) or "medium")


def to_view(option: Any) -> OptionView:
    return OptionView(
        id=str(option.id),
        name=str(option.name),
        score=int(option.score or 0),
        cost_delta=float(option.cost_delta or 0),
        time_impact_minutes=int(option.time_impact_minutes or 0),
        bookings_preserved=int(option.bookings_preserved or 0),
        total_bookings=int(option.total_bookings or 0),
        residual_risk=_risk_value(option.residual_risk),
        feasible=bool(getattr(option, "feasible", True)),
    )


def rank(options: Iterable[Any]) -> list[OptionView]:
    views = [to_view(o) for o in options]
    return sorted((v for v in views if v.feasible), key=lambda v: v.score, reverse=True)


def _prefs(preferences: dict | None) -> dict:
    merged = {**DEFAULT_PREFERENCES, **(preferences or {})}
    merged["recoveryPriorities"] = {**DEFAULT_PREFERENCES["recoveryPriorities"], **(merged.get("recoveryPriorities") or {})}
    return merged


def describe_preferences(preferences: dict | None) -> str:
    """One clause describing what the traveler asked the ranking to favour."""
    p = _prefs(preferences)
    speed = int(p.get("costVsSpeed", 50))
    comfort = int(p.get("disruptionVsComfort", 50))
    priorities = p["recoveryPriorities"]
    wants: list[str] = []
    if speed >= 60 or priorities.get("minimizeTime"):
        wants.append("arriving sooner")
    elif speed <= 40 or priorities.get("minimizeCost"):
        wants.append("keeping extra cost low")
    if comfort >= 60 or priorities.get("maximizeComfort"):
        wants.append("a more comfortable journey")
    elif comfort <= 40 or priorities.get("minimizeDisruption"):
        wants.append("changing as few bookings as possible")
    if not wants:
        return "a balance of speed, cost and comfort"
    return " and ".join(wants)


def _money(value: float) -> str:
    return f"₹{abs(value):,.0f}"


def _cost_phrase(value: float) -> str:
    return "no extra cost" if value <= 0 else f"+{_money(value)}"


def _time_phrase(minutes: int) -> str:
    if minutes <= 0:
        return "no later arrival"
    if minutes < 60:
        return f"+{minutes} min"
    hours, mins = divmod(minutes, 60)
    return f"+{hours}h{f' {mins}m' if mins else ''}"


def compare(option: OptionView, top: OptionView) -> str:
    """Why `option` ranks below `top`, stated as concrete trade-offs."""
    parts: list[str] = []
    cost_diff = option.cost_delta - top.cost_delta
    time_diff = option.time_impact_minutes - top.time_impact_minutes
    if cost_diff < 0:
        parts.append(f"saves {_money(cost_diff)}")
    elif cost_diff > 0:
        parts.append(f"costs {_money(cost_diff)} more")
    if time_diff > 0:
        parts.append(f"arrives {_time_phrase(time_diff)[1:]} later")
    elif time_diff < 0:
        parts.append(f"arrives {_time_phrase(-time_diff)[1:]} sooner")
    if option.bookings_preserved < top.bookings_preserved:
        parts.append(f"keeps {option.bookings_preserved}/{option.total_bookings} bookings instead of {top.bookings_preserved}")
    order = {"low": 0, "medium": 1, "high": 2}
    if order.get(option.residual_risk, 1) > order.get(top.residual_risk, 1):
        parts.append(f"leaves {option.residual_risk} residual risk")
    if not parts:
        return f"“{option.name}” scores {option.score}/100 — nearly identical trade-offs, slightly weaker on your priorities."
    return f"“{option.name}” ({option.score}/100) {', '.join(parts)}."


def option_notes(options: Iterable[Any], preferences: dict | None) -> dict[str, str]:
    ranked = rank(options)
    if not ranked:
        return {}
    top = ranked[0]
    notes = {
        top.id: (
            f"“{top.name}” ranked first ({top.score}/100) for {describe_preferences(preferences)}: "
            f"{_cost_phrase(top.cost_delta)}, {_time_phrase(top.time_impact_minutes)}, "
            f"{top.bookings_preserved}/{top.total_bookings} bookings kept, {top.residual_risk} residual risk."
        )
    }
    for option in ranked[1:]:
        notes[option.id] = compare(option, top)
    return notes


def executive_summary(disruption_label: str | None, options: Iterable[Any]) -> str:
    ranked = rank(options)
    lead = f"{disruption_label}. " if disruption_label else ""
    if not ranked:
        return f"{lead}No feasible recovery plan is available yet — every provider alternative conflicts with the rest of the itinerary."
    top = ranked[0]
    others = len(ranked) - 1
    return (
        f"{lead}Recommended: “{top.name}” — {_cost_phrase(top.cost_delta)}, {_time_phrase(top.time_impact_minutes)}, "
        f"{top.bookings_preserved}/{top.total_bookings} bookings preserved, {top.residual_risk} residual risk."
        + (f" {others} alternative{'s' if others != 1 else ''} considered." if others else "")
    )


def narrative(disruption_label: str | None, options: Iterable[Any], preferences: dict | None) -> str:
    options = list(options)
    ranked = rank(options)
    if not ranked:
        return executive_summary(disruption_label, options)
    notes = option_notes(options, preferences)
    lines = [f"You asked Safar Sathi to favour {describe_preferences(preferences)}.", notes[ranked[0].id]]
    lines.extend(notes[o.id] for o in ranked[1:])
    cheapest = min(ranked, key=lambda o: o.cost_delta)
    fastest = min(ranked, key=lambda o: o.time_impact_minutes)
    if cheapest.id != ranked[0].id:
        lines.append(f"If cost matters most, “{cheapest.name}” is the cheapest path ({_cost_phrase(cheapest.cost_delta)}).")
    if fastest.id != ranked[0].id and fastest.id != cheapest.id:
        lines.append(f"If arrival time matters most, “{fastest.name}” is the fastest ({_time_phrase(fastest.time_impact_minutes)}).")
    return " ".join(lines)
