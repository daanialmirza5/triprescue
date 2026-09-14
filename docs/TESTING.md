# Testing

## Running everything

```powershell
# Backend (from backend/)
.\.venv\Scripts\python.exe -m pytest app/tests/ -q

# Frontend (from repo root)
npm run typecheck
npm run lint
npm test          # vitest run
npm run build
```

All four frontend commands and the backend pytest run are expected to pass
with zero errors on `main` at all times - none of them are optional/"known
failing."

## Backend suite (`backend/app/tests/`, 124 tests)

Pure-engine unit tests, run with no database and no HTTP layer - they
construct `EngineNode`/`EngineEdge` fixtures directly:

- `test_graph_engine.py` - node/edge CRUD, upstream/downstream traversal,
  cycle detection, topological ordering.
- `test_propagation_engine.py` - the buffer-vs-requirement math that decides
  healthy/delayed/at-risk/broken/cancelled, including the hero 3-hour-delay
  case and the "uncertainty window" heuristic for far-future nodes.
- `test_recovery_engine.py` - candidate generation, feasibility filtering,
  determinism (same inputs → same ranking), preference sensitivity (cost vs.
  speed extremes reorder the ranking), and the activity-conflict
  fixed-point-loop regression test (`test_activity_conflict_resolution_converges_on_chained_conflicts`).
- `test_risk_engine.py`, `test_financial_engine.py`, `test_refund_engine.py`
  - the standalone formulas (connection/exposure risk, financial exposure
  summary, refund arithmetic against cancellation-deadline rules).

HTTP-layer tests (`backend/app/tests/conftest.py`'s `client` fixture: a
`TestClient` against an in-memory SQLite DB, seeded fresh per test):

- `test_api_trip.py` - trip listing/detail/graph/risks/bookings/
  activity/notifications/preferences endpoints.
- `test_api_disruption_and_recovery.py` - trigger disruption, the
  `/simulate` dry-run preview (asserts real computed figures, not the
  placeholder zeros it used to return), generate/apply recovery, reset.
- `test_hero_scenario.py` - the full canonical walkthrough end-to-end
  through the real HTTP API (healthy → 3h delay → broken connection →
  recovery options → preference-driven re-ranking → apply → verify
  before/after → AI assistant → reset → repeat), plus
  `test_recovered_trip_remains_re_disruptable_without_a_reset` (disrupt →
  recover → apply → **without resetting** → disrupt again, and recovery
  generation still works on top of that).
- `test_auth.py` - register/login/demo-account/`/me`, trip-ownership
  isolation on read routes (a new traveler starts with zero trips and gets a
  404 on a trip they don't own), and trip-ownership isolation on every
  mutation route too -
  `test_a_new_traveler_cannot_disrupt_recover_or_ask_about_a_trip_they_do_not_own`
  asserts a non-owner gets a 404 from `/disruptions`, `/simulate`,
  `/recovery-options/generate`, `/recovery/apply`, and `/api/assistant`,
  then confirms the actual owner can still do all five. Also covers token
  expiry, a tampered/garbage token being rejected with 401 (not silently
  downgraded to the demo traveler), and login/register rate limiting
  (excessive attempts get 429; ordinary usage never does).
- `test_api_assistant.py` - the AI assistant endpoint, including a
  regression test for a `score_breakdown` dict-vs-attribute crash on a "why"
  question asked before any recovery has been applied.
- `test_graph_scale_and_benchmark.py` - `GraphEngine` on large/complex
  synthetic DAGs (diamond structures, 500-node topologies, cycle-detection
  edge cases) and the itinerary-graph performance benchmark
  (`app/engines/benchmark.py`).
- `test_config.py` - `Settings.resolved_database_url` (Postgres connection
  strings normalized to the psycopg3 driver; SQLite passed through
  unchanged), `Settings.enforce_secure_auth_secret` (refuses to run with
  the default `AUTH_SECRET` outside `environment="development"`), and
  `engine_kwargs_for` (SQLite gets no pool tuning at all - its pool classes
  don't accept those kwargs; Postgres gets `pool_pre_ping` plus the
  configured pool size/overflow/recycle settings).
- `test_startup.py` - the app's actual startup path (not just the
  `Settings` method) refuses to boot with an insecure `AUTH_SECRET` outside
  development.
- `test_migrations.py` - runs `alembic upgrade head`/`downgrade base` as a
  real subprocess against a throwaway SQLite file (the same way a
  production deploy would invoke it) and asserts the resulting table set
  matches `Base.metadata` exactly, that downgrade removes every app table,
  and that re-running `upgrade head` against an already-migrated database
  is a safe no-op.
- `test_postgres_integration.py` - the same kind of checks, but against a
  **real PostgreSQL database**, not SQLite: registration/login/token
  round-trip, trip creation and retrieval, cross-user trip isolation, and
  transaction rollback on a mid-request failure, all through the actual
  HTTP API. This is what caught a genuine Postgres/SQLite divergence during
  development (Postgres' native `ENUM` types aren't dropped by `DROP TABLE`
  alone, which broke a downgrade-then-upgrade cycle that worked fine on
  SQLite) - fixed in `02f207f86d70_initial_schema.py`'s `downgrade()`.
  Skips automatically (not a failure) if no Postgres is reachable via
  `POSTGRES_TEST_URL`/`DATABASE_URL` - see `docs/DEPLOYMENT.md`'s "Local
  development database" section for starting the local Docker instance
  this suite is meant to run against.

### What's deliberately NOT covered

- No test exercises a real Anthropic API call (`_llm_answer`) - the test
  environment never sets `ANTHROPIC_API_KEY`, so the assistant always
  exercises the deterministic path; that's intentional (tests must not
  depend on a live external API or cost money to run), but it does mean the
  actual LLM integration is only manually verified.

## Frontend suite (`src/**/*.test.{ts,tsx}`, Vitest + React Testing Library, 65 tests)

- `src/lib/status.test.ts`, `src/lib/utils.test.ts`,
  `src/lib/graphLayout.test.ts` - pure functions (currency/duration
  formatting, risk color thresholds, the class-name helper, the layered
  auto-layout algorithm's layering/spacing/cycle-safety rules).
- `src/components/ui/{ScoreRing,RiskBadge,StatusBadge}.test.tsx` - the
  presentational components render the right label/color/threshold for a
  given prop.
- `src/store/AppContext.test.tsx` - integration tests against a mocked
  `services/api.ts`: initial load, load-failure error surfacing, switching
  trips resets disruption/recovery state, the full
  disruption → recovery → apply flow, apply-failure leaves state
  untouched and rethrows, the preferences round-trip (loads what the
  backend persisted rather than always resetting to defaults), not
  displaying the seeded demo trip to a user who owns no trips, trip
  creation becoming the active trip, and adding a flight wholesale-replacing
  trip state from the backend response.
- `src/components/trip/CreateTripModal.test.tsx`,
  `src/components/trip/AddFlightModal.test.tsx` - the two interactive
  itinerary-mutation forms: accessible labelled fields, field-level
  validation, a successful submission notifying the parent, an honest error
  message with the form re-enabled on API failure, and the submit button
  disabled while a request is in flight.

### What's deliberately NOT covered by this suite

Full page components (`Overview`, `TripDetail`, `RiskIntelligence`,
`BookingsPage`, ...), the React Flow graph rendering, and the AI Assistant
panel are validated via a live Playwright-driven browser session against a
running backend instead of component tests - see `docs/DEMO_GUIDE.md`. If a
regression shows up there, the fix belongs in the relevant page/component,
and the AppContext-level flow it depends on should already be covered above.

## Adding a test

- **New engine logic** → a focused unit test in the matching
  `test_*_engine.py`, constructing `EngineNode`/`EngineEdge` fixtures
  directly (see `backend/app/tests/fixtures.py` for the shared Ladakh
  fixture, or build a small custom graph inline for a specific edge case
  the way `test_recovery_engine.py`'s chained-conflict test does).
- **New API behavior** → `test_api_*.py` via the `client` fixture, asserting
  actual response bodies, not just status codes.
- **New pure frontend logic/component** → co-locate `X.test.ts(x)` next to
  `X.ts(x)`.
- **New AppContext flow** → extend `AppContext.test.tsx`, mocking only the
  `services/api.ts` functions that flow touches.
