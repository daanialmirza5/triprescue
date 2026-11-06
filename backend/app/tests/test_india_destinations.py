"""India destination catalog: data integrity and lookups."""

import re

from app.data import india_destinations as catalog


def test_catalog_entries_are_valid():
    ids = [d.id for d in catalog.DESTINATIONS]
    assert len(ids) == len(set(ids)) == 32
    for d in catalog.DESTINATIONS:
        assert 6 <= d.lat <= 36 and 68 <= d.lng <= 98, d.name  # inside India's bounding box
        assert d.airport is None or re.fullmatch(r"[A-Z]{3}", d.airport), d.name
        assert d.station is None or re.fullmatch(r"[A-Z]{1,5}", d.station), d.name


def test_find_by_name_id_and_alias():
    assert catalog.find("Goa").id == "goa"
    assert catalog.find("bombay").id == "mumbai"
    assert catalog.find("bangalore").id == "bengaluru"
    assert catalog.find("  ") is None
    assert catalog.find("atlantis") is None


def test_search_by_state_or_region():
    names = [d.name for d, _ in catalog.search("rajasthan")]
    assert names == ["Jaipur", "Udaipur", "Jodhpur"]
    assert len(catalog.search("")) == 32
