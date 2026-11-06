"""Live travel-data providers. `registry()` builds them once from Settings;
tests replace `_registry` with instances that use faked HTTP transports."""

from __future__ import annotations

from dataclasses import dataclass

from app.config import get_settings
from app.providers.live.aviationstack import AviationstackProvider
from app.providers.live.common import LiveProviderError
from app.providers.live.nominatim_places import NominatimPlacesProvider
from app.providers.live.overpass import OverpassProvider
from app.providers.live.railradar import RailRadarProvider
from app.providers.live.ticketmaster import TicketmasterProvider

__all__ = ["LiveProviderError", "LiveProviders", "registry", "set_registry"]


@dataclass
class LiveProviders:
    flights: AviationstackProvider
    trains: RailRadarProvider
    places: NominatimPlacesProvider | OverpassProvider
    events: TicketmasterProvider


_registry: LiveProviders | None = None


def registry() -> LiveProviders:
    global _registry
    if _registry is None:
        s = get_settings()
        timeout = s.live_provider_timeout_seconds
        _registry = LiveProviders(
            flights=AviationstackProvider(s.aviationstack_api_key, s.aviationstack_base_url, timeout),
            trains=RailRadarProvider(s.railradar_api_key, s.railradar_base_url, timeout),
            # Kept under the frontend's 15 s request timeout so a slow Overpass
            # instance fails cleanly instead of triggering a client retry.
            places=(
                OverpassProvider(s.overpass_url, min(max(timeout, 10.0), 12.0))
                if s.places_provider == "overpass"
                else NominatimPlacesProvider(s.nominatim_places_url, min(timeout, 8.0), s.geocoding_contact)
            ),
            events=TicketmasterProvider(s.ticketmaster_api_key, s.ticketmaster_base_url, timeout),
        )
    return _registry


def set_registry(providers: LiveProviders | None) -> None:
    global _registry
    _registry = providers
