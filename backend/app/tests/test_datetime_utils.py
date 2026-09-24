from datetime import datetime, timezone, timedelta
from app.core.datetime_utils import parse_iso_datetime, format_utc_iso


def test_parse_iso_datetime_valid_utc():
    res = parse_iso_datetime("2026-06-15T14:30:00Z")
    assert res is not None
    assert res.year == 2026
    assert res.month == 6
    assert res.day == 15
    assert res.hour == 14
    assert res.minute == 30
    assert res.tzinfo == timezone.utc


def test_parse_iso_datetime_with_offset():
    # IST (+05:30)
    res = parse_iso_datetime("2026-06-15T20:00:00+05:30")
    assert res is not None
    # Converted to UTC (20:00 - 5:30 = 14:30)
    assert res.hour == 14
    assert res.minute == 30
    assert res.tzinfo == timezone.utc


def test_parse_iso_datetime_naive():
    res = parse_iso_datetime("2026-06-15T14:30:00")
    assert res is not None
    assert res.tzinfo == timezone.utc


def test_parse_iso_datetime_invalid():
    assert parse_iso_datetime(None) is None
    assert parse_iso_datetime("") is None
    assert parse_iso_datetime("not-a-date") is None


def test_format_utc_iso():
    dt = datetime(2026, 6, 15, 14, 30, 0, tzinfo=timezone.utc)
    assert format_utc_iso(dt) == "2026-06-15T14:30:00Z"
    assert format_utc_iso(None) is None
