"""Compatibility alias: provider selection lives in app/providers/factory.py."""

from app.providers.factory import build_providers, get_flight_provider

__all__ = ["build_providers", "get_flight_provider"]
