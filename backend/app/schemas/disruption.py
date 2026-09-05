from datetime import datetime

from app.schemas.base import CamelModel


class DisruptionRequest(CamelModel):
    type: str
    primary_node_id: str | None = None
    delay_minutes: int | None = None


class CascadeStepOut(CamelModel):
    id: str
    description: str
    node_id: str | None = None
    timestamp: str


class DisruptionOut(CamelModel):
    id: str
    type: str
    label: str
    primary_node_id: str
    delay_minutes: int | None = None
    impact_level: str
    direct_impact: int
    downstream_impact: int
    financial_exposure: float
    refund_exposure: float
    cascade_steps: list[CascadeStepOut]
    detected_at: str


class ImpactEntryOut(CamelModel):
    node_id: str
    status: str
    reason: str | None = None
    caused_by: str | None = None
    available_buffer_minutes: int | None = None
    required_buffer_minutes: int | None = None


class PropagationResultOut(CamelModel):
    disruption: DisruptionOut
    impacts: list[ImpactEntryOut]
    sequence: list[str]
    trip_health_score: int
