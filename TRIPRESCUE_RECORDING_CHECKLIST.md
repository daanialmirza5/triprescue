# TripRescue — Recording Checklist

Work through this in order. Sections A–C happen *before* you press record; D is the recording session itself; E is what to verify afterward (mirrors the user's own "Final verification" requirements).

---

## A. Environment setup (do this first)

- [ ] **Reset the local dev database** (your decision from the planning conversation): delete `backend/triprescue.db` so it reseeds clean on next backend startup. This removes the leftover test accounts and the "nn" trip on your own account. Back it up first if you want to keep anything from it.
  ```powershell
  cd backend
  # stop the backend first (Ctrl+C in its terminal) so the file isn't locked
  Remove-Item .\triprescue.db
  ```
- [ ] **Point the backend at local Docker Postgres** (so the architecture section's claims are true on screen, not just asserted):
  ```powershell
  docker compose --env-file .env.docker up -d
  docker compose --env-file .env.docker ps   # confirm "healthy"
  ```
  Create `backend/.env` (copy from `backend/.env.example`) and set:
  ```
  DATABASE_URL=postgresql://triprescue:<your .env.docker password>@localhost:5433/triprescue
  ```
  Run the migration once against it:
  ```powershell
  cd backend
  $env:DATABASE_URL = "postgresql://triprescue:<your .env.docker password>@localhost:5433/triprescue"
  .\.venv\Scripts\python.exe -m alembic upgrade head
  ```
- [ ] Start both dev servers fresh:
  ```powershell
  # backend/
  .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
  # repo root
  npm run dev
  ```
- [ ] Confirm `GET http://localhost:8000/api/health` returns `{"status":"ok","database":"ok",...}`.
- [ ] **Pre-register the second account** used only in Simulation 3 (do this now, not on camera): pick a realistic but clearly fictional name/email, e.g. "Rohan Verma / rohan.verma.demo@example.com".
- [ ] Decide and note your first account's demo credentials (the one you'll register live in Section 2) — realistic but fictional, e.g. "Meera Kapoor / meera.kapoor.demo@example.com".

## B. Rehearsal (do not skip — this is where the accuracy rules get enforced)

- [ ] **Full dry run of Section 4 (Adding a flight) specifically.** This code path was never live-browser-verified during development (a tooling limitation blocked it) — confirm it actually works exactly as scripted before it's part of a real take. If it doesn't, stop and get it fixed before recording rather than scripting around a broken flow.
- [ ] Dry-run the full script once, out loud, with the app in front of you, stopwatch running. Note where your actual timing diverges from the script's section budgets.
- [ ] Confirm the seeded Ladakh trip is in its original healthy state (if you've triggered disruptions on it during rehearsal, use its Reset button before the real take).
- [ ] Confirm Simulation 2 (hotel cancellation) genuinely works — trigger it once during rehearsal, apply a recovery, then reset the trip again before recording.

## C. Recording environment

- [ ] Screen resolution set to 1920×1080 (or your recorder's 1080p capture area matches this).
- [ ] Browser: clean profile/window, no extension icons, no bookmarks bar, no other tabs open.
- [ ] Close Slack/Discord/email/notification popups — anything that could interrupt or appear on screen.
- [ ] Close any terminal windows showing file paths, environment variables, or other machine-identifying info you don't want visible.
- [ ] Zoom level decided and fixed (100% or a slightly larger size for readability) — don't change it mid-recording.
- [ ] Screen recorder ready (OBS Studio, Windows Game Bar, or similar), set to 1080p, with system + microphone audio levels checked.
- [ ] Mouse-click highlighting enabled if your recorder supports it (many do, e.g. OBS's cursor-click plugin, or Windows' own pointer options).
- [ ] `TRIPRESCUE_VIDEO_SCRIPT.txt` open on a second monitor or printed, for reading.

## D. During recording

- [ ] Move the mouse deliberately and a little slower than feels natural — it reads as normal at 1x on the actual recording.
- [ ] Pause for ~1–2 seconds after every state change (form submit, page navigate, disruption trigger) before speaking the next line — this is what gives loading states and transitions room to actually be visible.
- [ ] Speak the on-screen simulation labels out loud when they appear ("Simulation 1: Flight Delay — this is simulated") — reinforces the label for anyone watching without sound too.
- [ ] If a take goes wrong, don't try to edit around it live — stop, reset the affected trip if needed (see below), and re-take that section cleanly. It's much easier to fix in one continuous re-take than to patch a jump cut later.
- [ ] **Trip reset between takes**: if you re-record Simulation 1 or 2 after a failed take, use the trip's Reset button (or `POST /api/trips/{id}/reset`) to restore the Ladakh trip to its seeded healthy state before trying again — don't record a "disruption" on an already-disrupted trip, it won't match the narration.

## E. Post-recording verification (matches the user's own requirements)

- [ ] Play back the entire recording start to finish.
- [ ] Confirm total runtime is between 8:00 and 10:00.
- [ ] Confirm the narration you actually said matches what's on screen at each timestamp (re-time any section that drifted and update the script/SRT if you deviated significantly from the written narration).
- [ ] Confirm every feature named in the Feature Coverage Matrix (`TRIPRESCUE_RECORDING_PLAN.md`) that's marked "Shown" actually appears on screen.
- [ ] Confirm both on-screen simulation labels ("Simulation 1"/"Simulation 2") are visible and readable.
- [ ] Confirm no password characters, raw session tokens, `.env` file contents, database connection strings, or the Docker Postgres password are visible anywhere in the frame (check any terminal cutaways especially carefully).
- [ ] Confirm you didn't say anything implying hotels/activities/custom events can be created through the UI (they can't) — the script is written to avoid this, but ad-libbing during recording is where this kind of overclaim tends to slip in.
- [ ] Confirm you didn't claim the production deployment is on Supabase — it isn't yet; the script only claims it's configured/tested locally.
- [ ] If you generated/edited an SRT file to match your actual recording, spot-check 4–5 timestamps against the audio for sync drift.
- [ ] Confirm no code was committed or pushed as part of any of this (recording a video involves no git operations at all — if you touched `backend/.env` or reset the database, those are local-only, untracked/gitignored changes).

## F. After recording — what to update

- [ ] If your actual timing diverged meaningfully from the script (more than ~15–20 seconds per section), update the timestamps in `TRIPRESCUE_VIDEO_SCRIPT.md`/`.txt` and `TRIPRESCUE_SUBTITLES.srt` to match the real recording — the script should describe the video you made, not the other way around.
- [ ] Decide whether to commit these planning/script files to the repo (they're currently just local files, same as `TripRescue_Presentation_Script.txt` already sitting there) — that's a separate decision from anything in this checklist.
