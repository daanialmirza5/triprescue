from __future__ import annotations

from datetime import datetime

from app.providers.base import ProviderFailureError, ActivityProvider, CancellationPolicy, ProviderAlternative
from app.core.pipeline_trace import traced

_CATALOGUE: dict[str, list[ProviderAlternative]] = {
    "Pangong Tso": [
        ProviderAlternative(
            id="activity-pangong-day2",
            provider="Ladakh Adventures",
            confirmation_hint="LA-PG-441",
            origin="Leh",
            destination="Pangong Tso",
            departure=datetime(2025, 9, 13, 6, 0),
            arrival=datetime(2025, 9, 13, 18, 0),
            cost=4800,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
        ),
        ProviderAlternative(
            id="activity-pangong-day3",
            provider="Ladakh Adventures",
            confirmation_hint="LA-PG-442",
            origin="Leh",
            destination="Pangong Tso",
            departure=datetime(2025, 9, 14, 6, 0),
            arrival=datetime(2025, 9, 14, 18, 0),
            cost=4800,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
        ),
    ],
}


class MockActivityProvider(ActivityProvider):

    def __init__(self, failure_mode: str | None = None):
        """failure_mode is injectable for resilience tests: ``timeout`` raises
        ProviderFailureError and ``empty`` makes search return no alternatives."""
        if failure_mode not in (None, "timeout", "empty"):
            raise ValueError("failure_mode must be None, 'timeout', or 'empty'")
        self.failure_mode = failure_mode

    def _maybe_fail(self) -> None:
        if self.failure_mode == "timeout":
            raise ProviderFailureError(self.__class__.__name__, "provider request timed out", "timeout")

    def search(self, location: str, date: str) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        return list(_CATALOGUE.get(location, []))

    @traced("provider", "Activity inventory (simulated catalogue)", detail=lambda r, a, k: {"provider": type(a[0]).__name__, "alternatives": len(r), "dataSource": "simulated"})
    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        options = _CATALOGUE.get(location, [])
        if not options and self.failure_mode is None and location:
            from datetime import timedelta
            options = [
                ProviderAlternative(
                    id=f"activity-sim-1-{location}",
                    provider="City Heritage Tours",
                    confirmation_hint="CHT-101",
                    origin=location,
                    destination=location,
                    departure=after + timedelta(days=1, hours=2),
                    arrival=after + timedelta(days=1, hours=6),
                    cost=2500,
                    tier="standard",
                    refundable=False,
                    refund_percentage=0.0,
                    cancellation_deadline_hours=24,
                )
            ]
        return sorted(
            [o for o in options if o.departure >= after], key=lambda o: o.departure
        )

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
                refundable=False,
                refund_percentage=0.0,
                cancellation_deadline_hours=24,
                description="Strict. No refund within 24h of departure.",
            )
        return CancellationPolicy(
            booking.refundable,
            booking.refund_percentage,
            booking.cancellation_deadline_hours,
            "Strict. No refund within 24h of departure.",
        )
