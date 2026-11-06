"""Live flight search that can never break recovery generation.

Wraps a live FlightProvider (AmadeusFlightProvider, which raises
ProviderFailureError on any failure) and answers from the simulated catalogue
whenever the live call fails, returns nothing usable, or is paused after a
rate limit (HTTP 429 pauses live calls for a cool-down). Live results are
tagged source="live" so the UI can tell travelers which prices are real.
"""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import replace
from datetime import datetime
from typing import Callable

from app.providers.base import CancellationPolicy, FlightProvider, ProviderAlternative, ProviderFailureError
from app.providers.mock_flight_provider import MockFlightProvider
from app.core.pipeline_trace import traced

logger = logging.getLogger("safarsathi.providers.fallback")

RATE_LIMIT_COOLDOWN_SECONDS = 60


class FallbackFlightProvider(FlightProvider):
    def __init__(self, primary: FlightProvider | None, fallback: FlightProvider | None = None, cooldown_seconds: float = RATE_LIMIT_COOLDOWN_SECONDS):
        """`primary=None` (no credentials) serves simulated inventory without touching the network."""
        self.primary = primary
        self.fallback = fallback or MockFlightProvider()
        self.cooldown_seconds = cooldown_seconds
        self._paused_until = 0.0
        self._lock = threading.Lock()

    def _live(self, call: Callable[[FlightProvider], list[ProviderAlternative]]) -> list[ProviderAlternative] | None:
        if self.primary is None:
            return None
        with self._lock:
            if time.monotonic() < self._paused_until:
                logger.info("Live flight search paused after a rate limit; using simulated flights")
                return None
        try:
            found = call(self.primary)
        except ProviderFailureError as exc:
            if "429" in str(exc):
                with self._lock:
                    self._paused_until = time.monotonic() + self.cooldown_seconds
            logger.warning("Live flight search failed (%s); falling back to simulated flights", exc)
            return None
        return [replace(o, source="live") for o in found] or None

    def search(self, origin: str, destination: str, date: str) -> list[ProviderAlternative]:
        return self._live(lambda p: p.search(origin, destination, date)) or self.fallback.search(origin, destination, date)

    @traced("provider", "Live flight search with simulated fallback", detail=lambda r, a, k: {"provider": "FallbackFlightProvider", "alternatives": len(r), "live": sum(1 for o in r if o.source == "live")})
    def get_alternatives(
        self, origin: str, destination: str, after: datetime, exclude_confirmation: str | None = None
    ) -> list[ProviderAlternative]:
        live = self._live(lambda p: p.get_alternatives(origin, destination, after, exclude_confirmation))
        return live[:6] if live else self.fallback.get_alternatives(origin, destination, after, exclude_confirmation)

    def get_booking(self, confirmation: str) -> ProviderAlternative | None:
        # Self-service Amadeus keys can't look up arbitrary bookings.
        return self.fallback.get_booking(confirmation)

    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy:
        return self.fallback.get_cancellation_policy(confirmation)
