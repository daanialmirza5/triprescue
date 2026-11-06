"""Disruption, recovery and assistant endpoints are rate limited per client."""

import pytest

from app.config import get_settings


@pytest.fixture()
def tight_limits():
    settings = get_settings()
    saved = (settings.disruption_rate_limit, settings.recovery_rate_limit, settings.assistant_rate_limit)
    settings.disruption_rate_limit = settings.recovery_rate_limit = settings.assistant_rate_limit = "2/minute"
    yield
    settings.disruption_rate_limit, settings.recovery_rate_limit, settings.assistant_rate_limit = saved


def test_simulate_is_rate_limited(client, tight_limits):
    body = {"type": "flight-delay", "delayMinutes": 60}
    codes = [client.post("/api/trips/trip-ladakh-2025/simulate", json=body).status_code for _ in range(3)]
    assert codes == [200, 200, 429]


def test_assistant_is_rate_limited(client, tight_limits):
    body = {"tripId": "trip-ladakh-2025", "message": "status?"}
    codes = [client.post("/api/assistant", json=body).status_code for _ in range(3)]
    assert codes == [200, 200, 429]


def test_recovery_generation_is_rate_limited(client, tight_limits):
    client.post("/api/trips/trip-ladakh-2025/disruptions", json={"type": "flight-delay", "delayMinutes": 180})
    codes = [client.post("/api/trips/trip-ladakh-2025/recovery-options/generate").status_code for _ in range(3)]
    assert codes == [200, 200, 429]


def test_default_limits_do_not_affect_normal_use(client):
    for _ in range(5):
        assert client.post("/api/trips/trip-ladakh-2025/simulate", json={"type": "flight-delay", "delayMinutes": 30}).status_code == 200
