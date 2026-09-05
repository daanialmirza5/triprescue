from __future__ import annotations

from datetime import datetime

from app.providers.base import CancellationPolicy, FlightProvider, ProviderAlternative

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
    def search(self, origin: str, destination: str, date: str) -> list[ProviderAlternative]:
        return list(_CATALOGUE.get((origin, destination), []))

    def get_alternatives(
        self, origin: str, destination: str, after: datetime, exclude_confirmation: str | None = None
    ) -> list[ProviderAlternative]:
        options = _CATALOGUE.get((origin, destination), [])
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
            return CancellationPolicy(False, 0.0, 0, "Unknown booking.")
        return CancellationPolicy(
            booking.refundable,
            booking.refund_percentage,
            booking.cancellation_deadline_hours,
            f"{'Refundable' if booking.refundable else 'Non-refundable'} up to "
            f"{booking.cancellation_deadline_hours}h before departure.",
        )
