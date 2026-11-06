"""Domain and application exceptions for Safar Sathi."""


class SafarSathiException(Exception):
    """Base exception for all domain-specific Safar Sathi errors."""

    def __init__(self, message: str, status_code: int = 400, details: dict | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ResourceNotFoundError(SafarSathiException):
    """Raised when a requested entity or resource is not found."""

    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            message=f"{resource_type} '{resource_id}' not found",
            status_code=404,
            details={"resource_type": resource_type, "resource_id": resource_id},
        )


class DisruptionCalculationError(SafarSathiException):
    """Raised when disruption propagation or recovery calculation fails."""

    def __init__(self, message: str, node_id: str | None = None):
        super().__init__(
            message=message,
            status_code=422,
            details={"node_id": node_id} if node_id else {},
        )


class ProviderUnavailableError(SafarSathiException):
    """Raised when an external live travel data provider is unreachable."""

    def __init__(self, provider_name: str, message: str | None = None):
        super().__init__(
            message=message or f"Live data provider '{provider_name}' is currently unavailable",
            status_code=503,
            details={"provider": provider_name},
        )
