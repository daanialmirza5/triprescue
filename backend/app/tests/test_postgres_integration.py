"""Integration tests that exercise the real app against a real PostgreSQL
database - not just schema/migration parity (see test_migrations.py) but
live registration, login, trip ownership, and transaction-rollback behavior
through the actual HTTP API.

This is deliberately a separate, narrower suite from the rest of
app/tests/, which runs against in-memory SQLite for speed. It exists
specifically to catch dialect differences SQLite can't - it's what caught
the Postgres-only "orphaned ENUM type" downgrade bug fixed in
02f207f86d70_initial_schema.py during development.

Skipped automatically if no Postgres is reachable via POSTGRES_TEST_URL (or
DATABASE_URL, if that's already a postgres:// URL) - e.g. on a machine
without Docker, or in CI unless that's wired up. Point it at the local
Docker instance with:
    docker compose --env-file .env.docker up -d
    $env:POSTGRES_TEST_URL = "postgresql://<user>:<password>@localhost:<port>/<db>"
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest
import sqlalchemy as sa
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.database.session import get_db
from app.main import app

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

_TRUNCATE_ALL = sa.text(
    "TRUNCATE travelers, trips, itinerary_nodes, dependency_edges, bookings, "
    "disruptions, cascade_steps, recovery_plans, recovery_actions, "
    "activity_events, notifications, risk_snapshots RESTART IDENTITY CASCADE"
)


def _normalize(url: str) -> str:
    if url.startswith("postgres://"):
        return "postgresql+psycopg://" + url[len("postgres://"):]
    if url.startswith("postgresql://"):
        return "postgresql+psycopg://" + url[len("postgresql://"):]
    return url


def _postgres_test_url() -> str | None:
    url = os.environ.get("POSTGRES_TEST_URL") or os.environ.get("DATABASE_URL", "")
    return _normalize(url) if url.startswith(("postgres://", "postgresql")) else None


POSTGRES_TEST_URL = _postgres_test_url()

pytestmark = pytest.mark.skipif(
    POSTGRES_TEST_URL is None,
    reason=(
        "No Postgres reachable for this suite - set POSTGRES_TEST_URL (or DATABASE_URL) "
        "to a postgres:// connection string, e.g. the local Docker instance started with "
        "`docker compose --env-file .env.docker up -d`."
    ),
)


@pytest.fixture(scope="module")
def postgres_engine():
    env = {**os.environ, "DATABASE_URL": POSTGRES_TEST_URL}
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND_DIR, env=env, capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr

    engine = sa.create_engine(POSTGRES_TEST_URL)
    with engine.begin() as conn:
        conn.execute(_TRUNCATE_ALL)
    yield engine
    engine.dispose()


@pytest.fixture()
def client(postgres_engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=postgres_engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()
    with postgres_engine.begin() as conn:
        conn.execute(_TRUNCATE_ALL)


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_register_login_and_token_roundtrip_against_real_postgres(client):
    resp = client.post(
        "/api/auth/register",
        json={"name": "PG Traveler", "email": "pg-traveler@example.com", "password": "hunter2"},
    )
    assert resp.status_code == 200, resp.text
    registered = resp.json()
    assert registered["email"] == "pg-traveler@example.com"

    resp = client.post("/api/auth/login", json={"email": "pg-traveler@example.com", "password": "hunter2"})
    assert resp.status_code == 200
    assert resp.json()["travelerId"] == registered["travelerId"]

    resp = client.get("/api/auth/me", headers=_auth_header(registered["token"]))
    assert resp.status_code == 200
    assert resp.json()["email"] == "pg-traveler@example.com"


def test_trip_creation_and_retrieval_persist_against_real_postgres(client):
    registered = client.post(
        "/api/auth/register",
        json={"name": "PG Trip Owner", "email": "pg-trip-owner@example.com", "password": "hunter2"},
    ).json()
    headers = _auth_header(registered["token"])

    create_resp = client.post(
        "/api/trips",
        json={
            "name": "Postgres Test Trip", "origin": "Delhi", "destination": "Goa",
            "startDate": "2026-05-01", "endDate": "2026-05-05",
        },
        headers=headers,
    )
    assert create_resp.status_code == 201, create_resp.text
    trip_id = create_resp.json()["id"]

    get_resp = client.get(f"/api/trips/{trip_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Postgres Test Trip"

    list_resp = client.get("/api/trips", headers=headers)
    assert any(t["id"] == trip_id for t in list_resp.json())


def test_cross_user_trip_isolation_against_real_postgres(client):
    owner = client.post(
        "/api/auth/register",
        json={"name": "PG Owner", "email": "pg-owner@example.com", "password": "hunter2"},
    ).json()
    intruder = client.post(
        "/api/auth/register",
        json={"name": "PG Intruder", "email": "pg-intruder@example.com", "password": "hunter2"},
    ).json()

    trip_id = client.post(
        "/api/trips",
        json={
            "name": "Private Trip", "origin": "Mumbai", "destination": "Jaipur",
            "startDate": "2026-06-01", "endDate": "2026-06-04",
        },
        headers=_auth_header(owner["token"]),
    ).json()["id"]

    resp = client.get(f"/api/trips/{trip_id}", headers=_auth_header(intruder["token"]))
    assert resp.status_code == 404

    resp = client.get("/api/trips", headers=_auth_header(intruder["token"]))
    assert resp.json() == []

    resp = client.get(f"/api/trips/{trip_id}", headers=_auth_header(owner["token"]))
    assert resp.status_code == 200


def test_transaction_rollback_on_failure_leaves_no_partial_state_on_real_postgres(client, monkeypatch):
    """Real Postgres transaction semantics differ enough from SQLite's that
    this is worth proving directly, not just trusting the SQLite-backed
    version of this same test (test_api_trip.py's
    test_node_and_booking_are_persisted_atomically)."""
    registered = client.post(
        "/api/auth/register",
        json={"name": "PG Atomicity", "email": "pg-atomicity@example.com", "password": "hunter2"},
    ).json()
    headers = _auth_header(registered["token"])

    trip_id = client.post(
        "/api/trips",
        json={
            "name": "Atomicity Trip", "origin": "Delhi", "destination": "Agra",
            "startDate": "2026-07-01", "endDate": "2026-07-03",
        },
        headers=headers,
    ).json()["id"]

    from sqlalchemy.orm import Session as SASession

    def failing_commit(self, *args, **kwargs):
        raise RuntimeError("simulated failure partway through add_flight_node")

    monkeypatch.setattr(SASession, "commit", failing_commit)

    with pytest.raises(RuntimeError, match="simulated failure"):
        client.post(
            f"/api/trips/{trip_id}/nodes",
            json={
                "category": "flight", "title": "Test Flight", "provider": "TestAir",
                "confirmation": "PG-123", "originCode": "DEL", "destinationCode": "AGR",
                "scheduledStart": "2026-07-01T09:00:00", "scheduledEnd": "2026-07-01T10:00:00",
                "cost": 1000,
            },
            headers=headers,
        )

    monkeypatch.undo()  # restore the real commit() for the read-only verification below

    trip_after = client.get(f"/api/trips/{trip_id}", headers=headers).json()
    assert trip_after["nodes"] == []

    bookings_after = client.get(f"/api/trips/{trip_id}/bookings", headers=headers).json()
    assert bookings_after == []
