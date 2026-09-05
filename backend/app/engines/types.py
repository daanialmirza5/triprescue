"""Plain, ORM-free data structures shared by the domain engines.

Keeping these independent of SQLAlchemy models is what makes the engines in this
package unit-testable in isolation (see app/tests) without touching a database.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class EngineNode:
    id: str
    category: str
    title: str
    location: str
    scheduled_start: datetime
    scheduled_end: datetime
    flexible: bool = False
    # For most nodes, a delayed start shifts the end by the same amount (duration is
    # preserved). For a node with a fixed external end constraint - a hotel checkout
    # policy time, say - a late check-in does NOT push checkout back; set this True
    # so the engine keeps actual_end pinned to scheduled_end regardless of shift.
    fixed_end: bool = False
    cost: float = 0.0
    refundable: bool = False
    refund_percentage: float = 0.0
    cancellation_deadline_hours: int = 0
    provider: str = ""
    confirmation: str | None = None
    origin_code: str | None = None
    destination_code: str | None = None


@dataclass
class EngineEdge:
    id: str
    source: str
    target: str
    dependency_type: str  # "hard" | "soft"
    min_buffer_minutes: int = 0
    risk_buffer_minutes: int = 0
    # Which end of the upstream node's timing this edge reads. "end" (default) is the
    # right choice for a sequential handoff (flight arrival -> next booking). "start"
    # is for dependents that only need the upstream to have BEGUN (e.g. an activity
    # during a multi-night hotel stay only needs check-in to have happened, not
    # checkout - keying it to "end" would wrongly wait for the whole stay to finish).
    upstream_reference: str = "end"


@dataclass
class NodeImpact:
    node_id: str
    status: str
    reason: str | None = None
    caused_by: str | None = None
    actual_start: datetime | None = None
    actual_end: datetime | None = None
    available_buffer_minutes: int | None = None
    required_buffer_minutes: int | None = None
    delay_minutes: int = 0

    def to_dict(self) -> dict:
        return {
            "node_id": self.node_id,
            "status": self.status,
            "reason": self.reason,
            "caused_by": self.caused_by,
            "actual_start": self.actual_start.isoformat() if self.actual_start else None,
            "actual_end": self.actual_end.isoformat() if self.actual_end else None,
            "available_buffer_minutes": self.available_buffer_minutes,
            "required_buffer_minutes": self.required_buffer_minutes,
            "delay_minutes": self.delay_minutes,
        }


@dataclass
class PropagationResult:
    impacts: dict[str, NodeImpact]
    sequence: list[str] = field(default_factory=list)
    """Node ids in the order they were resolved (topological), for cascade animation."""
