from datetime import datetime

from app.services.converters import format_date, format_time, format_time_range


def test_same_day_range_shows_the_date_once():
    assert format_time_range(datetime(2025, 9, 12, 6, 30), datetime(2025, 9, 12, 9, 5)) == "12 Sep · 06:30–09:05"


def test_overnight_range_shows_both_dates():
    text = format_time_range(datetime(2025, 9, 12, 22, 0), datetime(2025, 9, 13, 1, 15))
    assert text == "12 Sep · 22:00 — 13 Sep · 01:15"


def test_single_date_and_time():
    moment = datetime(2026, 1, 5, 7, 4)
    assert format_date(moment) == "05 Jan"
    assert format_time(moment) == "07:04"
