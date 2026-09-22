# TripRescue — Demo Video Script

Target runtime: **9:00** (within the 8–10 minute requirement). Target pace: ~135 words/minute. Total script word count and calculated duration are at the bottom of this file — verify they still match after you personalize the bracketed placeholders (`[Your Name]`, etc.) or ad-lib during recording.

Read `TRIPRESCUE_RECORDING_PLAN.md` first — it explains *why* this script is structured this way (what's real, what's seeded, what's excluded, and why).

---

## [00:00–00:35] Introduction (35s · ~80 words)

**Narration:**
"Hi, I'm [Your Name], and this is TripRescue — a travel platform I built to solve a problem every traveler knows. Your flight, your hotel, and your plans usually live in five different apps and emails, completely disconnected. When something goes wrong — a delay, a missed connection — nothing talks to anything else. TripRescue treats your whole trip as one connected system, so when one piece breaks, it knows exactly what else is affected, and what to do about it. Let me show you."

**What is shown:**
- TripRescue landing page, logged out.
- Brief pan across the hero section / value proposition copy.

**Technical explanation:**
- Static React SPA served by Vite; no backend call happens until the user takes an action.

---

## [00:35–01:15] Registration and login (40s · ~92 words)

**Narration:**
"First, a real account. I'll register with a name, email, and password — nothing here is faked or pre-filled." *(fill form, submit)* "That request goes to our FastAPI backend, which checks the email isn't already taken, hashes the password — we never store it in plain text — and creates the account. The backend then issues a signed session token, which the browser stores and attaches to every request from here on. If I'd typed the wrong password on a login instead, the backend would reject it with a clear, generic error — it doesn't reveal whether the email even exists."

**What is shown:**
- Landing → "Enter TripRescue" → "Create account" → fill name/email/password → submit.
- Successful redirect into the authenticated dashboard.
- (Do not show the password field's actual characters in a way that's readable — normal masked input is fine.)

**Technical explanation:**
- Frontend: `LoginScreen.tsx`, controlled inputs, calls `AuthContext.registerAccount`.
- Backend: `POST /api/auth/register` → `auth.py:register` → checks `Traveler.email` uniqueness (409 if taken) → `hash_password` (salted PBKDF2-HMAC-SHA256, 200,000 iterations) → `db.commit()`.
- Token: `create_token` HMAC-signs `traveler_id + issued_at` with `AUTH_SECRET`; no JWT library, a minimal custom scheme.
- Frontend stores the token in `localStorage` (`authStorage.ts`) and attaches `Authorization: Bearer <token>` on every subsequent API call (`api.ts`).
- A wrong password on login returns a generic 401 ("Invalid email or password") — deliberately doesn't confirm whether the account exists.

---

## [01:15–02:00] Dashboard and trip creation (45s · ~101 words)

**Narration:**
"This is a brand-new account, so there's nothing here yet — and that's the honest state, not a placeholder. Let's create a trip." *(open Create Trip, fill fields)* "The only thing I type by hand is the trip name, origin, destination, and dates — that's genuinely all this form asks for today. When I save, the backend creates this trip and attaches it to my account specifically — my user ID comes from my session token, not from anything the browser sends, so there's no way to fake ownership of a trip. And there it is, showing up immediately on my dashboard."

**What is shown:**
- "My Trips" empty state (no seeded/demo trip shown to a new user).
- "New Trip" → fill name, origin, destination, start/end dates → save.
- New trip appears in the list and opens to its (empty) detail page.

**Technical explanation:**
- Frontend: `CreateTripModal.tsx`, client-side validation (required fields, end date not before start date), then `AppContext.createTrip`.
- Backend: `POST /api/trips` → `trip_service.create_trip` — `traveler_id` comes exclusively from `get_current_traveler_id` (the authenticated token), never from the request body.
- Database: `INSERT INTO trips` with `trip_value=0`, `health_score=100`, `status=operational`.
- Response updates `AppContext` state and switches the active trip — no separate page reload needed.
- Ownership check (`trip_service.get_trip`) is what later prevents any other account from reading or modifying this trip.

---

## [02:00–03:00] Adding a flight (60s · ~135 words)

**Narration:**
"Right now the trip has no itinerary at all, so let's add the first real piece: a flight." *(open Add Flight, fill fields)* "I enter the airline, the confirmation number, the origin and destination airport codes, and the schedule. To be completely honest with you — this is manual entry today, not a flight search. Hotels, attractions, and custom events aren't buildable through the interface yet either; that's genuinely the next thing on the roadmap, not something I'm going to pretend already works. What *is* real is everything that happens after I save: the backend validates the airport codes, checks I actually own this trip, and creates the flight and its matching booking record in one atomic database transaction — either both are saved, or neither is, even if something fails halfway through."

**What is shown:**
- Empty-itinerary state on the new trip ("This trip has no itinerary yet").
- "Add Flight" → fill airline/confirmation/origin/destination/times/cost → submit.
- Flight appears in the Timeline immediately after.

**Technical explanation:**
- Frontend: `AddFlightModal.tsx` — client-side validation mirrors backend validation (3-letter airport codes, arrival not before departure, non-negative cost).
- Backend: `POST /api/trips/{id}/nodes` → `NodeCreateRequest` (currently `category` must be `"flight"`, enforced by the schema) → `trip_service.get_trip()` ownership check (404, not 403, if not owned) → `trip_service.add_flight_node`.
- Database: creates one `ItineraryNode` row and one matching `Booking` row in the same transaction, updates `trips.trip_value`; a mid-transaction failure rolls back both (verified by a dedicated test).
- Response replaces the frontend's trip state wholesale from the backend's answer — never a client-guessed/optimistic insert.

---

## [03:00–03:50] The complete picture: switching to a full itinerary (50s · ~113 words)

**Narration:**
"To show you what a fully built-out, connected trip looks like, I'm going to switch to TripRescue's example account — Aisha's Ladakh Expedition, an eight-day trip with flights, a hotel, and activities already in place." *(log out, log back in as demo account)* "Same login flow, same real backend — this is just a different, richer dataset. Here's the Timeline, day by day. Here's the Graph view — this is the actual dependency structure: which booking depends on which, and how much buffer time sits between them. The Map plots every located stop geographically. And Bookings is every confirmation number in one place. All four views are reading the exact same trip data — there's no separate copy anywhere."

**What is shown:**
- Log out of the new account → log in as "Continue as Demo Traveler (Aisha Khan)".
- Open the Ladakh trip → Timeline tab → Graph tab → Map tab → Bookings tab, a few seconds each.

**Technical explanation:**
- All four tabs render from the same `GET /api/trips/{id}` response held in `AppContext` — Bookings makes its own separate `GET /api/trips/{id}/bookings` call, everything else is derived from the already-loaded trip.
- Graph view: React Flow, nodes/edges from `trip.nodes`/`trip.edges`; hard vs. soft dependency edges reflect real buffer-time requirements computed by the backend's graph engine.
- Map view: SVG projection of each node's real `lat`/`lng`, not an embedded live map SDK.

---

## [03:50–04:50] Simulation 1 — Flight delay and recovery (60s · ~135 words)

**On-screen label: "SIMULATION 1 — Flight Delay (simulated disruption)"**

**Narration:**
"Now let's break something on purpose. I'm going to simulate a three-hour delay on the Mumbai to Delhi flight." *(trigger disruption, show loading)* "For this demonstration, the disruption and the recovery response are simulated, so we can show how the product actually behaves during a travel interruption — this isn't pulling live flight-status data. But watch what happens next: that delay cascades through the whole graph in real time — the tight connection in Delhi is now at risk, and everything downstream gets re-evaluated. TripRescue then generates several ranked recovery options, each with a real cost and time tradeoff. I'll pick this one." *(select, apply)* "And the itinerary updates immediately — new times, new risk levels, propagated everywhere."

**What is shown:**
- "Simulate Disruption" → Flight Delay → ~3 hour slider → submit.
- Propagation animation / loading state (a few seconds).
- Cascade impact shown (at-risk/broken status on downstream nodes).
- Recovery Center: 2–3 ranked options with score breakdowns.
- Select one → Apply → Before/After view.

**Technical explanation:**
- `POST /api/trips/{id}/disruptions` → `PropagationEngine.propagate` walks the dependency graph, computing real buffer-vs-requirement math for every downstream node (not hardcoded outcomes).
- `POST /api/trips/{id}/recovery-options/generate` → `RecoveryEngine` builds candidate plans using alternative flights from `MockFlightProvider` — **explicitly mock/hardcoded data**, not a live GDS — then `ScoringEngine` ranks them by weighted cost/time/comfort against the traveler's preferences.
- `POST /api/trips/{id}/recovery/apply` persists the chosen `RecoveryPlan` and its `RecoveryAction`s, and mutates the actual node/edge records — this is a real, committed database change, not a UI-only effect.

---

## [04:50–05:50] Simulation 2 — Hotel cancellation and recovery (60s · ~135 words)

**On-screen label: "SIMULATION 2 — Hotel Cancellation (simulated disruption)"**

**Narration:**
"Let's try a different kind of disruption — the hotel in Leh cancels on us." *(trigger disruption)* "Again, this is a simulated scenario, not a live cancellation notice — but everything downstream of it is computed for real. The engine checks what this hotel was anchoring — the activities booked around it — and generates alternatives from its hotel catalogue, which, to be clear, is demo data, not a live booking search. I'll compare two options side by side." *(open comparison)* "This one keeps more of the existing plan intact, so I'll apply it." *(apply)* "Notice the trip's financial exposure and refund numbers update too — those are computed live from the actual booking terms, not hardcoded."

**What is shown:**
- Trigger a hotel-cancellation disruption.
- Recovery options, open the comparison view if time allows.
- Apply the chosen option.
- Brief glance at updated financial/risk numbers.

**Technical explanation:**
- Same `PropagationEngine`/`RecoveryEngine`/`ScoringEngine` pipeline as Simulation 1, different `DisruptionType` (`hotel-cancellation`) and provider (`MockHotelProvider`).
- `FinancialEngine`/`RefundEngine` recompute real exposure/refund figures from each node's actual `cost`, `refundable`, and `cancellation_deadline_hours` fields — not placeholder numbers (this was a real bug fixed earlier in development; the numbers are now genuinely calculated).

---

## [05:50–06:40] Simulation 3 — Persistence and isolation (50s · ~113 words)

**On-screen label: "SIMULATION 3 — Persistence & Isolation (real, not simulated)"**

**Narration:**
"Unlike the last two, nothing here is simulated — this is just the real app under normal conditions. I'll refresh the browser." *(refresh)* "The recovered trip is still exactly as I left it — that's coming fresh from the database on every load, not a client-side cache. I'll log out and log back in." *(logout, login)* "Still there. Now watch this: I'll switch to a second, completely separate account." *(switch account, open My Trips)* "Aisha's trip isn't just hidden — it's not in this account's list at all. The backend enforces that at the database query level, using the identity from my session token, not anything the browser could tamper with."

**What is shown:**
- Refresh the page on the recovered Ladakh trip.
- Log out → log back in as the same demo account → trip still present.
- Switch to the pre-registered second account → "My Trips" shows only that account's own (empty or separate) trips.

**Technical explanation:**
- Every page load re-fetches from `GET /api/trips/{id}` and `GET /api/trips` — there is no offline/local persistence of trip data itself (only the auth token is cached client-side).
- `get_current_traveler_id` resolves identity from the bearer token on every request; `trip_service.get_trip`/`list` filter by that `traveler_id` at the query level.
- A non-owner requesting someone else's trip by ID gets 404, not 403 — deliberate, so a guessed ID doesn't even confirm the trip exists.

---

## [06:40–07:40] Architecture explanation (60s · ~135 words)

**Narration:**
"So what's actually running underneath all of this? The frontend is React and Vite, talking to a FastAPI backend over a typed API layer. Every request goes through authentication, then an ownership check, then real business logic — the propagation, scoring, financial, and refund engines you just saw — before anything touches the database through SQLAlchemy. For the database itself: locally, I've been running this against a real PostgreSQL instance in Docker, with Alembic managing every schema change — not a hand-edited table. In production, the backend is hosted on Render, and it's built to run against Supabase's managed Postgres the same way — that connection is fully configured and tested locally, though I haven't pointed the live production deployment at it yet. So: user click, React state change, API request, authentication, ownership check, business logic, database transaction, response, and the UI updates — every single time."

**What is shown:**
- Live app, plus (optional, brief) a code editor cutaway: `backend/app/main.py`, `session.py`, or the Alembic migration folder — 5–8 seconds max, not a code read-through.

**Technical explanation (for you, not necessarily all spoken):**
- Layering: routes → services → engines/repositories → models (SQLAlchemy).
- `app/database/session.py`: dialect-agnostic engine, Postgres gets `pool_pre_ping` + tuned pool size/overflow/recycle; SQLite unaffected.
- `backend/alembic/`: schema is Alembic-managed against Postgres; SQLite still uses `create_all()` for local convenience.
- Production path: Render (backend, unchanged) + Supabase Postgres via its IPv4-compatible Session Mode pooler connection (documented in `docs/DEPLOYMENT.md`) — **not yet actually pointed at a live Supabase project**, say so if asked.

---

## [07:40–08:30] Final recap (50s · ~113 words)

**Narration:**
"Let's look at the finished picture. This trip has a real flight I added myself, plus the seeded hotel and activity bookings, all shown consistently across Timeline, Graph, Map, and Bookings. It survived two simulated disruptions and came out the other side with an updated, still-accurate plan. It's tied to one authenticated account, isolated from every other user, and it persists through a refresh or a full logout — because it's genuinely stored in a database, not held together by browser state. One more view before we close: Risk Intelligence, which continuously scores every leg of the trip for exposure — that's the same engine that powers the disruption simulations you just saw, just running proactively instead of reactively."

**What is shown:**
- Quick revisit: Timeline → Graph → Bookings (2–3s each) on the now-recovered Ladakh trip.
- Risk Intelligence page, a few seconds.

**Technical explanation:**
- Nothing new technically — this section is a narrated recap, not a new code path.

---

## [08:30–09:00] Closing (30s · ~68 words)

**Narration:**
"That's TripRescue: real authentication, a real database, real disruption and recovery logic, and a connected view of your entire trip instead of five disconnected ones. Today it supports flights end-to-end, with hotels, activities, and live provider search as the clear next step — the architecture is already built to support them. Thanks for watching."

**What is shown:**
- Final shot: the dashboard/overview screen, trip visibly healthy.

**Technical explanation:**
- —

---

## Duration check

| Section | Seconds | Words (narration only) |
|---|---:|---:|
| Introduction | 35 | 80 |
| Registration/login | 40 | 92 |
| Dashboard/trip creation | 45 | 101 |
| Adding a flight | 60 | 135 |
| Full itinerary showcase | 50 | 113 |
| Simulation 1 | 60 | 135 |
| Simulation 2 | 60 | 135 |
| Simulation 3 | 50 | 113 |
| Architecture | 60 | 135 |
| Recap | 50 | 113 |
| Closing | 30 | 68 |
| **Total** | **540 (9:00)** | **~1,220** |

1,220 words ÷ 9 minutes ≈ **136 words/minute** — within the 125–145 target. Actual recorded duration will vary with your pacing and pauses after state changes (expected — build 10–20% slack into your run-through rather than reading at a fixed metronome pace).
