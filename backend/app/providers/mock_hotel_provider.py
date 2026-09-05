from __future__ import annotations

from datetime import datetime

from app.providers.base import CancellationPolicy, HotelProvider, ProviderAlternative

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
    def search(self, location: str, check_in: str) -> list[ProviderAlternative]:
        return list(_CATALOGUE.get(location, []))

    def get_alternatives(self, location: str, check_in: datetime) -> list[ProviderAlternative]:
        return [o for o in _CATALOGUE.get(location, []) if o.departure >= check_in]

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
            f"Free change up to {booking.cancellation_deadline_hours}h before check-in.",
        )
