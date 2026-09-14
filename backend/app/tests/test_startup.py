"""Integration-level check that the app's actual startup path enforces
AUTH_SECRET, not just the underlying Settings method (see test_config.py's
TestAuthSecretEnforcement for the unit-level cases)."""

import pytest

from app.config import DEFAULT_INSECURE_AUTH_SECRET, Settings
from app.main import app, lifespan


@pytest.mark.asyncio
async def test_app_startup_refuses_to_run_with_default_secret_outside_development(monkeypatch):
    insecure_prod_settings = Settings(
        _env_file=None, environment="production", auth_secret=DEFAULT_INSECURE_AUTH_SECRET
    )
    monkeypatch.setattr("app.main.get_settings", lambda: insecure_prod_settings)

    with pytest.raises(RuntimeError, match="AUTH_SECRET"):
        async with lifespan(app):
            pass  # pragma: no cover - must not be reached
