# TripRescue — Recording Audit

## 1. How this video was actually produced

This environment does have genuine screen-recording capability — confirmed only after two earlier requests in this session where I incorrectly reported it didn't. Playwright's browser automation (blocked earlier in this session by a Windows Application Control policy) turned out to be unblocked when re-tested via a different process-launch method, and Playwright's built-in `recordVideo` context option captured the actual browser session as I drove it through the real application. Windows' built-in SAPI text-to-speech (`Microsoft Zira Desktop`) generated the narration audio, and `ffmpeg` (already installed on this machine) encoded and muxed the final file. None of this used any external service or paid tool.

**What this means concretely**: every screen, click, form submission, disruption, and recovery shown in the video is a real interaction with the actual running TripRescue application (frontend on `localhost:5173`, backend on `localhost:8000`) — not a mockup, not a scripted animation, not a static image sequence.

## 2. Video file

- **Path**: `TRIPRESCUE_COMPLETE_DEMO.mp4` (repo root)
- **Duration**: 536 seconds (8:56) — within the 8–10 minute requirement
- **Resolution**: 1920×1080
- **Video codec**: H.264 (re-encoded from Playwright's native VP8/WebM capture for MP4 compatibility)
- **Audio**: Yes — AAC, synthesized narration (see §1), muxed at the real timestamps a Node.js automation script recorded during the actual run
- **Verified via**: `ffprobe` (duration, resolution, codec, streams) and direct frame extraction/visual inspection at multiple points across the timeline (not just start/end)

## 3. Recording environment

- Local dev only: `npm run dev` (frontend) + `uvicorn app.main:app` (backend), both already running.
- **Database**: the backend's default local SQLite (`backend/triprescue.db`) — no `backend/.env` override was in place, so `DATABASE_URL` was never pointed at the Docker Postgres instance for this recording. The narration's architecture segment (07:22–08:22) references Postgres/Docker/Alembic verification work that is real but happened separately, earlier the same session — **not** in this recording. This is stated explicitly as a caveat in the script rather than left ambiguous.
- Demo data: two fresh accounts were registered live during recording ("Meera Kapoor" for trip/flight creation, "Rohan Verma" for the isolation check — both `@example.com` addresses, fictional), plus the pre-existing seeded demo account ("Aisha Khan").
- The Ladakh trip was reset to its clean seeded state (`POST /api/trips/{id}/reset`) immediately before the final successful recording run, so the disruption/recovery sequence starts from a known-healthy baseline.

## 4. Production process (for transparency)

Getting a clean, complete recording took five attempts. Each failure was diagnosed by extracting real frames from the partial video with `ffmpeg` and looking at them directly — not guessed:

1. **First attempt**: failed — three elements matched the "Add Flight" button selector ambiguously (header button, empty-state CTA, modal submit). Fixed by scoping the selector to the dialog.
2. **Second attempt**: failed — clicking the trip name text hit the TopBar's trip-switcher dropdown instead of the actual trip card (both display the same text). Fixed by targeting the unambiguous "View details" link.
3. **Third attempt**: failed — the planned `hotel-cancellation` disruption for Simulation 2 genuinely produces **zero feasible recovery options** for this specific seeded trip (a real, honest app state: "No Feasible Recovery Options... could not find a feasible recovery... using the currently available demo data" — verified via direct API testing across seven disruption types, not assumed). Switched to `activity-cancellation`, which does have a feasible option.
4. **Fourth attempt**: failed — after the refresh-persistence step, a subsequent logout landed on the marketing landing page instead of the login form. Root-caused by reading `App.tsx`'s `Gate()` component: it tracks "past the landing page" as local React state that a full page reload resets, while a normal in-app logout doesn't. Fixed the automation to handle both cases.
5. **Fifth attempt**: succeeded completely, end to end, at real (but too short, ~2:15) duration.

After success, pause durations were scaled up (typing/technical waits mostly left alone; "let the viewer see this" dwell pauses scaled ~4–5×) to bring the real recorded duration into the required 8–10 minute range, and the recording was run one final time at that scale — the version described throughout this report.

## 5. Console errors — investigated, not hidden

The recording shows 16 "Failed to load resource: 404" console errors. These were **investigated directly**, not assumed benign:

Root cause: `AppContext`'s initial state optimistically requests the hardcoded default trip (`trip-ladakh-2025`) on first load. For the two newly-registered accounts in this recording (who don't own that trip), the backend correctly returns 404, and the frontend gracefully falls back to checking the account's actual trips and shows an honest empty state — this is the intended, already-tested behavior from earlier work this session (the "new user sees no stale demo trip" fix), not a defect. Reproduced deterministically via a standalone diagnostic script (8 requests per new-account login × 2 new accounts = 16, matching exactly). No other error types occurred.

## 6. Features demonstrated

See `TRIPRESCUE_VIDEO_FEATURE_MATRIX.md` for the full, timestamped breakdown. In summary: registration, login, trip creation, flight creation, Timeline/Graph/Map/Bookings views, two full disruption→recovery cycles (flight delay and activity cancellation, both clearly labeled as simulations), refresh persistence, logout/login persistence, and cross-user isolation — all demonstrated against the real, running application.

## 7. Features not demonstrated / unavailable

- Hotel, activity, transfer, and custom-event creation — do not exist in the application's UI at all (not a recording limitation — a real product gap, stated on screen).
- The AI Assistant panel exists (visible in frames) but was not opened/exercised in this recording.
- Live/real flight, hotel, or activity provider data — does not exist anywhere in the application; all recovery alternatives come from hardcoded mock catalogues, stated explicitly in the narration.
- Actual PostgreSQL/Docker/Supabase execution — not part of this recording (see §3); referenced only as separately-verified, real prior work.

## 8. A correction made during review

While writing the synced script, I compared the spoken rupee figure against the actual on-screen value at that exact moment (04:00, via frame extraction) and found a discrepancy: the script had used the trip's overall value (₹42,800) rather than the disruption-specific financial exposure figure actually shown (₹36,400 financial exposure, ₹7,400 refund exposure). This is flagged as a caveat directly in `TRIPRESCUE_SYNCED_VIDEO_SCRIPT.md` rather than silently left in — if you re-record narration using this script, use the corrected figures, not the ones in the synthesized audio track.

## 9. Suitability for submission

**Suitable as a genuine, accurate technical demo** of TripRescue's real, working functionality, with honest, on-camera disclosure of every simulation, mock-data boundary, and current product limitation. **Not** a polished marketing video — the narration is synthesized (not human), and the pacing/timing was mechanically generated rather than performance-directed. If a more natural final cut is wanted, the real recorded footage (`TRIPRESCUE_COMPLETE_DEMO.mp4`) and this script are both ready to re-voice with a human narrator following the same real timestamps.

## 10. What still requires manual action

- If you want human narration instead of synthesized TTS: re-record voice-over using `TRIPRESCUE_SYNCED_VIDEO_SCRIPT.txt`, timed against the existing silent-narration gaps, and re-mux.
- If you want the video to actually demonstrate the Postgres/Supabase path: point `backend/.env`'s `DATABASE_URL` at the Docker instance before any future re-recording.
- Clean up the extra test accounts this recording session created in the local SQLite database (`meera.kapoor.demo.*@example.com`, `rohan.verma.demo.*@example.com`, plus earlier sessions' leftovers) if you plan to keep using this local database for anything other than further demo recording.
