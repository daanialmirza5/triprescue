from __future__ import annotations

from datetime import datetime

from app.providers.base import CancellationPolicy, ProviderAlternative, TransferProvider

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
    def search(self, location: str, date: str) -> list[ProviderAlternative]:
        return list(_CATALOGUE.get(location, []))

    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]:
        return [o for o in _CATALOGUE.get(location, []) if o.departure >= after]

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
            "Free cancellation up to 2h before pickup." if booking.refundable else "Non-refundable.",
        )
