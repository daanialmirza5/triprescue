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
from app.providers.base import ActivityProvider, FlightProvider, HotelProvider, ProviderAlternative, TransferProvider

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


def _find_upstream_incoming(edges: list[EngineEdge], node_id: str) -> list[EngineEdge]:
    return [e for e in edges if e.target == node_id]


def _remove_incoming_edges(edges: list[EngineEdge], node_id: str) -> list[EngineEdge]:
    return [e for e in edges if e.target != node_id]


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
        self, nodes: list[EngineNode], impacts: dict[str, NodeImpact]
    ) -> EngineNode | None:
        broken = [
            n for n in nodes if n.category in BOOKABLE_CATEGORIES and impacts[n.id].status in ("broken", "cancelled")
        ]
        if broken:
            return broken[0]
        at_risk = [
            n for n in nodes if n.category in BOOKABLE_CATEGORIES and impacts[n.id].status == "at-risk"
        ]
        return at_risk[0] if at_risk else None

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
        target = self._find_recovery_target(nodes, impacts)
        if target is None:
            return []

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
        alternatives = self.flight_provider.get_alternatives(
            target.origin_code or "", target.destination_code or "", earliest, target.confirmation
        )

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

        result = self.propagation.propagate(
            list(working_nodes.values()), working_edges, disrupted_node_id, disruption_type, delay_minutes, detected_at
        )
        impacts = dict(result.impacts)

        # If a downstream activity is now at-risk purely because its original slot
        # no longer fits the new arrival time, look for the next available slot.
        activity_actions, working_nodes, impacts = self._resolve_activity_conflicts(
            working_nodes, working_edges, impacts, disrupted_node_id, disruption_type, delay_minutes, detected_at
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

        feasible = all(impacts[n.id].status not in ("broken",) for n in nodes)

        refund_result = self.refund_engine.calculate_refund(
            cost=old_cost,
            refundable=target.refundable,
            refund_percentage=target.refund_percentage,
            cancellation_deadline_hours=target.cancellation_deadline_hours,
            hours_before_start=0,  # the original booking failed same-day; treat as no-notice cancellation
        )
        cost_delta = round(alt.cost - old_cost, 2)

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
        )

    def _resolve_activity_conflicts(
        self,
        working_nodes: dict[str, EngineNode],
        working_edges: list[EngineEdge],
        impacts: dict[str, NodeImpact],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None,
        detected_at: datetime,
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
            pass_actions, changed = self._reschedule_at_risk_activities(working_nodes, working_edges, impacts)
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
            alternatives = self.activity_provider.get_alternatives(node.location, node.scheduled_start)
            next_slot = next((a for a in alternatives if a.departure > node.scheduled_start), None)
            if not next_slot:
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
        alternatives = provider.get_alternatives(target.location, earliest)

        results: list[RecoveryPlanResult] = []
        for alt in alternatives:
            if alt.confirmation_hint == target.confirmation:
                continue
            working_nodes = _clone_nodes(nodes)
            working_edges = _remove_incoming_edges(edges, target.id)
            old_cost = target.cost
            duration = target.scheduled_end - target.scheduled_start
            working_nodes[target.id].scheduled_start = alt.departure
            working_nodes[target.id].scheduled_end = alt.departure + duration
            working_nodes[target.id].cost = alt.cost
            working_nodes[target.id].provider = alt.provider
            working_nodes[target.id].confirmation = alt.confirmation_hint

            result = self.propagation.propagate(
                list(working_nodes.values()), working_edges, disrupted_node_id, disruption_type, delay_minutes, detected_at
            )
            impacts_new = result.impacts
            feasible = all(impacts_new[n.id].status != "broken" for n in nodes)
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
                hours_before_start=0,
            )
            residual_risk_percent = self._residual_risk(list(working_nodes.values()), working_edges, impacts_new)

            results.append(
                RecoveryPlanResult(
                    key=f"{target.category}-{alt.confirmation_hint}",
                    name=f"Rebook with {alt.provider}",
                    tag="ALTERNATIVE",
                    tag_color="blue",
                    description=f"Replace {target.title} with {alt.provider} ({alt.confirmation_hint}).",
                    cost_delta=round(alt.cost - old_cost, 2),
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
                        )
                    ],
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
            )
            percents.append(result.risk_percent)
        if not percents:
            return 10
        return round(sum(percents) / len(percents))
