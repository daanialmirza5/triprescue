from pydantic import BaseModel


class RecoveryPriorities(BaseModel):
    minimizeCost: bool = False
    minimizeTime: bool = False
    minimizeDisruption: bool = True
    maximizeComfort: bool = False


class TravelerPreferences(BaseModel):
    costVsSpeed: int = 50
    disruptionVsComfort: int = 50
    recoveryPriorities: RecoveryPriorities = RecoveryPriorities()


class ErrorResponse(BaseModel):
    detail: str
