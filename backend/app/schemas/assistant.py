from pydantic import Field, field_validator

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
