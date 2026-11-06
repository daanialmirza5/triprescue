"""Normalized live travel data. Provider-specific payloads never leave the
backend; every object carries `source` + `external_id` and a `data_source` of
"live" (provider data) - simulated data is never labelled live."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.trip import TripOut

TransportStatus = Literal["scheduled", "boarding", "departed", "en_route", "arrived", "delayed", "cancelled", "diverted", "unknown"]


class PlaceRef(CamelModel):
    code: str | None = None
    name: str
    latitude: float | None = None
    longitude: float | None = None


class GeoPoint(CamelModel):
    latitude: float
    longitude: float


class RouteStop(CamelModel):
    code: str
    name: str
    latitude: float | None = None
    longitude: float | None = None


class LiveTransportOut(CamelModel):
    id: str
    mode: Literal["flight", "train"]
    provider: str  # "aviationstack" | "railradar"
    source: str
    external_id: str
    data_source: Literal["live", "simulation"] = "live"
    number: str | None = None
    name: str | None = None
    operator: str | None = None
    origin: PlaceRef | None = None
    destination: PlaceRef | None = None
    status: TransportStatus = "unknown"
    delay_minutes: int | None = None
    current_location: GeoPoint | None = None
    current_location_name: str | None = None
    speed_kmh: float | None = None
    altitude_meters: float | None = None
    heading: float | None = None
    is_on_ground: bool | None = None
    aircraft: str | None = None
    scheduled_departure: datetime | None = None
    estimated_departure: datetime | None = None
    actual_departure: datetime | None = None
    scheduled_arrival: datetime | None = None
    estimated_arrival: datetime | None = None
    actual_arrival: datetime | None = None
    previous_stop: PlaceRef | None = None
    next_stop: PlaceRef | None = None
    platform: str | None = None
    route: list[RouteStop] = []
    journey_date: str | None = None
    notices: list[str] = []
    # Provider's own "last updated" when it gives one, else when we fetched it.
    last_updated_at: datetime
    retrieved_at: datetime


class TrainBetweenOut(CamelModel):
    id: str
    source: str = "railradar"
    external_id: str
    data_source: Literal["live"] = "live"
    number: str
    name: str
    train_type: str | None = None
    origin: PlaceRef
    destination: PlaceRef
    departure_time: str | None = None  # HH:MM at the origin station
    arrival_time: str | None = None
    arrival_day_offset: int = 0
    duration_minutes: int | None = None
    run_days: list[str] = []
    live_delay_minutes: int | None = None
    live_platform: str | None = None


class TrainsBetweenResultOut(CamelModel):
    origin: PlaceRef
    destination: PlaceRef
    date: str | None = None
    trains: list[TrainBetweenOut]
    retrieved_at: datetime


class HotelOut(CamelModel):
    id: str
    type: Literal["hotel"] = "hotel"
    source: str = "openstreetmap"
    external_id: str
    name: str
    category: str
    latitude: float
    longitude: float
    address: str | None = None
    city: str | None = None
    phone: str | None = None
    website: str | None = None
    stars: float | None = None
    source_url: str
    last_updated_at: datetime


class AttractionOut(CamelModel):
    id: str
    type: Literal["attraction"] = "attraction"
    source: str = "openstreetmap"
    external_id: str
    name: str
    category: str
    latitude: float
    longitude: float
    address: str | None = None
    city: str | None = None
    website: str | None = None
    source_url: str
    last_updated_at: datetime


class TravelEventOut(CamelModel):
    id: str
    type: Literal["event"] = "event"
    source: str = "ticketmaster"
    external_id: str
    name: str
    venue: str | None = None
    city: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    start_time: datetime | None = None
    start_date: str | None = None  # local date when only a date is announced
    end_time: datetime | None = None
    category: str | None = None
    image_url: str | None = None
    ticket_url: str | None = None
    status: str | None = None
    last_updated_at: datetime


class DestinationOut(CamelModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float
    airport_code: str | None = None
    station_code: str | None = None
    region_match: str | None = None
    source: str = "catalog"  # "catalog" | "nominatim"


class ProviderHealthOut(CamelModel):
    provider: str
    available: bool
    configured: bool
    detail: str


class LiveHealthOut(CamelModel):
    flights: ProviderHealthOut
    trains: ProviderHealthOut
    places: ProviderHealthOut
    events: ProviderHealthOut


# ---- Add to trip ---------------------------------------------------------------------------

ExternalKind = Literal["flight", "train", "hotel", "attraction", "event"]
ExternalSource = Literal["aviationstack", "railradar", "openstreetmap", "ticketmaster"]


class ExternalItemCreate(CamelModel):
    """A discovered item to insert into the existing trip. The frontend
    adapters fill it from the normalized objects above."""

    kind: ExternalKind
    source: ExternalSource
    external_id: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=200)
    operator: str | None = Field(default=None, max_length=120)
    location: str | None = Field(default=None, max_length=200)
    origin_code: str | None = Field(default=None, max_length=10)
    destination_code: str | None = Field(default=None, max_length=10)
    scheduled_start: datetime
    scheduled_end: datetime
    lat: float | None = Field(default=None, ge=-90, le=90)
    lng: float | None = Field(default=None, ge=-180, le=180)


class ExternalItemLinkOut(CamelModel):
    node_id: str
    kind: str
    source: str
    external_id: str


class ExternalItemAddOut(CamelModel):
    trip: TripOut
    node_id: str
    already_added: bool
    link: ExternalItemLinkOut


class TrackedTransportOut(CamelModel):
    node_id: str
    kind: str
    source: str
    external_id: str
    live: LiveTransportOut | None = None
    error: str | None = None
