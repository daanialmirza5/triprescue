"""RefundEngine: backend-authoritative refund arithmetic.

Given a booking's refund policy and how much notice is given before its scheduled
start, computes the refund actually recoverable. Cancelling well before the
policy's deadline recovers the full percentage; cancelling inside the deadline
window applies a late-cancellation penalty (half the normal percentage) rather
than an all-or-nothing cliff, which better matches how travel providers price
late changes.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RefundResult:
    refund_amount: float
    refund_percentage_applied: float
    within_deadline: bool
    explanation: str


class RefundEngine:
    def calculate_refund(
        self,
        *,
        cost: float,
        refundable: bool,
        refund_percentage: float,
        cancellation_deadline_hours: int,
        hours_before_start: float,
    ) -> RefundResult:
        if not refundable or refund_percentage <= 0 or cost <= 0:
            return RefundResult(0.0, 0.0, False, "This booking is non-refundable.")

        within_deadline = (
            cancellation_deadline_hours <= 0 or hours_before_start >= cancellation_deadline_hours
        )
        applied_percentage = refund_percentage if within_deadline else refund_percentage * 0.5
        amount = round(cost * applied_percentage, 2)

        if within_deadline:
            explanation = (
                f"Cancelled with {hours_before_start:.0f}h notice (>= {cancellation_deadline_hours}h "
                f"required), so the full {applied_percentage * 100:.0f}% refund policy applies."
            )
        else:
            explanation = (
                f"Cancelled with only {hours_before_start:.0f}h notice (< {cancellation_deadline_hours}h "
                f"required), so a late-cancellation rate of {applied_percentage * 100:.0f}% applies."
            )
        return RefundResult(amount, applied_percentage, within_deadline, explanation)
