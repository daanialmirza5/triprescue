"""predict_trip: alerts only when a trip's risk gets meaningfully worse since
the previous prediction - a booking newly at high risk, a booking's risk rising
sharply, or a jump in weather risk - and never twice for the same state."""

from datetime import datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.seed import seed_if_empty
from app.models.enums import ActivityType, NotificationCategory
from app.models.trip import Trip
from app.providers.weather_provider import WeatherSnapshot
from app.repositories.activity_repository import ActivityRepository
from app.repositories.risk_snapshot_repository import RiskSnapshotRepository
from app.schemas.risk import RiskAnalysisOut
from app.services import risk_prediction_service, risk_service
from app.services.risk_prediction_service import predict_trip

TRIP = "trip-ladakh-2025"


@pytest.fixture()
def db(monkeypatch):
    # No network: every weather lookup returns calm conditions.
    monkeypatch.setattr(risk_service._weather_provider, "get_snapshot", lambda lat, lng, moment: WeatherSnapshot(
        temperature=24.0, precipitation_probability=5, wind_speed=8.0, weather_code=1, label="Clear", fetched_at=datetime.now()))
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    session = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    seed_if_empty(session)
    yield session
    session.close()


def _worsen(monkeypatch, db, change):
    real = risk_prediction_service.get_risk_analysis
    base = real(db, TRIP)
    worsened = change(base)
    monkeypatch.setattr(risk_prediction_service, "get_risk_analysis",
                        lambda session, tid: worsened if tid == TRIP else real(session, tid))


def test_baseline_run_snapshots_without_alerting_on_unchanged_state(db):
    trip = db.get(Trip, TRIP)
    predict_trip(db, trip)
    assert RiskSnapshotRepository(db).latest_for_trip(TRIP)
    # Same inputs again: nothing got worse, so nothing new to tell the traveler.
    assert predict_trip(db, trip) == []


def test_sharp_rise_in_a_booking_risk_alerts_once(db, monkeypatch):
    trip = db.get(Trip, TRIP)
    predict_trip(db, trip)

    def raise_first_card(base):
        cards = [c.model_copy() for c in base.cards]
        cards[0].risk_percent += 20
        cards[0].risk_level = "medium"  # a rise, not a new HIGH crossing
        return RiskAnalysisOut(score=base.score, cards=cards, alerts=base.alerts)

    _worsen(monkeypatch, db, raise_first_card)
    raised = predict_trip(db, trip)
    assert len(raised) == 1
    assert raised[0].category == NotificationCategory.RISK
    assert "increased" in raised[0].message.lower()
    events = ActivityRepository(db).list_for_trip(TRIP)
    assert any(e.type == ActivityType.MONITORING and "Elevated risk detected" in e.message for e in events)

    assert predict_trip(db, trip) == []  # same worsened state: no repeat alert


def test_weather_worsening_alerts(db, monkeypatch):
    trip = db.get(Trip, TRIP)
    predict_trip(db, trip)

    def stormier(base):
        score = base.score.model_copy()
        score.weather_risk += 20
        return RiskAnalysisOut(score=score, cards=base.cards, alerts=base.alerts)

    _worsen(monkeypatch, db, stormier)
    raised = predict_trip(db, trip)
    assert len(raised) == 1
    assert "weather risk increased" in raised[0].message.lower()


def test_no_alerts_while_the_trip_is_disrupted(db, monkeypatch):
    from app.models.enums import TripStatus

    trip = db.get(Trip, TRIP)
    predict_trip(db, trip)
    trip.status = TripStatus.DISRUPTED
    db.commit()

    def stormier(base):
        score = base.score.model_copy()
        score.weather_risk += 40
        return RiskAnalysisOut(score=score, cards=base.cards, alerts=base.alerts)

    _worsen(monkeypatch, db, stormier)
    assert predict_trip(db, trip) == []


def test_poll_once_endpoint_returns_new_alerts(client):
    resp = client.post(f"/api/trips/{TRIP}/risk/poll-once")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
