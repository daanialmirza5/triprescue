from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_INSECURE_AUTH_SECRET = "dev-secret-change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    database_url: str = "sqlite:///./triprescue.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-sonnet-4-5"
    auth_secret: str = DEFAULT_INSECURE_AUTH_SECRET
    auth_token_ttl_days: int = 30
    login_rate_limit: str = "10/minute"
    register_rate_limit: str = "5/minute"
    db_pool_size: int = 5
    db_max_overflow: int = 10
    db_pool_recycle_seconds: int = 300

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def uses_insecure_default_auth_secret(self) -> bool:
        return self.auth_secret == DEFAULT_INSECURE_AUTH_SECRET

    @property
    def is_development(self) -> bool:
        return self.environment.strip().lower() == "development"

    def enforce_secure_auth_secret(self) -> None:
        """Refuses to proceed if this looks like a non-development deployment
        still using the publicly-known default AUTH_SECRET - that secret
        signs every session token (see app/services/auth_service.py), so an
        unchanged default there means anyone can forge a valid token for any
        traveler id. Called from the app's startup lifespan; split out as its
        own method so it can be tested without booting the whole app."""
        if self.is_development or not self.uses_insecure_default_auth_secret:
            return
        raise RuntimeError(
            "AUTH_SECRET is still the insecure default ('dev-secret-change-me') and "
            f"ENVIRONMENT is '{self.environment}', not 'development'. Refusing to start: "
            "set a real AUTH_SECRET (e.g. `python -c \"import secrets; print(secrets.token_hex(32))\"`) "
            "in this environment's configuration."
        )

    @property
    def resolved_database_url(self) -> str:
        """`database_url`, normalized for SQLAlchemy/psycopg3.

        Render (and most other hosts) hand out Postgres connection strings
        using the legacy `postgres://` scheme, which SQLAlchemy 2.x rejects
        outright, and the plain `postgresql://` scheme defaults to the
        psycopg2 driver, which isn't installed here (psycopg3 is). Rewrite
        either to `postgresql+psycopg://` so the same DATABASE_URL Render
        provides can be used unmodified. SQLite URLs pass through untouched.
        """
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+psycopg://" + url[len("postgres://"):]
        if url.startswith("postgresql://"):
            return "postgresql+psycopg://" + url[len("postgresql://"):]
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
