import enum


class NodeCategory(str, enum.Enum):
    FLIGHT = "flight"
    CONNECTION = "connection"
    TRANSFER = "transfer"
    HOTEL = "hotel"
    ACTIVITY = "activity"
    RETURN = "return"


class NodeStatus(str, enum.Enum):
    HEALTHY = "healthy"
    AT_RISK = "at-risk"
    BROKEN = "broken"
    DELAYED = "delayed"
    CANCELLED = "cancelled"
    RECOVERED = "recovered"


class EdgeStatus(str, enum.Enum):
    HEALTHY = "healthy"
    AT_RISK = "at-risk"
    BROKEN = "broken"
    RECOVERED = "recovered"


class DependencyType(str, enum.Enum):
    HARD = "hard"
    SOFT = "soft"


class TripStatus(str, enum.Enum):
    OPERATIONAL = "operational"
    DISRUPTED = "disrupted"
    RECOVERING = "recovering"
    RECOVERED = "recovered"


class DisruptionType(str, enum.Enum):
    FLIGHT_DELAY = "flight-delay"
    FLIGHT_CANCELLATION = "flight-cancellation"
    MISSED_CONNECTION = "missed-connection"
    HOTEL_CHECKIN_CONFLICT = "hotel-conflict"
    HOTEL_CANCELLATION = "hotel-cancellation"
    TRANSFER_FAILURE = "transfer-failure"
    ACTIVITY_CANCELLATION = "activity-cancellation"
    ACTIVITY_DELAY = "activity-delay"
    AIRPORT_CLOSURE = "airport-closure"


class ImpactLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class ChangeType(str, enum.Enum):
    REBOOKED = "rebooked"
    RESCHEDULED = "rescheduled"
    CANCELLED = "cancelled"
    PRESERVED = "preserved"
    NEW = "new"


class ActivityType(str, enum.Enum):
    MONITORING = "monitoring"
    RISK = "risk"
    RECOVERY = "recovery"
    BOOKING = "booking"
    SYSTEM = "system"
    DISRUPTION = "disruption"


class NotificationSeverity(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    SYSTEM = "system"


class NotificationCategory(str, enum.Enum):
    RISK = "risk"
    RECOVERY = "recovery"
    BOOKING = "booking"
    SYSTEM = "system"


class SnapshotType(str, enum.Enum):
    NODE = "node"
    TRIP = "trip"
