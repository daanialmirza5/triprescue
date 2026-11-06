# SafarSathi — Implementation Checklist

Living tracking document. Every item below traces back to the final PRD, TRD, or Flow doc (v3.0, 27 Sep 2026), the QA walkthrough, the punch-list UX pass, or the HackCelestial 3.0 mandatory addendum. Status reflects **verified code inspection**, not claims — update the checkbox and the note together as work lands, don't just check the box.

Legend: `[x]` verified done · `[~]` partial/in progress (see note) · `[ ]` not started

> **Audit pass — 27 Sep 2026 (second).** Re-verified against the code on `main` (bf60e3f) plus the fixes in this pass, and against the live deployments (Vercel + Render). Results:
> - `pytest app/tests/ -q` → **405 passed, 4 skipped** (skips need a reachable Postgres).
> - `npx vitest run` → **154 passed** across 30 files; `npm run typecheck` clean, `npm run lint` 0 errors (7 pre-existing fast-refresh warnings), `npm run build` passes.
> - End-to-end API smoke run (~1,700 requests: all 10 disruption types × every booking × 3 seeded trips, recovery generate/apply, repeat disruption, Digital Twin simulate/apply, assistant, extraction): **0 server errors** after the fixes below; recovery rankings and twin simulations were identical across repeated runs; simulate never mutated the live trip.
>
> Commit bf60e3f had deleted the test suites, `backend/scripts/` and the offline demo, but left imports of the demo services behind — **that broke the Vercel build**. This pass finished the offline-demo removal, restored the tests and scripts from cd1b760, and fixed the bugs listed in §0.

---

## 0. Bugs found and fixed in the 27 Sep audit

- [x] **Vercel build failure**: `api.ts` and `WeatherScenarioSliders.tsx` imported the deleted `services/demoBackend.ts` / `demoTwin.ts`, and `App.tsx` used `WifiOff` without importing it. Offline-demo branches removed from `api.ts`/`AuthContext.tsx`/`TopBar.tsx`; a browser that had stored the old demo mode is migrated to live sign-in; `severityOf` moved to `lib/digitalTwin.ts` (mirrors the backend formula).
- [x] **`GET /api/twin/state` always returned 500** (read `digital_twin_service._simulations`, which doesn't exist — the store is `_store`). Confirmed failing on the live Render deployment. Fixed; regression test `test_twin_state_counts_cached_simulations`.
- [x] Open-Meteo per-node request sent `forecast_days` alongside explicit `start_date`/`end_date` (redundant, and a risk of the request being rejected). Removed.
- [x] `config.py` declared `geocoding_request_timeout_seconds` and `geocoding_contact` twice. Deduplicated.
- [x] Risk-prediction docstring said only RECOVERED trips are skipped; the code also skips DISRUPTED ones. Docstring corrected.
- [x] Stale "Explore Offline Demo" copy in the demo-unavailable error, README and DEPLOYMENT.md. Updated.

## 1. Core Engines & Data Model (PRD §4.1–4.4, TRD §2–4)

- [x] Itinerary modeled as a typed dependency graph (nodes + edges, hard/soft, buffer minutes)
- [x] Interactive dependency graph view for the traveller (React Flow, behind a "Why?" toggle)
- [x] 8 disruption types across 4 booking categories — the enum now has 10 (`airport-closure`, `weather-disruption` added); all 10 exercised in the smoke run
- [x] Propagation engine: direct + full-graph cascading impact recompute per disruption event
- [x] Continuous proactive buffer-based connection/schedule risk scoring (independent of disruption trigger)
- [x] Recovery engine generates multiple ranked, feasible candidate plans per disruption
- [x] Each candidate carries cost delta, time impact, refund recovered, feasibility, residual risk
- [x] Scoring engine: traveller preferences drive a weighted multi-criteria ranking, applied uniformly across disruption types
- [x] Financial/refund engine computes trip-wide exposure and per-candidate refund recovered
- [x] Comparison UI: cost/time/comfort/bookings-preserved shown per candidate, score-breakdown bars expand inline
- [x] Selecting a plan persists its actions onto the trip's nodes; itinerary updates in place — smoke run: 99 top-ranked feasible plans applied, none left a booking broken/cancelled
- [x] Explicit human confirmation required before any booking change applies (Recovery Center modal, assistant `propose_apply_recovery` only proposes)
- [x] Repeated/mid-trip disruption support (`latest_unresolved()`); smoke run disrupts again after every applied recovery
- [x] Determinism: identical input always produces identical propagation/risk/ranking output — verified by regenerating every option set twice
- [x] Weather modeled as a first-class disruption type (`WEATHER_DISRUPTION`, alembic migration `7e91a2c4b5d6`)

## 2. Live Weather → Risk Score (TRD §3.1.1)

- [~] `app/providers/weather_provider.py`: Open-Meteo call, 10-min cache per (0.01°, hour). **Corrections to the old note:** per-request timeout is 3 s (`WEATHER_REQUEST_TIMEOUT_SECONDS`) with a 4 s total budget, not 1.5 s; the cache key is 0.01°, not 0.1°; and `get_snapshot()` *can* raise — `risk_service` catches every failure and uses the heuristic, so the risk endpoint never fails. **Live finding:** on 27 Sep both this dev machine and the Render deployment were getting Open-Meteo's "daily API request limit exceeded" (`/api/weather` answered `"source": "fallback"`), so weather shown in a demo may be the deterministic fallback, not live. It is labelled as such.
- [x] `_blend_live_weather()` in `risk_service.py` blends live severity into `weather_risk`, capped at ±20 from the time-of-day heuristic
- [x] `WEATHER_RISK_ENABLED` feature flag (default true)
- [x] Test suite forces the flag off via an autouse `conftest.py` fixture — no network dependency
- [x] `.env.example` documents the setting
- [x] Framed in the UI as the Digital Twin's environmental input (§7 A1)

## 3. Recovery Coordination (PRD §4.3, TRD §3.2/§4)

- [x] Non-flight disruptions (`_single_rebook_candidates`) chain into `_resolve_activity_conflicts` and `_rebook_broken_downstream` like the flight path — covered by tests and by the smoke run across all hotel/transfer/activity nodes
- [x] Provider timeout/empty simulation in all 4 mock providers, caught into an explicit UNAVAILABLE plan (`test_provider_failures.py`)

## 4. Frontend Punch List (TRD §5)

> Several notes in the previous version named components that don't exist in this codebase (`SathiPage`, `RiskIntelligence.tsx`, `PageHeader`, `MorePage`, `ActivityPage`). The current equivalents are `AssistantPage` (+ `components/ai/AssistantParts.tsx` `ActionCard`), `LiveUpdatesPage` (contains `LoadingRisk`), and `PageHero` + `PageContext` `Breadcrumbs`. Items are re-stated against the real files.

- [~] Dead components removed — `MapView`, `TripDetail`, `LiveMonitor`, `RecoveryCard`, `RecoveryComparison`, `AIAssistant` are gone, but **`BookingsPage.tsx` exists and is routed** (`#/bookings`), so it was kept deliberately, not removed
- [~] Old color classes — no `accent-*`/`electric-*` remain, but `ink-*` (`text-ink-muted` etc.) is the current design token set, and `tailwind.config.js` defines a `glow` box-shadow used by `shadow-glow`. If the intent was "none of the old tokens", these two remain
- [x] Unified AI surface: `✦ SAFARSATHI INSIGHT` + `.ai-surface` shared across Dashboard, Impact panel, Recovery and Assistant
- [x] Staged cascade animation in `ImpactAnalysisPanel.tsx` (`animate-cascade`), dependency graph behind "Why? Show dependency view"; `CountUp` used once
- [x] `LoadingRisk` staged loader (in `LiveUpdatesPage.tsx`)
- [x] Assistant Ask/Act split: inline `ActionCard` + confirm-before-apply
- [x] Recovery Center score-breakdown bars expand inline (`safar-blue` ring)
- [x] Breadcrumbs (`PageContext.tsx` `Breadcrumbs`, `aria-label="Breadcrumb"`) via `PageHero`
- [~] Journey map — the map is **Leaflet** with Esri World Imagery tiles and live pins (`RouteMap`, `JourneyRoute`, `DiscoveryMap`), not an OpenStreetMap iframe as previously noted
- [x] Live weather from one shared source
- [x] `MetricCard.tsx` used (Dashboard, Claims)
- [x] Confirm modal (`components/ui/Modal.tsx`): `role="dialog"`, `aria-modal`, labelled/described, focus managed
- [~] Keyboard-navigation/focus-visible audit — **first pass done 27 Sep**: automated sweep for clickable non-interactive elements and unlabeled controls. Fixed: Live Updates list rows now have a focusable button; Settings read-only fields are label-associated, preference sliders have accessible names, toggles are `role="switch"` with `aria-checked` and focus rings; disruption report textarea labelled. Not yet done: a manual screen-reader + Tab-order walkthrough of every page

## 5. The 12 Handwritten Limitations

- [x] 1. Limited whole-trip dependency analysis — solved (core graph engine)
- [x] 2. No transparent dependency graph for travellers — solved (React Flow graph view)
- [x] 3. Alternative booking ≠ complete recovery plan — solved
- [x] 4. Limited coordinated recovery across flight+hotel+transfer+activities — solved (§3)
- [x] 5. Limited financial exposure calc across all bookings — solved
- [~] 6. Dependency on human intervention for booking changes — deliberate by design (trust); no real booking API to act on
- [x] 7. Flight-only focus vs. whole ecosystem — solved (§3)
- [x] 8. Limited proactive prediction before disruption occurs — solved: background `risk_prediction_loop` (§6). **Off by default** — set `RISK_PREDICTION_ENABLED=true` on Render to have it run; the same scan is available on demand via `POST /api/trips/{id}/risk/poll-once`
- [x] 9. Repeated disruptions in same trip — solved
- [~] 10. Weather/airport/traffic integration — weather scored (§2; see the Open-Meteo quota note), airport closure is a disruption type, live traffic signals still absent
- [x] 11. Reproducible/deterministic recovery — solved and re-verified
- [x] 12. Graceful recovery when provider data unavailable — solved (§3)

## 6. Intelligence Layer (PRD §4.5)

- [~] Generative narratives on the Nugen-aligned model — **Digital Twin** cascade explanation + mitigation (`nugen_service.explain_weather_cascade` / `mitigation_guidance`) and, as of 27 Sep, the **Recovery Center ranking narrative** (`nugen_service.explain_recovery_ranking`, tried before Claude, UI tag `· Nugen`; tests `test_recovery_narrative_uses_nugen_when_configured` / `..._falls_back_when_nugen_fails`). Still templated/Claude: the per-disruption "SAFARSATHI INSIGHT" summary generated inside the disruption request, left off Nugen on purpose so a slow Nugen call (12 s timeout) can't delay reporting a disruption
- [x] Conversational assistant with trip-state grounding and tool-calling (Anthropic SDK). **Live finding:** the Render deployment answered with `"source": "deterministic"`, so either `ANTHROPIC_API_KEY` isn't set there or the call is failing (SDK pinned at `anthropic==0.34.2`, model `claude-sonnet-4-5`) — check the Render logs for "LLM call failed"
- [x] Assistant tool-calling (`get_impact`, `list_recovery_options`, `propose_apply_recovery`; the last only proposes)
- [x] Natural-language disruption reporting — typed **and now spoken**: mic button in `DisruptionModal.tsx` (`hooks/useSpeechInput.ts`, Web Speech API, `en-IN`), hidden in browsers without support (e.g. Firefox); transcript lands in the text box for review before "Analyze". Tests cover supported/unsupported/blocked-mic cases
- [x] Proactive prediction job (`risk_prediction_service.py`, flag default `false`)

## 7. Mandatory Addendum A — Weather-Driven Digital Twin (HackCelestial 3.0)

- [x] A1. Live weather as the twin's input (`DigitalTwinPage.tsx`, `WeatherScenarioSliders.tsx`) — see §2 note about the Open-Meteo quota on demo day
- [x] A2. Geospatial map with weather + simulated impact propagation (`DigitalTwinMapOverlay.tsx`)
- [x] A3. Real-world social signals (`mastodon_signal_provider.py`, labelled simulated fallback) — live endpoint returned signals on 27 Sep
- [x] A4. Interactive what-if simulation: read-only `simulate` + guarded `apply` — verified live on Render and in the smoke run (38 plans applied across trips/scenarios)

## 8. Mandatory Addendum B — Nugen Intelligence Integration (HackCelestial 3.0)

- [ ] **Nugen account + working API key tested with one live inference call.** The endpoint path the client uses exists (`POST https://api.nugen.in/api/v3/inference/chat/completions` answers `403 {"detail":"Not authenticated"}` without a key), but no call has succeeded with a real key yet
- [x] Domain-specific dataset — **60 samples** (47 with cascades, 13 no-impact negatives; 20 scenarios × 3 seeded trips), regenerated by `backend/scripts/export_nugen_dataset.py` from the real Digital Twin engine
- [ ] Alignment workflow run against a real Nugen account (`python scripts/export_nugen_dataset.py --upload` with `NUGEN_API_KEY`), then deploy and set `NUGEN_MODEL_ID`
- [x] `app/core/nugen_client.py` inference client — never raises, timeout, 429 → 60 s cool-down, `None` on any failure
- [~] Narratives routed through the aligned model — Digital Twin + Recovery Center ranking (see §6); confirm with organizers whether this coverage satisfies the addendum
- [x] Pipeline documented for judges — README §16 "Nugen Intelligence pipeline" (diagram + the four steps)
- [ ] Exact request/response payloads confirmed against a real account — same root cause as the API-key item

## 9. Documentation & Presentation Hygiene

- [x] PRD, TRD, and Flow docs consolidated to a single current version
- [ ] Commit a `docs/` folder with the PRD/TRD/Flow docs (they exist only as external deliverables)
- [x] README test results match a real run: 405 passed / 4 skipped backend, 154 passed frontend (27 Sep)
- [x] Test suites back in the repo (they were deleted in bf60e3f): `backend/app/tests/`, frontend `*.test.ts(x)`, `src/test/setup.ts`. The two offline-demo test files were dropped with the demo; the page tests that used the demo as a fake server now use fixtures captured from the real backend (`src/test/fixtures/ladakh.json`, `backend/scripts/make_frontend_fixtures.py`)
- [ ] QA walkthrough document's Test Execution Summary filled in

---

### How to use this file
Check an item only after re-verifying it in the running code (grep/read the file, or re-run the relevant test), not from memory of having planned it. When you close an item, update its note in place rather than deleting the line, so this stays a record of what changed and when.

### What's genuinely still open
1. **Get a Nugen API key and make one live call** (§8) — then run `--upload` for the alignment, deploy, and set `NUGEN_API_KEY`/`NUGEN_MODEL_ID` on Render.
2. **Check the assistant's Anthropic key on Render** (§6) — the deployed assistant is answering deterministically.
3. **Decide** with organizers whether Nugen on the Digital Twin + Recovery narrative satisfies Addendum B (§8).
4. **Open-Meteo quota** (§2) — live weather was falling back on Render on 27 Sep; expect the labelled fallback during the demo unless the quota resets or a paid key is used.
5. **Turn on `RISK_PREDICTION_ENABLED=true`** on Render if you want proactive alerts running in the demo (§5/§6).
6. Manual screen-reader + Tab-order walkthrough (§4); `docs/` folder and QA summary (§9).
