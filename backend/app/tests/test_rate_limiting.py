import pytest
from app.core.rate_limiting import limiter, reset_rate_limits


def test_rate_limiter_instance_and_reset():
    assert limiter is not None
    # Verify reset execution without errors
    reset_rate_limits()
