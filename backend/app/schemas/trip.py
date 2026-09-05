from datetime import datetime

from app.schemas.base import CamelModel


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
