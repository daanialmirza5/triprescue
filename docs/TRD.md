# Technical Requirements Document — TripRescue

Companion to `PRD.md`. States *how* the product requirements are met
technically; defers deep detail to the specialist docs it links to rather
than duplicating them.

## 1. System overview

Two independently runnable services:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Flow.
  Preserved from the original Bolt-generated scaffold; now a thin
  presentation/interaction layer with no authoritative business logic.
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy 2.0 + SQLite + Pydantic 2.
  Owns all authoritative state and every calculation.

They communicate exclusively over a REST/JSON HTTP API (`docs/API_SPEC.md`).
There is no shared code, database, or process between them; the frontend
holds no business logic beyond staggering the reveal of backend-computed
results for animation.

Full layering and module responsibilities: `docs/ARCHITECTURE.md`.

## 2. Technical requirements by concern

### 2.1 Domain logic placement (hard requirement)

All business logic — graph structure, disruption propagation, recovery
search, scoring, risk heuristics, financial/refund math — must live in
framework-free Python modules (`backend/app/engines/`) that:

- Take and return plain dataclasses, never SQLAlchemy models or Pydantic
  schemas.
- Have zero imports of `fastapi`, `sqlalchemy`, or `starlette`.
- Are unit-testable without a database, an HTTP server, or network I/O.

Routes (`app/api/routes/`) may only: parse the request, call a service
function, and translate the result/exception into an HTTP response. Services
(`app/services/`) are the only layer permitted to combine engines with
database reads/writes. This separation is what makes the algorithm claims in
the PRD ("independently determine", "not hardcoded") auditable — see
`docs/ALGORITHM_SPEC.md` for the algorithms themselves.

### 2.2 Determinism

Every engine computation must be a pure function of its inputs — no wall-clock
`datetime.now()`/`utcnow()` inside propagation or recovery logic, no random
number generation without a fixed seed (provider "reliability" scores are a
stable hash of the provider name, not `random()`). All itinerary timestamps
are itinerary-relative (the trip's own calendar), not real time, specifically
so that running the same disruption twice against the same itinerary state
produces identical results. This is required for the hero end-to-end test to
be meaningful and for Demo Mode to be exactly repeatable.

### 2.3 Data persistence

- SQLite via SQLAlchemy ORM; every entity (nodes, edges, bookings,
  disruptions, cascade steps, recovery plans/actions, risk snapshots,
  activity, notifications) is a normalized table with foreign keys — no
  itinerary structure may be stored as an opaque JSON blob. Full schema:
  `docs/DATA_MODEL.md`.
- No migration framework at this stage (`Base.metadata.create_all()` on
  startup is sufficient pre-production); introduce Alembic when there is
  real user data to preserve across a schema change.
- Reset is implemented by re-running the same seed-construction function per
  trip, not by replaying an undo log — this must remain true so that "Reset"
  is provably identical to first boot.

### 2.4 API contract

- All endpoints under `/api/`, JSON in and out, camelCase field names (a
  `CamelModel` Pydantic base with an alias generator, so backend Python stays
  snake_case while the wire format matches the frontend's existing
  TypeScript types without translation).
- Every error response is `{"detail": "<message>"}` with an appropriate HTTP
  status; unhandled exceptions are caught by a global handler and never leak
  a stack trace to the client. Full contract: `docs/API_SPEC.md`.
- CORS restricted to the configured frontend origin(s) via
  `CORS_ORIGINS` (backend `.env`), not wildcarded.

### 2.5 Frontend integration constraints

- `src/services/api.ts` is the *only* module allowed to call `fetch`; every
  network call goes through it, with a request timeout (default 12s) and
  structured error extraction (`ApiError` with the backend's `detail`
  message).
- `src/types/index.ts` — the pre-existing domain types — must be extended
  only additively (new optional fields); no existing field may be renamed or
  removed, so every component written against the original Bolt scaffold
  keeps compiling and rendering unchanged.
- `src/data/mockData.ts` may only be imported for: (a) the initial
  placeholder render before the first backend fetch resolves, (b) static UI
  configuration that isn't itinerary state (disruption type labels, suggested
  AI prompts, hand-authored graph node layout positions), and (c) test
  fixtures. No component may treat it as a source of live/authoritative trip
  state.
- Exactly one timer/cancellation mechanism governs disruption-cascade
  animation and Demo Mode (`AppContext`'s `timersRef` +
  `sequenceTokenRef`); a manual disruption trigger and a running Demo Mode
  sequence must not be able to race — enforced via an `isBusy` guard plus
  cascade-token invalidation, not by disabling UI affordances alone.

### 2.6 AI assistant

- Must answer only from data actually present in the current trip/disruption/
  recovery state passed to it — no invented bookings, prices, or times. When
  an `ANTHROPIC_API_KEY` is configured, real Claude calls are grounded with
  that data via the system prompt; when it isn't (or the call fails for any
  reason), a deterministic keyword-based responder answers from the same
  data. The product must be fully functional with zero AI configuration.

### 2.7 Authentication

- Passwords are never stored in plaintext (salted PBKDF2-HMAC-SHA256,
  200,000 iterations). Session tokens are HMAC-signed, not a general-purpose
  JWT library, to keep the dependency footprint minimal for a local-dev
  feature. No endpoint currently *requires* a token — see
  `docs/FUTURE_ROADMAP.md` for what wiring a real login flow would involve.

### 2.8 Configuration and secrets

- Frontend: `VITE_API_BASE_URL` only, via `.env.local` — anything prefixed
  `VITE_` is bundled into public client JS, so no secret may ever use that
  prefix.
- Backend: `DATABASE_URL`, `CORS_ORIGINS`, `ANTHROPIC_API_KEY` (optional),
  `ANTHROPIC_MODEL`, `AUTH_SECRET`, via `backend/.env` (gitignored;
  `.env.example` documents the shape with no real values).
- The pre-existing repo-root `.env` (unrelated third-party deployment
  credentials, not part of this application) is never read by either the
  frontend build or the backend, and is left untouched.

## 3. Non-functional requirements

| Requirement | Target / approach |
|---|---|
| Explainability | Every risk/score/financial number returned by the API carries a human-readable reason; no bare statistic. |
| Test coverage | Every engine has direct unit tests; every mutating endpoint has an integration test; the full hero scenario has a dedicated end-to-end test driven through the HTTP API. |
| Startup cost | Cold start (fresh SQLite file) must seed three full trips and be ready to serve in well under a second — verified informally via local runs. |
| Error resilience | Frontend must never show a blank screen on backend unavailability — a visible retry banner instead — and no user action (trigger, apply, ask assistant) may throw an unhandled promise rejection. |
| Graph scale | Algorithms are O(V+E) (adjacency-list BFS/DFS/topological sort), appropriate for itineraries of tens of nodes; not designed or tested for graphs at a different order of magnitude. |

## 4. Testing strategy

- **Unit** (`backend/app/tests/test_*_engine.py`): each engine in isolation,
  using plain dataclass fixtures (`app/tests/fixtures.py`) built directly
  against the Ladakh trip's real numbers — no database.
- **Integration** (`test_api_trip.py`, `test_api_disruption_and_recovery.py`):
  FastAPI `TestClient` against an in-memory SQLite database (`StaticPool`,
  shared across the per-request sessions a real app would open), exercising
  actual HTTP requests/responses end to end through the service and
  repository layers.
- **End-to-end** (`test_hero_scenario.py`): the full spec'd scenario —
  healthy trip → disrupt → verify cascade → generate recovery → shift
  preferences → verify re-ranking → apply → verify re-propagation and score
  changes → reset → repeat — as one continuous test against real computed
  values, not mocked ones.
- **Frontend**: no committed automated suite yet (see
  `docs/FUTURE_ROADMAP.md`); validated via `tsc --noEmit`, ESLint, a
  production `vite build`, and a live Playwright-driven browser session
  against the running app.

Run commands: `docs/README.md` → "Running tests".

## 5. Deployment / environment requirements

- Backend requires Python 3.11 or 3.12 (3.13+ may lack a prebuilt
  `pydantic-core` wheel on some platforms; this repo's dev venv uses 3.12
  specifically because the machine's default Python was 3.14).
- No containerization or cloud deployment target is defined yet — both
  services are specified for local development only. A production
  deployment would need, at minimum: a non-SQLite database (or accepted
  single-writer SQLite constraints), Alembic migrations, a real
  `AUTH_SECRET`/session strategy, and HTTPS termination in front of both
  services.

## 6. Dependencies

Backend: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic` /
`pydantic-settings`, `python-dotenv`, `httpx`, `anthropic` (optional runtime
use), `pytest` / `pytest-asyncio` (dev). Frontend: unchanged from the
original Bolt scaffold (`react`, `reactflow`, `lucide-react`,
`@supabase/supabase-js` and `framer-motion` remain installed but unused —
see the original audit and `FUTURE_ROADMAP.md` for why they weren't removed
without explicit instruction to do so).
