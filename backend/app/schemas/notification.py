from app.schemas.base import CamelModel


class NotificationOut(CamelModel):
    id: str
    severity: str
    category: str
    title: str
    message: str
    timestamp: str
    read: bool
