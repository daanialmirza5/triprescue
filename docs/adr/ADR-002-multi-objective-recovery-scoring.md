# ADR-002: Multi-Objective Scoring Engine for Autonomous Disruption Recovery

## Status
Accepted

## Context
When a travel disruption occurs, there are often multiple candidate recovery options (rebooking alternative flights, rerouting through another hub, shifting hotel check-in dates, or converting transfers). No single metric (e.g. lowest cost or earliest arrival) suits every traveler or situation:
- Business travelers prioritize speed and schedule preservation over cost.
- Leisure / budget travelers prioritize minimizing out-of-pocket change fees.
- Families prioritize comfort, minimizing connections, and protecting pre-booked experiences.

## Decision
We implement a multi-objective utility scoring function that dynamically weights competing dimensions:
$$\text{Score} = w_{\text{cost}} \cdot S_{\text{cost}} + w_{\text{time}} \cdot S_{\text{time}} + w_{\text{preservation}} \cdot S_{\text{preservation}} + w_{\text{comfort}} \cdot S_{\text{comfort}}$$

Where:
- $S_{\text{cost}}$ evaluates net out-of-pocket change fees and refund recovery.
- $S_{\text{time}}$ scores delay minimization relative to the original planned itinerary.
- $S_{\text{preservation}}$ measures the ratio of downstream commitments kept intact.
- Weights ($w$) are dynamically derived from traveler preference settings (`costVsSpeed`, `disruptionVsComfort`, and explicit priority toggles).

## Consequences
### Positive
- Transparent, explainable ranking for every proposed recovery strategy.
- Honors individual traveler tradeoffs without hardcoded heuristic assumptions.
- Enables deterministic fallback execution if AI services are unavailable.

### Negative / Trade-offs
- Requires normalization of heterogeneous units (currency dollars vs minutes vs boolean flags) to a unified [0, 100] scale.
