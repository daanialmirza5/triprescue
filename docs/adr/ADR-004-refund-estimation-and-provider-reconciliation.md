# ADR-004: Automated Refund Estimation and Provider Reconciliation

## Context and Problem Statement
When a flight, accommodation, or activity is cancelled or modified due to a disruption, refund policies vary dramatically across providers (airlines, hotel aggregators, local tour operators) and booking classes (refundable, non-refundable, partial with penalty window).
TripRescue must present instant financial estimates to users during recovery option evaluation, without blocking on slow third-party GDS/supplier refund authorization webhooks.

## Decision Drivers
* Real-time calculation speed (<50ms) during recovery tree ranking.
* Accuracy within known penalty policy windows (e.g., >24h vs. <2h cancellation).
* Auditability of calculated refund vs. settled supplier refund.
* Resilient fallback when provider policy schemas are unknown or partially defined.

## Considered Options
1. **Synchronous Provider API Calls:** Query supplier APIs synchronously during recovery generation.
2. **Rule-Based Hybrid Engine (Chosen):** Deterministic policy evaluator based on structured booking metadata, cancellation timestamps, and conservative refund bounds.
3. **Static Default Percentages:** Flat percentage estimates across all booking types.

## Decision Outcome
Adopt Option 2: A deterministic `RefundEngine` that computes refund percentages and currency amounts based on:
1. Provider fare class rules (`refundable`, `non_refundable`, `conditional`).
2. Elapsed time between disruption detection / cancellation and scheduled departure / check-in.
3. Supplier cancellation penalty tiers (e.g., 100% refund before 24h, 50% before 6h, 0% after).

## Consequences
### Positive
* Instantaneous recovery option scoring without network latency or external API rate limit risks.
* Transparent breakdown displayed in recovery cards showing "Estimated Refund" alongside "Net Out-of-Pocket Cost".

### Negative
* Discrepancies may occur if airlines grant goodwill waivers outside standard fare rules; the system clarifies "Estimated Refund (Subject to Provider Confirmation)".
