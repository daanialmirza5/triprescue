from datetime import datetime, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.models.enums import RiskLevel, SnapshotType, TripStatus
from app.models.risk import RiskSnapshot
from app.models.trip import Trip
from app.repositories.risk_snapshot_repository import RiskSnapshotRepository
from app.repositories.trip_repository import TripRepository


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    trip = Trip(
        id="trip-1",
        traveler_id="traveler-1",
        name="Test Trip",
        route="DEL-LEH",
        origin="DEL",
        destination="LEH",
        start_date="2025-09-12",
        end_date="2025-09-18",
        status=TripStatus.OPERATIONAL,
    )
    trip2 = Trip(
        id="trip-2",
        traveler_id="traveler-1",
        name="Test Trip 2",
        route="DEL-BOM",
        origin="DEL",
        destination="BOM",
        start_date="2025-09-12",
        end_date="2025-09-18",
        status=TripStatus.OPERATIONAL,
    )
    session.add_all([trip, trip2])
    session.flush()

    yield session
    session.close()


def test_latest_for_trip_returns_only_newest_per_node_and_risk_type(db_session):
    repo = RiskSnapshotRepository(db_session)
    now = datetime.utcnow()

    s1_old = RiskSnapshot(
        trip_id="trip-1",
        node_id="node-1",
        snapshot_type=SnapshotType.NODE,
        risk_type="weather",
        risk_level=RiskLevel.LOW,
        risk_percent=10,
        created_at=now - timedelta(minutes=30),
    )
    s1_new = RiskSnapshot(
        trip_id="trip-1",
        node_id="node-1",
        snapshot_type=SnapshotType.NODE,
        risk_type="weather",
        risk_level=RiskLevel.HIGH,
        risk_percent=80,
        created_at=now - timedelta(minutes=5),
    )
    s2 = RiskSnapshot(
        trip_id="trip-1",
        node_id="node-1",
        snapshot_type=SnapshotType.NODE,
        risk_type="delay",
        risk_level=RiskLevel.MEDIUM,
        risk_percent=40,
        created_at=now - timedelta(minutes=15),
    )
    s3 = RiskSnapshot(
        trip_id="trip-1",
        node_id="node-2",
        snapshot_type=SnapshotType.NODE,
        risk_type="weather",
        risk_level=RiskLevel.LOW,
        risk_percent=15,
        created_at=now - timedelta(minutes=20),
    )
    s_other_trip = RiskSnapshot(
        trip_id="trip-2",
        node_id="node-1",
        snapshot_type=SnapshotType.NODE,
        risk_type="weather",
        risk_level=RiskLevel.HIGH,
        risk_percent=95,
        created_at=now,
    )

    repo.save_batch([s1_old, s1_new, s2, s3, s_other_trip])

    latest = repo.latest_for_trip("trip-1")

    assert len(latest) == 3
    latest_ids = {s.id for s in latest}
    assert s1_new.id in latest_ids
    assert s1_old.id not in latest_ids
    assert s2.id in latest_ids
    assert s3.id in latest_ids
    assert s_other_trip.id not in latest_ids

    node1_weather = next(s for s in latest if s.node_id == "node-1" and s.risk_type == "weather")
    assert node1_weather.risk_percent == 80


def test_trip_repository_list_active(db_session):
    trip_repo = TripRepository(db_session)
    active_trips = trip_repo.list_active()
    assert len(active_trips) == 2
    assert {t.id for t in active_trips} == {"trip-1", "trip-2"}

    trip_1 = next(t for t in active_trips if t.id == "trip-1")
    trip_1.status = TripStatus.RECOVERED
    db_session.flush()

    remaining_active = trip_repo.list_active()
    assert len(remaining_active) == 1
    assert remaining_active[0].id == "trip-2"
