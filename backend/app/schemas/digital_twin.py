from datetime import datetime

from pydantic import Field

from app.schemas.base import CamelModel
from app.schemas.social_signals import SocialSignalsOut
from app.schemas.trip import TripOut


class DigitalTwinSimulateRequest(CamelModel):
    scenario_name: str = Field("Custom scenario", min_length=1, max_length=80)
    rainfall_mm_per_hour: float = Field(0.0, ge=0, le=200)
    wind_speed_kmh: float = Field(0.0, ge=0, le=250)
    visibility_meters: float = Field(10000.0, ge=10, le=50000)
    temperature_celsius: float = Field(25.0, ge=-40, le=60)
    storm_duration_hours: float = Field(4.0, ge=0.5, le=48)
    affected_node_id: str | None = Field(default=None, max_length=100)
    # Optional explicit storm onset; defaults to the start of the itinerary
    # (or one hour before the affected booking).
    storm_start: datetime | None = None


class StateSummaryOut(CamelModel):
    health_score: int
    at_risk_commitments: int
    total_commitments: int
    cost_exposure: float


class TwinNodeOut(CamelModel):
    node_id: str
    title: str
    category: str
    mode: str
    live_status: str
    twin_status: str
    reason: str | None = None
    direct_hit: bool = False
    driver: str | None = None
    delay_minutes: int = 0
    lat: float | None = None
    lng: float | None = None


class RiskOut(CamelModel):
    node_id: str
    label: str
    probability: float
    low: float
    high: float


class CascadeLinkOut(CamelModel):
    from_node_id: str  # "weather" for direct hits
    to_node_id: str
    status: str


class TwinChangeOut(CamelModel):
    node_id: str
    title: str
    change_type: str
    new_start: datetime
    new_end: datetime
    cost_delta: float
    description: str


class TwinOptionOut(CamelModel):
    id: str
    name: str
    strategy: str
    description: str
    changes: list[TwinChangeOut]
    delta_cost: float
    time_impact_minutes: int
    commitments_preserved: int
    total_commitments: int
    health_score: int
    residual_failures: int
    score: int
    recommended: bool
    notes: list[str] = []


class DigitalTwinSimulationOut(CamelModel):
    simulation_id: str
    trip_id: str
    scenario_name: str
    severity: float
    storm_window_start: datetime
    storm_window_end: datetime
    live: StateSummaryOut
    twin: StateSummaryOut
    health_delta: int
    nodes: list[TwinNodeOut]
    risks: list[RiskOut]
    cascade: list[CascadeLinkOut]
    options: list[TwinOptionOut]
    social_signals: SocialSignalsOut
    explanation: str
    explanation_source: str  # "nugen" | "heuristic"
    model: str | None = None
    mitigation: list[str]
    mitigation_source: str
    expires_at: datetime


class DigitalTwinApplyRequest(CamelModel):
    simulation_id: str = Field(..., min_length=1, max_length=64)
    option_id: str = Field(..., min_length=1, max_length=40)


class DigitalTwinApplyOut(CamelModel):
    trip: TripOut
    applied_option: TwinOptionOut
    validation: StateSummaryOut
    all_connections_valid: bool
