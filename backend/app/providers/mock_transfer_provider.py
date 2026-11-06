from __future__ import annotations

from datetime import datetime

from app.providers.base import ProviderFailureError, CancellationPolicy, ProviderAlternative, TransferProvider
from app.core.pipeline_trace import traced

_CATALOGUE: dict[str, list[ProviderAlternative]] = {
    "Leh (IXL)": [
        ProviderAlternative(
            id="transfer-mmt",
            provider="MakeMyTrip Transfers",
            confirmation_hint="MMT-TR-882",
            origin="Leh (IXL)",
            destination="Hotel",
            departure=datetime(2025, 9, 12, 11, 50),
            arrival=datetime(2025, 9, 12, 12, 30),
            cost=1200,
            tier="standard",
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=2,
        ),
        ProviderAlternative(
            id="transfer-local-taxi",
            provider="Leh Local Taxi Union",
            confirmation_hint="LLT-119",
            origin="Leh (IXL)",
            destination="Hotel",
            departure=datetime(2025, 9, 12, 11, 50),
            arrival=datetime(2025, 9, 12, 12, 30),
            cost=900,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=0,
        ),
    ],
}


class MockTransferProvider(TransferProvider):

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

    @traced("provider", "Transfer inventory (simulated catalogue)", detail=lambda r, a, k: {"provider": type(a[0]).__name__, "alternatives": len(r), "dataSource": "simulated"})
    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        options = _CATALOGUE.get(location, [])
        if not options and self.failure_mode is None and location:
            from datetime import timedelta
            options = [
                ProviderAlternative(
                    id=f"transfer-sim-1-{location}",
                    provider="Express Cab Service",
                    confirmation_hint="ECS-201",
                    origin=location,
                    destination="Hotel",
                    departure=after + timedelta(minutes=30),
                    arrival=after + timedelta(minutes=75),
                    cost=1500,
                    tier="standard",
                    refundable=True,
                    refund_percentage=0.5,
                    cancellation_deadline_hours=2,
                ),
                ProviderAlternative(
                    id=f"transfer-sim-2-{location}",
                    provider="City Rail Express",
                    confirmation_hint="CRE-808",
                    origin=location,
                    destination="Hotel",
                    departure=after + timedelta(minutes=60),
                    arrival=after + timedelta(minutes=105),
                    cost=850,
                    tier="budget",
                    refundable=False,
                    refund_percentage=0.0,
                    cancellation_deadline_hours=1,
                ),
            ]
        return [o for o in options if o.departure >= after]

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
                refund_percentage=0.5,
                cancellation_deadline_hours=2,
                description="Free cancellation up to 2h before pickup.",
            )
        return CancellationPolicy(
            booking.refundable,
            booking.refund_percentage,
            booking.cancellation_deadline_hours,
            "Free cancellation up to 2h before pickup." if booking.refundable else "Non-refundable.",
        )
