# Future Roadmap

Honest accounting of what's simplified or deferred, and how each would be
tackled.

## ~~Multi-trip UI~~ (done)

~~The backend seeds and serves three trips...~~ Done: "My Trips" now fetches
`GET /api/trips` and shows Goa/Rajasthan as clickable cards, `TopBar`'s trip
switcher dropdown lists them too, and `AppContext.switchTrip(id)` reloads the
active trip (clearing disruption/recovery state and re-fetching). Fixing this
also surfaced a real bug: the itinerary graph's node positions
(`mockData.nodePositions`) were hand-authored only for the Ladakh trip's node
ids, so Goa/Rajasthan's nodes all collapsed onto the same point. Fixed with
`src/lib/graphLayout.ts` — a small layered (Sugiyama-style) auto-layout used
whenever the current node set isn't fully covered by the hand-authored
positions, leaving Ladakh's exact tuned layout untouched.

## Real travel providers

`app/providers/base.py`'s four interfaces (`FlightProvider`, `HotelProvider`,
`ActivityProvider`, `TransferProvider`) are the seam. A real integration
means implementing `search` / `get_alternatives` / `get_booking` /
`get_cancellation_policy` against an actual API (Amadeus, Duffel, a hotel
GDS...) and swapping the `Mock*Provider()` instantiations in
`recovery_service.py` for the real ones. `RecoveryEngine` itself needs zero
changes - it only depends on the interface.

## ~~Activity-vs-activity conflict detection~~ (done)

~~When a recovery reschedules one activity because it no longer fits a new
flight arrival time, the engine doesn't check whether the new slot collides
with a *different* activity now scheduled the same day...~~ Done:
`RecoveryEngine._resolve_activity_conflicts` (`app/engines/recovery_engine.py`)
now re-scans and re-propagates in a fixed-point loop (capped at
`MAX_ACTIVITY_CONFLICT_PASSES = 5`) instead of a single pass, so a reschedule
that pushes a *different* activity into conflict gets caught on the next
pass rather than silently leaking an at-risk node into the final plan. See
`test_activity_conflict_resolution_converges_on_chained_conflicts` in
`app/tests/test_recovery_engine.py` for a two-activity chain that only a
second pass resolves.

## ~~Multi-trip "My Trips" auth~~ (done)

~~`app/api/routes/auth.py` has working register/login/password-hashing, but
nothing in the frontend calls it...~~ Done: the frontend now has a real login
screen (`src/components/auth/LoginScreen.tsx`) backed by
`src/store/AuthContext.tsx` - login, register, or "Continue as Demo Traveler"
all store a bearer token (`src/lib/authStorage.ts`) that `services/api.ts`
attaches to every request. Every trip-scoped route - reads (`GET /api/trips`,
`GET /api/trips/{id}...`) *and* mutations (`POST .../disruptions`,
`.../simulate`, `.../propagate`, `.../recovery-options/generate`,
`.../recovery/apply`, `POST /api/assistant`) - resolves the caller via
`app/api/deps.py`'s `get_current_traveler_id` (falls back to the seeded demo
traveler when no/invalid token is sent, so old cached clients keep working)
and ownership-checks against it in the relevant service function
(`trip_service.py`, `disruption_service.py`, `recovery_service.py`,
`assistant_service.py`) - a trip that isn't yours 404s rather than leaking or
letting you disrupt/recover it. Sidebar and Settings show the real
authenticated name/email/home airport/loyalty tier via a new `GET
/api/auth/me`, with a logout button. See `app/tests/test_auth.py`, including
`test_a_new_traveler_cannot_disrupt_recover_or_ask_about_a_trip_they_do_not_own`.

## Real map

`MapView` is an abstract SVG projection of each node's own lat/lng (no
hardcoded second location list - see `ARCHITECTURE.md`), which means it's
accurate but not a real map: no terrain, roads, or actual distances. A small
`declutter()` pass nudges markers apart when stops project too close together
(e.g. Leh city, the hotel, and Nubra Valley are all in a similar area on this
trip's scale) so markers stay individually distinguishable, but the route/
marker *text labels* are still placed independently and can still crowd each
other in a tight cluster - full label collision avoidance (measuring text
width, not just marker points) was judged not worth it for a deliberately
abstract map. A real map (Mapbox/Leaflet) would solve both properly, at the
cost of a paid/rate-limited external dependency the "no paid map dependency
for the prototype" instruction ruled out for now.

## ~~Frontend automated tests~~ (done)

~~The frontend was validated with a live Playwright-driven browser session...
rather than a committed Vitest/React Testing Library suite.~~ Done: `npm test`
runs a committed Vitest + React Testing Library suite (`vite.config.ts`'s
`test` block, jsdom environment) - unit tests for the pure logic
(`src/lib/status.ts`, `src/lib/utils.ts`, `src/lib/graphLayout.ts`),
component tests for the presentational pieces (`ScoreRing`, `RiskBadge`,
`StatusBadge`), and integration tests for `AppContext`'s load/switch-trip/
disruption→recovery→apply flows against a mocked `services/api.ts`
(`src/store/AppContext.test.tsx`). The live Playwright-driven browser
session is still the right tool for full end-to-end/visual verification
against a real running backend and remains part of how this app gets
checked before a demo.

## Risk history over time

`RiskSnapshot` exists as a table but nothing currently writes to it - risk is
computed fresh on every `GET /risks` call rather than being persisted as a
time series. A "risk trend" feature (has this connection gotten riskier over
the last hour?) would start writing snapshots on each computation and query
them for a chart.

## Database migrations

Schema changes currently mean deleting `triprescue.db` and letting
`create_all()` rebuild it - fine while there's no real user data to preserve.
Introduce Alembic once there's a deployment with data worth migrating rather
than a deployment worth migrating *to*.
