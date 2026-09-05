from app.schemas.base import CamelModel


class ActivityEventOut(CamelModel):
    id: str
    timestamp: str
    type: str
    message: str
    detail: str | None = None
