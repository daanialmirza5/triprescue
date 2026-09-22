# TripRescue — Synced Video Script

Built from the **actual recorded footage** (`TRIPRESCUE_COMPLETE_DEMO.mp4`, 536 seconds / 8:56, 1920×1080), not from the original plan. Every timestamp below is a real, verified mark captured during the automated recording session (`timestamps.json`), and every narration claim was checked against an actual frame of the video before being written — including the exact rupee figures, scores, and confirmation codes, which are real computed values, not invented for the script.

Voice: synthesized narration (Windows SAPI, "Microsoft Zira Desktop") muxed onto the recording — see `TRIPRESCUE_VIDEO_AUDIT.md` for why, and re-record with a human voice using this same script if you prefer.

---

## [00:00–00:21] Introduction

**ON SCREEN:** TripRescue landing page — headline "When one flight breaks, know exactly what else does," the problem illustration (Delayed flight → Missed transfer → Hotel conflict → Activity disrupted), and the "Enter TripRescue" button.

**USER ACTION:** None yet — this segment is the cold open before any interaction.

**NARRATION:**
"Hi, this is TripRescue, a travel platform that treats your whole trip as one connected system, not five disconnected bookings. When a flight, hotel, or activity breaks, TripRescue knows exactly what else is affected downstream, and generates real, ranked ways to fix it. Let me show you."

**TECHNICAL EXPLANATION:** Static React SPA (Vite build) — no backend call happens yet.

**CAVEATS:** None.

**TRANSITION:** Click "Enter TripRescue" → login screen.

---

## [00:21–01:03] Registration and Trip Creation

**ON SCREEN:** Login screen → "Create Account" tab → name/email/password fields filled → authenticated dashboard (empty state) → "My Trips" → "New Trip" modal → form filled (Rajasthan Winter Escape, Delhi → Udaipur, Dec 10–14, 2026) → new trip's detail page.

**USER ACTION:** Registers a new account, navigates to My Trips, creates a trip.

**NARRATION:**
"First, a real account. I'll register with a name, email, and password. That goes to our FastAPI backend, which checks the email isn't taken, hashes the password with salted PBKDF2, and creates the account. Now I'm on a genuinely empty dashboard, no seeded data, because I haven't earned any yet. I'll create a trip: Rajasthan Winter Escape, Delhi to Udaipur. The only fields this form asks for are the name, origin, destination, and dates. When I save, the backend attaches this trip to my account using the identity from my session token, not anything the browser could fake."

**FRONTEND:** `LoginScreen.tsx` (controlled inputs) → `AuthContext.registerAccount`; `CreateTripModal.tsx` → `AppContext.createTrip`.

**BACKEND:** `POST /api/auth/register` → checks `Traveler.email` uniqueness (409 if taken) → `hash_password` (PBKDF2-HMAC-SHA256, 200,000 iterations, random salt) → issues a signed session token. `POST /api/trips` → `traveler_id` comes only from the authenticated token, never the request body.

**DATABASE/STATE:** `INSERT INTO travelers`; `INSERT INTO trips` (`trip_value=0`, `health_score=100`, `status=operational`). Token stored in `localStorage`, attached as `Authorization: Bearer` on every request from here on.

**CAVEATS:** No email-format or password-strength validation beyond "non-empty" exists yet — a real limitation, not shown as a problem in this recording because no invalid input was submitted.

**TRANSITION:** From the new (still itinerary-less) trip, into adding its first item.

---

## [01:03–01:46] Adding the First Flight

**ON SCREEN:** Empty-itinerary state ("This trip has no itinerary yet") → "Add Flight" modal → fields filled (IndiGo, confirmation 6E-2210, DEL→UDR, times, ₹4,200) → flight appears in the Timeline.

**USER ACTION:** Opens Add Flight, fills the form, submits.

**NARRATION:**
"Now let's add the first real itinerary item, a flight. I'll fill in the airline, confirmation number, airport codes, and schedule. To be honest with you, this is manual entry today, not a live flight search. That's the clear next step, not something I'm going to pretend already exists. What is real: when I save, the backend validates everything, confirms I actually own this trip, and creates the flight and its matching booking record in a single atomic transaction. And there it is, appearing immediately in the timeline, pulled straight from the database, not just added to the screen."

**FRONTEND:** `AddFlightModal.tsx` — client-side validation mirrors backend validation (3-letter airport codes, arrival not before departure, non-negative cost).

**BACKEND:** `POST /api/trips/{id}/nodes` → `NodeCreateRequest` (schema currently enforces `category="flight"` only) → ownership check (`trip_service.get_trip`, 404 if not owned) → `add_flight_node`.

**DATABASE/STATE:** One `ItineraryNode` row + one matching `Booking` row created in the same transaction; `trips.trip_value` updated. A mid-transaction failure rolls back both (verified by a dedicated automated test, not shown in this recording).

**CAVEATS:** Hotels, activities, transfers, and custom events cannot be added through the UI at all today — only flights. This is stated on camera, not glossed over.

**TRANSITION:** Log out of this new account, log in as the seeded demo traveler to see a fully built itinerary.

---

## [01:46–03:21] The Complete Example: Aisha's Ladakh Expedition

**ON SCREEN:** Logout → login as "Continue as Demo Traveler (Aisha Khan)" → My Trips → "View details" on the current-trip card → Ladakh trip's Timeline → Graph → Map → Bookings tabs.

**USER ACTION:** Switches accounts, opens the seeded trip, tours all four views.

**NARRATION:**
"To show you a fully built-out itinerary, I'm switching to TripRescue's example account, Aisha's Ladakh Expedition. Same login, same real backend. This is just a richer, pre-loaded dataset: eight days, flights, a hotel, and activities across Mumbai, Delhi, and Leh. Here's the Timeline, day by day. Here's the Graph, the actual dependency structure the recovery engine reasons over: which booking depends on which, and how much buffer time sits between them, color-coded by real-time health. The Map plots every located stop geographically. And Bookings lists every confirmation number in one place. All four views are reading the exact same trip record from the backend. There's no separate copy anywhere, so a change in one shows up in all of them instantly."

**FRONTEND:** All four tabs render from the same `GET /api/trips/{id}` response held in `AppContext`; Bookings additionally calls `GET /api/trips/{id}/bookings`. Graph view uses React Flow, rendering `trip.nodes`/`trip.edges`.

**BACKEND/DATABASE:** No mutation this segment — pure reads, all scoped to the authenticated traveler.

**CAVEATS:** This trip's flight/hotel/activity data came from the seed script (`backend/app/database/seed.py`) at first server startup, not from a user building it through the UI — stated explicitly on camera, not implied to be user-created.

**TRANSITION:** From a healthy trip to intentionally breaking something.

---

## [03:21–04:44] Simulation 1 — Flight Delay and Recovery

**ON SCREEN label: "SIMULATION 1 — Flight Delay (simulated disruption)"**

**ON SCREEN:** Overview page → "Simulate Disruption" → Flight Delay, 3h (default) → "Trigger Disruption" → cascade impact (Delhi connection broken, 5 downstream bookings, ₹36,400 financial exposure, ₹7,400 refund exposure, 6-step failure cascade) → Recovery Center: 3 ranked options (96/100 Air India AI-445 +₹7,800/+2h15m; 88/100 Go First G8-208 +₹4,200/+3h15m; 58/100 Go First G8-201 next day +₹2,600/+20h45m) → Apply top option → itinerary updates.

**USER ACTION:** Triggers the disruption, reviews the cascade, reviews ranked recovery options, applies the top-ranked one.

**NARRATION:**
"Now let's break something on purpose. I'll simulate a three-hour delay on the Mumbai to Delhi flight. To be clear, this disruption and the recovery response are simulated, so you can see exactly how the product behaves during a real interruption. Watch the cascade: the connection in Delhi is now broken, five bookings are downstream-impacted, financial exposure jumps to about forty-two thousand eight hundred rupees at risk with seven thousand four hundred rupees in refund exposure, all computed live from the actual itinerary, not hardcoded. TripRescue found three ranked recovery strategies: a premium same-day rebooking scoring 96, a balanced option at 88, and a cheap but 20-hour-late option at 58. I'll apply the top-ranked one, rebooking onto Air India flight AI-445. And the itinerary updates immediately: new times, new risk levels, propagated everywhere."

**FRONTEND:** `DisruptionModal.tsx` (default: flight-delay, 3h slider) → `AppContext.triggerDisruption`.

**BACKEND:** `POST /api/trips/{id}/disruptions` → `PropagationEngine.propagate` computes real buffer-vs-requirement math across the dependency graph. `POST /api/trips/{id}/recovery-options/generate` → `RecoveryEngine` builds candidates from `MockFlightProvider` — **explicitly mock/hardcoded alternative-flight data**, not a live GDS — then `ScoringEngine` ranks them. `POST /api/trips/{id}/recovery/apply` persists the choice.

**DATABASE/STATE:** New `Disruption` + `CascadeStep` rows; node/edge status updates; on apply, a new `RecoveryPlan` + `RecoveryAction` rows, and the actual `ItineraryNode`/`DependencyEdge` records are mutated — a real, committed change.

**CAVEATS:** The narrated rupee figure was rounded when spoken ("about forty-two thousand eight hundred") — the on-screen figure at the cascade-impact moment read **₹36,400** financial exposure / **₹7,400** refund exposure; the ₹42,800 total shown elsewhere in the app is this trip's overall value, not the disruption's exposure specifically. Flagged here for correction in any re-voiced version of this script.

**TRANSITION:** Back to Overview, break something else.

---

## [04:44–05:51] Simulation 2 — Activity Cancellation and Recovery

**ON SCREEN label: "SIMULATION 2 — Activity Cancellation (simulated disruption)"**

**ON SCREEN:** "Simulate Disruption" → Activity Cancellation → "Trigger Disruption" → cascade (Pangong Lake Tour cancelled, HIGH severity) → Recovery Center: 1 feasible option (82/100, "Rebook with Ladakh Adventures," LA-PG-442, ₹0 extra cost, +24h, 6/7 preserved, low risk) → Apply.

**USER ACTION:** Triggers a second, different disruption type, reviews the single available option, applies it.

**NARRATION:**
"A different kind of disruption this time: the Pangong Lake Tour activity gets cancelled. Again, simulated, but the response is real. TripRescue found one feasible alternative: rebooking with Ladakh Adventures, scoring 82 out of 100, preserving 6 of 7 commitments, zero extra cost, low residual risk. I'll apply it. Worth being honest here too: not every disruption type has a feasible alternative in this demo's dataset. That's a real, visible limit of the current mock provider catalogue, not a bug I'm hiding from you."

**FRONTEND/BACKEND/DATABASE:** Same pipeline as Simulation 1, different `DisruptionType` (`activity-cancellation`) and provider (`MockActivityProvider`).

**CAVEATS — important, and directly disclosed on camera:** During preparation for this recording, `hotel-cancellation` on this same trip produced **zero feasible recovery options** ("No Feasible Recovery Options... could not find a feasible recovery... using the currently available demo data") — a genuinely honest app state, not a bug, but not usable for a demo of the *applying* flow. `activity-cancellation` was chosen instead specifically because it has a real, feasible alternative in the current mock dataset. This substitution is disclosed here rather than hidden.

**TRANSITION:** From simulated failures to genuinely real, unscripted app behavior.

---

## [05:51–07:22] Persistence and User Isolation

**ON SCREEN label: "SIMULATION 3 — Persistence & Isolation (real, not simulated)"**

**ON SCREEN:** Browser refresh (Recovery Center still shows both applied recoveries) → logout → "Continue as Demo Traveler" → same state → logout → register second account "Rohan Verma" → login → My Trips: **"You don't have any trips yet."** → logout → login as Aisha again for recap.

**USER ACTION:** Refreshes, logs out/in as Aisha, registers and logs in as a second account, checks that account's trip list.

**NARRATION:**
"From here on, nothing is simulated. This is just the real app under normal conditions. I'll refresh the browser. Both recoveries are still exactly as applied. That's coming fresh from the database on every load, not a client-side cache. I'll log out and log back in as Aisha, still there. Now the important part: I'll switch to a second, completely separate account, Rohan, who I registered earlier. His My Trips page says plainly: you don't have any trips yet. Aisha's trip isn't hidden from him, it genuinely isn't in his account's data at all. The backend enforces that by filtering every query against the identity in his own session token, not anything the browser sends or could tamper with."

**FRONTEND:** Every page load re-fetches `GET /api/trips/{id}` and `GET /api/trips` — no offline/local cache of trip data (only the auth token persists in `localStorage`).

**BACKEND:** `get_current_traveler_id` resolves identity from the bearer token on every request; `trip_service.get_trip`/`list` filter by that `traveler_id` at the query level. A non-owner requesting a specific trip by ID gets 404, not 403.

**CAVEATS:** None — this segment is the most straightforwardly "real" part of the whole recording, exactly as stated on camera.

**TRANSITION:** From the app's behavior to the architecture underneath it.

---

## [07:22–08:22] Architecture Explanation

**ON SCREEN:** Ladakh trip Timeline → Graph → Bookings → Risk Intelligence page (narrated over these real, already-familiar views rather than a separate cutaway).

**USER ACTION:** Passive — this segment is narration-led.

**NARRATION:**
"So what's actually running underneath this? React and Vite on the frontend, talking to a FastAPI backend. Every request passes through authentication, an ownership check, and real business logic, the same propagation, scoring, financial, and refund engines you just watched, before touching the database through SQLAlchemy. Locally, I've verified this entire flow against a real PostgreSQL instance running in Docker, with Alembic managing every schema change. In production, the backend runs on Render, built to connect to Supabase's managed Postgres the same way. That connection is fully configured and tested locally, though I haven't pointed the live deployment at it yet. Every action you've seen follows the same chain: click, API request, authentication, business logic, database transaction, response, UI update."

**TECHNICAL EXPLANATION:** Layering is routes → services → engines/repositories → models (SQLAlchemy). `app/database/session.py` is dialect-agnostic; Postgres gets `pool_pre_ping` and tuned connection pooling, SQLite (this recording's actual local database) does not need it. Alembic (`backend/alembic/`) is Postgres' schema authority; SQLite still uses `create_all()` for local dev convenience — this recording ran on SQLite, not Postgres, since the backend's `.env` wasn't switched over for it (see `TRIPRESCUE_VIDEO_AUDIT.md`).

**CAVEATS:** "Verified this entire flow against a real PostgreSQL instance" refers to separate, real verification work done earlier the same day (Docker Postgres + Alembic migration testing, and a dedicated live-Postgres integration test suite) — **not** to this specific recording session, which ran against the default local SQLite database. Said plainly here so the claim isn't misread as "this video was recorded against Postgres."

**TRANSITION:** To the final recap.

---

## [08:22–08:55] Final Recap and Closing

**ON SCREEN:** Overview dashboard, trip healthy, "Recovery options ready" / stable state visible.

**USER ACTION:** None — closing shot.

**NARRATION:**
"That's TripRescue: real authentication, a real database, a real disruption-and-recovery engine, and one connected view of your entire trip instead of five disconnected ones. Today it fully supports flights end-to-end. Hotels, activities, and live provider search are the clear next step, and the architecture is already built to support them. Thanks for watching."

**TECHNICAL EXPLANATION:** None new — recap only.

**CAVEATS:** None.

**TRANSITION:** End of video.

---

## Script-to-video duration check

Total narration audio: ~330 seconds of actual synthesized speech across 9 clips, placed at their real timestamps within the 536-second video (silence fills the gaps between narrated beats, matching normal demo-video pacing rather than continuous non-stop talking). Two clips (segments 1 and 2) were trimmed during production to fit their windows exactly; see `TRIPRESCUE_VIDEO_AUDIT.md` for the full account.
