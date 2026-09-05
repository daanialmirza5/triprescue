from app.schemas.base import CamelModel


class ScoreBreakdownOut(CamelModel):
    cost: int
    speed: int
    preservation: int
    comfort: int
    risk: int


class RecoveryChangeOut(CamelModel):
    node_id: str
    node_label: str
    change_type: str
    description: str


class RecoveryOptionOut(CamelModel):
    id: str
    name: str
    tag: str
    tag_color: str
    description: str
    cost_delta: float
    time_impact_minutes: int
    bookings_preserved: int
    total_bookings: int
    refund_recovered: float
    residual_risk: str
    score: int
    changes: list[RecoveryChangeOut]
    score_breakdown: ScoreBreakdownOut


class ApplyRecoveryRequest(CamelModel):
    recovery_id: str


class ApplyRecoveryResult(CamelModel):
    trip: "TripOut"
    applied_recovery: RecoveryOptionOut
    activity_event: "ActivityEventOut"
    notification: "NotificationOut"


from app.schemas.activity import ActivityEventOut  # noqa: E402
from app.schemas.notification import NotificationOut  # noqa: E402
from app.schemas.trip import TripOut  # noqa: E402

ApplyRecoveryResult.model_rebuild()
