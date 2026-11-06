"""DigitalTwinEngine: a sandboxed, weather-driven copy of a trip.

The twin clones the itinerary graph (EngineNodes/EngineEdges are dataclasses;
every mutation happens on `dataclasses.replace` copies), applies a weather
scenario as simultaneous direct hits on the bookings it would plausibly
affect, and runs the same PropagationEngine the live system uses to find the
counterfactual cascade. Nothing here touches the database - the live itinerary
only changes when a traveler applies a plan via the digital twin service.

Stress rules (per booking type, only for bookings overlapping the storm window):
- Flights: visibility < 800 m -> ground stop (120-180 min); wind > 60 km/h ->
  crosswind holds; heavy rain -> flow control; extreme fog/wind -> cancellation.
- Road transfers: rainfall above 35 mm/h (25 on mountain roads) causes
  waterlogging diversions; above 60 (45 mountain) blocks the road outright.
- Trains: dense fog and extreme rain slow services.
- Outdoor activities: wind > 60 km/h or rain > 25 mm/h cancels them; extreme
  heat pushes them to cooler hours.
- Hotels: only extreme flooding threatens check-in; otherwise they are hit
  indirectly through late arrivals (the cascade).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta

from app.engines.financial_engine import FinancialEngine
from app.engines.graph_engine import GraphEngine
from app.engines.itinerary_engine import ItineraryEngine
from app.engines.propagation_engine import PropagationEngine
from app.engines.types import EngineEdge, EngineNode, NodeImpact
from app.core.pipeline_trace import traced

MOUNTAIN_RE = re.compile(r"\b(leh|ladakh|manali|shimla|darjeeling|munnar|pass|ghat|hill|mountain|nubra|pangong|spiti)\b", re.I)
OUTDOOR_RE = re.compile(r"\b(tour|trek|hike|lake|safari|cruise|boat|dive|scuba|beach|valley|sunrise|sunset|fort|garden|excursion|rafting|camp)\b", re.I)
RAIL_RE = re.compile(r"\b(train|rail|express|shatabdi|rajdhani|vande bharat|metro)\b", re.I)

_SEVERITY = {"flight-cancellation": 5, "weather-disruption": 5, "transfer-failure": 4, "hotel-conflict": 2, "flight-delay": 1, "activity-delay": 1}
_BOOKABLE = {"flight", "train", "transfer", "hotel", "activity", "return"}


@dataclass(frozen=True)
class WeatherScenario:
    name: str
    rainfall_mm_per_hour: float = 0.0
    wind_speed_kmh: float = 0.0
    visibility_meters: float = 10000.0
    temperature_celsius: float = 25.0
    storm_duration_hours: float = 4.0
    affected_node_id: str | None = None
    storm_start: datetime | None = None

    @property
    def severity(self) -> float:
        """0..1 overall intensity of the scenario."""
        parts = [
            min(1.0, self.rainfall_mm_per_hour / 80),
            min(1.0, max(0.0, self.wind_speed_kmh - 20) / 90),
            min(1.0, max(0.0, 5000 - self.visibility_meters) / 4800),
            min(1.0, max(0.0, self.temperature_celsius - 38) / 10),
        ]
        return round(max(parts) * 0.7 + (sum(parts) / len(parts)) * 0.3, 3)


@dataclass(frozen=True)
class StressHit:
    node_id: str
    disruption_type: str
    delay_minutes: int | None
    driver: str  # "visibility" | "rainfall" | "wind" | "heat"
    reason: str


@dataclass
class RiskEstimate:
    node_id: str
    label: str
    probability: float
    low: float
    high: float


@dataclass
class TwinRun:
    impacts: dict[str, NodeImpact]
    hits: dict[str, StressHit]
    primary_node_id: str | None
    health_score: int
    exposure: float
    risks: list[RiskEstimate]
    cascade: list[tuple[str, str, str]]  # (from_id, to_id, status); from_id "weather" for direct hits
    window: tuple[datetime, datetime]


@dataclass
class NodeChange:
    node_id: str
    title: str
    change_type: str  # "rescheduled" | "rebooked" | "protected"
    new_start: datetime
    new_end: datetime
    cost_delta: float
    description: str


@dataclass
class TwinOption:
    id: str
    name: str
    strategy: str
    description: str
    changes: list[NodeChange]
    delta_cost: float
    time_impact_minutes: int
    commitments_preserved: int
    total_commitments: int
    health_score: int
    residual_failures: int
    score: int = 0
    recommended: bool = False
    notes: list[str] = field(default_factory=list)


def _category(node: EngineNode) -> str:
    return str(node.category)


def mode_of(node: EngineNode) -> str:
    category = _category(node)
    text = f"{node.title} {node.provider}"
    if category == "return":
        return "flight" if node.origin_code else ("train" if RAIL_RE.search(text) else "transfer")
    if category == "transfer" and RAIL_RE.search(text):
        return "train"
    return category


def _overlaps(node: EngineNode, window: tuple[datetime, datetime]) -> bool:
    return node.scheduled_start < window[1] and node.scheduled_end > window[0]


class DigitalTwinEngine:
    def __init__(self) -> None:
        self._propagation = PropagationEngine()
        self._itinerary = ItineraryEngine()
        self._financial = FinancialEngine()

    # ---- Scenario -> direct hits -------------------------------------------------------

    @staticmethod
    def storm_window(nodes: list[EngineNode], scenario: WeatherScenario) -> tuple[datetime, datetime]:
        if scenario.storm_start is not None:
            start = scenario.storm_start
        elif scenario.affected_node_id:
            target = next((n for n in nodes if n.id == scenario.affected_node_id), None)
            start = (target.scheduled_start if target else min(n.scheduled_start for n in nodes)) - timedelta(hours=1)
        else:
            start = min(n.scheduled_start for n in nodes)
        return start, start + timedelta(hours=max(0.5, scenario.storm_duration_hours))

    @staticmethod
    def stress_for(node: EngineNode, s: WeatherScenario) -> StressHit | None:
        mode = mode_of(node)
        text = f"{node.title} {node.location}"
        mountain = bool(MOUNTAIN_RE.search(text))
        rain, wind, vis, heat = s.rainfall_mm_per_hour, s.wind_speed_kmh, s.visibility_meters, s.temperature_celsius
        long_storm = s.storm_duration_hours >= 6

        if mode == "flight":
            if (vis < 150 and long_storm) or wind > 95:
                driver = "visibility" if vis < 150 else "wind"
                return StressHit(node.id, "flight-cancellation", None, driver,
                                 f"{'Zero-visibility fog' if driver == 'visibility' else f'{wind:.0f} km/h winds'} ground all departures for {s.storm_duration_hours:g}h; the airline cancels.")
            candidates: list[tuple[int, str, str]] = []
            if vis < 800:
                candidates.append((180 if vis < 300 else 120, "visibility", f"Visibility {vis:.0f} m is below CAT-I minima; ground stop."))
            if wind > 60:
                candidates.append((min(300, int(90 + (wind - 60) * 2)), "wind", f"{wind:.0f} km/h crosswinds force holds and diversions."))
            if rain > 35:
                candidates.append((int(60 + (rain - 35) * 2), "rainfall", f"{rain:.0f} mm/h rain triggers air-traffic flow control."))
            if heat > 46:
                candidates.append((45, "heat", f"{heat:.0f} °C cuts take-off performance; payload and slot delays."))
            if candidates:
                delay, driver, reason = max(candidates)
                return StressHit(node.id, "flight-delay", delay, driver, reason)
            return None

        if mode == "transfer":
            blocked_at, slowed_at = (45, 25) if mountain else (60, 35)
            road = "mountain road" if mountain else "road"
            if rain > blocked_at or (mountain and wind > 80):
                driver = "rainfall" if rain > blocked_at else "wind"
                return StressHit(node.id, "transfer-failure", None, driver,
                                 f"{rain:.0f} mm/h rain blocks the {road} (landslide/flooding risk); the transfer cannot run." if driver == "rainfall"
                                 else f"{wind:.0f} km/h winds close the {road}.")
            if rain > slowed_at:
                return StressHit(node.id, "activity-delay", int(45 + (rain - slowed_at) * 3), "rainfall",
                                 f"Waterlogging on the {road}: cabs divert via longer routes.")
            if vis < 300:
                return StressHit(node.id, "activity-delay", 60, "visibility", f"Dense fog ({vis:.0f} m) slows road traffic.")
            return None

        if mode == "train":
            if vis < 300:
                return StressHit(node.id, "activity-delay", 120, "visibility", f"Fog ({vis:.0f} m) forces caution running; trains run late.")
            if rain > 70:
                return StressHit(node.id, "activity-delay", 90, "rainfall", f"{rain:.0f} mm/h rain floods track sections; speed restrictions.")
            return None

        if mode == "activity":
            outdoor = bool(OUTDOOR_RE.search(text))
            if outdoor and (wind > 60 or rain > 25):
                driver = "wind" if wind > 60 else "rainfall"
                return StressHit(node.id, "weather-disruption", None, driver,
                                 f"{wind:.0f} km/h winds make the outing unsafe; the operator cancels." if driver == "wind"
                                 else f"{rain:.0f} mm/h rain washes out the outdoor activity.")
            if outdoor and heat > 42:
                return StressHit(node.id, "activity-delay", 120, "heat", f"{heat:.0f} °C heat: operator moves the tour to cooler hours.")
            if rain > 60:
                return StressHit(node.id, "activity-delay", 45, "rainfall", "Heavy rain delays access to the venue.")
            return None

        if mode == "hotel" and rain > 80:
            return StressHit(node.id, "hotel-conflict", None, "rainfall", f"{rain:.0f} mm/h flooding around the property may delay check-in.")
        return None

    def hits(self, nodes: list[EngineNode], scenario: WeatherScenario) -> tuple[dict[str, StressHit], tuple[datetime, datetime]]:
        window = self.storm_window(nodes, scenario)
        targets = [n for n in nodes if n.id == scenario.affected_node_id] if scenario.affected_node_id else [n for n in nodes if _overlaps(n, window)]
        found: dict[str, StressHit] = {}
        for node in targets:
            if _category(node) == "connection":
                continue
            hit = self.stress_for(node, scenario)
            if hit:
                found[node.id] = hit
        return found, window

    # ---- Simulation ---------------------------------------------------------------------

    @staticmethod
    def _risk(node: EngineNode, impact: NodeImpact, scenario: WeatherScenario, signal: float, direct: bool, hard_in: bool) -> RiskEstimate | None:
        base = {"cancelled": 0.9, "broken": 0.86, "at-risk": 0.62, "delayed": 0.45}.get(impact.status)
        if base is None:
            return None
        category = _category(node)
        if impact.status == "broken" and hard_in:
            label = "Connection miss risk"
        elif category == "hotel":
            label = "Late check-in risk"
        elif impact.status in ("cancelled", "broken"):
            label = "Cancellation risk"
        else:
            label = "Delay risk"
        severity = scenario.severity
        p = min(0.99, base + 0.08 * severity + 0.06 * signal + (0.03 if direct else 0.0))
        half = 0.04 + 0.16 * (1 - signal) * (1 - 0.5 * severity)
        return RiskEstimate(node.id, label, round(p, 2), round(max(0.01, p - half), 2), round(min(0.99, p + half * 0.6), 2))

    @traced("intelligence", "Digital Twin: weather stress on a sandbox copy", detail=lambda r, a, k: {"directHits": len(r.hits), "twinHealth": r.health_score})
    def run(
        self,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        scenario: WeatherScenario,
        signal_intensity: dict[str, float] | None = None,
    ) -> TwinRun:
        twin_nodes = [replace(n) for n in nodes]  # sandbox copies
        twin_edges = [replace(e) for e in edges]
        hits, window = self.hits(twin_nodes, scenario)
        signals = signal_intensity or {}
        if hits:
            primary = max(hits.values(), key=lambda h: (_SEVERITY.get(h.disruption_type, 0), h.delay_minutes or 0))
            others = {nid: (h.disruption_type, h.delay_minutes) for nid, h in hits.items() if nid != primary.node_id}
            result = self._propagation.propagate(
                twin_nodes, twin_edges, primary.node_id, primary.disruption_type, primary.delay_minutes,
                detected_at=window[0], extra_overrides=others,
            )
            impacts, primary_id = result.impacts, primary.node_id
        else:
            first = min(twin_nodes, key=lambda n: n.scheduled_start)
            impacts, primary_id = self._propagation.propagate(twin_nodes, twin_edges, first.id, "none").impacts, None

        hard_targets = {e.target for e in twin_edges if e.dependency_type == "hard"}
        risks = [
            r for n in twin_nodes
            if (r := self._risk(n, impacts[n.id], scenario, signals.get(n.id, 0.0), n.id in hits, n.id in hard_targets))
        ]
        cascade = [("weather", nid, impacts[nid].status) for nid in hits]
        cascade += [(imp.caused_by, nid, imp.status) for nid, imp in impacts.items() if imp.caused_by and imp.status != "healthy" and nid not in hits]
        return TwinRun(
            impacts=impacts,
            hits=hits,
            primary_node_id=primary_id,
            health_score=self._itinerary.compute_health_score(twin_nodes, twin_edges, impacts),
            exposure=self._financial.summarize(twin_nodes, impacts).at_risk_value,
            risks=sorted(risks, key=lambda r: r.probability, reverse=True),
            cascade=cascade,
            window=window,
        )

    # ---- Preemptive recovery ----------------------------------------------------------------

    @traced("recovery", "Digital Twin: preemptive recovery options", detail=lambda r, a, k: {"options": len(r)})
    def preemptive_options(
        self,
        nodes: list[EngineNode],
        edges: list[EngineEdge],
        scenario: WeatherScenario,
        baseline: TwinRun,
        signal_intensity: dict[str, float] | None = None,
    ) -> list[TwinOption]:
        if not baseline.hits:
            return []
        by_id = {n.id: n for n in nodes}
        incoming: dict[str, list[EngineEdge]] = {}
        for e in edges:
            incoming.setdefault(e.target, []).append(e)
        order = GraphEngine([n.id for n in nodes], [(e.source, e.target) for e in edges]).topological_order()
        window_start, window_end = baseline.window
        transport_hits = [nid for nid in order if nid in baseline.hits and mode_of(by_id[nid]) in ("flight", "transfer", "train")]
        activity_hits = [nid for nid in order if nid in baseline.hits and _category(by_id[nid]) == "activity"]
        candidates: list[tuple[str, str, str, str, list[NodeChange]]] = []

        def change(node: EngineNode, start: datetime, kind: str, fee_rate: float, text: str) -> NodeChange:
            duration = node.scheduled_end - node.scheduled_start
            return NodeChange(node.id, node.title, kind, start, start + duration, round(node.cost * fee_rate, 2), text)

        def next_day_activities() -> list[NodeChange]:
            return [
                change(by_id[a], by_id[a].scheduled_start + timedelta(days=1), "rescheduled", 0.1,
                       f"Move {by_id[a].title} to the same time tomorrow, after the storm clears.")
                for a in activity_hits
            ]

        # A. Depart ahead of the storm: move stressed transport to finish before it hits.
        ahead: list[NodeChange] = []
        feasible = True
        moved_end: dict[str, datetime] = {}
        for nid in transport_hits:
            node = by_id[nid]
            duration = node.scheduled_end - node.scheduled_start
            new_end = window_start - timedelta(minutes=45)
            new_start = new_end - duration
            for e in incoming.get(nid, []):
                upstream_end = moved_end.get(e.source, by_id[e.source].scheduled_end)
                if new_start < upstream_end + timedelta(minutes=e.min_buffer_minutes):
                    feasible = False
            if new_start >= node.scheduled_start:
                continue  # already clear of the storm
            moved_end[nid] = new_end
            ahead.append(change(node, new_start, "rebooked", 0.14, f"Rebook {node.title} to depart {new_start:%d %b %H:%M}, clearing the storm window."))
        if ahead and feasible:
            candidates.append(("ahead", "Beat the Storm", "depart-early",
                               "Move exposed legs earlier so the journey is past the danger zone before the weather arrives.", ahead + next_day_activities()))

        # B. Wait it out: move stressed transport to just after the storm, then re-time what depends on it.
        after: list[NodeChange] = []
        shifted_end: dict[str, datetime] = {}
        for nid in order:
            node = by_id[nid]
            if _category(node) in ("connection",) or nid in activity_hits:
                continue
            duration = node.scheduled_end - node.scheduled_start
            if nid in transport_hits:
                start = max(node.scheduled_start, window_end + timedelta(minutes=30))
            else:
                start = node.scheduled_start
            for e in incoming.get(nid, []):
                src_end = shifted_end.get(e.source)
                if src_end is not None and e.dependency_type == "hard":
                    start = max(start, src_end + timedelta(minutes=e.min_buffer_minutes + 30))
            if start != node.scheduled_start and _category(node) != "hotel":
                shifted_end[nid] = start + duration
                after.append(change(node, start, "rescheduled" if nid in transport_hits else "rebooked", 0.08,
                                    f"{'Rebook' if nid not in transport_hits else 'Reschedule'} {node.title} to {start:%d %b %H:%M}, after the storm."))
            else:
                # Propagate any shift through connection windows so downstream sees the later time.
                upstream_ends = [shifted_end[e.source] for e in incoming.get(nid, []) if e.source in shifted_end]
                if upstream_ends and _category(node) == "connection":
                    shifted_end[nid] = max(upstream_ends)
        if after:
            candidates.append(("after", "Wait It Out", "reschedule-after",
                               "Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them.",
                               after + next_day_activities()))

        # C. Protect the chain: keep transport, add buffer to every hard connection downstream of a hit.
        protect: list[NodeChange] = []
        for nid in order:
            node = by_id[nid]
            impact = baseline.impacts[nid]
            if nid in baseline.hits or _category(node) in ("connection", "hotel", "activity"):
                continue
            if impact.status in ("broken", "at-risk"):
                bump = timedelta(minutes=(impact.required_buffer_minutes or 60) + 90)
                upstream = impact.caused_by and baseline.impacts.get(impact.caused_by)
                anchor = (upstream.actual_end if upstream and upstream.actual_end else node.scheduled_start) + bump
                start = max(node.scheduled_start + timedelta(minutes=60), anchor)
                protect.append(change(node, start, "rebooked", 0.1, f"Rebook {node.title} to {start:%d %b %H:%M}, restoring a safe connection buffer."))
        protect += next_day_activities()
        if protect:
            candidates.append(("protect", "Protect the Chain", "buffer-expansion",
                               "Accept the weather delay but rebook at-risk connections with generous buffers, and move outdoor plans out of the storm.",
                               protect))

        options = [self._evaluate(key, name, strategy, desc, changes, nodes, edges, scenario, signal_intensity) for key, name, strategy, desc, changes in candidates]
        return self._rank(options)

    def _evaluate(self, key, name, strategy, description, changes, nodes, edges, scenario, signals) -> TwinOption:
        changed = {c.node_id: c for c in changes}
        candidate_nodes = [
            replace(n, scheduled_start=changed[n.id].new_start, scheduled_end=changed[n.id].new_end) if n.id in changed else replace(n)
            for n in nodes
        ]
        # Re-simulate under the SAME storm window: the option must survive the weather it was built for.
        pinned = replace(scenario, storm_start=self.storm_window(nodes, scenario)[0])
        run = self.run(candidate_nodes, edges, pinned, signals)
        bookable = [n for n in candidate_nodes if _category(n) in _BOOKABLE]
        failed = [n for n in bookable if run.impacts[n.id].status in ("broken", "cancelled")]
        original_end = {n.id: n.scheduled_end for n in nodes}
        lateness = [
            int((run.impacts[n.id].actual_end - original_end[n.id]).total_seconds() // 60)
            for n in candidate_nodes
            if _category(n) not in ("hotel", "connection", "activity") and run.impacts[n.id].actual_end
        ]
        return TwinOption(
            id=key, name=name, strategy=strategy, description=description, changes=changes,
            delta_cost=round(sum(c.cost_delta for c in changes), 2),
            time_impact_minutes=max([0, *lateness]),
            commitments_preserved=len(bookable) - len(failed),
            total_commitments=len(bookable),
            health_score=run.health_score,
            residual_failures=len(failed),
            notes=[f"{n.title}: {run.impacts[n.id].reason}" for n in failed if run.impacts[n.id].reason][:3],
        )

    @staticmethod
    def _rank(options: list[TwinOption]) -> list[TwinOption]:
        if not options:
            return options
        max_cost = max(o.delta_cost for o in options) or 1
        max_time = max(o.time_impact_minutes for o in options) or 1
        for o in options:
            preserved = o.commitments_preserved / max(1, o.total_commitments)
            o.score = round(100 * (0.4 * preserved + 0.3 * o.health_score / 100 + 0.2 * (1 - o.delta_cost / max_cost) + 0.1 * (1 - o.time_impact_minutes / max_time)))
        options.sort(key=lambda o: (o.residual_failures, -o.score))
        options[0].recommended = True
        return options
