"""ItineraryEngine: trip-level orchestration over the other engines.

This is the one engine that is allowed to combine the others - it computes the
per-node/edge risk picture and the overall trip health score from whatever the
current itinerary state actually is (healthy or mid-disruption), so nothing here
is a fixed number like the old frontend's `healthScore = 94`.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.engines.financial_engine import FinancialEngine, FinancialSummary
from app.engines.risk_engine import RiskEngine, RiskResult
from app.engines.types import EngineEdge, EngineNode, NodeImpact


@dataclass
class NodeRiskSnapshot:
    node_id: str
    result: RiskResult
    is_connection_risk: bool = False
    available_minutes: int | None = None
    required_minutes: int | None = None
    recommended_minutes: int | None = None


class ItineraryEngine:
    def __init__(self, risk_engine: RiskEngine | None = None, financial_engine: FinancialEngine | None = None):
        self.risk_engine = risk_engine or RiskEngine()
        self.financial_engine = financial_engine or FinancialEngine()

    def compute_node_risks(
        self, nodes: list[EngineNode], edges: list[EngineEdge]
    ) -> list[NodeRiskSnapshot]:
        node_by_id = {n.id: n for n in nodes}
        dependency_count = {n.id: 0 for n in nodes}
        for edge in edges:
            dependency_count[edge.source] = dependency_count.get(edge.source, 0) + 1

        snapshots: list[NodeRiskSnapshot] = []
        incoming_hard: dict[str, EngineEdge] = {
            e.target: e for e in edges if e.dependency_type == "hard"
        }

        for node in nodes:
            edge = incoming_hard.get(node.id)
            if edge is not None:
                upstream = node_by_id[edge.source]
                available = int((node.scheduled_start - upstream.scheduled_end).total_seconds() // 60)
                required = max(edge.min_buffer_minutes, 1)
                recommended = edge.min_buffer_minutes + edge.risk_buffer_minutes
                result = self.risk_engine.connection_risk(
                    edge_label=edge.id,
                    available_minutes=available,
                    required_minutes=required,
                    recommended_minutes=recommended,
                    location=node.location,
                    moment=node.scheduled_start,
                    dependency_count=dependency_count.get(node.id, 0),
                )
                snapshots.append(
                    NodeRiskSnapshot(node.id, result, True, available, required, recommended)
                )
            else:
                result = self.risk_engine.exposure_risk(
                    provider=node.provider,
                    cost=node.cost,
                    refundable=node.refundable,
                    refund_percentage=node.refund_percentage,
                    dependency_count=dependency_count.get(node.id, 0),
                    moment=node.scheduled_start,
                )
                snapshots.append(NodeRiskSnapshot(node.id, result))
        return snapshots

    def compute_health_score(
        self,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        impacts: dict[str, NodeImpact] | None = None,
    ) -> int:
        node_risks = self.compute_node_risks(nodes, edges)
        financial = self.financial_engine.summarize(nodes, impacts)
        exposure_ratio = financial.at_risk_value / financial.total_trip_value if financial.total_trip_value else 0
        resilience = self.risk_engine.trip_resilience(
            [snap.result.risk_percent for snap in node_risks], exposure_ratio
        )

        if impacts:
            severe = sum(1 for i in impacts.values() if i.status in ("broken", "cancelled"))
            watch = sum(1 for i in impacts.values() if i.status == "at-risk")
            resilience -= severe * 15 + watch * 5

        return max(0, min(100, round(resilience)))

    def financial_summary(
        self, nodes: list[EngineNode], impacts: dict[str, NodeImpact] | None = None
    ) -> FinancialSummary:
        return self.financial_engine.summarize(nodes, impacts)
