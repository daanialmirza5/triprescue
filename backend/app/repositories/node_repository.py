from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dependency_edge import DependencyEdge
from app.models.itinerary_node import ItineraryNode
from app.core.pipeline_trace import traced


class NodeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, node_id: str) -> ItineraryNode | None:
        return self.db.get(ItineraryNode, node_id)

    @traced("database", "Read journey nodes", detail=lambda r, a, k: {"operation": "read", "table": "itinerary_nodes", "rows": len(r)})
    def list_for_trip(self, trip_id: str) -> list[ItineraryNode]:
        return list(self.db.scalars(select(ItineraryNode).where(ItineraryNode.trip_id == trip_id)))

    @traced("database", "Read dependency edges", detail=lambda r, a, k: {"operation": "read", "table": "dependency_edges", "rows": len(r)})
    def list_edges_for_trip(self, trip_id: str) -> list[DependencyEdge]:
        return list(self.db.scalars(select(DependencyEdge).where(DependencyEdge.trip_id == trip_id)))

    def save(self, node: ItineraryNode) -> ItineraryNode:
        self.db.add(node)
        self.db.flush()
        return node
