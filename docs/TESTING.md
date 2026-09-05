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

## Backend suite (`backend/app/tests/`, 65 tests)

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
- `test_auth.py` - register/login/demo-account/`/me`, and trip-ownership
  isolation (a new traveler starts with zero trips and gets a 404 on a trip
  they don't own).

### What's deliberately NOT covered

- Disruption/recovery/assistant mutation routes don't check trip ownership
  yet (see `docs/FUTURE_ROADMAP.md`), so there's no test asserting they do.
- No test exercises a real Anthropic API call (`_llm_answer`) - the test
  environment never sets `ANTHROPIC_API_KEY`, so the assistant always
  exercises the deterministic path; that's intentional (tests must not
  depend on a live external API or cost money to run), but it does mean the
  actual LLM integration is only manually verified.

## Frontend suite (`src/**/*.test.{ts,tsx}`, Vitest + React Testing Library)

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
  untouched and rethrows, and the preferences round-trip (loads what the
  backend persisted rather than always resetting to defaults).

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
