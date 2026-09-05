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

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def uses_insecure_default_auth_secret(self) -> bool:
        return self.auth_secret == DEFAULT_INSECURE_AUTH_SECRET


@lru_cache
def get_settings() -> Settings:
    return Settings()
