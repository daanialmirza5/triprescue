from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dependency_edge import DependencyEdge
from app.models.itinerary_node import ItineraryNode


class NodeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, node_id: str) -> ItineraryNode | None:
        return self.db.get(ItineraryNode, node_id)

    def list_for_trip(self, trip_id: str) -> list[ItineraryNode]:
        return list(self.db.scalars(select(ItineraryNode).where(ItineraryNode.trip_id == trip_id)))

    def list_edges_for_trip(self, trip_id: str) -> list[DependencyEdge]:
        return list(self.db.scalars(select(DependencyEdge).where(DependencyEdge.trip_id == trip_id)))
