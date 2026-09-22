# TripRescue — Video Feature Coverage Matrix

Every row was verified against an actual frame or the automation's real timestamp log for `TRIPRESCUE_COMPLETE_DEMO.mp4` (536s / 8:56) — not the original plan. See `TRIPRESCUE_VIDEO_AUDIT.md` for the full recording conditions.

| Feature | Demonstrated? | Timestamp | Actual behavior | Limitation |
|---|---:|---|---|---|
| Registration | Yes | 00:23–00:32 | Real `POST /api/auth/register`, PBKDF2 password hashing, new `Traveler` row created | None found |
| Login | Yes | 01:56–01:58, 06:33, 06:59, 07:22 (multiple times) | Real `POST /api/auth/login`, session token issued | None found |
| New-user empty dashboard | Yes | 00:44 | Genuinely empty "My Trips" — no stale/seeded trip shown to a new user | None |
| Trip creation | Yes | 00:48–01:03 | `POST /api/trips`, owner set from auth token only | Only name/origin/destination/dates — no origin/destination search or travel-mode selector |
| Adding a flight | Yes | 01:21–01:37 | `POST /api/trips/{id}/nodes`, atomic node+booking creation | Manual entry only — no flight search; hotels/activities/transfers/custom events cannot be added via the UI at all |
| Timeline view | Yes | 02:13 (new trip), 02:13–02:32 (Ladakh) | Renders real `trip.days`/`trip.nodes` | None |
| Graph/dependency view | Yes | 02:32–02:48 | React Flow rendering real `trip.nodes`/`trip.edges`, hard/soft dependency edges | None |
| Map view | Yes | 02:48–03:05 | SVG projection of real node lat/lng | Only plots nodes that have coordinates |
| Bookings view | Yes | 03:05–03:21 | Independent `GET /api/trips/{id}/bookings` fetch | None |
| Simulation 1: Flight delay | Yes | 03:27–03:35 | Real `PropagationEngine` cascade computation | Disruption itself is simulated, clearly labeled on screen |
| Cascade/impact analysis | Yes | 03:44–04:00 | Real computed figures: ₹36,400 financial exposure, ₹7,400 refund exposure, 6-step cascade, 5 downstream bookings | None — verified via direct frame inspection, not assumed |
| Recovery option generation | Yes | 04:00–04:26 | Real `RecoveryEngine`/`ScoringEngine` output: 3 ranked options (96/88/58) | Underlying alternative-flight data is `MockFlightProvider` — explicitly mock, labeled |
| Apply recovery | Yes | 04:26 | Real `POST /api/trips/{id}/recovery/apply`, persisted `RecoveryPlan` | None |
| Simulation 2: Activity cancellation | Yes | 04:55–05:00 | Real cascade + recovery pipeline, different disruption type | `hotel-cancellation` was tried first during prep and had **zero** feasible options on this trip — disclosed on screen and in the script, not hidden |
| Refresh persistence | Yes | 06:13 | Full page reload, state rebuilt from `GET /api/trips/{id}`, not cache | None |
| Logout/login persistence | Yes | 06:13–06:33 | Same trip state present after a fresh login | None |
| Cross-user isolation | Yes | 06:40–06:59 | Second account's "My Trips" genuinely shows zero trips — verified via direct frame inspection ("You don't have any trips yet.") | None |
| AI Assistant | **No** — mentioned only in prior planning, not shown in this recording | — | Present in the app (`Ask TripRescue AI` button visible in frames) but not opened/demonstrated | Not exercised this recording; would run the deterministic fallback locally (no `ANTHROPIC_API_KEY` configured) |
| Risk Intelligence | Yes | 08:07 (recap) | Real page visit | Not deeply explored — single visual beat only |
| PostgreSQL / Docker / Alembic | Mentioned in narration | 07:22–08:22 | **Not actually running in this recording** — the backend used its default local SQLite database; Postgres/Docker/Alembic were separately verified real in earlier work the same session, not in this video | Disclosed explicitly in the script's caveat notes |
| Supabase production database | Mentioned in narration | 07:22–08:22 | Documented target, connection code tested locally — **not deployed**, explicitly stated as such | None hidden |
| Settings "Connected Providers" list | **No — deliberately excluded** | — | Known to be a hardcoded, non-trip-derived UI element from earlier auditing | Excluded specifically to avoid misrepresenting static content as live |
| Hotel/activity/custom-event creation | **No — cannot be shown** | — | Does not exist in the application | Stated as a limitation on screen (01:03–01:46 segment) |

## Summary counts

- Rows demonstrated and verified real: 18
- Rows explicitly excluded/not demonstrated, with reason given: 4 (AI Assistant not opened, Postgres/Supabase not actually running in-video, Settings page excluded, hotel/activity creation doesn't exist)
- Rows where a claim required correction after frame-by-frame review: 1 (Simulation 1's spoken rupee figure vs. the actual on-screen figure — see `TRIPRESCUE_VIDEO_AUDIT.md`)
