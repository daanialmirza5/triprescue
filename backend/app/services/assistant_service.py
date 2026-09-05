"""AssistantService: explains engine output - it never computes trip facts itself.

Every number quoted to the traveler (cost, time, risk, buffer) comes from the
propagation/recovery/risk engines via the current database state. When an
Anthropic API key is configured, a real LLM call turns that grounded context into
a natural-language answer. When it isn't (or the call fails for any reason), a
deterministic, keyword-based responder answers from the same grounded context, so
the assistant is never left non-functional.
"""

from __future__ import annotations

import logging

from sqlalchemy.orm import Session

from app.config import get_settings
from app.repositories.disruption_repository import DisruptionRepository
from app.repositories.recovery_repository import RecoveryRepository
from app.schemas.assistant import AssistantReference, AssistantResponse
from app.services.risk_service import get_risk_analysis
from app.services.trip_service import get_trip_out

logger = logging.getLogger("triprescue.assistant")


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
                f"your preferences at the time: cost {breakdown.get('cost')}, speed {breakdown.get('speed')}, "
                f"preservation {breakdown.get('preservation')}, comfort {breakdown.get('comfort')}, risk "
                f"{breakdown.get('risk')}. It preserved {applied_plan.bookings_preserved}/"
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
            f"{breakdown.cost}, speed {breakdown.speed}, preservation {breakdown.preservation}, comfort "
            f"{breakdown.comfort}, risk {breakdown.risk}. It preserves {top.bookings_preserved}/"
            f"{top.total_bookings} bookings.",
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


def _llm_answer(context: dict, message: str) -> str | None:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
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

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        response = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=400,
            system=(
                "You are the TripRescue assistant. Answer ONLY using the JSON trip data provided. "
                "Never invent bookings, prices, or times that are not in the data. Be concise and specific, "
                "citing actual numbers from the data."
            ),
            messages=[
                {
                    "role": "user",
                    "content": f"Trip data:\n{grounded}\n\nTraveler question: {message}",
                }
            ],
        )
        return response.content[0].text if response.content else None
    except Exception:
        # LLM outage/misconfiguration must never break the assistant - the
        # deterministic responder below is the fallback - but a silent
        # failure here means an operator has no way to notice a broken key
        # or a persistent outage, so log it (no secrets, just the failure).
        logger.warning("LLM call failed; falling back to the deterministic assistant.", exc_info=True)
        return None


def answer_question(db: Session, trip_id: str, message: str, traveler_id: str | None = None) -> AssistantResponse:
    context = _gather_context(db, trip_id, traveler_id)

    llm_text = _llm_answer(context, message)
    if llm_text:
        return AssistantResponse(content=llm_text, references=[], source="llm")

    text, refs = _deterministic_answer(context, message)
    return AssistantResponse(content=text, references=refs, source="deterministic")
