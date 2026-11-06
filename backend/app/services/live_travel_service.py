"""Live travel data -> the existing trip system.

Adapter layer only: discovered items become ordinary NodeCreateRequests and go
through the unchanged trip_service.add_node (so they join the dependency graph,
propagation and recovery exactly like hand-entered bookings). The link table
remembers source + external id to prevent duplicates and to let tracked
flights/trains be re-fetched live. Costs are 0 - no provider here sells
anything, and no price is ever invented.
"""

from __future__ import annotations

import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.data import india_destinations
from app.models.external_item import ExternalItemLink
from app.models.itinerary_node import ItineraryNode
from app.providers.geocoding_provider import NominatimGeocodingProvider
from app.providers.live import LiveProviderError, registry
from app.repositories.node_repository import NodeRepository
from app.schemas.live import (
    DestinationOut,
    ExternalItemAddOut,
    ExternalItemCreate,
    ExternalItemLinkOut,
    LiveHealthOut,
    ProviderHealthOut,
    TrackedTransportOut,
)
from app.schemas.trip import NodeCreateRequest
from app.services import trip_service

SOURCE_LABELS = {"aviationstack": "Aviationstack", "railradar": "RailRadar", "openstreetmap": "OpenStreetMap", "ticketmaster": "Ticketmaster"}
EXPECTED_SOURCE = {"flight": "aviationstack", "train": "railradar", "hotel": "openstreetmap", "attraction": "openstreetmap", "event": "ticketmaster"}
_IATA_RE = re.compile(r"^[A-Z]{3}$")
_RAIL_WORD_RE = re.compile(r"\b(train|rail|express)\b", re.I)


class InvalidExternalItemError(ValueError):
    pass


# ---- Adapters -------------------------------------------------------------------------------


def to_node_request(item: ExternalItemCreate) -> NodeCreateRequest:
    if EXPECTED_SOURCE[item.kind] != item.source:
        raise InvalidExternalItemError(f"A {item.kind} must come from {SOURCE_LABELS[EXPECTED_SOURCE[item.kind]]}.")
    label = SOURCE_LABELS[item.source]
    confirmation = f"Not booked · {label}"
    base = dict(title=item.title, confirmation=confirmation, scheduled_start=item.scheduled_start,
                scheduled_end=item.scheduled_end, cost=0, lat=item.lat, lng=item.lng)
    if item.kind == "flight":
        origin, dest = (item.origin_code or "").upper(), (item.destination_code or "").upper()
        if not _IATA_RE.match(origin) or not _IATA_RE.match(dest):
            raise InvalidExternalItemError("This flight has no departure/arrival airport codes to add it with.")
        return NodeCreateRequest(category="flight", provider=item.operator or label, origin_code=origin,
                                 destination_code=dest, location=item.location, **base)
    if item.kind == "train":
        # Trains are transfer nodes; the rail wording lets the engines treat them as trains.
        title = item.title if _RAIL_WORD_RE.search(item.title) else f"Train {item.title}"
        return NodeCreateRequest(category="transfer", provider=item.operator or "Indian Railways",
                                 origin_code=(item.origin_code or None), destination_code=(item.destination_code or None),
                                 location=item.location, **{**base, "title": title})
    if item.kind == "hotel":
        return NodeCreateRequest(category="hotel", provider=item.operator or item.title, location=item.location or item.title, **base)
    return NodeCreateRequest(category="activity", provider=item.operator or label, location=item.location or item.title, **base)


def _link_out(link: ExternalItemLink) -> ExternalItemLinkOut:
    return ExternalItemLinkOut(node_id=link.node_id, kind=link.kind, source=link.source, external_id=link.external_id)


def list_links(db: Session, trip_id: str, traveler_id: str) -> list[ExternalItemLinkOut]:
    trip_service.get_trip(db, trip_id, traveler_id)
    node_ids = {n.id for n in NodeRepository(db).list_for_trip(trip_id)}
    links = db.scalars(select(ExternalItemLink).where(ExternalItemLink.trip_id == trip_id)).all()
    return [_link_out(link) for link in links if link.node_id in node_ids]


def add_external_item(db: Session, trip_id: str, traveler_id: str, item: ExternalItemCreate) -> ExternalItemAddOut:
    trip_service.get_trip(db, trip_id, traveler_id)  # ownership first
    existing = db.scalars(
        select(ExternalItemLink).where(
            ExternalItemLink.trip_id == trip_id, ExternalItemLink.source == item.source, ExternalItemLink.external_id == item.external_id
        )
    ).first()
    if existing is not None:
        if db.get(ItineraryNode, existing.node_id) is not None:
            return ExternalItemAddOut(trip=trip_service.get_trip_out(db, trip_id, traveler_id), node_id=existing.node_id,
                                      already_added=True, link=_link_out(existing))
        db.delete(existing)  # the node was removed since; allow adding again
        db.flush()

    request = to_node_request(item)
    before = {n.id for n in NodeRepository(db).list_for_trip(trip_id)}
    trip_service.add_node(db, trip_id, traveler_id, request)
    created = [n for n in NodeRepository(db).list_for_trip(trip_id) if n.id not in before]
    node_id = created[0].id
    link = ExternalItemLink(trip_id=trip_id, node_id=node_id, kind=item.kind, source=item.source, external_id=item.external_id)
    db.add(link)
    db.commit()
    return ExternalItemAddOut(trip=trip_service.get_trip_out(db, trip_id, traveler_id), node_id=node_id,
                              already_added=False, link=_link_out(link))


# ---- Live monitoring of trip items -------------------------------------------------------------


def _split(external_id: str) -> tuple[str, str | None]:
    number, _, day = external_id.partition("@")
    return number, (day or None)


def tracked_transport(db: Session, trip_id: str, traveler_id: str) -> list[TrackedTransportOut]:
    providers = registry()
    out: list[TrackedTransportOut] = []
    for link in list_links(db, trip_id, traveler_id):
        if link.kind not in ("flight", "train"):
            continue
        number, day = _split(link.external_id)
        entry = TrackedTransportOut(node_id=link.node_id, kind=link.kind, source=link.source, external_id=link.external_id)
        try:
            entry.live = providers.flights.get_flight(number, day) if link.kind == "flight" else providers.trains.live_status(number, day)
        except LiveProviderError as exc:
            entry.error = exc.message
        out.append(entry)
    return out


# ---- Health + destinations ----------------------------------------------------------------------


def health() -> LiveHealthOut:
    p = registry()

    def keyed(provider: str, configured: bool, env: str) -> ProviderHealthOut:
        return ProviderHealthOut(provider=provider, available=configured, configured=configured,
                                 detail="Ready" if configured else f"{env} is not configured on the server.")

    return LiveHealthOut(
        flights=keyed("aviationstack", p.flights.configured, "AVIATIONSTACK_API_KEY"),
        trains=keyed("railradar", p.trains.configured, "RAILRADAR_API_KEY"),
        # Public Overpass endpoint: no key; availability is only known per request.
        places=ProviderHealthOut(provider="openstreetmap", available=True, configured=True,
                                 detail=f"OpenStreetMap via {'Overpass' if get_settings().places_provider == 'overpass' else 'Nominatim'} (no key needed)"),
        events=keyed("ticketmaster", p.events.configured, "TICKETMASTER_API_KEY"),
    )


_geocoder: NominatimGeocodingProvider | None = None


def _geocode(query: str) -> tuple[float, float] | None:
    global _geocoder
    if _geocoder is None:
        s = get_settings()
        _geocoder = NominatimGeocodingProvider(timeout_seconds=s.geocoding_request_timeout_seconds, contact=s.geocoding_contact)
    return _geocoder.geocode(f"{query}, India")


def search_destinations(query: str | None) -> list[DestinationOut]:
    found = [
        DestinationOut(id=d.id, name=d.name, state=d.state, latitude=d.lat, longitude=d.lng, airport_code=d.airport,
                       station_code=d.station, region_match=match)
        for d, match in india_destinations.search(query)
    ]
    q = (query or "").strip()
    if found or len(q) < 3:
        return found
    coords = _geocode(q)  # anywhere else in India, via OpenStreetMap Nominatim
    if coords is None:
        return []
    slug = re.sub(r"[^a-z0-9]+", "-", q.lower()).strip("-")
    return [DestinationOut(id=f"geo-{slug}", name=q.title(), state="India", latitude=coords[0], longitude=coords[1], source="nominatim")]


def resolve_point(city: str | None, lat: float | None, lng: float | None) -> tuple[float, float, str | None]:
    """A search centre from explicit coordinates, the catalog, or geocoding."""
    if lat is not None and lng is not None:
        return lat, lng, city
    dest = india_destinations.find(city)
    if dest:
        return dest.lat, dest.lng, dest.name
    if city and len(city.strip()) >= 3:
        coords = _geocode(city.strip())
        if coords:
            return coords[0], coords[1], city.strip()
    raise InvalidExternalItemError("Choose a destination (city or coordinates) to search around.")
