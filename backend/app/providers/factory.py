"""Chooses provider implementations from PROVIDER_MODE.

- mock (default): simulated inventory for every booking type.
- live: real APIs where an integration exists and is configured (flights via
  Amadeus), simulated inventory everywhere else. Each live provider falls back
  to simulated results per request, so switching modes can never break
  recovery generation.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from app.config import Settings, get_settings
from app.providers.amadeus_flight_provider import AmadeusFlightProvider
from app.providers.base import ActivityProvider, FlightProvider, HotelProvider, TransferProvider
from app.providers.fallback_flight_provider import FallbackFlightProvider
from app.providers.mock_activity_provider import MockActivityProvider
from app.providers.mock_flight_provider import MockFlightProvider
from app.providers.mock_hotel_provider import MockHotelProvider
from app.providers.mock_transfer_provider import MockTransferProvider

logger = logging.getLogger("safarsathi.providers")


@dataclass(frozen=True)
class ProviderSet:
    flight: FlightProvider
    hotel: HotelProvider
    activity: ActivityProvider
    transfer: TransferProvider
    mode: str


def get_flight_provider(settings: Settings | None = None) -> FlightProvider:
    settings = settings or get_settings()
    if settings.provider_mode == "live":
        if settings.amadeus_client_id and settings.amadeus_client_secret:
            return FallbackFlightProvider(
                AmadeusFlightProvider(
                    settings.amadeus_client_id,
                    settings.amadeus_client_secret,
                    settings.amadeus_base_url,
                    timeout_seconds=settings.provider_timeout_seconds,
                )
            )
        logger.warning("PROVIDER_MODE=live but AMADEUS_CLIENT_ID/SECRET are not set; using simulated flights.")
    return MockFlightProvider()


def build_providers(settings: Settings | None = None) -> ProviderSet:
    settings = settings or get_settings()
    return ProviderSet(
        flight=get_flight_provider(settings),
        # No live hotel/activity/transfer integrations yet - simulated in both modes.
        hotel=MockHotelProvider(),
        activity=MockActivityProvider(),
        transfer=MockTransferProvider(),
        mode=settings.provider_mode,
    )
