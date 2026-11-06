"""Curated India destination catalog for fast discovery navigation.

Coordinates are published city-centre coordinates (4 d.p.); airport codes are
IATA codes of the airport that serves the destination and station codes are
Indian Railways codes of its main station. `None` means the destination has no
airport / railhead of its own - never a guessed code. Hotels, places and events
themselves always come from the live providers, not from here.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Destination:
    id: str
    name: str
    state: str
    lat: float
    lng: float
    airport: str | None
    station: str | None
    aliases: tuple[str, ...] = ()


DESTINATIONS: tuple[Destination, ...] = (
    Destination("mumbai", "Mumbai", "Maharashtra", 19.0760, 72.8777, "BOM", "CSMT", ("bombay",)),
    Destination("delhi", "Delhi", "Delhi", 28.6139, 77.2090, "DEL", "NDLS", ("new delhi",)),
    Destination("goa", "Goa", "Goa", 15.4909, 73.8278, "GOI", "MAO", ("panaji", "panjim")),
    Destination("jaipur", "Jaipur", "Rajasthan", 26.9124, 75.7873, "JAI", "JP", ("rajasthan",)),
    Destination("udaipur", "Udaipur", "Rajasthan", 24.5854, 73.7125, "UDR", "UDZ", ("rajasthan",)),
    Destination("jodhpur", "Jodhpur", "Rajasthan", 26.2389, 73.0243, "JDH", "JU", ("rajasthan",)),
    Destination("agra", "Agra", "Uttar Pradesh", 27.1767, 78.0081, "AGR", "AGC", ("taj mahal",)),
    Destination("varanasi", "Varanasi", "Uttar Pradesh", 25.3176, 82.9739, "VNS", "BSB", ("banaras", "kashi")),
    Destination("rishikesh", "Rishikesh", "Uttarakhand", 30.0869, 78.2676, "DED", "YNRK", ("uttarakhand",)),
    Destination("manali", "Manali", "Himachal Pradesh", 32.2432, 77.1892, "KUU", None, ("himachal",)),
    Destination("shimla", "Shimla", "Himachal Pradesh", 31.1048, 77.1734, "SLV", "SML", ("himachal",)),
    Destination("srinagar", "Srinagar", "Jammu and Kashmir", 34.0837, 74.7973, "SXR", "SINA", ("kashmir",)),
    Destination("leh", "Leh", "Ladakh", 34.1526, 77.5771, "IXL", None, ("ladakh",)),
    Destination("amritsar", "Amritsar", "Punjab", 31.6340, 74.8723, "ATQ", "ASR", ("punjab", "golden temple")),
    Destination("hyderabad", "Hyderabad", "Telangana", 17.3850, 78.4867, "HYD", "SC", ("secunderabad",)),
    Destination("bengaluru", "Bengaluru", "Karnataka", 12.9716, 77.5946, "BLR", "SBC", ("bangalore", "karnataka")),
    Destination("chennai", "Chennai", "Tamil Nadu", 13.0827, 80.2707, "MAA", "MAS", ("madras", "tamil nadu")),
    Destination("kochi", "Kochi", "Kerala", 9.9312, 76.2673, "COK", "ERS", ("cochin", "kerala")),
    Destination("munnar", "Munnar", "Kerala", 10.0889, 77.0595, None, None, ("kerala",)),
    Destination("ooty", "Ooty", "Tamil Nadu", 11.4102, 76.6950, None, "UAM", ("udhagamandalam", "nilgiris")),
    Destination("pune", "Pune", "Maharashtra", 18.5204, 73.8567, "PNQ", "PUNE", ("poona",)),
    Destination("mahabaleshwar", "Mahabaleshwar", "Maharashtra", 17.9237, 73.6586, None, None, ()),
    Destination("nashik", "Nashik", "Maharashtra", 19.9975, 73.7898, "ISK", "NK", ("nasik",)),
    Destination("darjeeling", "Darjeeling", "West Bengal", 27.0410, 88.2663, "IXB", "DJ", ("west bengal",)),
    Destination("gangtok", "Gangtok", "Sikkim", 27.3314, 88.6138, "PYG", None, ("sikkim",)),
    Destination("shillong", "Shillong", "Meghalaya", 25.5788, 91.8933, "SHL", None, ("meghalaya",)),
    Destination("andaman", "Andaman (Port Blair)", "Andaman and Nicobar Islands", 11.6234, 92.7265, "IXZ", None, ("port blair", "havelock")),
    Destination("pondicherry", "Puducherry", "Puducherry", 11.9416, 79.8083, None, "PDY", ("pondicherry", "pondy")),
    Destination("mysore", "Mysuru", "Karnataka", 12.2958, 76.6394, "MYQ", "MYS", ("mysore", "karnataka")),
    Destination("coorg", "Coorg (Madikeri)", "Karnataka", 12.4244, 75.7382, None, None, ("kodagu", "madikeri", "karnataka")),
    Destination("hampi", "Hampi", "Karnataka", 15.3350, 76.4600, None, "HPT", ("hosapete", "karnataka")),
    Destination("kutch", "Kutch (Bhuj)", "Gujarat", 23.2420, 69.6669, "BHJ", "BHUJ", ("bhuj", "rann of kutch", "gujarat")),
)

BY_ID = {d.id: d for d in DESTINATIONS}


def search(query: str | None) -> list[tuple[Destination, str | None]]:
    """Destinations whose name, state or alias matches; second item is the
    region/alias that matched (e.g. "kerala") when not the name itself."""
    q = (query or "").strip().lower()
    if not q:
        return [(d, None) for d in DESTINATIONS]
    results: list[tuple[Destination, str | None]] = []
    for d in DESTINATIONS:
        if q in d.name.lower() or q == d.id:
            results.append((d, None))
        elif q in d.state.lower():
            results.append((d, d.state))
        else:
            alias = next((a for a in d.aliases if q in a), None)
            if alias:
                results.append((d, alias))
    return results


def find(name: str | None) -> Destination | None:
    q = (name or "").strip().lower()
    if not q:
        return None
    for d in DESTINATIONS:
        if q in (d.id, d.name.lower()) or q in d.aliases:
            return d
    return None
