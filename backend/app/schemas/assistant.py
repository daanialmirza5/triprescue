from app.schemas.base import CamelModel


class AssistantReference(CamelModel):
    type: str
    id: str
    label: str


class AssistantRequest(CamelModel):
    trip_id: str
    message: str


class AssistantResponse(CamelModel):
    content: str
    references: list[AssistantReference] = []
    source: str  # "llm" | "deterministic"
