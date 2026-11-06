"""POST /api/assistant/extract-disruption: free-text notice -> structured
disruption, matched against the trip's real bookings. No ANTHROPIC_API_KEY is
set in tests, so everything here exercises the deterministic heuristic path."""

import pytest

TRIP = "trip-ladakh-2025"


def _extract(client, text, trip_id=TRIP):
    resp = client.post("/api/assistant/extract-disruption", json={"text": text, "tripId": trip_id})
    assert resp.status_code == 200, resp.text
    return resp.json()


def test_delay_with_flight_number_and_iata_route_matches_the_leg(client):
    body = _extract(client, "IndiGo 6E 2031 DEL to IXL delayed by 3 hours")
    assert body["type"] == "flight-delay"
    assert body["delayMinutes"] == 180
    assert body["primaryNodeId"] == "del-leh"
    assert body["source"] in ("heuristic", "fallback")


@pytest.mark.parametrize(
    ("text", "expected_type", "expected_node"),
    [
        # City names in the booking title ("Delhi → Leh"), in either phrasing.
        ("My Delhi to Leh flight got delayed by 3 hours", "flight-delay", "del-leh"),
        ("My Mumbai to Delhi flight is delayed by 95 minutes", "flight-delay", "bom-del"),
        # Destination only: the one flight that lands in Leh.
        ("Flight to Leh cancelled", "flight-cancellation", "del-leh"),
        # A distinctive word from the booking's name.
        ("Pangong tour cancelled due to snow", "activity-cancellation", "pangong-tour"),
        ("My hotel Grand Dragon cancelled my booking", "hotel-cancellation", "grand-dragon"),
    ],
)
def test_plain_language_reports_match_the_right_booking(client, text, expected_type, expected_node):
    body = _extract(client, text)
    assert body["type"] == expected_type
    assert body["primaryNodeId"] == expected_node


def test_weather_report_is_classified_as_weather_disruption(client):
    assert _extract(client, "There is a huge storm at the airport right now")["type"] == "weather-disruption"


def test_ambiguous_flight_report_does_not_guess_a_booking(client):
    # Three flights on the trip and nothing identifies which one - better to
    # leave the choice to the traveler than to silently disrupt the wrong leg.
    body = _extract(client, "My flight got delayed by 45 minutes")
    assert body["type"] == "flight-delay"
    assert body["delayMinutes"] == 45
    assert body["primaryNodeId"] is None


def test_lower_case_words_are_not_read_as_airport_codes(client):
    body = _extract(client, "we got to the airport and the flight was delayed 2 hours")
    assert body["delayMinutes"] == 120
    assert all("route" not in s for s in body["matchedSignals"])


def test_rejects_blank_text(client):
    resp = client.post("/api/assistant/extract-disruption", json={"text": "   ", "tripId": TRIP})
    assert resp.status_code == 422


def test_unknown_trip_is_404(client):
    resp = client.post("/api/assistant/extract-disruption", json={"text": "flight delayed", "tripId": "nope"})
    assert resp.status_code == 404
