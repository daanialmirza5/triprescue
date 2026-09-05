from app.schemas.base import CamelModel


class RiskScoreOut(CamelModel):
    trip_resilience: int
    connection_risk: int
    schedule_risk: int
    vendor_risk: int
    weather_risk: int


class RiskCardOut(CamelModel):
    node_id: str
    node_label: str
    risk_type: str
    risk_level: str
    risk_percent: int
    buffer: str | None = None
    recommended: str | None = None
    historical_risk: str
    downstream_impact: int
    recommendation: str


class AlertOut(CamelModel):
    id: str
    severity: str
    title: str
    reason: str
    impact: str
    action: str
    node_id: str | None = None
    timestamp: str


class RiskAnalysisOut(CamelModel):
    score: RiskScoreOut
    cards: list[RiskCardOut]
    alerts: list[AlertOut]
