from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_INSECURE_AUTH_SECRET = "dev-secret-change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    database_url: str = "sqlite:///./safarsathi.db"
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
    weather_request_timeout_seconds: float = 3.0
    weather_total_timeout_seconds: float = 4.0
    # Blend live Open-Meteo readings into the weather risk score (capped at ±20
    # from the time-of-day heuristic). False = heuristic only, no network calls.
    weather_risk_enabled: bool = True
    # Pull real traveler posts from Mastodon's public hashtag timelines for the
    # live signals feed. False = simulated signals only, no network calls.
    social_signals_live_enabled: bool = True
    geocoding_request_timeout_seconds: float = 3.0
    # Real contact (email/URL) for Nominatim's User-Agent policy; omitted when unset.
    geocoding_contact: str | None = None
    # When True, the three demo trips (Ladakh/Goa/Rajasthan) and the demo traveler are created on startup if they don't already exist. Must be False in any real deployment with real users - a real production database should start empty and grow only from real user signups and trip creation.
    # Unset = on in development (so "Continue as Demo Traveler" works out of the box), off everywhere else.
    seed_demo_data: bool | None = None

    # --- Rate limits (SlowAPI syntax, per client IP) for costly endpoints ---
    disruption_rate_limit: str = "30/minute"
    recovery_rate_limit: str = "30/minute"
    assistant_rate_limit: str = "20/minute"

    # --- Auth: when True, requests without a bearer token get 401 instead of
    # falling back to the default traveler. Turn on for real deployments. ---
    require_authentication: bool = False

    # --- Background risk prediction ---
    risk_prediction_enabled: bool = False
    risk_prediction_interval_minutes: int = 15

    # --- Transactional email. Disabled = emails are logged, never sent. ---
    email_notifications_enabled: bool = False
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = True
    email_from: str = "Safar Sathi <no-reply@safarsathi.app>"

    # --- Observability ---
    sentry_dsn: str | None = None
    sentry_traces_sample_rate: float = 0.0
    log_format: Literal["json", "console"] = "console"
    log_level: str = "INFO"

    # --- Provider integrations. "live" uses real APIs where configured and
    # falls back to simulated inventory per request when they fail. ---
    provider_mode: Literal["mock", "live"] = "mock"
    amadeus_client_id: str | None = None
    amadeus_client_secret: str | None = None
    amadeus_base_url: str = "https://test.api.amadeus.com"
    provider_timeout_seconds: float = 6.0

    # --- Nugen Intelligence (domain-aligned model for travel reasoning) ---
    # Base model -> Nugen alignment (scripts/nugen_alignment_dataset.jsonl) ->
    # deployed aligned model id -> used here. Without a key, Safar Sathi falls
    # back to its built-in heuristic reasoning engine.
    nugen_api_key: str | None = None
    nugen_model_id: str = "safar-sathi-travel-twin-v1"
    nugen_base_url: str = "https://api.nugen.in"
    nugen_timeout_seconds: float = 12.0

    # --- Live travel data (server-side only; never exposed to the frontend). ---
    # Missing keys disable that provider: its endpoints answer "not configured"
    # instead of falling back to simulated data.
    aviationstack_api_key: str | None = None
    aviationstack_base_url: str = "https://api.aviationstack.com/v1"
    railradar_api_key: str | None = None
    railradar_base_url: str = "https://api.railradar.in"
    ticketmaster_api_key: str | None = None
    ticketmaster_base_url: str = "https://app.ticketmaster.com"
    # Hotels/places source: "nominatim" (free, keyless, default) or "overpass".
    places_provider: str = "nominatim"
    nominatim_places_url: str = "https://nominatim.openstreetmap.org/search"
    overpass_url: str = "https://overpass-api.de/api/interpreter"
    live_provider_timeout_seconds: float = 8.0

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def uses_insecure_default_auth_secret(self) -> bool:
        return self.auth_secret == DEFAULT_INSECURE_AUTH_SECRET

    @property
    def is_development(self) -> bool:
        return self.environment.strip().lower() == "development"

    @property
    def is_production(self) -> bool:
        return self.environment.strip().lower() in ("production", "prod")

    @property
    def is_sqlite(self) -> bool:
        return self.resolved_database_url.startswith("sqlite")

    @property
    def is_postgres(self) -> bool:
        return self.resolved_database_url.startswith("postgresql")

    @property
    def should_seed_demo_data(self) -> bool:
        return self.is_development if self.seed_demo_data is None else self.seed_demo_data


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
