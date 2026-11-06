from __future__ import annotations

from datetime import datetime

from app.providers.base import ProviderFailureError, CancellationPolicy, FlightProvider, ProviderAlternative
from app.core.pipeline_trace import traced

_CATALOGUE: dict[tuple[str, str], list[ProviderAlternative]] = {
    ("DEL", "IXL"): [
        ProviderAlternative(
            id="flight-g8-204",
            provider="Go First",
            confirmation_hint="G8-204",
            origin="DEL",
            destination="IXL",
            departure=datetime(2025, 9, 12, 10, 15),
            arrival=datetime(2025, 9, 12, 11, 30),
            cost=9200,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
        ),
        ProviderAlternative(
            id="flight-g8-208",
            provider="Go First",
            confirmation_hint="G8-208",
            origin="DEL",
            destination="IXL",
            departure=datetime(2025, 9, 12, 13, 30),
            arrival=datetime(2025, 9, 12, 14, 45),
            cost=13400,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
        ),
        ProviderAlternative(
            id="flight-ai-445",
            provider="Air India",
            confirmation_hint="AI-445",
            origin="DEL",
            destination="IXL",
            departure=datetime(2025, 9, 12, 12, 30),
            arrival=datetime(2025, 9, 12, 13, 45),
            cost=17000,
            tier="premium",
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=4,
        ),
        ProviderAlternative(
            id="flight-g8-201",
            provider="Go First",
            confirmation_hint="G8-201",
            origin="DEL",
            destination="IXL",
            departure=datetime(2025, 9, 13, 7, 0),
            arrival=datetime(2025, 9, 13, 8, 15),
            cost=11800,
            tier="standard",
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
        ),
    ],
    ("BOM", "GOI"): [
        ProviderAlternative(
            id="flight-6e-701",
            provider="IndiGo",
            confirmation_hint="6E-701",
            origin="BOM",
            destination="GOI",
            departure=datetime(2026, 1, 10, 14, 0),
            arrival=datetime(2026, 1, 10, 15, 15),
            cost=4200,
            tier="standard",
            refundable=True,
            refund_percentage=0.7,
            cancellation_deadline_hours=24,
        ),
        ProviderAlternative(
            id="flight-6e-705",
            provider="IndiGo",
            confirmation_hint="6E-705",
            origin="BOM",
            destination="GOI",
            departure=datetime(2026, 1, 10, 18, 30),
            arrival=datetime(2026, 1, 10, 19, 45),
            cost=5100,
            tier="standard",
            refundable=True,
            refund_percentage=0.7,
            cancellation_deadline_hours=24,
        ),
    ],
}


class MockFlightProvider(FlightProvider):

    def __init__(self, failure_mode: str | None = None):
        """failure_mode is injectable for resilience tests: ``timeout`` raises
        ProviderFailureError and ``empty`` makes search return no alternatives."""
        if failure_mode not in (None, "timeout", "empty"):
            raise ValueError("failure_mode must be None, 'timeout', or 'empty'")
        self.failure_mode = failure_mode

    def _maybe_fail(self) -> None:
        if self.failure_mode == "timeout":
            raise ProviderFailureError(self.__class__.__name__, "provider request timed out", "timeout")

    def search(self, origin: str, destination: str, date: str) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty":
            return []
        return list(_CATALOGUE.get((origin, destination), []))

    @traced("provider", "Flight inventory (simulated catalogue)", detail=lambda r, a, k: {"provider": type(a[0]).__name__, "alternatives": len(r), "dataSource": "simulated"})
    def get_alternatives(
        self, origin: str, destination: str, after: datetime, exclude_confirmation: str | None = None
    ) -> list[ProviderAlternative]:
        self._maybe_fail()
        if self.failure_mode == "empty" or after == datetime.max:
            # datetime.max means "no known earliest time"; any offset from it overflows.
            return []
        options = [
            o for o in _CATALOGUE.get((origin, destination), [])
            if o.departure >= after and o.confirmation_hint != exclude_confirmation
        ]
        # The catalogue is pinned to the seeded trips' dates; for any other date
        # (e.g. a traveler's own trip on the same route) simulate the next few
        # departures instead of reporting that nothing flies.
        if not options and self.failure_mode is None and origin and destination:
            from datetime import timedelta
            dep1 = after + timedelta(hours=2)
            dep2 = after + timedelta(hours=4, minutes=30)
            dep3 = after + timedelta(hours=8)
            options = [
                ProviderAlternative(
                    id=f"flight-sim-1-{origin}-{destination}",
                    provider="AirConnect",
                    confirmation_hint="AC-102",
                    origin=origin,
                    destination=destination,
                    departure=dep1,
                    arrival=dep1 + timedelta(hours=1, minutes=30),
                    cost=8500,
                    tier="standard",
                    refundable=True,
                    refund_percentage=0.6,
                    cancellation_deadline_hours=6,
                ),
                ProviderAlternative(
                    id=f"flight-sim-2-{origin}-{destination}",
                    provider="SkyExpress",
                    confirmation_hint="SE-404",
                    origin=origin,
                    destination=destination,
                    departure=dep2,
                    arrival=dep2 + timedelta(hours=1, minutes=30),
                    cost=12500,
                    tier="premium",
                    refundable=True,
                    refund_percentage=0.85,
                    cancellation_deadline_hours=4,
                ),
                ProviderAlternative(
                    id=f"flight-sim-3-{origin}-{destination}",
                    provider="DirectFly",
                    confirmation_hint="DF-901",
                    origin=origin,
                    destination=destination,
                    departure=dep3,
                    arrival=dep3 + timedelta(hours=1, minutes=30),
                    cost=6200,
                    tier="budget",
                    refundable=False,
                    refund_percentage=0.0,
                    cancellation_deadline_hours=24,
                ),
            ]
        return sorted(
            [
                o
                for o in options
                if o.departure >= after and o.confirmation_hint != exclude_confirmation
            ],
            key=lambda o: o.departure,
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
                refundable=True,
                refund_percentage=0.5,
                cancellation_deadline_hours=24,
                description="Refundable up to 24h before departure.",
            )
        return CancellationPolicy(
            booking.refundable,
            booking.refund_percentage,
            booking.cancellation_deadline_hours,
            f"{'Refundable' if booking.refundable else 'Non-refundable'} up to "
            f"{booking.cancellation_deadline_hours}h before departure.",
        )
