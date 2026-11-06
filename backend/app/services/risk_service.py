from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from concurrent.futures import TimeoutError as FuturesTimeoutError

from sqlalchemy.orm import Session

from app.engines.financial_engine import FinancialEngine
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.risk_engine import RiskEngine
from app.repositories.node_repository import NodeRepository
from app.schemas.risk import AlertOut, RiskAnalysisOut, RiskCardOut, RiskScoreOut
from app.services.converters import refresh_dependency_counts, to_engine_edge, to_engine_node
from app.services.trip_service import get_trip
from app.config import get_settings
from app.providers.weather_provider import OpenMeteoWeatherProvider

_itinerary_engine = ItineraryEngine()
_risk_engine = RiskEngine()
_financial_engine = FinancialEngine()
_settings = get_settings()
_weather_provider = OpenMeteoWeatherProvider(timeout_seconds=_settings.weather_request_timeout_seconds)

# Time-of-day weather heuristic (TRD §3.1.1): bookings before 06:00 or from 20:00
# carry more weather/operations exposure. Deterministic baseline for the blend.
_WEATHER_HEURISTIC_BASE = 8  # the long-standing neutral weather score
_WEATHER_HEURISTIC_ODD_HOURS_WEIGHT = 30
_WEATHER_ODD_HOUR_BEFORE, _WEATHER_ODD_HOUR_FROM = 6, 20


def _time_of_day_weather_heuristic(nodes: list) -> int:
    """Base score plus up to 30 points for the share of bookings scheduled in
    the early-morning/late-night window. Pure function of the itinerary."""
    if not nodes:
        return _WEATHER_HEURISTIC_BASE
    odd = sum(1 for n in nodes if n.scheduled_start.hour < _WEATHER_ODD_HOUR_BEFORE or n.scheduled_start.hour >= _WEATHER_ODD_HOUR_FROM)
    return min(100, _WEATHER_HEURISTIC_BASE + round(_WEATHER_HEURISTIC_ODD_HOURS_WEIGHT * odd / len(nodes)))


def _blend_live_weather(heuristic_score: int, live_severity: int, cap: int = 20) -> int:
    """Blend live weather severity into the time-of-day heuristic, capped at ±cap so a
    single live reading can never swing the score more than `cap` points from the
    heuristic baseline — this keeps output deterministic and bounded."""
    delta = max(-cap, min(cap, live_severity - heuristic_score))
    return heuristic_score + delta


def get_risk_analysis(db: Session, trip_id: str) -> RiskAnalysisOut:
    get_trip(db, trip_id)
    node_repo = NodeRepository(db)
    nodes = node_repo.list_for_trip(trip_id)
    edges = node_repo.list_edges_for_trip(trip_id)
    refresh_dependency_counts(nodes, edges)
    engine_nodes = [to_engine_node(n) for n in nodes]
    engine_edges = [to_engine_edge(e) for e in edges]
    node_by_id = {n.id: n for n in nodes}

    snapshots = _itinerary_engine.compute_node_risks(engine_nodes, engine_edges)
    financial = _financial_engine.summarize(engine_nodes)
    exposure_ratio = financial.at_risk_value / financial.total_trip_value if financial.total_trip_value else 0
    resilience = _risk_engine.trip_resilience([s.result.risk_percent for s in snapshots], exposure_ratio)

    connection_snapshots = [s for s in snapshots if s.is_connection_risk]
    exposure_snapshots = [s for s in snapshots if not s.is_connection_risk]

    connection_risk = max((s.result.risk_percent for s in connection_snapshots), default=8)
    schedule_risk = round(
        sum(s.result.risk_percent for s in connection_snapshots) / len(connection_snapshots)
    ) if connection_snapshots else 12
    vendor_risk = round(
        sum(s.result.risk_percent for s in exposure_snapshots) / len(exposure_snapshots)
    ) if exposure_snapshots else 10
    # Weather starts from the deterministic time-of-day heuristic. When enabled,
    # live Open-Meteo conditions at each node's coordinates and scheduled hour
    # nudge it by at most ±20 points (_blend_live_weather). A provider failure is
    # deliberately non-fatal: the heuristic score is used unchanged.
    weather_snapshots = []
    weather_nodes = [n for n in nodes if n.lat is not None and n.lng is not None]
    heuristic_weather = _time_of_day_weather_heuristic(weather_nodes)
    if weather_nodes and _settings.weather_risk_enabled:
        # Weather is an external dependency. Fetch node snapshots concurrently so
        # one slow location does not multiply the Open-Meteo timeout by every node.
        # The entire weather dimension has a bounded budget; if the budget expires,
        # the rest of the risk response still returns with a neutral weather fallback.
        executor = ThreadPoolExecutor(max_workers=min(6, len(weather_nodes)), thread_name_prefix="weather-risk")
        futures = {
            executor.submit(_weather_provider.get_snapshot, node.lat, node.lng, node.scheduled_start): node
            for node in weather_nodes
        }
        try:
            for future in as_completed(futures, timeout=_settings.weather_total_timeout_seconds):
                try:
                    weather_snapshots.append(future.result())
                except Exception:
                    continue
        except FuturesTimeoutError:
            pass
        finally:
            executor.shutdown(wait=False, cancel_futures=True)

    # WeatherSnapshot itself exposes the scored risk; the future result above is
    # converted below so this list stays deliberately tolerant of provider errors.
    weather_risk_values = [snapshot.risk_percent for snapshot in weather_snapshots]
    if weather_risk_values:
        live_severity = round(sum(weather_risk_values) / len(weather_risk_values))
        weather_risk = _blend_live_weather(heuristic_weather, live_severity)
    else:
        weather_risk = heuristic_weather

    score = RiskScoreOut(
        trip_resilience=resilience,
        connection_risk=connection_risk,
        schedule_risk=schedule_risk,
        vendor_risk=vendor_risk,
        weather_risk=weather_risk,
    )

    # Synthetic connection-marker nodes aren't real bookings - showing a
    # "cancellation window" warning on a ₹0 placeholder is misleading, so they're
    # excluded from the card list (their risk still feeds trip_resilience above).
    bookable_snapshots = [s for s in snapshots if node_by_id[s.node_id].category.value != "connection"]
    ranked = sorted(bookable_snapshots, key=lambda s: -s.result.risk_percent)
    cards: list[RiskCardOut] = []
    for snap in ranked[:5]:
        if snap.result.risk_percent < 12:
            continue
        node = node_by_id[snap.node_id]
        if snap.is_connection_risk:
            risk_type = f"{snap.result.risk_level.upper()} CONNECTION RISK"
            buffer_text = f"{snap.available_minutes} min" if snap.available_minutes is not None else None
            recommended_text = f"{snap.recommended_minutes} min+" if snap.recommended_minutes else None
        elif node.category.value == "hotel":
            risk_type = "CHECK-IN WINDOW"
            buffer_text = None
            recommended_text = None
        elif not node.refundable:
            risk_type = "STRICT CANCELLATION WINDOW"
            buffer_text = None
            recommended_text = None
        else:
            risk_type = "SCHEDULE RISK"
            buffer_text = None
            recommended_text = None

        cards.append(
            RiskCardOut(
                node_id=node.id,
                node_label=node.label,
                risk_type=risk_type,
                risk_level=snap.result.risk_level,
                risk_percent=snap.result.risk_percent,
                buffer=buffer_text,
                recommended=recommended_text,
                historical_risk="Elevated" if snap.result.risk_percent >= 50 else "Low",
                downstream_impact=node.dependency_count,
                recommendation=snap.result.recommendation,
            )
        )

    alerts: list[AlertOut] = []
    for i, snap in enumerate(ranked[:3]):
        if snap.result.risk_percent < 12:
            continue
        node = node_by_id[snap.node_id]
        alerts.append(
            AlertOut(
                id=f"alert-{node.id}",
                severity=snap.result.risk_level,
                title=snap.result.reason,
                reason=", ".join(snap.result.contributing_factors),
                impact=f"{node.dependency_count} downstream booking(s) could be affected."
                if node.dependency_count
                else f"₹{node.cost:,.0f} at risk if this fails.",
                action=snap.result.recommendation,
                node_id=node.id,
                timestamp="just now",
            )
        )

    return RiskAnalysisOut(score=score, cards=cards, alerts=alerts)
