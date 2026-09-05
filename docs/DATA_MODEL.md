# Data Model

SQLite via SQLAlchemy. Every entity is its own table with foreign keys - the
itinerary graph is nodes + edges tables, not a JSON blob.

## Entities

```
Traveler
  id, name, email, home_airport, loyalty_tier, password_hash, preferences (JSON)
  1--* Trip

Trip
  id, traveler_id (FK), name, route, origin, destination, start_date, end_date,
  trip_value, health_score, status
  1--* ItineraryNode
  1--* DependencyEdge
  1--* Disruption
  1--* RecoveryPlan
  1--* ActivityEvent
  1--* Notification
  1--* RiskSnapshot

ItineraryNode
  id, trip_id (FK), category, label, title, subtitle, location,
  scheduled_start, scheduled_end, actual_start, actual_end,
  flexible, fixed_end,                    -- propagation behavior flags
  provider, confirmation, cost,
  cancellation_policy, refundable, refund_percentage, cancellation_deadline_hours,
  risk_level, dependency_count,           -- cached/derived, recomputed on read
  status, status_reason, caused_by,       -- last-computed propagation result
  day, icon, description, lat, lng, origin_code, destination_code
  1--1 Booking (optional - the synthetic 'connection' node has none)
  *--* DependencyEdge (as source or target)

DependencyEdge
  id, trip_id (FK), source_id (FK -> ItineraryNode), target_id (FK -> ItineraryNode),
  dependency_type (hard | soft), min_buffer_minutes, risk_buffer_minutes,
  upstream_reference (end | start),
  status, label, animated                 -- last-computed propagation result

Booking
  id, trip_id (FK), node_id (FK, unique - 1:1 with its node),
  category, provider, confirmation, cost, refundable, cancellation_policy,
  status, risk_level, route

Disruption
  id, trip_id (FK), type, label, primary_node_id (FK), delay_minutes,
  impact_level, direct_impact, downstream_impact,
  financial_exposure, refund_exposure, detected_at, resolved
  1--* CascadeStep
  1--* RecoveryPlan

CascadeStep
  id, disruption_id (FK), sequence_order, description, node_id (FK, nullable), timestamp

RecoveryPlan
  id, trip_id (FK), disruption_id (FK), name, tag, tag_color, description,
  cost_delta, time_impact_minutes, bookings_preserved, total_bookings,
  refund_recovered, residual_risk, score, score_breakdown (JSON),
  explanation, feasible, applied, applied_at, created_at
  1--* RecoveryAction

RecoveryAction
  id, recovery_plan_id (FK), node_id (FK), change_type,
  description, new_scheduled_start, new_scheduled_end, new_cost,
  new_provider, new_confirmation

RiskSnapshot
  id, trip_id (FK), node_id (FK, nullable - null = trip-level),
  snapshot_type, risk_type, risk_level, risk_percent, reason,
  contributing_factors (JSON list), recommendation, created_at
  (currently computed on-demand for GET /risks rather than persisted per
  request - the table exists for a future "risk history over time" feature)

ActivityEvent
  id, trip_id (FK), type, message, detail, timestamp

Notification
  id, trip_id (FK), severity, category, title, message, timestamp, read
```

## Why nodes and edges are separate from "the graph"

`GraphEngine` (the algorithm) never sees a `Trip`, an `ItineraryNode`, or SQL
- it operates on plain `(node_id, [(source, target)])` data. The database
schema and the graph algorithm are two different layers on purpose: the DB
schema captures everything a *booking* needs (cost, policy, provider...); the
graph algorithm captures only what a *dependency relationship* needs (hard vs
soft, buffer minutes, which end it reads). `app/services/converters.py` is
the only place that bridges the two, via `to_engine_node` / `to_engine_edge`.

## JSON columns

Two deliberate exceptions to "no JSON blobs": `Traveler.preferences` (a small,
genuinely nested settings object - `TravelerPreferences`) and
`RecoveryPlan.score_breakdown` (a fixed 5-key structure,
`{cost, speed, preservation, comfort, risk}`). Both are small, fixed-shape,
and never queried by their internal fields - storing them as real columns
would mean five extra columns each for no benefit. Everything else that is
itinerary structure or state (nodes, edges, bookings, disruptions, plans,
actions) is a real relational table.

## Why `dependency_count` and `risk_level` are stored columns but recomputed live

They're declared as real columns (so they exist on the ORM object and appear
in API responses without extra plumbing) but are always overwritten from a
fresh computation before being read (`refresh_dependency_counts` in
`converters.py`, and `ItineraryEngine.compute_node_risks` in the risk/trip
services) - never trusted as a stale cache. For a handful of nodes per trip
this recomputation is effectively free, and it guarantees "risk score is
dynamic" is actually true rather than aspirational.

## Reset semantics

There's no "undo log" or snapshot table for reset. Each trip has a dedicated
`build_<trip>_trip(db, traveler_id)` function in `seed.py` that deletes that
trip's nodes/edges/bookings/disruptions/recovery plans/cascade steps and
recreates them from the same hardcoded seed values used at first boot.
`reset_trip` just calls that function again. This is simpler and more
robust than trying to patch mutated rows back to their original values, and
it's what guarantees Demo Mode is exactly repeatable.
