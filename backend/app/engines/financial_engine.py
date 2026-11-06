"""FinancialEngine: aggregates itinerary-level financial exposure from real booking data."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from app.engines.refund_engine import RefundEngine
from app.engines.types import EngineNode, NodeImpact
from app.core.pipeline_trace import traced

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

    @traced("impact_engine", "Financial exposure", detail=lambda r, a, k: {"atRiskValue": round(r.at_risk_value), "potentialRefund": round(r.potential_refund)})
    def summarize(
        self,
        nodes: list[EngineNode],
        impacts: dict[str, NodeImpact] | None = None,
        detected_at: datetime | None = None,
    ) -> FinancialSummary:
        """`detected_at` is when the disruption was detected; refunds for affected
        bookings are evaluated against the notice that leaves before each one
        starts. Without it, every cancellation is treated as no-notice (the
        conservative worst case)."""
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
                hours_before_start = (
                    max(0.0, (node.scheduled_start - detected_at).total_seconds() / 3600) if detected_at else 0.0
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
