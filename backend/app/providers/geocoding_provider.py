"""Nominatim (OpenStreetMap) geocoding provider.

Turns a free-text location from the add-booking forms into coordinates so
user-created nodes get the same weather-risk scoring as seeded ones (see
risk_service, which skips nodes without lat/lng). Like the weather provider,
an external-dependency failure is never fatal: every failure returns None and
the caller simply proceeds without coordinates.
"""

from __future__ import annotations

from typing import Any

import httpx


class NominatimGeocodingProvider:
    """Thin Nominatim client with injectable HTTP transport for tests."""

    SEARCH_URL = "https://nominatim.openstreetmap.org/search"
    # Nominatim's usage policy requires an identifying User-Agent, and it
    # actively rejects placeholder contacts (a fake example.com address gets
    # 403) - so a contact is only included when a real one is configured.
    APP_USER_AGENT = "SafarSathi/1.0"

    def __init__(self, client: httpx.Client | None = None, timeout_seconds: float = 3.0, contact: str | None = None):
        self._client = client
        self.timeout_seconds = timeout_seconds
        self.user_agent = f"{self.APP_USER_AGENT} ({contact})" if contact else self.APP_USER_AGENT

    def _request(self, params: dict[str, Any]) -> Any:
        headers = {"User-Agent": self.user_agent}
        if self._client is not None:
            response = self._client.get(self.SEARCH_URL, params=params, headers=headers, timeout=self.timeout_seconds)
        else:
            response = httpx.get(self.SEARCH_URL, params=params, headers=headers, timeout=self.timeout_seconds)
        response.raise_for_status()
        return response.json()

    def geocode(self, query: str) -> tuple[float, float] | None:
        try:
            results = self._request({"q": query, "format": "json", "limit": 1})
            if not isinstance(results, list) or not results:
                return None
            first = results[0]
            return float(first["lat"]), float(first["lon"])
        except Exception:
            return None
