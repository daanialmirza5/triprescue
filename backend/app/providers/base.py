"""Provider interfaces the RecoveryEngine depends on.

No live airline/hotel/activity APIs are wired up yet - these interfaces exist so
that a real provider integration can be dropped in later (see
docs/FUTURE_ROADMAP.md) without touching the RecoveryEngine itself, which only
ever talks to these abstractions.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProviderAlternative:
    id: str
    provider: str
    confirmation_hint: str
    origin: str
    destination: str
    departure: datetime
    arrival: datetime
    cost: float
    tier: str  # "standard" | "premium"
    refundable: bool
    refund_percentage: float
    cancellation_deadline_hours: int


@dataclass
class CancellationPolicy:
    refundable: bool
    refund_percentage: float
    cancellation_deadline_hours: int
    description: str


class FlightProvider(ABC):
    @abstractmethod
    def search(self, origin: str, destination: str, date: str) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_alternatives(
        self, origin: str, destination: str, after: datetime, exclude_confirmation: str | None = None
    ) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_booking(self, confirmation: str) -> ProviderAlternative | None: ...

    @abstractmethod
    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy: ...


class HotelProvider(ABC):
    @abstractmethod
    def search(self, location: str, check_in: str) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_alternatives(self, location: str, check_in: datetime) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_booking(self, confirmation: str) -> ProviderAlternative | None: ...

    @abstractmethod
    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy: ...


class ActivityProvider(ABC):
    @abstractmethod
    def search(self, location: str, date: str) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_booking(self, confirmation: str) -> ProviderAlternative | None: ...

    @abstractmethod
    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy: ...


class TransferProvider(ABC):
    @abstractmethod
    def search(self, location: str, date: str) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_alternatives(self, location: str, after: datetime) -> list[ProviderAlternative]: ...

    @abstractmethod
    def get_booking(self, confirmation: str) -> ProviderAlternative | None: ...

    @abstractmethod
    def get_cancellation_policy(self, confirmation: str) -> CancellationPolicy: ...
