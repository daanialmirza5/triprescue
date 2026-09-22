# TripRescue — 8–10 Minute Demo Video: Recording Plan

Status: **planning + script complete; no video recorded.** This environment has no screen-capture or video-export capability — everything here is the executable plan, timed script, scene list, and checklist for *you* to record. See "Environment limitation" at the end of this document.

---

## 1. Accuracy findings (read this before recording)

Verified against the actual repository and a live local run on 2026-09-15. These findings shaped every section of the script — nothing below is a suggestion to "work around," it's why the script is structured the way it is.

1. **Hotel/activity/custom-event creation does not exist in the UI.** Only flights can be added to a trip (`POST /api/trips/{id}/nodes`, hardcoded to `category="flight"` — see `backend/app/schemas/trip.py`). The seeded demo trips (Aisha's Ladakh Expedition, Goa Getaway, Rajasthan Heritage Circuit) already contain hotel/activity/transfer nodes, but those came from the seed script (`backend/app/database/seed.py`), not a live user workflow. **Decision (yours, confirmed):** the script creates a real trip and adds one real flight, then switches to the seeded Ladakh trip to show what a complete connected itinerary looks like — narrated explicitly as seeded example data for that part.
2. **Recovery-engine alternatives are mock data.** `RecoveryEngine` computes real scoring/ranking math against real trip state, but the flight/hotel/activity *alternatives* it offers come from `MockFlightProvider`/`MockHotelProvider`/etc. — hardcoded catalogues, not a live GDS or booking API. The script labels this explicitly, per your own rule 5.
3. **AI Assistant runs the deterministic fallback locally** — `ANTHROPIC_API_KEY` is not set in your local `.env` as of this check, so `/api/assistant` uses the keyword-grounded responder, not a live Anthropic call. Mentioned honestly in the architecture section; not claimed as "live LLM."
4. **Settings page has a stale, hardcoded "Connected Providers" list** (IndiGo, Go First, MakeMyTrip, etc.) that doesn't reflect the actual active trip's data. **Excluded from the recording** — showing it would misrepresent something as live/dynamic when it's static decoration.
5. **Production Supabase is not yet configured** — the last session's work made the backend Postgres/Supabase-*ready* (Docker locally, Alembic migrations verified against real Postgres) but no Supabase project has actually been created yet. The script does not claim "this is running on Supabase in production" — it demos the real, verified local setup (Docker Postgres) and describes Supabase as the documented, tested-but-not-yet-deployed production target.
6. **The deployed GitHub Pages frontend's automated deploy step is missing from CI** (found in an earlier audit this session) — deploying and demoing the live production URL is not reliable to rely on for a timed recording. **Recommendation: record entirely against your local dev environment** (`npm run dev` + `uvicorn`), which is fully in your control and avoids Render free-tier cold-start delays (up to ~50s) that would blow the time budget.
7. **The Add Flight frontend is uncommitted, code-complete, and passes automated tests/typecheck, but has never been live-browser-verified** (a Playwright/browser automation block on this machine prevented it, and manual verification was never completed before other work took priority). **You must do one full rehearsal of the add-flight step before your real take** to confirm it works exactly as scripted — see the Checklist.
8. **The local dev database has leftover test accounts** from earlier sessions, including what looks like your own real account (`daanialmirza@gmail.com`) with a trip named "nn". You've said you'll handle resetting this yourself before recording — see Checklist step 1.
9. **No client-side routing exists** (confirmed: no `react-router-dom`, navigation is local React state) — there are no shareable URLs to show in an address bar. The isolation demo (Simulation 3) is shown by logging in as a second account and confirming Aisha's trip is absent from "My Trips," not by URL manipulation.

---

## 2. Recommended recording setup

- **Environment**: local dev only (`npm run dev` on 5173, `uvicorn app.main:app --reload` on 8000). Do not use the deployed Render/GitHub Pages URLs for this recording.
- **Database**: point the backend at local Docker Postgres, not SQLite, so the architecture section's claims about Postgres are demonstrably true on screen, not just asserted. Steps in the Checklist.
- **Browser**: a clean window/profile, 1920×1080, no extensions visible, bookmarks bar hidden, zoom at 100% (or 110% if text is hard to read on your recording — decide once and keep it consistent).
- **Accounts needed**:
  - The seeded demo account ("Continue as Demo Traveler (Aisha Khan)") — already exists, no setup needed.
  - One **fresh** account you register live on camera in Section 2 (for trip/flight creation).
  - One **second fresh** account, pre-registered *before* recording (not shown being created), used only in Section 8 to prove isolation — registering a second account live would eat time better spent elsewhere.

---

## 3. Scene-by-scene recording breakdown

| # | Timestamp | Scene | Real app state required |
|---|---|---|---|
| 1 | 00:00–00:35 | Landing page, cold open | App loaded, logged out |
| 2 | 00:35–01:15 | Register a new account live; show login screen briefly first | Logged out → authenticated |
| 3 | 01:15–02:00 | Empty "My Trips" state → create a trip | New account, zero trips |
| 4 | 02:00–03:00 | Add one flight to the new trip; empty-itinerary state → populated | Trip exists, zero nodes → one flight node |
| 5 | 03:00–03:50 | Switch to seeded "Aisha's Ladakh Expedition" trip; Timeline → Graph → Map → Bookings | Log out of new account, log in as Demo Traveler (or switch trip if same session supports it — see note below) |
| 6 | 03:50–04:50 | **Simulation 1** (labeled on screen): trigger a 3h flight delay on the Ladakh trip, show cascade, recovery options, apply one | Ladakh trip, healthy state |
| 7 | 04:50–05:50 | **Simulation 2** (labeled on screen): trigger a hotel cancellation, show recovery options (mock alternative hotel), apply | Ladakh trip, post-Sim-1 state (recoverable again without a reset — verified in tests) |
| 8 | 05:50–06:40 | **Simulation 3** (labeled on screen): refresh browser (trip persists) → log out → log back in (trip still there) → log in as the pre-registered second account → "My Trips" shows Aisha's trip is absent | Second account already exists |
| 9 | 06:40–07:40 | Brief editor/architecture cutaway (optional) + narrated diagram-style explanation over the running app | Any screen; narration-led |
| 10 | 07:40–08:30 | Recap: revisit Timeline/Graph/Map/Bookings/Risk Intelligence briefly on the recovered Ladakh trip | Ladakh trip, post-recovery |
| 11 | 08:30–09:00 | Closing, final shot of the dashboard | — |

**Note on scene 5**: switching from your new test account to the Demo Traveler requires logging out and back in (the app has no admin/multi-account switcher) — budget ~5–8 seconds for this transition, shown briefly rather than cut away, so the audience sees it's a real re-authentication, not a scene fake-out.

---

## 4. Feature coverage matrix

| Feature | Shown in video? | Actual or simulated? | Frontend behavior | Backend behavior | Database effect | Timestamp |
|---|---:|---|---|---|---|---|
| Registration | Yes | Actual | Controlled form → `POST /api/auth/register` | Validates unique email, PBKDF2-hashes password, creates `Traveler` | `INSERT INTO travelers` | 00:35–01:15 |
| Login | Yes | Actual | Controlled form → `POST /api/auth/login` | Verifies password (constant-time compare), issues signed token | Read-only | 00:35–01:15 |
| Session persistence | Yes | Actual | Token in `localStorage`, sent as `Authorization: Bearer` on every request | `verify_token` checks HMAC signature + 30-day expiry | Read-only | 05:50–06:40 |
| Trip creation | Yes | Actual | Form → `POST /api/trips` | Creates `Trip` owned by the authenticated traveler (never client-supplied) | `INSERT INTO trips` | 01:15–02:00 |
| Flight creation | Yes | Actual | Form → `POST /api/trips/{id}/nodes` | Ownership check, creates `ItineraryNode` + `Booking` atomically | `INSERT` into `itinerary_nodes`, `bookings`; updates `trips.trip_value` | 02:00–03:00 |
| Hotel/activity/custom-event creation | **No** | **Not implemented** | No UI exists | No endpoint supports it | N/A | — (stated honestly, not shown) |
| Seeded itinerary (Ladakh) | Yes | Actual data, seeded not user-created | Rendered from real API response | `seed_if_empty` populated it at first startup | Pre-existing rows | 03:00–03:50 |
| Timeline view | Yes | Actual | Renders `trip.days`/`trip.nodes` | `GET /api/trips/{id}` | Read-only | 03:00–03:50, 07:40–08:30 |
| Graph/dependency view | Yes | Actual | React Flow renders `trip.nodes`/`trip.edges` | Same response as Timeline | Read-only | 03:00–03:50, 07:40–08:30 |
| Map view | Yes | Actual (SVG projection of real lat/lng) | Projects node coordinates | Same response | Read-only | 03:00–03:50 |
| Bookings view | Yes | Actual | Independent fetch | `GET /api/trips/{id}/bookings` | Read-only | 03:00–03:50 |
| Disruption simulation 1 (flight delay) | Yes | **Simulated, labeled on screen** | Trigger control → modal → propagation animation | `PropagationEngine` computes real cascade math on real graph state | `INSERT` disruption/cascade rows, node/edge status updates | 03:50–04:50 |
| Recovery options | Yes | Scoring is real; alternatives are **mock provider data, labeled** | Ranked cards with score breakdown | `RecoveryEngine` + `ScoringEngine`, alternatives from `Mock*Provider` | Read-only until applied | 03:50–04:50 |
| Apply recovery | Yes | Actual persistence of a simulated scenario's outcome | Before/after view | Mutates nodes/edges, persists `RecoveryPlan`+`RecoveryAction` | `UPDATE`/`INSERT` | 03:50–04:50 |
| Disruption simulation 2 (hotel cancellation) | Yes | **Simulated, labeled on screen** | Same pattern as Sim 1, different disruption type | Same engines | Same pattern | 04:50–05:50 |
| Refresh persistence | Yes | Actual | Full reload → state rebuilt from API, not cache | `GET /api/trips/{id}` on load | Read-only | 05:50–06:40 |
| Logout/re-login persistence | Yes | Actual | Token cleared/reissued | Same auth endpoints as Section 2 | Read-only | 05:50–06:40 |
| Cross-user isolation | Yes | Actual | Second account's "My Trips" | `get_trip`/`list` scoped to `traveler_id` from token | Read-only, provably filtered | 05:50–06:40 |
| AI Assistant | Mentioned only, not demoed live | **Deterministic fallback locally** (no `ANTHROPIC_API_KEY` set) | — | — | — | 06:40–07:40 (verbal only) |
| Risk Intelligence | Brief visual only | Actual | Resilience score/risk cards | `GET /api/trips/{id}/risks` | Read-only | 07:40–08:30 |
| PostgreSQL (local, Docker) | Yes (verbal + implied by working app) | Actual, verified | — | SQLAlchemy engine against `postgresql+psycopg://` | Real Postgres, Alembic-migrated | 06:40–07:40 |
| Supabase (production) | Mentioned only | **Not yet deployed** — documented target, not demoed | — | — | — | 06:40–07:40 (verbal, explicitly future) |
| Settings "Connected Providers" | **No — excluded** | Stale/hardcoded, not trip-derived | — | — | — | — |

---

## 5. Environment limitation

This session cannot capture, encode, or export a video file — there is no screen-recording or video tool available here. Everything above and in the companion files (`TRIPRESCUE_VIDEO_SCRIPT.md`/`.txt`, `TRIPRESCUE_RECORDING_CHECKLIST.md`, `TRIPRESCUE_SUBTITLES.srt`) is the complete, ready-to-execute plan. **The actual screen capture is a step you still need to perform** (OBS Studio, Windows Game Bar, or any screen recorder of your choice, at 1080p).
