"""Heuristic parser for free-text disruption notices (airline SMS, emails).

Turns messages like "IndiGo 6E 2173 BOM-DEL is delayed. New departure 09:35
(was 08:00)" into a structured disruption request. Pure and network-free; the
assistant service layers an optional LLM fallback on top when confidence is low.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from app.models.enums import DisruptionType

# IATA airline designators: two letters (AI, UA), letter+digit (G8) or digit+letter (6E).
_FLIGHT_RE = re.compile(r"\b([A-Z]{2}|[A-Z]\d|\d[A-Z])[\s-]?(\d{2,4})\b")
_HOURS_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b", re.I)
_MINUTES_RE = re.compile(r"(\d{1,4})\s*(?:minutes?|mins?|m)\b", re.I)
_TIME_RE = re.compile(r"\b([01]?\d|2[0-3])[:.]([0-5]\d)\s*(am|pm)?\b", re.I)
_GATE_RE = re.compile(r"\bgate\s*(?:changed\s*to|change\s*to|now|:)?\s*([A-Z]?\d{1,3}[A-Z]?)\b", re.I)
# Codes are matched case-sensitively in the original text (so "got to the" is
# never read as a route); only the connector is case-insensitive.
_ROUTE_RE = re.compile(r"\b([A-Z]{3})\s*(?:-|–|→|->|[Tt][Oo])\s*([A-Z]{3})\b")
_PLACE_SPLIT_RE = re.compile(r"\s*(?:→|->|–|\s-\s|\bto\b)\s*", re.I)
# Title words too generic to identify one booking on their own.
_GENERIC_WORDS = {
    "flight", "flights", "hotel", "resort", "stay", "tour", "trip", "lake", "valley", "excursion", "airport",
    "transfer", "connection", "return", "the", "and", "with", "from", "day", "visit", "night", "city", "local",
}

# Words that look like flight codes but aren't (times, gates, generic tokens).
_NOT_AIRLINES = {"PM", "AM", "PNR", "UTC", "IST", "GMT", "NO", "ON", "AT"}


@dataclass
class Extraction:
    type: str | None = None
    delay_minutes: int | None = None
    flight_number: str | None = None
    gate: str | None = None
    route: tuple[str, str] | None = None
    signals: list[str] = field(default_factory=list)
    confidence: float = 0.0
    text: str = ""  # lower-cased original, for matching bookings by place/title words


def _minutes_of_day(hh: str, mm: str, meridiem: str | None) -> int:
    hour = int(hh) % 24
    if meridiem:
        meridiem = meridiem.lower()
        if meridiem == "pm" and hour < 12:
            hour += 12
        if meridiem == "am" and hour == 12:
            hour = 0
    return hour * 60 + int(mm)


def _delay_minutes(text: str) -> tuple[int | None, str | None]:
    """Explicit durations first ("delayed by 1 hr 35 min", "+95 mins"), then
    old-vs-new departure times ("now 11:50, was 10:15")."""
    # Strip clock times so "10:15" isn't read as "15 m".
    no_times = _TIME_RE.sub(" ", text)
    hours = _HOURS_RE.search(no_times)
    minutes = _MINUTES_RE.search(no_times)
    if hours or minutes:
        total = round(float(hours.group(1)) * 60) if hours else 0
        # "2.5 hours" already includes the minutes; only add a separate minutes term after an integer hour count.
        if minutes and not (hours and "." in hours.group(1)):
            total += int(minutes.group(1))
        if 0 < total <= 48 * 60:
            return total, "explicit duration"
    times = _TIME_RE.findall(text)
    if len(times) >= 2 and re.search(r"\b(new|revised|now|rescheduled|re-?timed|delayed)\b", text, re.I):
        first = _minutes_of_day(*times[0])
        second = _minutes_of_day(*times[1])
        # Order in messages varies ("was 08:00, now 09:35" / "new time 09:35 instead of 08:00"); a delay is the positive gap.
        diff = abs(second - first)
        if diff > 12 * 60:
            diff = 24 * 60 - diff
        if 0 < diff <= 12 * 60:
            return diff, "old vs new time"
    return None, None


def _classify(lowered: str, has_delay: bool) -> tuple[str | None, str | None]:
    hotel = re.search(r"\b(hotel|room|check-?in|reservation|booking at|stay)\b", lowered)
    if re.search(r"\b(cancel|cancels|cancel+ed|cancel+ation|cancelled|called off)\b", lowered):
        if hotel and not re.search(r"\bflight\b", lowered):
            return DisruptionType.HOTEL_CANCELLATION.value, "cancellation (hotel)"
        if re.search(r"\b(tour|activity|excursion|show|ticket)\b", lowered):
            return DisruptionType.ACTIVITY_CANCELLATION.value, "cancellation (activity)"
        return DisruptionType.FLIGHT_CANCELLATION.value, "cancellation"
    if re.search(r"\bmiss(ed)?\s+(my\s+|the\s+)?connect", lowered):
        return DisruptionType.MISSED_CONNECTION.value, "missed connection"
    if re.search(r"\bairport\b.*\bclos(ed|ure)\b|\bclos(ed|ure)\b.*\bairport\b", lowered):
        return DisruptionType.AIRPORT_CLOSURE.value, "airport closure"
    if re.search(r"\b(overbook|no room|room not available|double.?booked)\b", lowered) or (hotel and "conflict" in lowered):
        return DisruptionType.HOTEL_CHECKIN_CONFLICT.value, "hotel conflict"
    if re.search(r"\b(driver|cab|taxi|transfer|pickup|pick-up|chauffeur)\b", lowered) and re.search(r"\b(no.?show|did not|didn't|not arrive|unavailable|cancel)", lowered):
        return DisruptionType.TRANSFER_FAILURE.value, "transfer failure"
    if re.search(r"\b(delay(ed)?|late|rescheduled|re-?timed|revised departure|new departure|pushed back)\b", lowered) or has_delay:
        return DisruptionType.FLIGHT_DELAY.value, "delay"
    if re.search(r"\b(storm|cyclone|fog|snow|blizzard|monsoon|flood|weather)\b", lowered):
        return DisruptionType.WEATHER_DISRUPTION.value, "weather"
    return None, None


def extract(text: str) -> Extraction:
    lowered = text.lower()
    result = Extraction(text=lowered)

    for match in _FLIGHT_RE.finditer(text.upper()):
        code, number = match.group(1), match.group(2)
        if code in _NOT_AIRLINES:
            continue
        result.flight_number = f"{code} {number}"
        result.signals.append(f"flight number {result.flight_number}")
        break

    route = _ROUTE_RE.search(text)
    if route and route.group(1) != route.group(2):
        result.route = (route.group(1), route.group(2))
        result.signals.append(f"route {route.group(1)}→{route.group(2)}")

    gate = _GATE_RE.search(text)
    if gate and "gate" in lowered:
        result.gate = gate.group(1).upper()
        result.signals.append(f"gate {result.gate}")

    delay, how = _delay_minutes(text)
    if delay is not None:
        result.delay_minutes = delay
        result.signals.append(f"{delay} min delay ({how})")

    dtype, why = _classify(lowered, delay is not None)
    # A pure gate-change notice is informational - it doesn't move the schedule.
    if dtype is None and result.gate:
        result.signals.append("gate change only")
    if dtype:
        result.type = dtype
        result.signals.append(why or dtype)

    confidence = 0.1
    if result.type:
        confidence += 0.4
    if result.type == DisruptionType.FLIGHT_DELAY.value and result.delay_minutes:
        confidence += 0.25
    elif result.type and result.type != DisruptionType.FLIGHT_DELAY.value:
        confidence += 0.15
    if result.flight_number or result.route:
        confidence += 0.2
    if result.type is None and result.gate:
        confidence = 0.6
    result.confidence = round(min(confidence, 0.97), 2)
    return result


def _norm(value: str | None) -> str:
    return re.sub(r"[^A-Z0-9]", "", (value or "").upper())


def _wanted_categories(disruption_type: str | None) -> set[str] | None:
    if disruption_type in (DisruptionType.FLIGHT_DELAY.value, DisruptionType.FLIGHT_CANCELLATION.value,
                           DisruptionType.AIRPORT_CLOSURE.value, DisruptionType.MISSED_CONNECTION.value):
        return {"flight", "return"}
    if disruption_type in (DisruptionType.HOTEL_CANCELLATION.value, DisruptionType.HOTEL_CHECKIN_CONFLICT.value):
        return {"hotel"}
    if disruption_type == DisruptionType.TRANSFER_FAILURE.value:
        return {"transfer"}
    if disruption_type in (DisruptionType.ACTIVITY_CANCELLATION.value, DisruptionType.ACTIVITY_DELAY.value):
        return {"activity"}
    return None


def _word_at(text: str, word: str) -> int:
    """Index of `word` as a whole word in `text`, or -1."""
    m = re.search(rf"\b{re.escape(word)}\b", text)
    return m.start() if m else -1


def _match_by_words(text: str, nodes: list, wanted: set[str] | None) -> tuple[str, str, str] | None:
    """Match plain-language notices ("my Delhi to Leh flight", "flight to Leh",
    "Pangong tour") against booking titles such as "Delhi → Leh" or "Pangong
    Lake Tour". Needs one best match - a tie is ambiguous and returns None."""
    if not text:
        return None
    scored: list[tuple[int, object, str]] = []
    for n in nodes:
        category = getattr(n.category, "value", n.category)
        if category == "connection" or (wanted and category not in wanted):
            continue
        title = (n.title or "").lower()
        places = [p.strip() for p in _PLACE_SPLIT_RE.split(title) if p.strip()]
        score, how = 0, ""
        if len(places) >= 2:
            origin_at, dest_at = _word_at(text, places[0]), _word_at(text, places[1])
            if origin_at >= 0 and dest_at > origin_at:
                score, how = 3, "route"
            elif dest_at >= 0 and re.search(rf"\bto\s+{re.escape(places[1])}\b", text):
                score, how = 2, "destination"
        if not score:
            words = [w for w in re.findall(r"[a-z]{4,}", title) if w not in _GENERIC_WORDS]
            hits = sum(1 for w in words if _word_at(text, w) >= 0)
            if hits:
                score, how = hits, "booking name"
        if score:
            scored.append((score, n, how))
    if not scored:
        return None
    scored.sort(key=lambda t: -t[0])
    if len(scored) > 1 and scored[0][0] == scored[1][0]:
        return None
    _, node, how = scored[0]
    return node.id, node.title, how


def match_node(extraction: Extraction, nodes: list) -> tuple[str | None, str | None, str | None]:
    """Find the itinerary node the notice refers to: by flight number in the
    booking reference/subtitle, then by route codes, then by booking type.
    Returns (node_id, node_title, how)."""
    if extraction.flight_number:
        wanted = _norm(extraction.flight_number)
        for n in nodes:
            haystack = _norm(f"{n.confirmation or ''} {n.subtitle or ''} {n.label or ''}")
            if wanted and wanted in haystack:
                return n.id, n.title, "flight number"
    if extraction.route:
        origin, dest = extraction.route
        for n in nodes:
            label = (n.label or "").upper()
            if origin in label and dest in label:
                return n.id, n.title, "route"
    by_words = _match_by_words(extraction.text, nodes, _wanted_categories(extraction.type))
    if by_words:
        return by_words
    wanted_category = None
    if extraction.type in (DisruptionType.FLIGHT_DELAY.value, DisruptionType.FLIGHT_CANCELLATION.value, DisruptionType.MISSED_CONNECTION.value):
        wanted_category = "flight"
    elif extraction.type in (DisruptionType.HOTEL_CANCELLATION.value, DisruptionType.HOTEL_CHECKIN_CONFLICT.value):
        wanted_category = "hotel"
    elif extraction.type == DisruptionType.TRANSFER_FAILURE.value:
        wanted_category = "transfer"
    elif extraction.type in (DisruptionType.ACTIVITY_CANCELLATION.value, DisruptionType.WEATHER_DISRUPTION.value):
        wanted_category = "activity"
    if wanted_category:
        candidates = [n for n in nodes if getattr(n.category, "value", n.category) == wanted_category]
        if len(candidates) == 1:
            return candidates[0].id, candidates[0].title, "only booking of that type"
    return None, None, None


DELAY_TYPES = {DisruptionType.FLIGHT_DELAY.value, DisruptionType.ACTIVITY_DELAY.value}
# A delay notice without a duration still needs a number to simulate with.
DEFAULT_DELAY_MINUTES = 180


def match_mentioned_node(text: str, nodes: list) -> tuple[str | None, str | None, str | None]:
    """Match client-supplied bookings by what the message actually mentions
    (title, route label or provider) - no guessing by booking type."""
    lowered = text.lower()
    for field_name in ("title", "label", "provider"):
        for n in nodes:
            value = (getattr(n, field_name, None) or "").strip().lower()
            if len(value) >= 3 and value in lowered:
                return n.id, n.title, field_name
    return None, None, None


def summarize(extraction: Extraction, node_title: str | None) -> str:
    if extraction.type is None and extraction.gate:
        return f"Gate change to {extraction.gate}" + (f" for {extraction.flight_number}" if extraction.flight_number else "") + " — no schedule impact."
    if extraction.type is None:
        return "No disruption could be identified in this message."
    subject = node_title or extraction.flight_number or "your booking"
    label = extraction.type.replace("-", " ")
    if extraction.delay_minutes and extraction.type == DisruptionType.FLIGHT_DELAY.value:
        return f"{subject}: delayed by {extraction.delay_minutes} min."
    return f"{subject}: {label}."
