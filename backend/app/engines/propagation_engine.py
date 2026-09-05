"""PropagationEngine: computes what actually breaks when a disruption occurs.

This is deliberately NOT "mark everything downstream red". Every node's resulting
status is derived from an explicit buffer/feasibility calculation against its
specific incoming edges, so the algorithm generalizes to any itinerary graph
(branches, multiple dependencies, etc.), not just the Ladakh trip it was designed
against.

Algorithm (see docs/ALGORITHM_SPEC.md for the full write-up):

1. Build a GraphEngine from the node/edge set and compute a topological order.
   (A cyclic dependency graph is a data error, not a disruption scenario, and is
   rejected up front.)
2. Walk nodes in topological order. For the disrupted node itself, apply the
   disruption's direct effect (delay, cancellation, ...). For every other node,
   evaluate each of its incoming edges against the (already-resolved) upstream
   node and take the worst resulting outcome.
3. Edge evaluation implements two kinds of dependency:
     - HARD edges (e.g. a flight connection): if the upstream is broken/cancelled,
       or if the available buffer is smaller than the edge's required buffer, the
       downstream node becomes BROKEN. There is no "soft landing" for a hard
       dependency - either the connection is feasible or it is not.
     - SOFT edges (e.g. transfer -> hotel -> activity sequencing): a buffer
       shortfall pushes a flexible node's schedule later (DELAYED) or flags an
       inflexible node as AT_RISK, but never breaks it outright - soft
       dependencies are things a traveler can usually still work around.
4. Uncertainty window: when an upstream node is BROKEN/CANCELLED and the
   dependency is SOFT, the downstream node is only marked AT_RISK if it is
   scheduled to start within UNCERTAINTY_WINDOW_HOURS of the disruption. Nodes
   far enough in the future (e.g. an activity two days later) are assumed
   recoverable by then and are left HEALTHY. This single, documented heuristic
   is what produces a realistic "how far does this cascade actually reach"
   boundary without hardcoding which specific nodes are affected.

All timestamps are itinerary-relative (the trip's own calendar), never wall-clock
time, so propagation is fully deterministic and reproducible in tests.
"""

from __future__ import annotations

from dataclasses import replace
from datetime import datetime, timedelta

from app.engines.graph_engine import GraphEngine
from app.engines.types import EngineEdge, EngineNode, NodeImpact, PropagationResult

UNCERTAINTY_WINDOW_HOURS = 24

_STATUS_PRIORITY = {
    "healthy": 0,
    "delayed": 1,
    "at-risk": 2,
    "broken": 3,
    "cancelled": 4,
}

_DISRUPTIVE_CANCEL_TYPES = {
    "flight-cancellation": "Flight cancelled by the airline.",
    "hotel-cancellation": "Hotel cancelled the reservation.",
    "activity-cancellation": "Activity cancelled by the operator.",
    "airport-closure": "Airport closed; all departures from here are suspended.",
}

_DISRUPTIVE_BREAK_TYPES = {
    "missed-connection": "Connection was missed.",
    "transfer-failure": "Transfer provider failed to arrive.",
}


def _minutes_between(earlier: datetime, later: datetime) -> int:
    return int((later - earlier).total_seconds() // 60)


def _healthy_impact(node: EngineNode) -> NodeImpact:
    return NodeImpact(
        node_id=node.id,
        status="healthy",
        actual_start=node.scheduled_start,
        actual_end=node.scheduled_end,
    )


def apply_disruption_override(
    node: EngineNode,
    disruption_type: str,
    delay_minutes: int | None,
) -> NodeImpact:
    base = _healthy_impact(node)

    if disruption_type == "flight-delay":
        delay = delay_minutes or 0
        return replace(
            base,
            status="delayed" if delay > 0 else "healthy",
            actual_end=node.scheduled_end + timedelta(minutes=delay),
            reason=f"Delayed by {delay} minutes." if delay else None,
            delay_minutes=delay,
        )

    if disruption_type == "activity-delay":
        delay = delay_minutes or 0
        return replace(
            base,
            status="delayed" if delay > 0 else "healthy",
            actual_start=node.scheduled_start + timedelta(minutes=delay),
            actual_end=node.scheduled_end + timedelta(minutes=delay),
            reason=f"Delayed by {delay} minutes." if delay else None,
            delay_minutes=delay,
        )

    if disruption_type == "hotel-conflict":
        return replace(
            base,
            status="at-risk",
            reason="Check-in conflict: the room may not be ready at the scheduled time.",
        )

    if disruption_type in _DISRUPTIVE_CANCEL_TYPES:
        return replace(
            base,
            status="cancelled",
            actual_start=None,
            actual_end=None,
            reason=_DISRUPTIVE_CANCEL_TYPES[disruption_type],
        )

    if disruption_type in _DISRUPTIVE_BREAK_TYPES:
        return replace(
            base,
            status="broken",
            actual_start=None,
            actual_end=None,
            reason=_DISRUPTIVE_BREAK_TYPES[disruption_type],
        )

    # Unknown disruption type: treat conservatively as a full break.
    return replace(base, status="broken", actual_start=None, actual_end=None, reason="Disrupted.")


def _evaluate_edge(
    edge: EngineEdge,
    upstream_impact: NodeImpact,
    upstream_node: EngineNode,
    node: EngineNode,
    detected_at: datetime,
) -> NodeImpact:
    hours_until_node = (node.scheduled_start - detected_at).total_seconds() / 3600
    reference_time = (
        upstream_impact.actual_start if edge.upstream_reference == "start" else upstream_impact.actual_end
    )

    if upstream_impact.status in ("broken", "cancelled") or reference_time is None:
        if edge.dependency_type == "hard":
            return NodeImpact(
                node_id=node.id,
                status="broken",
                reason=(
                    f"{node.title} depends on {upstream_node.title}, which is {upstream_impact.status}."
                ),
                caused_by=upstream_impact.node_id,
                available_buffer_minutes=0,
                required_buffer_minutes=edge.min_buffer_minutes,
            )
        if hours_until_node <= UNCERTAINTY_WINDOW_HOURS:
            # Deliberately leave actual_start/actual_end unset: the uncertainty is
            # real (we don't know when this will resolve), and leaving them None
            # lets the SAME uncertainty check apply independently to whatever is
            # scheduled next, rather than falsely resolving to "on schedule".
            return NodeImpact(
                node_id=node.id,
                status="at-risk",
                reason=(
                    f"{upstream_node.title} is {upstream_impact.status}; timing beyond this point "
                    "is uncertain until it is recovered."
                ),
                caused_by=upstream_impact.node_id,
            )
        return NodeImpact(
            node_id=node.id,
            status="healthy",
            actual_start=node.scheduled_start,
            actual_end=node.scheduled_end,
        )

    # Upstream has a concrete reference time - do the real buffer arithmetic.
    available = _minutes_between(reference_time, node.scheduled_start)
    required = edge.min_buffer_minutes
    deficit = required - available
    duration = node.scheduled_end - node.scheduled_start

    if deficit > 0:
        clamped_available = max(0, available)
        if edge.dependency_type == "hard":
            return NodeImpact(
                node_id=node.id,
                status="broken",
                reason=(
                    f"Required buffer is {required} minutes but only {clamped_available} minutes remain."
                ),
                caused_by=upstream_impact.node_id,
                available_buffer_minutes=clamped_available,
                required_buffer_minutes=required,
            )
        shifted_start = reference_time + timedelta(minutes=required)
        shifted_end = node.scheduled_end if node.fixed_end else shifted_start + duration
        if node.flexible:
            return NodeImpact(
                node_id=node.id,
                status="delayed",
                reason=(
                    f"Shifted later by {int(deficit)} minutes because {upstream_node.title} "
                    "finished later than scheduled."
                ),
                caused_by=upstream_impact.node_id,
                actual_start=shifted_start,
                actual_end=shifted_end,
                available_buffer_minutes=clamped_available,
                required_buffer_minutes=required,
                delay_minutes=int(deficit),
            )
        return NodeImpact(
            node_id=node.id,
            status="at-risk",
            reason=(
                f"Buffer after {upstream_node.title} is tighter than recommended "
                f"({clamped_available} of {required} minutes needed)."
            ),
            caused_by=upstream_impact.node_id,
            actual_start=shifted_start,
            actual_end=shifted_end,
            available_buffer_minutes=clamped_available,
            required_buffer_minutes=required,
        )

    actual_start = max(node.scheduled_start, reference_time)
    actual_end = node.scheduled_end if node.fixed_end else actual_start + duration
    shifted = actual_start != node.scheduled_start
    return NodeImpact(
        node_id=node.id,
        status="delayed" if shifted else "healthy",
        reason="Shifted slightly due to upstream timing." if shifted else None,
        caused_by=upstream_impact.node_id if shifted else None,
        actual_start=actual_start,
        actual_end=actual_end,
        available_buffer_minutes=available,
        required_buffer_minutes=required,
    )


def _worst(outcomes: list[NodeImpact]) -> NodeImpact:
    return max(outcomes, key=lambda o: _STATUS_PRIORITY.get(o.status, 0))


class PropagationEngine:
    def propagate(
        self,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        disrupted_node_id: str,
        disruption_type: str,
        delay_minutes: int | None = None,
        detected_at: datetime | None = None,
    ) -> PropagationResult:
        node_by_id = {n.id: n for n in nodes}
        if disrupted_node_id not in node_by_id:
            raise ValueError(f"Unknown node id: {disrupted_node_id}")

        graph = GraphEngine([n.id for n in nodes], [(e.source, e.target) for e in edges])
        validation_errors = graph.validate_graph()
        if validation_errors:
            raise ValueError(f"Invalid itinerary graph: {'; '.join(validation_errors)}")

        topo = graph.topological_order()
        detected_at = detected_at or node_by_id[disrupted_node_id].scheduled_start

        incoming_by_target: dict[str, list[EngineEdge]] = {}
        for edge in edges:
            incoming_by_target.setdefault(edge.target, []).append(edge)

        impacts: dict[str, NodeImpact] = {}
        sequence: list[str] = []

        for node_id in topo:
            node = node_by_id[node_id]
            if node_id == disrupted_node_id:
                impact = apply_disruption_override(node, disruption_type, delay_minutes)
            else:
                incoming = incoming_by_target.get(node_id, [])
                if not incoming:
                    impact = _healthy_impact(node)
                else:
                    outcomes = [
                        _evaluate_edge(edge, impacts[edge.source], node_by_id[edge.source], node, detected_at)
                        for edge in incoming
                        if edge.source in impacts
                    ]
                    impact = _worst(outcomes) if outcomes else _healthy_impact(node)
            impacts[node_id] = impact
            sequence.append(node_id)

        return PropagationResult(impacts=impacts, sequence=sequence)
