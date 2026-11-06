import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401  (register models on Base.metadata)
from app.config import get_settings
from app.core.rate_limiting import reset_rate_limits
from app.database.base import Base
from app.database.seed import seed_if_empty
from app.database.session import get_db
from app.main import app


@pytest.fixture(autouse=True)
def _no_live_weather_in_risk_scoring():
    # Risk scores must be a pure function of the seeded data in tests: with the
    # flag off, risk_service uses the time-of-day heuristic and makes no
    # Open-Meteo calls. A test that needs the live blend can set it back to True.
    settings = get_settings()
    saved = settings.weather_risk_enabled
    settings.weather_risk_enabled = False
    yield
    settings.weather_risk_enabled = saved


@pytest.fixture(autouse=True)
def _no_live_social_signals():
    # Same idea for the traveler-signals feed: simulated only, no Mastodon calls.
    settings = get_settings()
    saved = settings.social_signals_live_enabled
    settings.social_signals_live_enabled = False
    yield
    settings.social_signals_live_enabled = saved


@pytest.fixture(autouse=True)
def _reset_rate_limits():
    # The login/register limiter is a module-level singleton keyed by client
    # IP, and TestClient always presents as the same fake IP - without this,
    # attempts recorded by one test's login/register calls would carry over
    # and trip the limiter in the next, unrelated test.
    reset_rate_limits()
    yield


@pytest.fixture()
def client():
    # StaticPool is required for an in-memory SQLite DB shared across the
    # multiple connections FastAPI's per-request sessions open during a test.
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    seed_if_empty(db)
    db.close()

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    # Deliberately NOT using `with TestClient(app)`: that would run the real
    # app lifespan, which creates/seeds the actual safarsathi.db file rather
    # than this test's isolated in-memory database.
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()
