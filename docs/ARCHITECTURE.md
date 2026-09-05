# Architecture

## Layering

```
Frontend (React)
  |  fetch()
  v
FastAPI routes (app/api/routes/*)      <- HTTP concerns only: parsing, status codes
  |
  v
Services (app/services/*)              <- orchestration: load from DB, call engines,
  |                                        persist results, build response schemas
  v
Engines (app/engines/*)                <- pure business logic, no DB/HTTP awareness
  |
  v
Repositories (app/repositories/*)      <- thin SQLAlchemy query wrappers
  |
  v
Models (app/models/*) -> SQLite
```

The rule enforced throughout: **engines never import SQLAlchemy or FastAPI**,
and **routes never contain business logic** - they call a service function and
translate its result/exception into an HTTP response. This is what makes the
engines independently unit-testable (see `app/tests/test_*_engine.py`) without
a database or an HTTP server.

## The engines

| Engine | Responsibility |
|---|---|
| `GraphEngine` | Adjacency-list graph over node ids: add/remove node/edge, upstream/downstream traversal, cycle detection, topological order, dependency counts. |
| `PropagationEngine` | Given a disrupted node + disruption type, walks the graph in topological order and computes every other node's resulting status, using explicit buffer/feasibility math per edge - not a blanket "mark everything downstream broken". |
| `RecoveryEngine` | For the broken/at-risk booking, searches the relevant mock provider for alternatives, simulates each by rebooking + re-propagating, and resolves any resulting downstream date conflicts (e.g. an activity that no longer fits) before scoring. |
| `ScoringEngine` | Normalizes cost/speed/preservation/comfort/risk across the candidate set and combines them using weights derived from traveler preferences. |
| `RiskEngine` | Deterministic (not ML) weighted heuristic over buffer ratios, airport/location complexity, time-of-day, vendor reliability, dependency fan-out, and cancellation exposure. |
| `FinancialEngine` / `RefundEngine` | Aggregate trip value / at-risk value / refundable value, and compute an actual refund amount from a booking's policy and how much notice a change gives it. |
| `ItineraryEngine` | The one engine allowed to call the others - combines risk + financial data into the trip health score and per-node risk snapshots. |

Full algorithm details: `ALGORITHM_SPEC.md`.

## Services

Each service function is the thing a route calls, and does exactly one unit
of work: read the current DB state, convert it to the engines' plain
dataclasses (`app/services/converters.py`), run the relevant engine(s),
write the results back onto the ORM objects, commit, and build the response
schema. `disruption_service.trigger_disruption` and
`recovery_service.apply_recovery` are the two most involved examples - read
those first to understand the pattern.

## Database

SQLite via SQLAlchemy, with a normalized schema (nodes, edges, bookings,
disruptions, recovery plans/actions, risk snapshots, activity, notifications
all as their own tables with foreign keys - see `DATA_MODEL.md`). There is no
migration framework; `Base.metadata.create_all()` runs on startup, which is
sufficient for a SQLite-backed local-dev app with no production deployment
yet. If the schema needs to evolve after real data exists, introduce Alembic
at that point rather than before it's needed.

Seeding (`app/database/seed.py`) is idempotent: it only seeds if the demo
traveler doesn't already exist. Each trip has a dedicated `build_*_trip`
function that fully (re)creates that trip's nodes/edges/bookings; `reset_trip`
calls the same builder again, which is what gives "Reset" a genuinely clean
restore rather than trying to patch mutated rows back to their original
values.

## Frontend integration

`src/services/api.ts` is a thin `fetch` wrapper (timeout + JSON error
extraction) with one function per backend endpoint, returning the same
TypeScript interfaces already defined in `src/types/index.ts` (extended
additively - see the "Additive backend-computed explainability fields" comment
in that file - nothing existing was removed or renamed).

`src/store/AppContext.tsx` is unchanged in shape (still a single
`useReducer` + context, still exposes the same phase machine) but every
action now calls the backend instead of reading `mockData.ts`. The one
architectural change: previously `App.tsx` kept a *second*, independent timer
array for Demo Mode alongside `AppContext`'s cascade timers. There is now a
single timer registry inside `AppContext` (`timersRef` + a `sequenceTokenRef`
cancellation token), and Demo Mode is just a scripted sequence of `await`s
over the same `triggerDisruption` / `applyRecoveryPlan` functions a manual
click uses. An `isBusy` guard means starting a new disruption while one is
already in flight (manually or via Demo Mode) is a no-op, so the two paths
can never race.

## Providers

`app/providers/base.py` defines `FlightProvider` / `HotelProvider` /
`ActivityProvider` / `TransferProvider` interfaces; `RecoveryEngine` depends
only on these, not on any concrete implementation. The mock implementations
(`mock_*_provider.py`) hold small hardcoded catalogues of realistic
alternatives for the seeded trips. Swapping in a real provider later means
implementing these same four interfaces - see `FUTURE_ROADMAP.md`.
