# Engine Dependency Map

All engines live in `backend/app/engines/`, are framework-free (no FastAPI/SQLAlchemy imports), and operate on the plain dataclasses in `engines/types.py` (`EngineNode`, `EngineEdge`, `NodeImpact`). This is what makes them unit-testable in isolation - see `backend/app/tests/test_*_engine.py`.

```
                        ┌─────────────────┐
                        │  GraphEngine     │  add/remove node & edge,
                        │                  │  up/downstream traversal,
                        │                  │  cycle detection,
                        │                  │  topological_order()
                        └────────┬─────────┘
                                 │ topological order consumed by
                                 ▼
                        ┌─────────────────┐
                        │ PropagationEngine│  walks nodes in topo order,
                        │                  │  evaluates each incoming edge's
                        │                  │  buffer math → NodeImpact
                        └────────┬─────────┘
                                 │ NodeImpact per node
                 ┌───────────────┼───────────────────┐
                 ▼               ▼                    ▼
        ┌──────────────┐ ┌──────────────┐   ┌──────────────────┐
        │  RiskEngine   │ │FinancialEngine│   │  RecoveryEngine   │
        │ connection/   │ │ exposure from │   │ candidate search +│
        │ exposure risk │ │ impacts + cost│   │ feasibility (calls│
        └──────┬───────┘ └──────┬───────┘   │ PropagationEngine │
               │                │            │ again per candidate)│
               │                │            └────────┬──────────┘
               │                │                     │
               │        ┌───────┴────────┐            ▼
               │        │  RefundEngine   │   ┌──────────────────┐
               │        │  (used by both  │   │  ScoringEngine    │
               │        │  FinancialEngine│   │  weighted ranking │
               │        │  and Recovery)  │   │  from preferences │
               │        └────────────────┘   └──────────────────┘
               │
               ▼
        ┌──────────────────┐
        │  ItineraryEngine  │  orchestrates RiskEngine + FinancialEngine
        │  compute_health_  │  into the single trip health score
        │  score()          │
        └──────────────────┘
```

## Dependency direction (who calls whom)

- `RecoveryEngine` depends on `PropagationEngine` (to re-check feasibility of every simulated candidate), `FinancialEngine` + `RefundEngine` (cost/refund per candidate), `RiskEngine` (residual risk), and `ScoringEngine` (final ranking). It does **not** depend on `GraphEngine` directly - propagation already handles graph traversal internally.
- `ItineraryEngine` depends on `RiskEngine` and `FinancialEngine` only - it's purely an aggregator for the health score, no propagation logic of its own.
- `FinancialEngine` depends on `RefundEngine` for the refund-recoverable figure.
- `PropagationEngine` depends on `GraphEngine` for topological ordering and cycle validation, nothing else.
- Nothing depends on `RecoveryEngine` - it's a leaf consumer, never a dependency of another engine.

## Provider abstraction

`RecoveryEngine` talks to `app/providers/base.py`'s four interfaces (`FlightProvider`, `HotelProvider`, `ActivityProvider`, `TransferProvider`) rather than any concrete implementation. `services/recovery_service.py` wires in the `Mock*Provider` classes at construction time - swapping in a real provider integration later means implementing the same interface and changing only that one wiring point, with zero changes to `RecoveryEngine` itself.

## What is NOT an engine

`services/*.py` (disruption_service, recovery_service, trip_service, assistant_service, risk_service) are the orchestration layer - they load ORM state, convert it via `services/converters.py`, call the engines above, and persist results. They contain no domain algorithms of their own; every actual calculation traces back to one of the engines in this map.
