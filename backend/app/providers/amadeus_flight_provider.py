"""Amadeus Self-Service flight provider (live counterpart to MockFlightProvider).

Selected by factory.get_flight_provider() when PROVIDER_MODE=live and
Amadeus credentials are configured. Every failure - HTTP error, timeout,
malformed payload - surfaces as ProviderFailureError, the same exception the
mock raises in its failure modes, so RecoveryEngine's existing handling
(a "provider unavailable" plan instead of a crash) applies unchanged.
"""

from __future__ import annotations

import time
from datetime import datetime, timedelta
from typing import Any

import httpx

from app.providers.base import CancellationPolicy, FlightProvider, ProviderAlternative, ProviderFailureError

# Conservative defaults: Amadeus flight offers (especially sandbox data) don't
# reliably carry refund/cancellation terms, so every offer is treated as
# non-refundable until a richer fare-rules data source is wired in. This can
# only understate recovery value, never promise a refund that doesn't exist.
_DEFAULT_REFUNDABLE = False
_DEFAULT_REFUND_PERCENTAGE = 0.0
_DEFAULT_CANCELLATION_DEADLINE_HOURS = 24

_PREMIUM_CABINS = {"PREMIUM_ECONOMY", "BUSINESS", "FIRST"}

# Refresh the OAuth token this many seconds before Amadeus says it expires, so
# a request never goes out with a token that lapses in flight.
_TOKEN_EXPIRY_MARGIN_SECONDS = 60


class AmadeusFlightProvider(FlightProvider):
    TOKEN_PATH = "/v1/security/oauth2/token"
    FLIGHT_OFFERS_PATH = "/v2/shopping/flight-offers"
    # The whole app displays costs in rupees; without this Amadeus prices in EUR.
    CURRENCY = "INR"

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        base_url: str,
        timeout_seconds: float = 5.0,
        client: httpx.Client | None = None,
    ):
        """`client` is injectable for tests (httpx.MockTransport), matching
        OpenMeteoWeatherProvider."""
        self._client_id = client_id
        self._client_secret = client_secret
        self.base_url = base_url.rstrip("/")
        self.timeout_seconds = timeout_seconds
        self._client = client
        self._token: str | None = None
        self._token_expires_at = 0.0

    def _fail(self, reason: str, kind: str = "error") -> ProviderFailureError:
        return ProviderFailureError(self.__class__.__name__, reason, kind)

    def _send(self, method: str, path: str, **kwargs: Any) -> Any:
        url = f"{self.base_url}{path}"
        try:
            if self._client is not None:
                response = self._client.request(method, url, timeout=self.timeout_seconds, **kwargs)
            else:
                response = httpx.request(method, url, timeout=self.timeout_seconds, **kwargs)
            if response.status_code == 401:
                # Token revoked/expired early - drop it so the next call re-authenticates.
                self._token = None
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException as exc:
            raise self._fail("provider request timed out", "timeout") from exc
        except httpx.HTTPStatusError as exc:
            raise self._fail(f"Amadeus returned HTTP {exc.response.status_code}") from exc
        except httpx.HTTPError as exc:
            raise self._fail(f"could not reach Amadeus ({exc.__class__.__name__})") from exc
        except ValueError as exc:
            raise self._fail("Amadeus returned a non-JSON response") from exc

    def _access_token(self) -> str:
        if self._token and time.monotonic() < self._token_expires_at:
            return self._token
        data = self._send(
            "POST",
            self.TOKEN_PATH,
            data={
                "grant_type": "client_credentials",
                "client_id": self._client_id,
                "client_secret": self._client_secret,
            },
        )
        try:
            token = str(data["access_token"])
            expires_in = float(data.get("expires_in", 0))
        except (KeyError, TypeError, ValueError) as exc:
            raise self._fail("Amadeus token response was malformed") from exc
        self._token = token
        self._token_expires_at = time.monotonic() + max(expires_in - _TOKEN_EXPIRY_MARGIN_SECONDS, 0)
        return token

    def _parse_offer(self, offer: dict[str, Any]) -> ProviderAlternative:
        segments = offer["itineraries"][0]["segments"]
        first, last = segments[0], segments[-1]
        flight_numbers = "/".join(f"{s['carrierCode']}-{s['number']}" for s in segments)
        departure = datetime.fromisoformat(first["departure"]["at"])
        cabins = {
            detail.get("cabin")
            for pricing in offer.get("travelerPricings") or []
            for detail in pricing.get("fareDetailsBySegment") or []
        }
        return ProviderAlternative(
            # Offer ids ("1", "2", ...) are only unique within one response, so
            # derive a stable id from the flight itself.
            id=f"flight-{flight_numbers.lower()}-{departure:%Y%m%d%H%M}",
            provider=first["carrierCode"],
            confirmation_hint=flight_numbers,
            origin=first["departure"]["iataCode"],
            destination=last["arrival"]["iataCode"],
            departure=departure,
            arrival=datetime.fromisoformat(last["arrival"]["at"]),
            cost=float(offer["price"]["total"]),
            tier="premium" if cabins & _PREMIUM_CABINS else "standard",
            refundable=_DEFAULT_REFUNDABLE,
            refund_percentage=_DEFAULT_REFUND_PERCENTAGE,
            cancellation_deadline_hours=_DEFAULT_CANCELLATION_DEADLINE_HOURS,
        )

    def search(self, origin: str, destination: str, date: str) -> list[ProviderAlternative]:
        payload = self._send(
            "GET",
            self.FLIGHT_OFFERS_PATH,
            params={
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": date,
                "adults": 1,
                "currencyCode": self.CURRENCY,
            },
            headers={"Authorization": f"Bearer {self._access_token()}"},
        )
        offers = payload.get("data") if isinstance(payload, dict) else None
        if not isinstance(offers, list):
            raise self._fail("Amadeus flight-offers response had no data list")

        # One odd offer shouldn't discard the rest; only an entirely
        # unparseable response counts as a provider failure.
        alternatives: list[ProviderAlternative] = []
        for offer in offers:
            try:
                alternatives.append(self._parse_offer(offer))
            except (KeyError, IndexError, TypeError, ValueError):
                continue
        if offers and not alternatives:
            raise self._fail("Amadeus flight offers could not be parsed")
        return alternatives

    def get_alternatives(
        self, origin: str, destination: str, after: datetime, exclude_confirmation: str | None = None
    ) -> list[ProviderAlternative]:
        # Nothing departs "after" an unbounded time (RecoveryEngine can pass
        # datetime.max), and Amadeus can't search without both airports.
        if not origin or not destination or after.date() >= datetime.max.date():
            return []
        # Search the day of `after` and the next day, so a late-evening
        # disruption can still recover onto a next-morning flight.
        options: dict[str, ProviderAlternative] = {}
        for day in (after.date(), after.date() + timedelta(days=1)):
            for option in self.search(origin, destination, day.isoformat()):
                options.setdefault(option.id, option)
        return sorted(
            (o for o in options.values() if o.departure >= after and o.confirmation_hint != exclude_confirmation),
            key=lambda o: o.departure,
        )

    def get_booking(self, confirmation: str) -> ProviderAlternative | None:
        # Amadeus Self-Service can only retrieve orders created through its own
        # booking API, by Amadeus order id - it cannot look up an arbitrary
        # airline booking by confirmation code. "Not found" is the honest answer.
        return None

    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy:
        # No booking lookup (see get_booking), so fall back to the same
        # conservative terms search() assigns to every offer.
        return CancellationPolicy(
            _DEFAULT_REFUNDABLE,
            _DEFAULT_REFUND_PERCENTAGE,
            _DEFAULT_CANCELLATION_DEADLINE_HOURS,
            "Cancellation terms unavailable from Amadeus; assuming non-refundable.",
        )
