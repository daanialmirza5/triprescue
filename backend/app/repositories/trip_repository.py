from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.trip import Trip


class TripRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, trip_id: str) -> Trip | None:
        return self.db.get(Trip, trip_id)

    def list_all(self) -> list[Trip]:
        return list(self.db.scalars(select(Trip)))

    def list_by_traveler(self, traveler_id: str) -> list[Trip]:
        return list(self.db.scalars(select(Trip).where(Trip.traveler_id == traveler_id)))

    def save(self, trip: Trip) -> Trip:
        self.db.add(trip)
        self.db.flush()
        return trip
