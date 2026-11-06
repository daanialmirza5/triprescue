"""RecoveryEngine: searches for feasible ways to fix a broken itinerary.

For the primary broken/cancelled booking, this:
  1. Identifies which provider interface handles its category.
  2. Searches that provider for real alternatives after the earliest moment the
     traveler could plausibly use them.
  3. Simulates each alternative by rebooking the node (which detaches it from the
     dependency that broke it - a rebooked node is a fresh booking, not bound to
     the old connection) and re-running the PropagationEngine to see the actual
     downstream effect of that specific choice.
  4. If an activity further downstream comes back at-risk because its original
     slot no longer fits (a date conflict, not a buffer violation), looks for the
     next available slot from the activity provider and adds a coordinated
     RESCHEDULE action - this is how a single flight choice can turn into a
     multi-action plan.
  5. Rejects any candidate that still has a BROKEN node afterwards.
  6. Computes cost/time/refund/risk/comfort metrics for every surviving candidate
     and hands them to the ScoringEngine for ranking.

This is a small, bounded search (a handful of provider alternatives), not a
general optimizer - deliberately, since explainability matters more here than
theoretical search power.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta

from app.engines.financial_engine import FinancialEngine
from app.engines.propagation_engine import PropagationEngine
from app.engines.refund_engine import RefundEngine
from app.engines.risk_engine import RiskEngine
from app.engines.scoring_engine import CandidateMetrics, ScoringEngine, weights_from_preferences
from app.engines.types import EngineEdge, EngineNode, NodeImpact
from app.providers.base import (
    ActivityProvider,
    FlightProvider,
    HotelProvider,
    ProviderAlternative,
    ProviderFailureError,
    TransferProvider,
)
from app.core.pipeline_trace import traced

BOOKABLE_CATEGORIES = {"flight", "hotel", "activity", "transfer", "return"}
MIN_REBOOK_BUFFER_MINUTES = 30
MAX_ACTIVITY_CONFLICT_PASSES = 5


@dataclass
class RecoveryActionResult:
    node_id: str
    node_label: str
    change_type: str
    description: str
    new_scheduled_start: datetime | None = None
    new_scheduled_end: datetime | None = None
    new_cost: float | None = None
    new_provider: str | None = None
    new_confirmation: str | None = None


@dataclass
class RecoveryPlanResult:
    key: str
    name: str
    tag: str
    tag_color: str
    description: str
    cost_delta: float
    time_impact_minutes: int
    bookings_preserved: int
    total_bookings: int
    refund_recovered: float
    residual_risk: str
    residual_risk_percent: int
    comfort_score: int
    feasible: bool
    actions: list[RecoveryActionResult] = field(default_factory=list)
    score: int = 0
    score_breakdown: dict[str, int] = field(default_factory=dict)
    provider_reason: str | None = None
    data_source: str = "simulated"


def _find_upstream_incoming(edges: list[EngineEdge], node_id: str) -> list[EngineEdge]:
    return [e for e in edges if e.target == node_id]


def _remove_incoming_edges(edges: list[EngineEdge], node_id: str) -> list[EngineEdge]:
    return [e for e in edges if e.target != node_id]


def _notice_hours(node: EngineNode, detected_at: datetime) -> float:
    """Hours of notice between detecting the disruption and the booking's original
    start - what cancellation-deadline policies are evaluated against. Never
    negative: a booking that has already started gets no notice."""
    return max(0.0, (node.scheduled_start - detected_at).total_seconds() / 3600)


def _clone_nodes(nodes: list[EngineNode]) -> dict[str, EngineNode]:
    import copy

    return {n.id: copy.copy(n) for n in nodes}


def _earliest_available_time(node_id: str, edges: list[EngineEdge], impacts: dict[str, NodeImpact]) -> datetime:
    """Walk upstream until a node with a concrete actual_start is found."""
    incoming = _find_upstream_incoming(edges, node_id)
    for edge in incoming:
        upstream = impacts.get(edge.source)
        if upstream and upstream.actual_start is not None:
            return upstream.actual_start + timedelta(minutes=MIN_REBOOK_BUFFER_MINUTES)
        if upstream:
            found = _earliest_available_time(edge.source, edges, impacts)
            if found:
                return found
    return datetime.max


def blocks_plan(node: EngineNode, impacts: dict[str, NodeImpact], disrupted_node_id: str) -> bool:
    """A broken node makes a plan infeasible - except the disrupted connection
    marker itself, which a rebooked onward leg replaces rather than repairs."""
    if impacts[node.id].status != "broken":
        return False
    return not (node.id == disrupted_node_id and node.category not in BOOKABLE_CATEGORIES)


class RecoveryEngine:
    def __init__(
        self,
        flight_provider: FlightProvider,
        hotel_provider: HotelProvider,
        activity_provider: ActivityProvider,
        transfer_provider: TransferProvider,
        propagation_engine: PropagationEngine | None = None,
        risk_engine: RiskEngine | None = None,
        financial_engine: FinancialEngine | None = None,
        refund_engine: RefundEngine | None = None,
        scoring_engine: ScoringEngine | None = None,
    ):
        self.flight_provider = flight_provider
        self.hotel_provider = hotel_provider
        self.activity_provider = activity_provider
        self.transfer_provider = transfer_provider
        self.propagation = propagation_engine or PropagationEngine()
        self.risk_engine = risk_engine or RiskEngine()
        self.financial_engine = financial_engine or FinancialEngine()
        self.refund_engine = refund_engine or RefundEngine()
        self.scoring_engine = scoring_engine or ScoringEngine()

    def _provider_for(self, category: str):
        return {
            "flight": self.flight_provider,
            "return": self.flight_provider,
            "hotel": self.hotel_provider,
            "activity": self.activity_provider,
            "transfer": self.transfer_provider,
        }[category]

    def _find_recovery_target(
        self, nodes: list[EngineNode], impacts: dict[str, NodeImpact], disrupted_node_id: str | None = None
    ) -> EngineNode | None:
        """The booking to replace: the disrupted booking itself when it is
        cancelled/broken (a cancelled first flight must be rebooked, not the
        last leg it takes down with it), else the earliest broken booking -
        the root of the cascade - then the earliest at-risk one."""
        nodes = sorted(nodes, key=lambda n: n.scheduled_start)
        disrupted = next((n for n in nodes if n.id == disrupted_node_id), None)
        if (
            disrupted is not None
            and disrupted.category in BOOKABLE_CATEGORIES
            and impacts[disrupted.id].status in ("broken", "cancelled")
        ):
            return disrupted
        broken = [
            n for n in nodes if n.category in BOOKABLE_CATEGORIES and impacts[n.id].status in ("broken", "cancelled")
        ]
        if broken:
            return broken[0]
        at_risk = [
            n for n in nodes if n.category in BOOKABLE_CATEGORIES and impacts[n.id].status == "at-risk"
        ]
        return at_risk[0] if at_risk else None

    def _provider_unavailable_plan(
        self, target: EngineNode, provider_name: str, reason: str
    ) -> RecoveryPlanResult:
        message = f"No options from {provider_name}. {reason}"
        return RecoveryPlanResult(
            key=f"provider-unavailable-{target.category}-{target.id}",
            name=f"No {target.category} recovery available",
            tag="UNAVAILABLE",
            tag_color="red",
            description=message,
            cost_delta=0,
            time_impact_minutes=0,
            bookings_preserved=0,
            total_bookings=1,
            refund_recovered=0,
            residual_risk="high",
            residual_risk_percent=100,
            comfort_score=0,
            feasible=False,
            provider_reason=message,
        )

    @traced("recovery", "Recovery engine: build candidate plans", detail=lambda r, a, k: {"plans": len(r), "feasible": sum(1 for p in r if p.feasible), "unavailable": [p.provider_reason for p in r if p.provider_reason][:1]})
    def generate_plans(
        self,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
        preferences: dict,
    ) -> list[RecoveryPlanResult]:
        target = self._find_recovery_target(nodes, impacts, disrupted_node_id)
        if target is None:
            return [self._keep_current_plan(nodes, edges, impacts)]

        if target.category in ("flight", "return"):
            candidates = self._flight_candidates(
                target, nodes, edges, impacts, disrupted_node_id, disruption_type, delay_minutes, detected_at
            )
        else:
            candidates = self._single_rebook_candidates(
                target, nodes, edges, impacts, disrupted_node_id, disruption_type, delay_minutes, detected_at
            )

        feasible = [c for c in candidates if c.feasible]
        if not feasible:
            return candidates  # surface why nothing was feasible rather than hiding everything

        weights = weights_from_preferences(preferences)
        metrics = [
            CandidateMetrics(
                id=c.key,
                cost_delta=c.cost_delta,
                refund_recovered=c.refund_recovered,
                time_impact_minutes=c.time_impact_minutes,
                bookings_preserved=c.bookings_preserved,
                total_bookings=c.total_bookings,
                residual_risk_percent=c.residual_risk_percent,
                comfort_score=c.comfort_score,
            )
            for c in feasible
        ]
        scored = {s.id: s for s in self.scoring_engine.score_candidates(metrics, weights)}
        for c in feasible:
            s = scored[c.key]
            c.score = s.score
            c.score_breakdown = s.breakdown

        return sorted(feasible, key=lambda c: -c.score)

    def _keep_current_plan(
        self, nodes: list[EngineNode], edges: list[EngineEdge], impacts: dict[str, NodeImpact]
    ) -> RecoveryPlanResult:
        """Nothing is broken or at risk (e.g. a short activity delay the buffers
        absorb): say so explicitly instead of returning an empty option list.
        Applying it resolves the disruption without changing any booking."""
        bookable = [n for n in nodes if n.category in BOOKABLE_CATEGORIES]
        residual = self._residual_risk(nodes, edges, impacts)
        return RecoveryPlanResult(
            key="keep-current",
            name="Keep your current plan",
            tag="NO CHANGE NEEDED",
            tag_color="green",
            description="Every booking still fits after this disruption - no rebooking is needed.",
            cost_delta=0,
            time_impact_minutes=0,
            bookings_preserved=len(bookable),
            total_bookings=len(bookable),
            refund_recovered=0,
            residual_risk="low" if residual < 30 else "medium" if residual < 60 else "high",
            residual_risk_percent=residual,
            comfort_score=100,
            feasible=True,
            score=100,
            score_breakdown={"cost": 100, "speed": 100, "preservation": 100, "comfort": 100, "risk": 100 - residual},
        )

    # -- flight recovery (the hero path) ---------------------------------------

    def _flight_candidates(
        self,
        target: EngineNode,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
    ) -> list[RecoveryPlanResult]:
        earliest = _earliest_available_time(target.id, edges, impacts)
        if earliest == datetime.max:
            # First leg of the trip: nothing upstream constrains it, so look for
            # alternatives from its own scheduled departure.
            earliest = target.scheduled_start
        try:
            alternatives = self.flight_provider.get_alternatives(
                target.origin_code or "", target.destination_code or "", earliest, target.confirmation
            )
        except ProviderFailureError as exc:
            return [self._provider_unavailable_plan(target, exc.provider_name, exc.reason)]

        if not alternatives:
            return [
                self._provider_unavailable_plan(
                    target, self.flight_provider.__class__.__name__,
                    f"No alternatives were returned for {target.origin_code or ''} → {target.destination_code or ''} after {earliest:%d %b %H:%M}."
                )
            ]

        results: list[RecoveryPlanResult] = []
        for alt in alternatives:
            results.append(
                self._simulate_flight_alternative(
                    target, alt, nodes, edges, impacts, disrupted_node_id, disruption_type, delay_minutes, detected_at
                )
            )
        return results

    def _simulate_flight_alternative(
        self,
        target: EngineNode,
        alt: ProviderAlternative,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        original_impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
    ) -> RecoveryPlanResult:
        provider_issues: list[str] = []
        working_nodes = _clone_nodes(nodes)
        working_edges = _remove_incoming_edges(edges, target.id)

        old_cost = target.cost
        working_nodes[target.id].scheduled_start = alt.departure
        working_nodes[target.id].scheduled_end = alt.arrival
        working_nodes[target.id].cost = alt.cost
        working_nodes[target.id].provider = alt.provider
        working_nodes[target.id].confirmation = alt.confirmation_hint
        working_nodes[target.id].refundable = alt.refundable
        working_nodes[target.id].refund_percentage = alt.refund_percentage
        working_nodes[target.id].cancellation_deadline_hours = alt.cancellation_deadline_hours

        actions = [
            RecoveryActionResult(
                node_id=target.id,
                node_label=target.title,
                change_type="rebooked",
                description=f"Rebooked to {alt.provider} {alt.confirmation_hint}, departing "
                f"{alt.departure.strftime('%H:%M')}.",
                new_scheduled_start=alt.departure,
                new_scheduled_end=alt.arrival,
                new_cost=alt.cost,
                new_provider=alt.provider,
                new_confirmation=alt.confirmation_hint,
            )
        ]

        # When the rebooked flight IS the disrupted one, the replacement is a new
        # booking the disruption no longer applies to (same rule as the generic path).
        rebooking_disrupted = target.id == disrupted_node_id
        sim_type = "healthy" if rebooking_disrupted else disruption_type
        sim_delay = 0 if rebooking_disrupted else delay_minutes

        result = self.propagation.propagate(
            list(working_nodes.values()), working_edges, disrupted_node_id, sim_type, sim_delay, detected_at
        )
        impacts = dict(result.impacts)

        # Later flights/transfers the new timing breaks get rebooked too.
        downstream_actions, downstream_cost, impacts = self._rebook_broken_downstream(
            working_nodes, working_edges, impacts, {target.id}, disrupted_node_id, sim_type, sim_delay, detected_at, provider_issues
        )
        actions.extend(downstream_actions)

        # If a downstream activity is now at-risk purely because its original slot
        # no longer fits the new arrival time, look for the next available slot.
        activity_actions, working_nodes, impacts = self._resolve_activity_conflicts(
            working_nodes, working_edges, impacts, disrupted_node_id, sim_type, sim_delay, detected_at, provider_issues
        )
        actions.extend(activity_actions)
        already_covered = {a.node_id for a in actions}

        for node in nodes:
            if node.id == target.id or node.id in already_covered:
                continue
            impact = impacts.get(node.id)
            if impact and impact.status in ("healthy", "delayed") and impact.caused_by:
                actions.append(
                    RecoveryActionResult(
                        node_id=node.id,
                        node_label=node.title,
                        change_type="rescheduled" if impact.status == "delayed" else "preserved",
                        description=impact.reason or "Timing adjusted automatically.",
                        new_scheduled_start=impact.actual_start,
                        new_scheduled_end=impact.actual_end,
                    )
                )
            elif impact and impact.status == "healthy":
                actions.append(
                    RecoveryActionResult(
                        node_id=node.id,
                        node_label=node.title,
                        change_type="preserved",
                        description="Unaffected by this recovery.",
                    )
                )

        feasible = not any(blocks_plan(n, impacts, disrupted_node_id) for n in nodes) and not provider_issues
        provider_reason = "; ".join(dict.fromkeys(provider_issues)) or None

        refund_result = self.refund_engine.calculate_refund(
            cost=old_cost,
            refundable=target.refundable,
            refund_percentage=target.refund_percentage,
            cancellation_deadline_hours=target.cancellation_deadline_hours,
            hours_before_start=_notice_hours(target, detected_at),
        )
        cost_delta = round(alt.cost - old_cost + downstream_cost, 2)

        bookable = [n for n in nodes if n.category in BOOKABLE_CATEGORIES]
        total = len(bookable)
        preserved = sum(1 for n in bookable if impacts[n.id].status in ("healthy", "delayed", "recovered"))
        time_impact = max(0, int((alt.arrival - target.scheduled_end).total_seconds() // 60))

        residual_risk_percent = self._residual_risk(list(working_nodes.values()), working_edges, impacts)
        comfort = 90 if alt.tier == "premium" else max(40, 70 - len(actions) * 3)

        tag, tag_color, name = self._label_for(alt, time_impact, cost_delta)

        return RecoveryPlanResult(
            key=f"flight-{alt.confirmation_hint}",
            name=name,
            tag=tag,
            tag_color=tag_color,
            description=f"Rebook {target.title} to {alt.provider} {alt.confirmation_hint} "
            f"departing {alt.departure.strftime('%H:%M')}.",
            cost_delta=cost_delta,
            time_impact_minutes=time_impact,
            bookings_preserved=preserved,
            total_bookings=total,
            refund_recovered=refund_result.refund_amount,
            residual_risk="low" if residual_risk_percent < 30 else "medium" if residual_risk_percent < 60 else "high",
            residual_risk_percent=residual_risk_percent,
            comfort_score=comfort,
            feasible=feasible,
            actions=actions,
            provider_reason=provider_reason,
            data_source=getattr(alt, "source", "simulated"),
        )

    @staticmethod
    def _earliest_connection_time(
        node_id: str, working_nodes: dict[str, EngineNode], edges: list[EngineEdge], impacts: dict[str, NodeImpact]
    ) -> datetime | None:
        """When a booking can start at the earliest: every upstream leg's
        (simulated) end plus that dependency's minimum buffer."""
        latest: datetime | None = None
        for edge in edges:
            if edge.target != node_id or edge.source not in working_nodes:
                continue
            upstream = impacts.get(edge.source)
            end = upstream.actual_end if upstream and upstream.actual_end else working_nodes[edge.source].scheduled_end
            ready = end + timedelta(minutes=edge.min_buffer_minutes)
            latest = ready if latest is None or ready > latest else latest
        return latest

    def _rebook_broken_downstream(
        self,
        working_nodes: dict[str, EngineNode],
        working_edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        handled: set[str],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
        provider_issues: list[str],
    ) -> tuple[list[RecoveryActionResult], float, dict[str, NodeImpact]]:
        """Coordinated recovery beyond the first rebooking: a later flight or
        transfer that the new timing breaks (e.g. the Delhi -> Leh connection
        after the Mumbai -> Delhi flight moves) is rebooked onto the first
        option after its new earliest connection time, then the graph is
        re-propagated. Activities are handled by _resolve_activity_conflicts.
        Returns the actions, their extra cost, and the updated impacts."""
        actions: list[RecoveryActionResult] = []
        extra_cost = 0.0
        for _ in range(MAX_ACTIVITY_CONFLICT_PASSES):
            broken = sorted(
                (
                    n for n in working_nodes.values()
                    if n.id not in handled
                    and n.category in BOOKABLE_CATEGORIES - {"activity"}
                    and impacts[n.id].status == "broken"
                ),
                key=lambda n: n.scheduled_start,
            )
            if not broken:
                break
            node = broken[0]
            handled.add(node.id)
            earliest = self._earliest_connection_time(node.id, working_nodes, working_edges, impacts)
            if earliest is None:
                continue
            provider = self._provider_for(node.category)
            try:
                if node.category in ("flight", "return"):
                    alternatives = provider.get_alternatives(
                        node.origin_code or "", node.destination_code or "", earliest, node.confirmation
                    )
                else:
                    alternatives = provider.get_alternatives(node.location, earliest)
            except ProviderFailureError as exc:
                provider_issues.append(f"No options from {exc.provider_name} for {node.title}. {exc.reason}.")
                continue
            alt = next((a for a in sorted(alternatives, key=lambda a: a.departure) if a.departure >= earliest), None)
            if alt is None:
                provider_issues.append(
                    f"No {node.category} after {earliest:%d %b %H:%M} was available to replace {node.title}."
                )
                continue
            duration = node.scheduled_end - node.scheduled_start
            new_end = alt.arrival if node.category in ("flight", "return") else alt.departure + duration
            extra_cost += alt.cost - node.cost
            working = working_nodes[node.id]
            working.scheduled_start, working.scheduled_end = alt.departure, new_end
            working.cost, working.provider, working.confirmation = alt.cost, alt.provider, alt.confirmation_hint
            working_edges[:] = _remove_incoming_edges(working_edges, node.id)
            actions.append(
                RecoveryActionResult(
                    node_id=node.id,
                    node_label=node.title,
                    change_type="rebooked",
                    description=f"Rebooked to {alt.provider} {alt.confirmation_hint}, departing "
                    f"{alt.departure:%d %b %H:%M}, to keep the connection.",
                    new_scheduled_start=alt.departure,
                    new_scheduled_end=new_end,
                    new_cost=alt.cost,
                    new_provider=alt.provider,
                    new_confirmation=alt.confirmation_hint,
                )
            )
            impacts = dict(
                self.propagation.propagate(
                    list(working_nodes.values()), working_edges, disrupted_node_id, disruption_type, delay_minutes, detected_at
                ).impacts
            )
        return actions, round(extra_cost, 2), impacts

    def _resolve_activity_conflicts(
        self,
        working_nodes: dict[str, EngineNode],
        working_edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
        provider_issues: list[str],
    ) -> tuple[list[RecoveryActionResult], dict[str, EngineNode], dict[str, NodeImpact]]:
        """Reschedules every at-risk activity onto its next available slot, then
        re-propagates and repeats until a pass makes no further changes.

        Moving one activity to a new slot can itself put a *different* activity
        at risk (e.g. two same-day activities that only collide once the first
        one shifts) - that only becomes visible in the impacts produced by the
        re-propagation after the first pass, so a single scan-and-fix isn't
        enough. Bounded by MAX_ACTIVITY_CONFLICT_PASSES so a pathological case
        (no slot ever fully resolves) can't loop indefinitely.
        """
        all_actions: list[RecoveryActionResult] = []
        working_edges = list(working_edges)

        for _ in range(MAX_ACTIVITY_CONFLICT_PASSES):
            pass_actions, changed = self._reschedule_at_risk_activities(working_nodes, working_edges, impacts, provider_issues)
            if not changed:
                break
            all_actions.extend(pass_actions)
            result = self.propagation.propagate(
                list(working_nodes.values()), working_edges, disrupted_node_id, disruption_type, delay_minutes, detected_at
            )
            impacts = dict(result.impacts)

        return all_actions, working_nodes, impacts

    def _reschedule_at_risk_activities(
        self,
        working_nodes: dict[str, EngineNode],
        working_edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        provider_issues: list[str],
    ) -> tuple[list[RecoveryActionResult], bool]:
        """Single scan: moves every currently at-risk activity to its next
        available slot. Mutates working_nodes/working_edges in place; returns
        the actions taken and whether anything changed this pass."""
        actions: list[RecoveryActionResult] = []
        changed = False

        for node in list(working_nodes.values()):
            if node.category != "activity":
                continue
            impact = impacts.get(node.id)
            if not impact or impact.status != "at-risk":
                continue
            try:
                alternatives = self.activity_provider.get_alternatives(node.location, node.scheduled_start)
            except ProviderFailureError as exc:
                provider_issues.append(
                    f"No options from {exc.provider_name} for {node.title}. {exc.reason}."
                )
                continue
            if not alternatives:
                provider_issues.append(
                    f"No options from {self.activity_provider.__class__.__name__} for {node.title}: "
                    f"no later slot was returned for {node.location}."
                )
                continue
            next_slot = next((a for a in alternatives if a.departure > node.scheduled_start), None)
            if not next_slot:
                provider_issues.append(
                    f"No options from {self.activity_provider.__class__.__name__} for {node.title}: "
                    "the provider returned no later slot that can resolve the conflict."
                )
                continue
            duration = node.scheduled_end - node.scheduled_start
            working_nodes[node.id].scheduled_start = next_slot.departure
            working_nodes[node.id].scheduled_end = next_slot.departure + duration
            working_edges[:] = _remove_incoming_edges(working_edges, node.id)
            actions.append(
                RecoveryActionResult(
                    node_id=node.id,
                    node_label=node.title,
                    change_type="rescheduled",
                    description=f"Moved to {next_slot.departure.strftime('%d %b, %H:%M')} "
                    "since the original slot no longer fits the new arrival time.",
                    new_scheduled_start=next_slot.departure,
                    new_scheduled_end=next_slot.departure + duration,
                )
            )
            changed = True

        return actions, changed

    def _label_for(self, alt: ProviderAlternative, time_impact: int, cost_delta: float) -> tuple[str, str, str]:
        if alt.tier == "premium":
            return "FASTEST", "amber", f"Premium alternate: {alt.provider} {alt.confirmation_hint}"
        if time_impact > 300:
            return "CHEAPEST", "green", f"Next available: {alt.provider} {alt.confirmation_hint} (next day)"
        return "BEST BALANCE", "cyan", f"Rebook next available flight: {alt.provider} {alt.confirmation_hint}"

    # -- generic single-booking recovery (hotel / activity / transfer) --------

    def _single_rebook_candidates(
        self,
        target: EngineNode,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
    ) -> list[RecoveryPlanResult]:
        provider = self._provider_for(target.category)
        earliest = _earliest_available_time(target.id, edges, impacts)
        if earliest == datetime.max:
            earliest = target.scheduled_start
        try:
            alternatives = provider.get_alternatives(target.location, earliest)
        except ProviderFailureError as exc:
            return [self._provider_unavailable_plan(target, exc.provider_name, exc.reason)]

        if not alternatives:
            return [
                self._provider_unavailable_plan(
                    target, provider.__class__.__name__,
                    f"No alternatives were returned for {target.location} after {earliest:%d %b %H:%M}."
                )
            ]

        results: list[RecoveryPlanResult] = []
        for alt in alternatives:
            if alt.confirmation_hint == target.confirmation:
                continue
            provider_issues: list[str] = []
            working_nodes = _clone_nodes(nodes)
            working_edges = _remove_incoming_edges(edges, target.id)
            old_cost = target.cost
            duration = target.scheduled_end - target.scheduled_start
            working_nodes[target.id].scheduled_start = alt.departure
            working_nodes[target.id].scheduled_end = alt.departure + duration
            working_nodes[target.id].cost = alt.cost
            working_nodes[target.id].provider = alt.provider
            working_nodes[target.id].confirmation = alt.confirmation_hint

            sim_disrupted_id = target.id if target.id == disrupted_node_id else disrupted_node_id
            sim_disruption_type = "healthy" if target.id == disrupted_node_id else disruption_type
            sim_delay = 0 if target.id == disrupted_node_id else delay_minutes

            result = self.propagation.propagate(
                list(working_nodes.values()), working_edges, sim_disrupted_id, sim_disruption_type, sim_delay, detected_at
            )
            impacts_new = dict(result.impacts)
            downstream_actions, downstream_cost, impacts_new = self._rebook_broken_downstream(
                working_nodes, working_edges, impacts_new, {target.id}, sim_disrupted_id, sim_disruption_type, sim_delay,
                detected_at, provider_issues,
            )
            activity_actions, working_nodes, impacts_new = self._resolve_activity_conflicts(
                working_nodes, working_edges, impacts_new, sim_disrupted_id, sim_disruption_type, sim_delay, detected_at, provider_issues
            )
            feasible = not any(blocks_plan(n, impacts_new, disrupted_node_id) for n in nodes) and not provider_issues
            provider_reason = "; ".join(dict.fromkeys(provider_issues)) or None
            bookable = [n for n in nodes if n.category in BOOKABLE_CATEGORIES]
            total = len(bookable)
            preserved = sum(
                1 for n in bookable if impacts_new[n.id].status in ("healthy", "delayed", "recovered")
            )

            refund_result = self.refund_engine.calculate_refund(
                cost=old_cost,
                refundable=target.refundable,
                refund_percentage=target.refund_percentage,
                cancellation_deadline_hours=target.cancellation_deadline_hours,
                hours_before_start=_notice_hours(target, detected_at),
            )
            residual_risk_percent = self._residual_risk(list(working_nodes.values()), working_edges, impacts_new)

            results.append(
                RecoveryPlanResult(
                    key=f"{target.category}-{alt.confirmation_hint}",
                    name=f"Rebook with {alt.provider}",
                    tag="ALTERNATIVE",
                    tag_color="blue",
                    description=f"Replace {target.title} with {alt.provider} ({alt.confirmation_hint}).",
                    cost_delta=round(alt.cost - old_cost + downstream_cost, 2),
                    time_impact_minutes=max(0, int((alt.departure - target.scheduled_start).total_seconds() // 60)),
                    bookings_preserved=preserved,
                    total_bookings=total,
                    refund_recovered=refund_result.refund_amount,
                    residual_risk="low" if residual_risk_percent < 30 else "medium" if residual_risk_percent < 60 else "high",
                    residual_risk_percent=residual_risk_percent,
                    comfort_score=70,
                    feasible=feasible,
                    actions=[
                        RecoveryActionResult(
                            node_id=target.id,
                            node_label=target.title,
                            change_type="rebooked",
                            description=f"Rebooked with {alt.provider} ({alt.confirmation_hint}).",
                            new_scheduled_start=alt.departure,
                            new_scheduled_end=alt.departure + duration,
                            new_cost=alt.cost,
                            new_provider=alt.provider,
                            new_confirmation=alt.confirmation_hint,
                        ),
                        *downstream_actions,
                        *activity_actions,
                    ],
                    provider_reason=provider_reason,
                )
            )
        return results

    def _residual_risk(
        self, nodes: list[EngineNode], edges: list[EngineEdge], impacts: dict[str, NodeImpact]
    ) -> int:
        percents = []
        for edge in edges:
            if edge.dependency_type != "hard":
                continue
            source_impact = impacts.get(edge.source)
            target_node = next((n for n in nodes if n.id == edge.target), None)
            if not source_impact or not target_node or source_impact.actual_end is None:
                continue
            available = int((target_node.scheduled_start - source_impact.actual_end).total_seconds() // 60)
            result = self.risk_engine.connection_risk(
                edge_label=edge.id,
                available_minutes=available,
                required_minutes=max(edge.min_buffer_minutes, 1),
                recommended_minutes=edge.min_buffer_minutes + edge.risk_buffer_minutes,
                location=target_node.location,
                moment=target_node.scheduled_start,
                dependency_count=1,
                road=target_node.category == "transfer",
            )
            percents.append(result.risk_percent)
        if not percents:
            return 10
        return round(sum(percents) / len(percents))
