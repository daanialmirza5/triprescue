from pydantic import Field, field_validator, model_validator

from app.schemas.base import CamelModel


class AssistantReference(CamelModel):
    type: str
    id: str
    label: str


class AssistantRequest(CamelModel):
    trip_id: str = Field(..., min_length=1, max_length=100, description="Target trip ID")
    message: str = Field(..., min_length=1, max_length=2000, description="Question or prompt from traveler")

    @field_validator("message", "trip_id")
    @classmethod
    def strip_and_validate_non_empty(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty or only whitespace")
        return cleaned


class AssistantResponse(CamelModel):
    content: str
    references: list[AssistantReference] = []
    source: str  # "llm" | "deterministic"
    # Set only when the assistant proposes applying a specific recovery plan. The
    # backend never applies it: the frontend must get explicit user confirmation
    # before calling the existing /recovery/apply endpoint.
    proposed_recovery_id: str | None = None


class RecoveryNarrativeRequest(CamelModel):
    trip_id: str = Field(..., min_length=1, max_length=100)


class ExtractNodeIn(CamelModel):
    """A booking the client already has on screen, for matching by mention."""

    id: str = Field(..., max_length=100)
    title: str = Field("", max_length=200)
    label: str | None = Field(default=None, max_length=100)
    provider: str | None = Field(default=None, max_length=100)
    category: str | None = Field(default=None, max_length=40)


class DisruptionExtractRequest(CamelModel):
    # `text` (raw SMS / email) and `message` (chat phrasing) are accepted
    # interchangeably; at least one must be non-blank.
    text: str | None = Field(default=None, max_length=4000, description="Raw airline SMS / email text")
    message: str | None = Field(default=None, max_length=4000)
    trip_id: str | None = Field(default=None, max_length=100)
    # Optional client-side bookings; when given, the booking is matched by
    # what the message mentions instead of against the stored itinerary.
    nodes: list[ExtractNodeIn] | None = Field(default=None, max_length=200)

    @model_validator(mode="after")
    def require_text(self):
        cleaned = (self.text or self.message or "").strip()
        if not cleaned:
            raise ValueError("Text cannot be empty or only whitespace")
        self.text = cleaned
        return self


class DisruptionExtractResponse(CamelModel):
    """Structured reading of a free-text disruption notice. `type` is a valid
    disruption type (ready for POST /api/trips/{id}/disruptions) or None when
    the message is informational only (e.g. a gate change)."""

    type: str | None = None
    delay_minutes: int | None = None
    flight_number: str | None = None
    gate: str | None = None
    primary_node_id: str | None = None
    primary_node_label: str | None = None
    confidence: float = 0.0
    matched_signals: list[str] = []
    summary: str
    # Same value as primary_node_id, for clients that read `nodeId`.
    node_id: str | None = None
    source: str = "fallback"  # "fallback" (rule-based) | "llm"