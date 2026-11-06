"""AssistantService: explains engine output - it never computes trip facts itself.

Every number quoted to the traveler (cost, time, risk, buffer) comes from the
propagation/recovery/risk engines via the current database state. When an
Anthropic API key is configured, a real LLM call turns that grounded context into
a natural-language answer. When it isn't (or the call fails for any reason), a
deterministic, keyword-based responder answers from the same grounded context, so
the assistant is never left non-functional.
"""

from __future__ import annotations

import json
import logging

from sqlalchemy.orm import Session

from app.config import get_settings
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.recovery_repository import RecoveryRepository
from app.models.enums import DisruptionType
from app.schemas.assistant import AssistantReference, AssistantResponse, DisruptionExtractResponse
from app.schemas.recovery import RecoveryNarrativeOut
from app.services import disruption_extraction, nugen_service, recovery_narrative, recovery_service
from app.services.risk_service import get_risk_analysis
from app.services.trip_service import get_trip, get_trip_out

logger = logging.getLogger("safarsathi.assistant")


def _gather_context(db: Session, trip_id: str, traveler_id: str | None = None) -> dict:
    trip = get_trip_out(db, trip_id, traveler_id)
    disruption = DisruptionRepository(db).latest_unresolved(trip_id)
    if disruption is None:
        # No ACTIVE disruption, but there may be a resolved one whose recovery
        # the traveler is still asking about (e.g. "why was this recommended?"
        # asked right after applying it) - keep that history available.
        from sqlalchemy import select

        from app.models.disruption import Disruption

        disruption = db.scalars(
            select(Disruption).where(Disruption.trip_id == trip_id).order_by(Disruption.detected_at.desc())
        ).first()

    recovery_options = list(RecoveryRepository(db).list_for_disruption(disruption.id)) if disruption else []
    applied_plan = next((p for p in recovery_options if p.applied), None)
    risk = get_risk_analysis(db, trip_id)
    return {
        "trip": trip,
        "disruption": disruption,
        "recovery_options": recovery_options,
        "applied_plan": applied_plan,
        "risk": risk,
    }


def _tool_get_impact(db: Session, trip_id: str, traveler_id: str | None) -> dict:
    context = _gather_context(db, trip_id, traveler_id)
    trip = context["trip"]
    disruption = context["disruption"]
    return {
        "trip_name": trip.name,
        "health_score": trip.health_score,
        "nodes": [
            {"title": n.title, "status": n.status, "reason": n.reason} for n in trip.nodes
        ],
        "active_disruption": (
            {
                "label": disruption.label,
                "financial_exposure": disruption.financial_exposure,
                "refund_exposure": disruption.refund_exposure,
            }
            if disruption
            else None
        ),
    }


def _tool_list_recovery_options(db: Session, trip_id: str, traveler_id: str | None) -> list[dict]:
    # Read-only on purpose: generate_recovery_options would delete and recreate
    # every plan with new ids (so a proposed id would no longer match the plans
    # the traveler's screen shows) and log activity on every chat turn.
    options = recovery_service.list_recovery_options(db, trip_id, traveler_id)
    return [
        {
            "id": o.id,
            "name": o.name,
            "cost_delta": o.cost_delta,
            "time_impact_minutes": o.time_impact_minutes,
            "score": o.score,
            "bookings_preserved": o.bookings_preserved,
            "total_bookings": o.total_bookings,
        }
        for o in options
        if o.feasible
    ]


# SAFETY: this function must never call recovery_service.apply_recovery().
# Applying a recovery is only ever triggered by an explicit user click in
# the frontend confirm modal, which calls the existing /recovery/apply
# endpoint directly. This tool exists only so the LLM can express intent;
# the AssistantResponse.proposed_recovery_id field carries that intent
# back to the frontend, and nothing here writes to the database.
def _tool_propose_apply_recovery(recovery_id: str) -> dict:
    return {"recovery_id": recovery_id, "status": "awaiting_user_confirmation"}


def _breakdown_component(breakdown: dict, key: str) -> str:
    """score_breakdown is stored as a raw JSON dict on the ORM model (see
    RecoveryPlan.score_breakdown in app/models/recovery.py), never a
    ScoreBreakdownOut instance - always access it by key, and fall back to
    "n/a" rather than crash if a component is missing."""
    value = breakdown.get(key)
    return "n/a" if value is None else str(value)


def _deterministic_answer(context: dict, message: str) -> tuple[str, list[AssistantReference]]:
    trip = context["trip"]
    disruption = context["disruption"]
    options = context["recovery_options"]
    applied_plan = context["applied_plan"]
    risk = context["risk"]
    lowered = message.lower()
    refs: list[AssistantReference] = []

    if not disruption:
        if "risk" in lowered or "resilience" in lowered:
            return (
                f"Your trip is operating normally with a resilience score of {risk.score.trip_resilience}/100. "
                f"The main watch item is connection risk at {risk.score.connection_risk}/100.",
                refs,
            )
        return (
            f"Your {trip.name} is currently healthy (health score {trip.health_score}/100) with no active "
            "disruption. Trigger a disruption from the command center to see the recovery engine in action.",
            refs,
        )

    if disruption.resolved and applied_plan:
        refs.append(AssistantReference(type="recovery", id=applied_plan.id, label=applied_plan.name))
        if "why" in lowered or "recommend" in lowered:
            breakdown = applied_plan.score_breakdown
            return (
                f"\"{applied_plan.name}\" was applied because it scored highest ({applied_plan.score}/100) for "
                f"your preferences at the time: cost {_breakdown_component(breakdown, 'cost')}, speed "
                f"{_breakdown_component(breakdown, 'speed')}, preservation "
                f"{_breakdown_component(breakdown, 'preservation')}, comfort "
                f"{_breakdown_component(breakdown, 'comfort')}, risk {_breakdown_component(breakdown, 'risk')}. "
                f"It preserved {applied_plan.bookings_preserved}/"
                f"{applied_plan.total_bookings} bookings for +₹{applied_plan.cost_delta:,.0f}.",
                refs,
            )
        return (
            f"{disruption.label} was detected and fully resolved by applying \"{applied_plan.name}\" "
            f"(+₹{applied_plan.cost_delta:,.0f}, {applied_plan.bookings_preserved}/{applied_plan.total_bookings} "
            f"bookings preserved). Your trip health is now {trip.health_score}/100.",
            refs,
        )

    broken = [n for n in trip.nodes if n.status in ("broken", "cancelled")]
    at_risk = [n for n in trip.nodes if n.status == "at-risk"]

    if "cheap" in lowered:
        if not options:
            return "No recovery options have been generated yet for this disruption.", refs
        cheapest = min(options, key=lambda o: o.cost_delta)
        refs.append(AssistantReference(type="recovery", id=cheapest.id, label=cheapest.name))
        return (
            f"The cheapest option is \"{cheapest.name}\" at +₹{cheapest.cost_delta:,.0f}. "
            f"It preserves {cheapest.bookings_preserved}/{cheapest.total_bookings} bookings and scores "
            f"{cheapest.score}/100.",
            refs,
        )

    if "fast" in lowered or "quick" in lowered:
        if not options:
            return "No recovery options have been generated yet for this disruption.", refs
        fastest = min(options, key=lambda o: o.time_impact_minutes)
        refs.append(AssistantReference(type="recovery", id=fastest.id, label=fastest.name))
        return (
            f"The fastest option is \"{fastest.name}\", adding about {fastest.time_impact_minutes} minutes "
            f"versus your original schedule, for +₹{fastest.cost_delta:,.0f}.",
            refs,
        )

    if "why" in lowered and options:
        top = max(options, key=lambda o: o.score)
        refs.append(AssistantReference(type="recovery", id=top.id, label=top.name))
        breakdown = top.score_breakdown
        return (
            f"\"{top.name}\" ranks highest ({top.score}/100) given your current preferences: cost score "
            f"{_breakdown_component(breakdown, 'cost')}, speed {_breakdown_component(breakdown, 'speed')}, "
            f"preservation {_breakdown_component(breakdown, 'preservation')}, comfort "
            f"{_breakdown_component(breakdown, 'comfort')}, risk {_breakdown_component(breakdown, 'risk')}. "
            f"It preserves {top.bookings_preserved}/{top.total_bookings} bookings.",
            refs,
        )

    if "money" in lowered or "lose" in lowered or "cost" in lowered or "exposure" in lowered:
        return (
            f"Estimated financial exposure from this disruption is ₹{disruption.financial_exposure:,.0f}, "
            f"of which ₹{disruption.refund_exposure:,.0f} is recoverable via refund policies. Recovery "
            + (
                f"options range from +₹{min(o.cost_delta for o in options):,.0f} to "
                f"+₹{max(o.cost_delta for o in options):,.0f} in additional spend."
                if options
                else "options have not been generated yet."
            ),
            refs,
        )

    for node in trip.nodes:
        if node.title.lower() in lowered or node.label.lower() in lowered:
            refs.append(AssistantReference(type="node", id=node.id, label=node.title))
            return (
                f"{node.title} is currently {node.status}." + (f" {node.reason}" if node.reason else ""),
                refs,
            )

    if broken or at_risk:
        names = ", ".join(n.title for n in broken + at_risk)
        return (
            f"{disruption.label} has affected {len(broken) + len(at_risk)} booking(s): {names}. "
            + (
                f"{len(options)} recovery option(s) are available."
                if options
                else "Recovery options are being generated."
            ),
            refs,
        )

    return (
        f"{disruption.label} was detected. Financial exposure is ₹{disruption.financial_exposure:,.0f}.",
        refs,
    )


def _llm_answer(context: dict, message: str, db: Session, trip_id: str, traveler_id: str | None) -> tuple[str | None, str | None]:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None, None
    try:
        import anthropic

        trip = context["trip"]
        disruption = context["disruption"]
        options = context["recovery_options"]

        grounded = {
            "trip_name": trip.name,
            "health_score": trip.health_score,
            "nodes": [
                {"title": n.title, "status": n.status, "reason": n.reason} for n in trip.nodes
            ],
            "active_disruption": (
                {
                    "label": disruption.label,
                    "financial_exposure": disruption.financial_exposure,
                    "refund_exposure": disruption.refund_exposure,
                }
                if disruption
                else None
            ),
            "recovery_options": [
                {
                    "id": o.id,
                    "name": o.name,
                    "cost_delta": o.cost_delta,
                    "time_impact_minutes": o.time_impact_minutes,
                    "score": o.score,
                    "bookings_preserved": o.bookings_preserved,
                    "total_bookings": o.total_bookings,
                }
                for o in options
            ],
        }

        tool_schemas = [
            {
                "name": "get_impact",
                "description": "Get the current trip's disruption status and per-node health",
                "input_schema": {"type": "object", "properties": {}},
            },
            {
                "name": "list_recovery_options",
                "description": "Get ranked recovery plan candidates for the active disruption",
                "input_schema": {"type": "object", "properties": {}},
            },
            {
                "name": "propose_apply_recovery",
                "description": (
                    "Propose applying a specific recovery plan by id. This does NOT apply it "
                    "— it only surfaces the proposal to the traveler for their explicit confirmation."
                ),
                "input_schema": {
                    "type": "object",
                    "properties": {"recovery_id": {"type": "string"}},
                    "required": ["recovery_id"],
                },
            },
        ]

        system_prompt = (
            "You are the SafarSathi assistant. Answer ONLY using the JSON trip data provided. "
            "Never invent bookings, prices, or times that are not in the data. Be concise and specific, "
            "citing actual numbers from the data. "
            "You may call get_impact or list_recovery_options to fetch live data if the trip data "
            "already provided is insufficient. If you determine the traveler wants to apply a specific "
            "recovery plan, call propose_apply_recovery with its id — you are never able to apply it "
            "yourself, only propose it."
        )

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        messages = [
            {
                "role": "user",
                "content": f"Trip data:\n{grounded}\n\nTraveler question: {message}",
            }
        ]

        proposed_recovery_id: str | None = None
        max_iterations = 4

        for _ in range(max_iterations):
            response = client.messages.create(
                model=settings.anthropic_model,
                max_tokens=400,
                system=system_prompt,
                tools=tool_schemas,
                messages=messages,
            )

            if response.stop_reason != "tool_use":
                # Normal text turn — extract the final answer.
                for block in response.content:
                    if hasattr(block, "text"):
                        return block.text, proposed_recovery_id
                return None, None

            # Process tool_use blocks and build tool_result responses.
            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue
                try:
                    if block.name == "get_impact":
                        result = _tool_get_impact(db, trip_id, traveler_id)
                    elif block.name == "list_recovery_options":
                        result = _tool_list_recovery_options(db, trip_id, traveler_id)
                    elif block.name == "propose_apply_recovery":
                        rid = block.input.get("recovery_id", "")
                        # Only a real, feasible, not-yet-applied plan for the active
                        # disruption can be proposed; anything else is refused.
                        proposable = {o["id"] for o in _tool_list_recovery_options(db, trip_id, traveler_id)}
                        if rid in proposable:
                            result = _tool_propose_apply_recovery(rid)
                            proposed_recovery_id = rid
                        else:
                            result = {"error": f"Unknown or unavailable recovery id: {rid}"}
                    else:
                        result = {"error": f"Unknown tool: {block.name}"}
                except Exception:
                    logger.warning("Tool dispatch %s failed; returning error to model.", block.name, exc_info=True)
                    result = {"error": f"Tool {block.name} failed"}

                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    }
                )

            # Append the assistant's response (contains tool_use blocks) and
            # a user message with the corresponding tool_result blocks.
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

        # Exhausted iterations without a final text response.
        return None, None
    except Exception:
        # LLM outage/misconfiguration must never break the assistant - the
        # deterministic responder below is the fallback - but a silent
        # failure here means an operator has no way to notice a broken key
        # or a persistent outage, so log it (no secrets, just the failure).
        logger.warning("LLM call failed; falling back to the deterministic assistant.", exc_info=True)
        return None, None


def answer_question(db: Session, trip_id: str, message: str, traveler_id: str | None = None) -> AssistantResponse:
    context = _gather_context(db, trip_id, traveler_id)

    llm_text, proposed_recovery_id = _llm_answer(context, message, db, trip_id, traveler_id)
    if llm_text:
        return AssistantResponse(content=llm_text, references=[], source="llm", proposed_recovery_id=proposed_recovery_id)

    text, refs = _deterministic_answer(context, message)
    return AssistantResponse(content=text, references=refs, source="deterministic")


# ---- Recovery narrative -------------------------------------------------------


def generate_recovery_narrative(trip, disruption, recovery_options, preferences: dict | None) -> tuple[str, str]:
    """Explain why the recovery options are ranked as they are, in terms of the
    traveler's preferences, and say who wrote it. Tries the Nugen-aligned travel
    model first, then Claude, then a deterministic comparison of cost deltas,
    arrival impact, preserved bookings and residual risk - it never raises.

    Returns (text, source) with source "nugen", "llm" or "deterministic"."""
    label = getattr(disruption, "label", None)
    options = list(recovery_options or [])
    fallback = recovery_narrative.narrative(label, options, preferences)
    ranked = recovery_narrative.rank(options)
    if not ranked:
        return fallback, "deterministic"
    grounded = {
        "trip": getattr(trip, "name", ""),
        "disruption": label,
        "traveler_priorities": recovery_narrative.describe_preferences(preferences),
        "options_ranked": [vars(o) for o in ranked],
        "deterministic_explanation": fallback,
    }

    text = nugen_service.explain_recovery_ranking(grounded)
    if text:
        return text, "nugen"

    settings = get_settings()
    if not settings.anthropic_api_key:
        return fallback, "deterministic"
    try:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=350,
            system=(
                "You explain travel recovery rankings. Use ONLY the JSON provided. In 3-5 sentences, say why the "
                "top option fits the traveler's priorities and what each alternative trades off. Never invent prices, "
                "times or bookings."
            ),
            messages=[{"role": "user", "content": f"{grounded}"}],
        )
        text = response.content[0].text.strip() if response.content else ""
        return (text, "llm") if text else (fallback, "deterministic")
    except Exception:
        logger.warning("LLM narrative failed; using deterministic narrative.", exc_info=True)
        return fallback, "deterministic"


def get_recovery_narrative(db: Session, trip_id: str, traveler_id: str | None = None) -> RecoveryNarrativeOut:
    context = _gather_context(db, trip_id, traveler_id)
    disruption = context["disruption"]
    active = disruption is not None and not disruption.resolved
    options = [o for o in context["recovery_options"] if not o.applied] if active else []
    preferences = get_trip(db, trip_id, traveler_id).traveler.preferences if active else None
    ranked = recovery_narrative.rank(options)
    if not active:
        return RecoveryNarrativeOut(
            executive_summary="No active disruption — every booking is on track.",
            narrative=None,
            source="deterministic",
        )
    text, source = generate_recovery_narrative(context["trip"], disruption, options, preferences)
    return RecoveryNarrativeOut(
        executive_summary=recovery_narrative.executive_summary(disruption.label, options),
        narrative=text,
        top_option_id=ranked[0].id if ranked else None,
        option_notes=recovery_narrative.option_notes(options, preferences),
        source=source,
    )


# ---- Free-text disruption extraction ---------------------------------------------


def _llm_extract(text: str) -> dict | None:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
    try:
        import json

        import anthropic

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=200,
            system=(
                "Extract a travel disruption from the message. Reply with JSON only: "
                '{"type": one of ' + json.dumps([t.value for t in DisruptionType]) + " or null, "
                '"delayMinutes": integer or null, "flightNumber": string or null}. Do not guess values absent from the text.'
            ),
            messages=[{"role": "user", "content": text}],
        )
        raw = response.content[0].text if response.content else ""
        start, end = raw.find("{"), raw.rfind("}")
        data = json.loads(raw[start : end + 1]) if start != -1 and end > start else None
        if not isinstance(data, dict):
            return None
        if data.get("type") not in {t.value for t in DisruptionType} | {None}:
            data["type"] = None
        return data
    except Exception:
        logger.warning("LLM disruption extraction failed; keeping heuristic result.", exc_info=True)
        return None


def extract_disruption(
    db: Session, text: str, trip_id: str | None = None, traveler_id: str | None = None, nodes: list | None = None
) -> DisruptionExtractResponse:
    result = disruption_extraction.extract(text)
    source = "fallback"
    if result.confidence < 0.5:
        llm = _llm_extract(text)
        if llm:
            result.type = llm.get("type") or result.type
            if isinstance(llm.get("delayMinutes"), int) and llm["delayMinutes"] > 0:
                result.delay_minutes = llm["delayMinutes"]
            result.flight_number = llm.get("flightNumber") or result.flight_number
            result.confidence = max(result.confidence, 0.7 if result.type else result.confidence)
            result.signals.append("language model")
            source = "llm"

    if result.delay_minutes is None and result.type in disruption_extraction.DELAY_TYPES:
        result.delay_minutes = disruption_extraction.DEFAULT_DELAY_MINUTES
        result.signals.append(f"no duration stated - assuming {disruption_extraction.DEFAULT_DELAY_MINUTES} min")

    node_id = node_title = how = None
    if trip_id:
        trip = get_trip(db, trip_id, traveler_id)  # raises TripNotFoundError for foreign trips
        if nodes is None:
            node_id, node_title, how = disruption_extraction.match_node(result, list(trip.nodes))
    if nodes is not None:
        node_id, node_title, how = disruption_extraction.match_mentioned_node(text, nodes)
    if node_id:
        result.signals.append(f"matched booking by {how}")
        result.confidence = round(min(0.99, result.confidence + 0.05), 2)

    return DisruptionExtractResponse(
        type=result.type,
        delay_minutes=result.delay_minutes,
        flight_number=result.flight_number,
        gate=result.gate,
        primary_node_id=node_id,
        primary_node_label=node_title,
        node_id=node_id,
        confidence=result.confidence,
        matched_signals=result.signals,
        summary=disruption_extraction.summarize(result, node_title),
        source=source,
    )