import re
from datetime import date, datetime

from pydantic import Field, model_validator

from app.schemas.base import CamelModel

_AIRPORT_CODE_RE = re.compile(r"^[A-Za-z]{3}$")


class NodeOut(CamelModel):
    id: str
    category: str
    label: str
    title: str
    subtitle: str
    location: str
    scheduled_time: str
    actual_time: str | None = None
    buffer: str | None = None
    provider: str
    confirmation: str | None = None
    cost: float
    cancellation_policy: str
    refundable: bool
    risk_level: int
    dependency_count: int
    status: str
    day: int
    icon: str
    description: str | None = None
    refund_amount: float | None = None
    lat: float | None = None
    lng: float | None = None

    # Additive fields beyond the original frontend type - backend-computed
    # explainability data the UI can opt into using.
    reason: str | None = None
    caused_by: str | None = None
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: datetime | None = None
    actual_end: datetime | None = None
    available_buffer_minutes: int | None = None
    required_buffer_minutes: int | None = None


class EdgeOut(CamelModel):
    id: str
    source: str
    target: str
    status: str
    label: str | None = None
    type: str | None = None
    animated: bool = False


class TripDayOut(CamelModel):
    day: int
    date: str
    title: str
    summary: str
    node_ids: list[str]


class TripOut(CamelModel):
    id: str
    name: str
    traveler_name: str
    route: str
    origin: str
    destination: str
    start_date: str
    end_date: str
    nodes: list[NodeOut]
    edges: list[EdgeOut]
    trip_value: float
    health_score: int
    status: str
    days: list[TripDayOut]


class TripSummaryOut(CamelModel):
    id: str
    name: str
    route: str
    start_date: str
    end_date: str
    trip_value: float
    health_score: int
    status: str
    node_count: int
    edge_count: int


class TripCreateRequest(CamelModel):
    name: str = Field(min_length=1)
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    start_date: str = Field(min_length=1, description="ISO date, e.g. 2026-03-05")
    end_date: str = Field(min_length=1, description="ISO date, e.g. 2026-03-09")

    @model_validator(mode="after")
    def _validate_date_range(self) -> "TripCreateRequest":
        try:
            start = date.fromisoformat(self.start_date)
            end = date.fromisoformat(self.end_date)
        except ValueError as exc:
            raise ValueError("Dates must be in YYYY-MM-DD format.") from exc
        if end < start:
            raise ValueError("End date cannot be before start date.")
        return self


class NodeCreateRequest(CamelModel):
    """Supports creating itinerary nodes for flight, hotel, activity, and transfer."""

    category: str
    title: str = Field(min_length=1)
    provider: str = Field(min_length=1)
    confirmation: str = Field(min_length=1)
    origin_code: str | None = None
    destination_code: str | None = None
    location: str | None = None
    scheduled_start: datetime
    scheduled_end: datetime
    cost: float = Field(ge=0)

    @model_validator(mode="after")
    def _validate(self) -> "NodeCreateRequest":
        valid_categories = {"flight", "hotel", "activity", "transfer"}
        if self.category not in valid_categories:
            raise ValueError(
                f"Unsupported category: '{self.category}'. Must be one of: {', '.join(sorted(valid_categories))}."
            )
        if self.category == "flight":
            if not self.origin_code or not _AIRPORT_CODE_RE.match(self.origin_code):
                raise ValueError("Origin airport code must be a 3-letter code (e.g. DEL).")
            if not self.destination_code or not _AIRPORT_CODE_RE.match(self.destination_code):
                raise ValueError("Destination airport code must be a 3-letter code (e.g. BOM).")
            self.origin_code = self.origin_code.upper()
            self.destination_code = self.destination_code.upper()
        if self.scheduled_end < self.scheduled_start:
            raise ValueError("Scheduled end cannot be before scheduled start.")
        return self


class BookingOut(CamelModel):
    id: str
    category: str
    provider: str
    confirmation: str
    date: str
    time: str
    cost: float
    refundable: bool
    cancellation_policy: str
    status: str
    risk_level: int
    route: str | None = None
    node_id: str


class TripExportOut(CamelModel):
    exported_at: str
    version: str = "1.0"
    trip: TripOut
    bookings: list[BookingOut]
