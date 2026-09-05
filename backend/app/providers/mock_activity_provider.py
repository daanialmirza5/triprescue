from __future__ import annotations

from datetime import datetime

from app.providers.base import ActivityProvider, CancellationPolicy, ProviderAlternative

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
    def search(self, location: str, date: str) -> list[ProviderAlternative]:
        return list(_CATALOGUE.get(location, []))

    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]:
        return sorted(
            [o for o in _CATALOGUE.get(location, []) if o.departure >= after], key=lambda o: o.departure
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
            "Strict. No refund within 24h of departure.",
        )
