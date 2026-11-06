"""Domain reasoning via the Nugen-aligned travel model.

Pipeline: base model -> Nugen alignment on Safar Sathi's travel-disruption
dataset (scripts/nugen_alignment_dataset.jsonl) -> deployed domain model
(NUGEN_MODEL_ID) -> called here for two tasks:

1. explain_weather_cascade(): why specific legs/commitments fail under a
   simulated weather scenario, plus proactive traveler advice.
2. mitigation_guidance(): preemptive buffer/rebooking advice for high-risk
   connections.

Both build the same grounded context (only facts from the Digital Twin run -
the model is told never to invent bookings, times or prices). When Nugen is
not configured or unreachable, the built-in heuristic reasoning engine below
answers from the identical context, so behaviour is deterministic offline and
in tests. The heuristic engine also produces the reference completions in the
alignment dataset (see scripts/export_nugen_dataset.py).
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass

from app.core.nugen_client import NugenClient
from app.engines.digital_twin_engine import TwinRun, WeatherScenario, mode_of
from app.core.pipeline_trace import traced

logger = logging.getLogger("safarsathi.nugen")

SYSTEM_PROMPT = (
    "You are Safar Sathi's travel-disruption reasoning model. You receive a multi-leg itinerary, a weather "
    "scenario and the Digital Twin's simulated impacts as JSON. Explain in plain language which legs fail and "
    "why (buffers, dependencies, weather drivers), give the key risk probabilities, and recommend concrete "
    "preemptive actions. Use ONLY facts in the JSON; never invent bookings, times, prices or providers. "
    "Be concise: at most 6 sentences."
)
MITIGATION_PROMPT = (
    "You are Safar Sathi's logistics model. From the JSON of at-risk connections, give 2-4 short, specific "
    "preemptive actions (one per line, no numbering) such as rebooking or widening a buffer, citing the minutes "
    "and legs involved. Use ONLY facts in the JSON."
)

RECOVERY_PROMPT = (
    "You are Safar Sathi's travel-disruption reasoning model. You receive a disruption, the traveler's priorities and "
    "the recovery options Safar Sathi's engine ranked, as JSON. In 3-5 sentences explain why the top option fits the "
    "traveler's priorities and what each alternative trades off. Use ONLY facts in the JSON; never invent prices, "
    "times, bookings or providers."
)

_client: NugenClient | None = None


def client() -> NugenClient:
    global _client
    if _client is None:
        _client = NugenClient()
    return _client


@dataclass(frozen=True)
class Reasoning:
    text: str
    source: str  # "nugen" | "heuristic"
    model: str | None = None


# ---- Grounded context -------------------------------------------------------------


def build_context(nodes: list, scenario: WeatherScenario, run: TwinRun) -> dict:
    by_id = {n.id: n for n in nodes}
    risk_by_node = {r.node_id: r for r in run.risks}
    impacted = []
    for n in nodes:
        imp = run.impacts.get(n.id)
        if not imp or imp.status == "healthy":
            continue
        hit = run.hits.get(n.id)
        risk = risk_by_node.get(n.id)
        impacted.append({
            "id": n.id, "title": n.title, "mode": mode_of(n), "status": imp.status,
            "direct_weather_hit": hit.reason if hit else None,
            "driver": hit.driver if hit else None,
            "caused_by": by_id[imp.caused_by].title if imp.caused_by in by_id else None,
            "reason": imp.reason,
            "available_buffer_min": imp.available_buffer_minutes,
            "required_buffer_min": imp.required_buffer_minutes,
            "risk": {"label": risk.label, "p": risk.probability, "range": [risk.low, risk.high]} if risk else None,
        })
    return {
        "itinerary": [
            {"id": n.id, "title": n.title, "mode": mode_of(n), "start": n.scheduled_start.strftime("%d %b %H:%M"),
             "end": n.scheduled_end.strftime("%d %b %H:%M")}
            for n in sorted(nodes, key=lambda x: x.scheduled_start)
        ],
        "scenario": {
            "name": scenario.name, "rainfall_mm_per_hour": scenario.rainfall_mm_per_hour, "wind_kmh": scenario.wind_speed_kmh,
            "visibility_m": scenario.visibility_meters, "temperature_c": scenario.temperature_celsius,
            "duration_h": scenario.storm_duration_hours,
            "window": f"{run.window[0]:%d %b %H:%M} - {run.window[1]:%d %b %H:%M}",
        },
        "health_score": run.health_score,
        "exposure_inr": round(run.exposure),
        "impacted": impacted,
    }


# ---- Heuristic reasoning engine (offline fallback + dataset teacher) -------------------


_DRIVER_WORDS = {"visibility": "low visibility", "rainfall": "heavy rain", "wind": "high winds", "heat": "extreme heat"}


def heuristic_explanation(ctx: dict) -> str:
    impacted = ctx["impacted"]
    sc = ctx["scenario"]
    if not impacted:
        return (f"Under “{sc['name']}” ({sc['window']}), none of your bookings are exposed: the weather misses every "
                "leg's scheduled window or stays within operating limits. No preemptive action is needed.")
    direct = [i for i in impacted if i["direct_weather_hit"]]
    cascaded = [i for i in impacted if not i["direct_weather_hit"]]
    lines: list[str] = []
    drivers = sorted({_DRIVER_WORDS.get(i["driver"], i["driver"]) for i in direct if i["driver"]})
    if direct:
        first = direct[0]
        lines.append(f"“{sc['name']}” brings {' and '.join(drivers) or 'severe weather'} during {sc['window']}: {first['title']} is hit directly — {first['direct_weather_hit'].rstrip('.')}.")
        if len(direct) > 1:
            lines.append("It also directly affects " + ", ".join(i["title"] for i in direct[1:3]) + ".")
    # A leg can be hit directly AND broken by a late upstream leg - the break is the bigger story.
    hard = [i for i in impacted if i["status"] == "broken" and i["caused_by"]]
    for i in hard[:2]:
        buf = ""
        if i["available_buffer_min"] is not None and i["required_buffer_min"] is not None:
            buf = f" — only {i['available_buffer_min']} of the {i['required_buffer_min']} minutes it needs remain"
        lines.append(f"Because {i['caused_by'] or 'an upstream leg'} runs late, {i['title']} can no longer be made{buf}.")
    soft = [i for i in cascaded if i["status"] in ("at-risk", "delayed")]
    if soft:
        lines.append("Downstream, " + ", ".join(i["title"] for i in soft[:3]) + (" are" if len(soft) > 1 else " is") + " at risk of late arrival.")
    top = max((i for i in impacted if i["risk"]), key=lambda i: i["risk"]["p"], default=None)
    if top:
        lo, hi = top["risk"]["range"]
        lines.append(f"Highest risk: {top['risk']['label'].lower()} for {top['title']} at {round(top['risk']['p'] * 100)}% (range {round(lo * 100)}–{round(hi * 100)}%).")
    lines.append(_advice(ctx))
    return " ".join(lines)


def _advice(ctx: dict) -> str:
    impacted = ctx["impacted"]
    broken = [i for i in impacted if i["status"] in ("broken", "cancelled")]
    if any(i["mode"] == "activity" and i["status"] == "cancelled" for i in impacted):
        tail = " Move outdoor plans out of the storm window rather than waiting for the operator to cancel."
    else:
        tail = ""
    if broken:
        return f"Act before the weather does: rebook {broken[0]['title']} now, while alternatives still have seats.{tail}"
    return f"Build in extra buffer and keep hotels informed of a late arrival.{tail}"


def heuristic_mitigation(ctx: dict) -> list[str]:
    tips: list[str] = []
    for i in ctx["impacted"]:
        need, have = i["required_buffer_min"], i["available_buffer_min"]
        if i["status"] == "broken" and need is not None:
            extra = (need - (have or 0)) + 60
            tips.append(f"Rebook {i['title']} at least {extra} min later to restore its {need}-min connection buffer.")
        elif i["status"] == "cancelled" and i["mode"] == "activity":
            tips.append(f"Reschedule {i['title']} to the day after the storm; weather cancellations are rarely refundable on the day.")
        elif i["status"] == "cancelled":
            tips.append(f"Secure an alternative to {i['title']} now — cancelled departures sell out fast once the storm is announced.")
        elif i["status"] == "at-risk" and i["mode"] == "hotel":
            tips.append(f"Ask {i['title']} to guarantee late check-in so the room is held.")
        elif i["status"] == "at-risk":
            tips.append(f"Widen the buffer before {i['title']} by at least 60 min or pick a flexible fare.")
        if len(tips) >= 4:
            break
    return tips or ["No at-risk connections: keep the current plan and monitor the forecast."]


# ---- Public API -----------------------------------------------------------------


@traced("intelligence", "Nugen: explain the weather cascade", detail=lambda r, a, k: {"source": r.source, "model": r.model})
def explain_weather_cascade(itinerary: list, weather_scenario: WeatherScenario, simulated_impacts: TwinRun) -> Reasoning:
    ctx = build_context(itinerary, weather_scenario, simulated_impacts)
    c = client()
    if c.configured:
        text = c.chat(SYSTEM_PROMPT, json.dumps(ctx, ensure_ascii=False), max_tokens=450)
        if text:
            return Reasoning(text=text, source="nugen", model=c.model_id)
        logger.info("Nugen unavailable (%s); using heuristic cascade explanation", c.last_error)
    return Reasoning(text=heuristic_explanation(ctx), source="heuristic")


@traced("intelligence", "Nugen: explain recovery ranking")
def explain_recovery_ranking(grounded: dict) -> str | None:
    """Nugen narrative for a ranked set of recovery options, or None when Nugen
    is not configured or unavailable (the caller then falls back)."""
    c = client()
    if not c.configured:
        return None
    text = c.chat(RECOVERY_PROMPT, json.dumps(grounded, ensure_ascii=False, default=str), max_tokens=350)
    if not text:
        logger.info("Nugen unavailable (%s); falling back for the recovery narrative", c.last_error)
    return text


@traced("intelligence", "Nugen: mitigation guidance", detail=lambda r, a, k: {"source": r[1], "tips": len(r[0])})
def mitigation_guidance(itinerary: list, weather_scenario: WeatherScenario, simulated_impacts: TwinRun) -> tuple[list[str], str]:
    ctx = build_context(itinerary, weather_scenario, simulated_impacts)
    at_risk = {"impacted": [i for i in ctx["impacted"] if i["status"] != "delayed"]}
    c = client()
    if c.configured and at_risk["impacted"]:
        text = c.chat(MITIGATION_PROMPT, json.dumps(at_risk, ensure_ascii=False), max_tokens=250)
        if text:
            tips = [line.strip("-• ").strip() for line in text.splitlines() if line.strip()]
            if tips:
                return tips[:4], "nugen"
    return heuristic_mitigation(ctx), "heuristic"
