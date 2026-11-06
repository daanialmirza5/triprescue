"""Discovered items -> existing booking requests (the add-to-trip adapter)."""

from datetime import datetime

import pytest

from app.schemas.live import ExternalItemCreate
from app.services.live_travel_service import InvalidExternalItemError, to_node_request

START, END = datetime(2026, 10, 3, 10, 0), datetime(2026, 10, 3, 12, 0)


def _item(**overrides):
    base = dict(kind="hotel", source="openstreetmap", external_id="node/1", title="Hotel Mandovi",
                scheduled_start=START, scheduled_end=END)
    return ExternalItemCreate(**{**base, **overrides})


def test_each_kind_maps_to_an_existing_booking_category():
    assert to_node_request(_item()).category == "hotel"
    assert to_node_request(_item(kind="attraction", title="Fort Aguada")).category == "activity"
    assert to_node_request(_item(kind="event", source="ticketmaster", external_id="Z1", title="Concert")).category == "activity"
    flight = to_node_request(_item(kind="flight", source="aviationstack", external_id="AI101@2026-10-03", title="AI101",
                                   origin_code="bom", destination_code="del"))
    assert (flight.category, flight.origin_code, flight.destination_code) == ("flight", "BOM", "DEL")


def test_trains_are_named_so_the_engines_treat_them_as_rail():
    train = to_node_request(_item(kind="train", source="railradar", external_id="12951@2026-10-03", title="12951 Mumbai Rajdhani"))
    assert train.category == "transfer" and train.title.startswith("Train ")
    already = to_node_request(_item(kind="train", source="railradar", external_id="1", title="Rajdhani Express"))
    assert already.title == "Rajdhani Express"


def test_nothing_is_priced_or_booked():
    req = to_node_request(_item())
    assert req.cost == 0 and req.confirmation == "Not booked · OpenStreetMap"


def test_mismatched_or_incomplete_items_are_rejected():
    with pytest.raises(InvalidExternalItemError):
        to_node_request(_item(source="ticketmaster"))
    with pytest.raises(InvalidExternalItemError):
        to_node_request(_item(kind="flight", source="aviationstack", external_id="X1", title="X1"))
