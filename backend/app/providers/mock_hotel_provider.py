from __future__ import annotations

from datetime import datetime

from app.providers.base import ProviderFailureError, CancellationPolicy, HotelProvider, ProviderAlternative
from app.core.pipeline_trace import traced

_CATALOGUE: dict[str, list[ProviderAlternative]] = {
    "Leh": [
        ProviderAlternative(
            id="hotel-grand-dragon",
            provider="Grand Dragon Ladakh",
            confirmation_hint="GDL-8843",
            origin="Leh",
            destination="Leh",
            departure=datetime(2025, 9, 12, 13, 0),
            arrival=datetime(2025, 9, 16, 11, 0),
            cost=14400,
            tier="standard",
            refundable=True,
            refund_percentage=0.75,
            cancellation_deadline_hours=48,
        ),
        ProviderAlternative(
            id="hotel-lchang-nang",
            provider="The Lchang Nang Retreat",
            confirmation_hint="LNR-2291",
            origin="Leh",
            destination="Leh",
            departure=datetime(2025, 9, 12, 13, 0),
            arrival=datetime(2025, 9, 16, 11, 0),
            cost=16800,
            tier="premium",
            refundable=True,
            refund_percentage=0.9,
            cancellation_deadline_hours=24,
        ),
    ],
}


class MockHotelProvider(HotelProvider):

    def __init__(self, failure_mode: str | None = None):
        """failure_mode is injectable for resilience tests: ``timeout`` raises
        ProviderFailureError and ``empty`` makes search return no alternatives."""
        if failure_mode not in (None, "timeout", "empty"):
            raise ValueError("failure_mode must be None, 'timeout', or 'empty'")
        self.failure_mode = failure_mode

    def _maybe_fail(self) -> None:
        if self.failure_mode == "timeout":
            raise ProviderFailureError(self.__class__.__name__, "provider request timed out", "timeout")

    def search(self, location: str, check_in: str) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        return list(_CATALOGUE.get(location, []))

    @traced("provider", "Hotel inventory (simulated catalogue)", detail=lambda r, a, k: {"provider": type(a[0]).__name__, "alternatives": len(r), "dataSource": "simulated"})
    def get_alternatives(self, location: str, check_in: datetime) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        options = _CATALOGUE.get(location, [])
        if not options and self.failure_mode is None and location:
            from datetime import timedelta
            options = [
                ProviderAlternative(
                    id=f"hotel-sim-1-{location}",
                    provider=f"{location} Grand Suites",
                    confirmation_hint="HGS-101",
                    origin=location,
                    destination=location,
                    departure=check_in,
                    arrival=check_in + timedelta(days=2),
                    cost=9500,
                    tier="standard",
                    refundable=True,
                    refund_percentage=0.75,
                    cancellation_deadline_hours=24,
                )
            ]
        return [o for o in options if o.departure >= check_in]

    def get_booking(self, confirmation: str) -> ProviderAlternative | None:
        for options in _CATALOGUE.values():
            for option in options:
                if option.confirmation_hint == confirmation:
                    return option
        return None

    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy:
        booking = self.get_booking(confirmation)
        if not booking:
            return CancellationPolicy(
                refundable=True,
                refund_percentage=0.75,
                cancellation_deadline_hours=24,
                description="Free change up to 24h before check-in.",
            )
        return CancellationPolicy(
            booking.refundable,
            booking.refund_percentage,
            booking.cancellation_deadline_hours,
            f"Free change up to {booking.cancellation_deadline_hours}h before check-in.",
        )
