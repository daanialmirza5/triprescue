import pytest

from app.config import DEFAULT_INSECURE_AUTH_SECRET, Settings
from app.database.session import engine_kwargs_for


def _settings(**overrides) -> Settings:
    # Bypass .env/process-env loading entirely so these tests are hermetic -
    # only the fields explicitly passed here matter.
    defaults = {"_env_file": None}
    return Settings(**defaults, **overrides)


class TestResolvedDatabaseUrl:
    def test_sqlite_url_passes_through_unchanged(self):
        settings = _settings(database_url="sqlite:///./triprescue.db")
        assert settings.resolved_database_url == "sqlite:///./triprescue.db"

    def test_legacy_postgres_scheme_is_rewritten_to_psycopg3(self):
        settings = _settings(database_url="postgres://user:pw@host:5432/dbname")
        assert settings.resolved_database_url == "postgresql+psycopg://user:pw@host:5432/dbname"

    def test_plain_postgresql_scheme_is_rewritten_to_psycopg3(self):
        settings = _settings(database_url="postgresql://user:pw@host:5432/dbname")
        assert settings.resolved_database_url == "postgresql+psycopg://user:pw@host:5432/dbname"

    def test_already_psycopg_scheme_is_left_alone(self):
        settings = _settings(database_url="postgresql+psycopg://user:pw@host:5432/dbname")
        assert settings.resolved_database_url == "postgresql+psycopg://user:pw@host:5432/dbname"


class TestAuthSecretEnforcement:
    def test_development_with_default_secret_does_not_raise(self):
        settings = _settings(environment="development", auth_secret=DEFAULT_INSECURE_AUTH_SECRET)
        settings.enforce_secure_auth_secret()  # must not raise

    def test_production_with_default_secret_raises(self):
        settings = _settings(environment="production", auth_secret=DEFAULT_INSECURE_AUTH_SECRET)
        with pytest.raises(RuntimeError, match="AUTH_SECRET"):
            settings.enforce_secure_auth_secret()

    def test_any_non_development_environment_with_default_secret_raises(self):
        settings = _settings(environment="staging", auth_secret=DEFAULT_INSECURE_AUTH_SECRET)
        with pytest.raises(RuntimeError):
            settings.enforce_secure_auth_secret()

    def test_production_with_a_real_secret_does_not_raise(self):
        settings = _settings(environment="production", auth_secret="a-real-random-secret-value")
        settings.enforce_secure_auth_secret()  # must not raise


class TestEngineKwargsFor:
    def test_sqlite_gets_only_check_same_thread_no_pool_kwargs(self):
        settings = _settings(database_url="sqlite:///./x.db")
        kwargs = engine_kwargs_for("sqlite:///./x.db", settings)
        assert kwargs == {"connect_args": {"check_same_thread": False}}

    def test_postgres_gets_pre_ping_and_configured_pool_settings(self):
        settings = _settings(
            database_url="postgresql+psycopg://u:p@host/db",
            db_pool_size=7, db_max_overflow=3, db_pool_recycle_seconds=120,
        )
        kwargs = engine_kwargs_for("postgresql+psycopg://u:p@host/db", settings)
        assert kwargs == {
            "connect_args": {},
            "pool_pre_ping": True,
            "pool_size": 7,
            "max_overflow": 3,
            "pool_recycle": 120,
        }

    def test_postgres_pool_settings_use_configured_defaults(self):
        settings = _settings(database_url="postgresql+psycopg://u:p@host/db")
        kwargs = engine_kwargs_for("postgresql+psycopg://u:p@host/db", settings)
        assert kwargs["pool_size"] == 5
        assert kwargs["max_overflow"] == 10
        assert kwargs["pool_recycle"] == 300
