"""REQUIRE_AUTHENTICATION turns off the anonymous demo-traveler fallback."""

import pytest

from app.config import get_settings
from app.services.auth_service import create_token


@pytest.fixture()
def auth_required():
    settings = get_settings()
    settings.require_authentication = True
    yield
    settings.require_authentication = False


def test_anonymous_requests_fall_back_by_default(client):
    assert client.get("/api/trips").status_code == 200


def test_anonymous_requests_rejected_when_required(client, auth_required):
    resp = client.get("/api/trips")
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Authentication required."
    assert client.get("/api/trips", headers={"Authorization": "Basic abc"}).status_code == 401


def test_valid_token_still_works_when_required(client, auth_required):
    token = create_token("traveler-aisha")
    resp = client.get("/api/trips", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_health_and_login_stay_public_when_required(client, auth_required):
    assert client.get("/api/health").status_code == 200
    resp = client.post("/api/auth/login", json={"email": "aisha.khan@example.com", "password": "safarsathi-demo"})
    assert resp.status_code == 200
