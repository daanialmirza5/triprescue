import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401  (register models on Base.metadata)
from app.database.base import Base
from app.database.seed import seed_if_empty
from app.database.session import get_db
from app.main import app


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
    # app lifespan, which creates/seeds the actual triprescue.db file rather
    # than this test's isolated in-memory database.
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()
