# TripRescue — Complete Build Summary

**What it is:** an Intelligent Travel Disruption Recovery Engine. Not a booking CRUD app — the core loop is: something breaks → determine exactly what breaks and why → generate feasible recovery options → rank them by the traveler's own priorities → apply one → recalculate the whole itinerary → keep it re-disruptable.

This document summarizes everything built across this project: the full-stack application, the hackathon presentation deck, and the production-readiness hardening pass.

---

## 1. Architecture

```
Frontend (React/TS/Tailwind/React Flow)
        ↓ REST/JSON
Backend API (FastAPI)
        ↓
Domain Engines (graph, propagation, recovery, scoring, risk, financial, refund)
        ↓
Database (SQLite via SQLAlchemy)
```

The frontend never computes an authoritative risk score, recovery ranking, financial exposure, or trip health — it's a view over backend-computed state. All business logic lives in the engines.

## 2. Backend (`backend/`)

**Stack:** FastAPI, SQLAlchemy, SQLite, Pydantic, PBKDF2-HMAC-SHA256 password hashing, HMAC-signed session tokens.

**Domain engines** (`backend/app/engines/`), each independently unit-tested, framework-free, and deterministic (zero randomness in any business calculation):
- `graph_engine.py` — canonical itinerary dependency graph: add/remove node/edge, up/downstream traversal, cycle detection, topological ordering.
- `propagation_engine.py` — computes what actually breaks from a disruption via real buffer-time math (available vs. required minutes per edge), not hardcoded cascades. Produces healthy/delayed/at-risk/broken/cancelled per node with a real reason string.
- `recovery_engine.py` — searches provider alternatives, rebooks + re-propagates to test each candidate, rejects infeasible ones, supports multi-action coordinated plans (e.g. rebooking a flight that also requires rescheduling a downstream activity). Activity-vs-activity conflict resolution is a fixed-point loop (re-scans until stable, capped at 5 passes) so a reschedule that creates a *new* conflict elsewhere gets caught.
- `scoring_engine.py` — weighted multi-criteria ranking (cost/speed/preservation/comfort/risk) driven by traveler preference sliders.
- `risk_engine.py`, `financial_engine.py`, `refund_engine.py` — connection/exposure risk, financial exposure, refund arithmetic (all formula-driven from real booking data).
- `itinerary_engine.py` — orchestrates the above into the trip health score.

**API** (`backend/app/api/routes/`): trips (list/detail/graph/risks/bookings/activity/notifications/preferences — full CRUD on preferences including the previously-missing GET), disruptions (trigger/simulate-preview/propagate), recovery (generate/apply), assistant, auth (register/login/demo-account/me), health.

**Auth:** real login/register/demo-account, PBKDF2 password hashing, HMAC session tokens. Every trip-scoped endpoint — both reads *and* mutations (trigger disruption, simulate, generate/apply recovery, ask assistant) — resolves the caller and enforces trip ownership; a trip you don't own 404s rather than leaking or being disruptable by a stranger. Falls back to the seeded demo traveler when no token is sent, so nothing broke for existing flows.

**AI Assistant:** grounded exclusively in live engine output (current trip/disruption/recovery/risk state passed as structured context) — never invents facts. Deterministic keyword-based responder always available; optional real LLM (Anthropic) layered on top when `ANTHROPIC_API_KEY` is set, with graceful, logged fallback on any LLM failure.

**Tests:** 66 pytest tests — engine unit tests (graph/propagation/recovery/risk/financial/refund), HTTP integration tests, the full hero scenario end-to-end (including re-disruption on an already-recovered trip *without* a reset), and auth/ownership tests (a non-owning traveler is verified blocked from every mutation endpoint, not just reads).

## 3. Frontend (`src/`)

**Stack:** the original React + TypeScript + Tailwind + React Flow UI, preserved visually and structurally, rewired from mock data to the real backend.

**Pages/features, all backend-driven:** Command Center (Overview), My Trips (multi-trip switching), Live Monitor, Recovery Center + Comparison + Before/After, Risk Intelligence, Bookings (filterable), Map (SVG projection from real node lat/lng), Activity Log, Notifications, Settings/Preferences, AI Assistant panel, Demo Mode (runs the exact same API sequence a manual walkthrough would — no separate fake path).

**Auth:** a real login screen (login / register / "Continue as Demo Traveler"), bearer token persisted and attached to every request, real authenticated identity shown in the Sidebar/Settings, working logout.

**Tests:** 44 Vitest + React Testing Library tests — pure-logic units (formatting, risk thresholds, the graph auto-layout algorithm), presentational component tests, and `AppContext` integration tests (load, trip-switch, the full disruption→recovery→apply flow, error handling) against a mocked API layer.

## 4. The hackathon presentation

A 16-slide deck (`HackCelestial 3.0_S4DCoders_TripRescue.pptx`) built directly on the official HackCelestial template — same visual identity, fonts, palette, and structure — with every TripRescue-specific claim sourced strictly from the uploaded PRD/TRD/Project-Flow documents. No fabricated metrics, no forbidden claims (no live booking, no real payments, no production-scale deployment implied). Covers problem → solution → pipeline → hero disruption scenario → impact analysis → recovery generation → personalized ranking → apply & reverify → architecture → innovation → tech stack → comparison → demo → closing.

## 5. Production-readiness pass

A full audit against a 61-section acceptance specification (four parallel research passes across frontend, backend, security/deployment, and determinism/test-coverage), followed by fixing every real finding — not just documenting them. Concrete bugs fixed:

- **`/simulate` disruption-preview endpoint** returned hardcoded `0` for financial exposure, refund exposure, and trip health score — now computed for real via the same engines the live trigger path uses.
- **Traveler preferences never round-tripped** — there was no `GET /preferences` route despite the backend service function existing, so the UI silently reset sliders to defaults on every reload instead of showing what was actually saved. Added the route and fixed the frontend to use it.
- **Risk Intelligence got stuck on its loading skeleton forever** if the risk-analysis fetch failed, instead of showing an error. Fixed, with retry.
- **Hardcoded fake risk figures** (a "What Could Go Wrong?" panel showing static made-up rupee amounts and percentages) replaced with real computed risk-card data — now also genuinely filterable by the Settings risk-threshold sliders, which were previously decorative.
- **Trips / Bookings pages swallowed fetch errors into an empty-looking list**, indistinguishable from a genuinely empty result. Both now show a real error state with retry.
- **Mobile/tablet layout was actually broken**: the sidebar didn't auto-collapse on narrow viewports, squeezing the whole app into an unreadable ~35% sliver of a phone screen. Fixed with a responsive `matchMedia` check; verified with real screenshots at 375px and 768px showing clean layouts.
- **Itinerary graph nodes were hover-only** — meaning full node detail (schedule, risk %, cost, cancellation policy) was completely unreachable on any touch device, since phones/tablets have no hover. Clicking/tapping a node now pins the same detail panel open, staying live through a cascade animation, with a close button.
- **A hardcoded disruption banner** in Recovery Center always displayed "Delhi → Leh connection unavailable / CRITICAL" regardless of the actual active disruption — would show the wrong text for any other scenario. Now reads the real disruption's label and impact level.
- **Trip ownership was only enforced on read endpoints**, not on disrupt/simulate/propagate/generate-recovery/apply-recovery/ask-assistant. Closed — verified live against the running server that a genuinely different, newly-registered traveler gets a real 404 attempting to disrupt someone else's trip.
- Assorted: missing empty states (notification bell, trip switcher), an overly-broad exception handler masking real DB errors as "not found," a silently-swallowed LLM failure (now logged), an insecure-default `AUTH_SECRET` now warned about at startup, a DB-connectivity health check (was a bare `{"status":"ok"}`), removed an unused dependency (`@supabase/supabase-js`) and ~250 lines of dead mock data.

**Documentation added:** `docs/DEPLOYMENT.md` (production startup, environment checklist, what's deliberately not included and why) and `docs/TESTING.md` (full test-suite inventory and how to extend it) — both were missing. README updated with an environment-variable table, Demo Mode section, and deployment pointer.

## 6. Verification — actually run, not assumed

- **Backend:** `pytest app/tests -q` → **66 passed**.
- **Frontend:** `npm run typecheck` (0 errors) · `npm run lint` (0 errors, 4 pre-existing benign warnings) · `npx vitest run` → **44 passed** · `npm run build` (succeeds).
- **Live browser (Playwright), full hero flow:** login → healthy trip → Risk Intelligence → trigger 3h delay → cascade → impact analysis (real ₹ figures, real cascade reasons) → 3 ranked recovery options → preference change reorders them → apply → real AI-assistant answer grounded in actual scores → activity log → reset → Demo Mode run twice → a second disruption triggered on the already-recovered trip without resetting. **Zero console errors, zero page errors, zero failed/5xx requests** across the entire run.
- **Production-style backend startup** (no `--reload`, real `ENVIRONMENT`/`AUTH_SECRET`) verified independently on a scratch port.
- **Responsive check** at 375px and 768px: no horizontal overflow, no console errors, visually confirmed clean layouts.
- **Live security check:** a freshly-registered, non-owning traveler verified blocked (404) from disrupting/recovering/asking-about the demo traveler's trip.

## 7. Known, deliberate limitations

- **No Docker** — assessed and consciously skipped; both halves (a Python venv + uvicorn, a static `dist/` build) run directly without enough real friction to justify container packaging at this size. Reasoning is in `docs/DEPLOYMENT.md`.
- **No real map/travel-provider integration** — mock providers only, by design (no paid dependency for a prototype). The provider interface (`app/providers/base.py`) is the seam for swapping in a real one later.
- **No database migration tooling** — schema changes mean recreating the SQLite file. Fine pre-launch; introduce Alembic once there's real user data worth preserving across a change.
- **Not yet a git repository** — left for you to initialize when ready. One thing to check before a first commit: the repo root's `.env` file contains real (non-placeholder) API credentials for an unrelated tool, not a TripRescue secret — `.gitignore` already excludes it, but confirm that holds before `git add -A`.

---

*Every claim in this document was verified by actually running the relevant command or test — pytest, vitest, tsc, eslint, a real production-mode backend startup, and a real Playwright browser session — not inferred from reading code.*
