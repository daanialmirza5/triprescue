"""Place-search query building: bounded search boxes and safe name filters."""

from app.providers.live.nominatim_places import viewbox
from app.providers.live.overpass import build_query, clean_query


def test_viewbox_spans_the_requested_radius():
    left, top, right, bottom = map(float, viewbox(15.49, 73.83, 5000).split(","))
    assert round(top - bottom, 3) == round(2 * 5000 / 111_320, 3)  # ~10 km north-south
    assert left < 73.83 < right and bottom < 15.49 < top
    # Longitude degrees shrink towards the poles, so the box widens in degrees.
    north_left, _, north_right, _ = map(float, viewbox(34.15, 77.58, 5000).split(","))
    assert (north_right - north_left) > (right - left)


def test_name_filters_cannot_break_out_of_the_query():
    assert clean_query('fort"]; out; node(1') == "fort out node1"
    assert clean_query("   ") is None
    query = build_query([("tourism", ["museum"])], 15.49, 73.83, 2000, 10, clean_query("City Museum"))
    assert '["name"~"City Museum",i]' in query and "(around:2000,15.49000,73.83000)" in query
