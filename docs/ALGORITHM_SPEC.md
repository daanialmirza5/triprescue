# Algorithm Spec

This document is the detailed write-up of the two algorithms that make
TripRescue's central claim true: "here is exactly what breaks, and why."

## Graph model

An itinerary is a directed graph: nodes are bookings (or, for a connection, a
zero-duration marker of the moment a connection process begins), edges are
dependencies. Represented as adjacency lists (`GraphEngine`), not a matrix -
itineraries are sparse (a handful of edges per node), so every graph
operation (BFS traversal, cycle detection via DFS, Kahn's-algorithm
topological sort) is O(V+E), and the model supports branches and
converging dependencies, not just a linear chain (see the Goa trip's fork -
one hotel feeding two independent activities - and the Rajasthan trip's fork
*and* join - two activities that must both complete before a transfer).

Each edge carries:

- `dependency_type`: `hard` or `soft`.
  - **Hard** (e.g. a flight connection): if the buffer requirement isn't met,
    the target is infeasible, full stop - `broken`. No partial credit.
  - **Soft** (e.g. transfer → hotel → activity sequencing): a buffer
    shortfall pushes a *flexible* node's schedule later (`delayed`) or flags
    an *inflexible* node as `at-risk`, but never breaks it outright.
- `min_buffer_minutes`: the actual minimum gap the dependency needs.
- `risk_buffer_minutes`: additional margin used only by `RiskEngine` to score
  how *comfortable* the buffer is, separate from the hard feasibility check.
- `upstream_reference`: whether this edge reads the upstream node's
  `actual_end` (default - "the flight lands, then...") or `actual_start`
  ("the hotel stay begins, then..." - an activity two nights into a stay
  should key off check-in, not checkout).

## Propagation algorithm

Input: the node/edge set, which node was disrupted, the disruption type, an
optional delay, and when it was detected (itinerary-relative, never
wall-clock time, so results are deterministic and reproducible in tests).

1. Build a `GraphEngine`, validate it (reject cycles - a cyclic dependency is
   a data error, not a disruption scenario), and compute topological order.
2. Walk nodes in that order. For the disrupted node itself, apply the
   disruption's direct effect (`apply_disruption_override`): a delay shifts
   `actual_end`; a cancellation/failure clears both `actual_start` and
   `actual_end` to `None` (genuinely unknown) and sets status to `cancelled`
   or `broken`.
3. For every other node, evaluate each incoming edge against its
   (already-resolved) upstream node and take the worst outcome across edges
   (`cancelled` > `broken` > `at-risk` > `delayed` > `healthy`):
   - **Upstream broken/cancelled, hard edge** → target `broken`.
   - **Upstream broken/cancelled, soft edge** → see "uncertainty window"
     below.
   - **Upstream healthy with a concrete `actual_end`/`actual_start`** → compute
     `available = minutes_between(upstream_reference_time, node.scheduled_start)`
     and `deficit = required_buffer - available`.
     - `deficit > 0`, hard edge → `broken`, with `reason` naming the exact
       required/available minutes (this is the literal source of "Required
       buffer is 60 minutes but only 0 minutes remain").
     - `deficit > 0`, soft edge, flexible node → `delayed`, schedule shifts by
       the deficit (duration preserved, *unless* the node has `fixed_end`
       set - see below).
     - `deficit > 0`, soft edge, inflexible node → `at-risk`.
     - `deficit <= 0` → `healthy` (or `delayed` if timing still shifted
       slightly but within tolerance).

### `fixed_end`: why a hotel checkout doesn't move because check-in was late

A naive "shift end by the same amount as start" rule works for a
transfer (fixed duration) but is wrong for a multi-night hotel stay: a
15-minute-late check-in must not push checkout back by 15 minutes too -
checkout is a fixed policy time. `EngineNode.fixed_end` marks this: when set,
a shifted `actual_start` still leaves `actual_end` pinned to
`scheduled_end`. This was found and fixed during testing (see
`test_recovery_engine.py::test_premium_option_preserves_all_bookings`) - it's
exactly the kind of bug this modeling nuance exists to prevent.

### The uncertainty window

When an upstream node is `broken`/`cancelled` and the dependency is soft, is
the downstream node "uncertain until recovered" (`at-risk`) or "far enough
away it'll probably be sorted out by then" (`healthy`)? A single, documented
heuristic: `UNCERTAINTY_WINDOW_HOURS = 24`. If the downstream node's
`scheduled_start` is within 24 hours of the disruption's `detected_at`, it's
`at-risk`; if it's further out, `healthy`. This heuristic is what produces a
realistic cascade boundary (a same-day transfer is at-risk; an activity two
days later is not) from one general rule, rather than hardcoding which
specific nodes are affected per scenario. Critically, an `at-risk` node from
this branch keeps `actual_start`/`actual_end` as `None` (genuinely unresolved)
rather than snapping to its scheduled time - that's what lets the *same*
24-hour check apply independently to whatever is scheduled next, so the
uncertainty correctly stops propagating once enough time has passed, instead
of every downstream node blindly inheriting a fake "resolved by schedule"
timestamp.

### The hero scenario, concretely

Aisha's Mumbai → Delhi flight (`bom-del`) is delayed 180 minutes.

1. `bom-del`: `delayed`, `actual_end` = scheduled + 180min.
2. `del-connection` (soft edge from `bom-del`, 0-minute requirement, itself a
   zero-duration marker, `flexible=True`): absorbs the delay, `delayed`,
   `actual_end` tracks `bom-del`'s new arrival time exactly.
3. `del-leh` (**hard** edge from `del-connection`, `min_buffer_minutes=60`):
   `available = del-connection.actual_end -> del-leh.scheduled_start` is now
   negative (clamped to 0 for display); `deficit = 60 - 0 = 60 > 0` → `broken`,
   `caused_by: del-connection`, reason cites the exact 60/0 minutes.
4. `airport-transfer` (soft edge from `del-leh`, upstream now `broken`):
   within the 24h window → `at-risk`, `caused_by: del-leh`.
5. `grand-dragon` (soft edge from `airport-transfer`, upstream `at-risk` with
   no concrete resolution time): within window → `at-risk`.
6. `pangong-tour` (soft edge from `grand-dragon`, `upstream_reference=start`):
   scheduled ~23.5h after detection → still within window → `at-risk`.
7. `nubra-valley` (same edge shape, but scheduled ~48.5h out) → beyond the
   window → `healthy`.
8. `leh-return` (5 days out, `upstream_reference=end` since it depends on
   checkout completing) → `healthy`.

Every one of these is computed from the general algorithm above against this
trip's actual buffer numbers - none of it is a per-scenario hardcoded list.
See `app/tests/test_propagation_engine.py::test_hero_scenario_bom_del_delayed_three_hours`
and `app/tests/test_hero_scenario.py` for the assertions.

## Recovery algorithm

Given the propagated impacts, `RecoveryEngine`:

1. Picks a recovery target: the first `broken`/`cancelled` bookable node
   (excluding the synthetic `connection` category), falling back to an
   `at-risk` one if nothing is outright broken (e.g. a hotel check-in
   conflict).
2. Depending on category, searches the matching mock provider
   (`FlightProvider` for `flight`/`return`, etc.) for alternatives departing
   after the earliest moment the traveler could plausibly use them (walked
   upstream to the nearest node with a concrete `actual_start`, plus a
   30-minute minimum connection buffer).
3. For each alternative, **simulates** it: clones the node/edge set, replaces
   the target's schedule/cost/provider with the alternative's, and - this is
   the key step - **removes the target's old incoming edges**, since a
   rebooked flight is a fresh, independent booking no longer bound to
   whatever dependency broke the old one. Re-runs `PropagationEngine` on this
   modified graph to see the *actual* downstream effect of that specific
   choice (a slower flight may leave the transfer/hotel `delayed` but
   feasible; a much slower one may leave an activity `at-risk`).
4. If an activity comes back `at-risk` purely because its original slot no
   longer fits the new arrival time (a date conflict, not a genuine
   feasibility problem), looks up the next available slot from
   `ActivityProvider` and adds a coordinated `RESCHEDULE` action - this is how
   a single flight choice can turn into the multi-action "cheapest" plan
   (rebook the flight *and* move Pangong Lake to the next day).
5. Rejects any candidate that still leaves a node `broken`.
6. Computes cost delta, time delta, bookings preserved/total, refund
   recovered (via `RefundEngine`, using the *original* booking's policy), and
   residual risk (via `RiskEngine`, averaged over remaining hard-edge
   connections in the simulated graph).
7. Hands all feasible candidates to `ScoringEngine`.

This is a small, bounded search (a handful of provider alternatives, one
follow-up pass for activity conflicts) rather than a general optimizer -
deliberately: correctness and explainability matter more here than search
power, and the search space for "rebook one flight, maybe reschedule one or
two downstream activities" doesn't need more.

**Known simplification**: rescheduling one activity doesn't check whether it
now collides with another activity on the same day (there's no
activity-vs-activity conflict detection, only activity-vs-flight-arrival). See
`FUTURE_ROADMAP.md`.

## Scoring algorithm

For a set of candidates, each of cost delta, time delta, preservation ratio,
and residual risk is normalized *relative to the other candidates* (min-max
scaling, not against some absolute scale), then combined:

```
overall = (cost*cost_w + speed*time_w + preservation*disruption_w
           + risk*risk_w + comfort*comfort_w) / (sum of weights)
```

Weights come entirely from `TravelerPreferences`:

- `cost_weight = (100 - costVsSpeed)/100`, boosted +0.5 if `minimizeCost`.
- `time_weight = costVsSpeed/100`, boosted +0.5 if `minimizeTime`.
- `disruption_weight (preservation) = (100 - disruptionVsComfort)/100`,
  boosted +0.5 if `minimizeDisruption`.
- `comfort_weight = disruptionVsComfort/100`, boosted +0.5 if
  `maximizeComfort`.
- `risk_weight = 0.6` (fixed baseline - residual risk always matters somewhat
  regardless of stated preferences).

Refund recovered is folded into cost as `net_cost = cost_delta -
refund_recovered` before normalization, rather than being a separate scored
dimension, so the displayed `ScoreBreakdown` stays the same 5-field shape
(`cost`, `speed`, `preservation`, `comfort`, `risk`) the frontend type already
defines. Moving the cost-vs-speed or disruption-vs-comfort sliders (or the
priority toggles) and regenerating options measurably changes the ranking -
see `test_recovery_engine.py::test_preference_shift_actually_changes_the_ranking`.

## Risk heuristic

Explicitly **not** machine learning - a transparent weighted formula:

- **Connection risk** (nodes with an incoming hard edge): driven by the
  *nominal* buffer ratio (available-at-schedule / required), adjusted by a
  static per-location complexity factor (bigger/busier airports score
  higher), a time-of-day factor (very early/late departures score higher),
  and downstream dependency count.
- **Exposure risk** (everything else): driven by a deterministic
  pseudo-reliability score per provider name (a stable hash, not a live
  rating feed), cancellation exposure (`1 - refund_percentage` if
  refundable, else full exposure), and the same time-of-day/dependency
  factors.
- **Trip resilience**: `100 - avg(node risk)*0.7 - financial_exposure_ratio*100*0.3`,
  further reduced per currently-broken/at-risk node when a disruption is
  active. This is what replaces the old frontend's hardcoded
  `healthScore = 87` / `94` - see `ItineraryEngine.compute_health_score`.

Every result carries `risk_percent`, `risk_level`, a human-readable `reason`,
a list of `contributing_factors`, and a `recommendation` - never a bare
number.

## Financial and refund arithmetic

`FinancialEngine.summarize` sums total/refundable/non-refundable trip value
directly from booking data, and - given the current propagated impacts -
at-risk value (cost of every non-healthy node) and potential refund (via
`RefundEngine`, for each at-risk/broken node, using its own policy).

`RefundEngine.calculate_refund(cost, refundable, refund_percentage,
cancellation_deadline_hours, hours_before_start)`: no refund if
non-refundable; full `refund_percentage` if cancelled with at least
`cancellation_deadline_hours` of notice; half that rate (a late-cancellation
penalty) otherwise. Example from the spec (₹5,000 at 80%, cancelled with
notice) yields exactly ₹4,000 - see `test_refund_engine.py`.
