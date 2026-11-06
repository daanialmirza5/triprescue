from typing import Literal

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
    feasible: bool = True
    provider_reason: str | None = None
    data_source: Literal["live", "simulated"] = "simulated"
    # Why this option sits where it does in the ranking, relative to the others
    # and the traveler's preferences. Populated on generation; None elsewhere.
    narrative: str | None = None


class RecoveryNarrativeOut(CamelModel):
    """Executive summary + narrative explaining the recovery ranking."""

    executive_summary: str | None = None
    narrative: str | None = None
    top_option_id: str | None = None
    option_notes: dict[str, str] = {}
    source: Literal["nugen", "llm", "deterministic"] = "deterministic"


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
