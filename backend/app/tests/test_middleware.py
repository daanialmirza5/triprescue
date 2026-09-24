import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_request_timing_and_id_headers():
    response = client.get("/health")
    assert response.status_code == 200
    assert "X-Process-Time-Ms" in response.headers
    assert "X-Request-ID" in response.headers
    assert float(response.headers["X-Process-Time-Ms"]) >= 0.0


def test_custom_request_id_preserved():
    custom_id = "custom-trace-header-12345"
    response = client.get("/health", headers={"X-Request-ID": custom_id})
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == custom_id
