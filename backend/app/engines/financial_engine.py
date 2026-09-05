"""FinancialEngine: aggregates itinerary-level financial exposure from real booking data."""

from __future__ import annotations

from dataclasses import dataclass

from app.engines.refund_engine import RefundEngine
from app.engines.types import EngineNode, NodeImpact

_NON_HEALTHY = {"at-risk", "broken", "cancelled", "delayed"}


@dataclass
class FinancialSummary:
    total_trip_value: float
    at_risk_value: float
    refundable_value: float
    non_refundable_value: float
    potential_refund: float


class FinancialEngine:
    def __init__(self, refund_engine: RefundEngine | None = None):
        self.refund_engine = refund_engine or RefundEngine()

    def summarize(
        self,
        nodes: list[EngineNode],
        impacts: dict[str, NodeImpact] | None = None,
    ) -> FinancialSummary:
        total = sum(n.cost for n in nodes)
        refundable_value = sum(n.cost for n in nodes if n.refundable)
        non_refundable_value = total - refundable_value

        at_risk_value = 0.0
        potential_refund = 0.0
        impacts = impacts or {}

        for node in nodes:
            impact = impacts.get(node.id)
            if impact and impact.status in _NON_HEALTHY:
                at_risk_value += node.cost
                hours_before_start = max(
                    0.0, (node.scheduled_start - (impact.actual_end or node.scheduled_start)).total_seconds() / 3600
                )
                refund = self.refund_engine.calculate_refund(
                    cost=node.cost,
                    refundable=node.refundable,
                    refund_percentage=node.refund_percentage,
                    cancellation_deadline_hours=node.cancellation_deadline_hours,
                    hours_before_start=hours_before_start,
                )
                potential_refund += refund.refund_amount

        return FinancialSummary(
            total_trip_value=round(total, 2),
            at_risk_value=round(at_risk_value, 2),
            refundable_value=round(refundable_value, 2),
            non_refundable_value=round(non_refundable_value, 2),
            potential_refund=round(potential_refund, 2),
        )
