"""Minimal client for Nugen Intelligence inference (https://docs.nugen.in).

Uses the OpenAI-style chat endpoint documented in Nugen's public OpenAPI spec:

    POST {base}/api/v3/inference/chat/completions
    Authorization: Bearer <NUGEN_API_KEY>
    {"model": ..., "messages": [...], "max_tokens": ..., "temperature": ...}
    -> {"choices": [{"message": {"content": "..."}}], "usage": {...}}

`chat()` never raises: a missing key, timeout, HTTP error, rate limit (429 ->
short cool-down) or malformed response returns None, so callers fall back to
Safar Sathi's heuristic reasoning engine.
"""

from __future__ import annotations

import logging
import time

import httpx

from app.config import get_settings

logger = logging.getLogger("safarsathi.nugen")

CHAT_PATH = "/api/v3/inference/chat/completions"
RATE_LIMIT_COOLDOWN_SECONDS = 60


class NugenClient:
    def __init__(
        self,
        api_key: str | None = None,
        model_id: str | None = None,
        base_url: str | None = None,
        timeout_seconds: float | None = None,
        http_client: httpx.Client | None = None,
    ):
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.nugen_api_key
        self.model_id = model_id or settings.nugen_model_id
        self.base_url = (base_url or settings.nugen_base_url).rstrip("/")
        self.timeout_seconds = timeout_seconds or settings.nugen_timeout_seconds
        self._http = http_client
        self._paused_until = 0.0
        self.last_error: str | None = None

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def chat(self, system: str, user: str, max_tokens: int = 500, temperature: float = 0.2) -> str | None:
        if not self.configured:
            self.last_error = "NUGEN_API_KEY not set"
            return None
        if time.monotonic() < self._paused_until:
            self.last_error = "rate limited (cooling down)"
            return None
        payload = {
            "model": self.model_id,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        try:
            post = self._http.post if self._http is not None else httpx.post
            response = post(
                f"{self.base_url}{CHAT_PATH}",
                json=payload,
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                timeout=self.timeout_seconds,
            )
            if response.status_code == 429:
                self._paused_until = time.monotonic() + RATE_LIMIT_COOLDOWN_SECONDS
                self.last_error = "rate limited"
                logger.warning("Nugen rate limit hit; using heuristic reasoning for %ss", RATE_LIMIT_COOLDOWN_SECONDS)
                return None
            response.raise_for_status()
            choices = response.json().get("choices") or []
            content = ((choices[0].get("message") or {}).get("content") if choices else None) or (choices[0].get("text") if choices else None)
            text = (content or "").strip()
            self.last_error = None if text else "empty response"
            return text or None
        except Exception as exc:  # timeout, connection, HTTP status, bad JSON
            self.last_error = type(exc).__name__
            logger.warning("Nugen inference failed (%s); falling back to heuristic reasoning", type(exc).__name__)
            return None
