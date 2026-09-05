# Backend Pipeline

How a disruption actually moves through the backend, traced against the real code (not an aspirational diagram). File:line references point at `backend/app/`.

## The full path

```
Frontend                      src/store/AppContext.tsx (triggerDisruption)
    ↓ POST /api/trips/{id}/disruptions
FastAPI route                 api/routes/disruptions.py:trigger_disruption
    ↓ resolves caller + ownership
Auth dependency                api/deps.py:get_current_traveler_id
    ↓
Service layer                 services/disruption_service.py:trigger_disruption
    ↓ loads canonical state
Repositories                  repositories/{trip,node}_repository.py
    ↓ ORM → ORM-free dataclasses
Converters                    services/converters.py (to_engine_node/to_engine_edge)
    ↓
Graph construction             engines/graph_engine.py (topological order, cycle check)
    ↓
Propagation Engine             engines/propagation_engine.py:PropagationEngine.propagate
    ↓ per-node NodeImpact (status + reason + buffer numbers)
Financial Engine                engines/financial_engine.py (exposure from impacts)
Itinerary Engine                 engines/itinerary_engine.py (health score)
    ↓
Persistence                    disruption_service.py writes node/edge status,
                                 Disruption + CascadeStep rows, ActivityEvent,
                                 Notification - one db.commit()
    ↓
Response                       PropagationResultOut (camelCase JSON)
    ↓
Frontend                       AppContext dispatches NODE_EDGE_UPDATE, stages
                                the cascade reveal (visual only - the backend
                                already decided every status)
```

Recovery generation and apply follow the same shape:

```
POST /recovery-options/generate
    → services/recovery_service.py:generate_recovery_options
    → engines/recovery_engine.py:RecoveryEngine.generate_plans
        → provider.get_alternatives() (app/providers/mock_*.py)
        → re-run PropagationEngine per candidate (simulated state)
        → engines/scoring_engine.py:ScoringEngine.score_candidates
    → persists RecoveryPlan + RecoveryAction rows
    → returns ranked RecoveryOptionOut[]

POST /recovery/apply
    → recovery_service.py:apply_recovery
    → mutate node schedule/cost/provider per RecoveryAction
    → drop stale incoming edges on changed nodes
    → re-run PropagationEngine on the new canonical state
    → itinerary_engine.compute_health_score
    → one db.commit() - see "Atomicity" below
```

## Atomicity

`backend/app/database/session.py:get_db()` wraps every request's SQLAlchemy session: on any exception it calls `db.rollback()` before closing, and re-raises. Combined with each service function doing exactly one `db.commit()` at the very end (never mid-function), a failure at any point before that commit leaves nothing persisted - verified by `backend/app/tests/test_api_disruption_and_recovery.py::test_apply_recovery_failure_partway_through_leaves_no_partial_state`, which injects a real failure after `apply_recovery` has already mutated node objects in memory but before the commit, then confirms the trip is unchanged.

## Re-disruptability

`trigger_disruption` and `apply_recovery` both rebuild `EngineNode`/`EngineEdge` fresh from the database on every call (via `to_engine_node`/`to_engine_edge`) - there is no separate "first disruption" code path. A trip that was disrupted, recovered, and applied is just the current canonical state; triggering a second disruption on it re-propagates from exactly that state. See `test_hero_scenario.py::test_recovered_trip_remains_re_disruptable_without_a_reset`.

## Where "the real algorithm" actually lives

- **Buffer/feasibility math**: `engines/propagation_engine.py:_evaluate_edge` - real subtraction of scheduled/actual times against `EngineEdge.min_buffer_minutes`, not a lookup table keyed by disruption type.
- **Cascade reach**: `UNCERTAINTY_WINDOW_HOURS = 24` in the same file - a documented heuristic (nodes far enough in the future are assumed recoverable by then), not a hardcoded node list.
- **Recovery feasibility**: `engines/recovery_engine.py:_simulate_flight_alternative` - a candidate is only feasible if re-running `PropagationEngine` on the simulated state leaves no `broken` node.
- **Activity conflict convergence**: `engines/recovery_engine.py:_resolve_activity_conflicts` - a fixed-point loop (`MAX_ACTIVITY_CONFLICT_PASSES = 5`) that re-scans after each reschedule, since fixing one activity's slot can put a *different* activity at risk.
