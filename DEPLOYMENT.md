# Deploying SafarSathi: Neon + Render + Vercel

This is the full, step-by-step path to a live deployment: **Neon** for the database,
**Render** for the FastAPI backend, **Vercel** for the React frontend. Everything here
is additive to local development — nothing in this guide changes how `npm run dev` or
SQLite-based local testing works.

Total cost on the tiers below: **$0**. All three have workable free tiers for a
hackathon/demo deployment. Render's free tier does spin down on idle (see
Troubleshooting at the end).

**Deploy order matters**: Neon → Render (backend) → Vercel (frontend) → back to Render
to set the real `CORS_ORIGINS` once you know the Vercel URL. You'll touch Render twice;
that's expected, not a mistake.

---

## 0. Prerequisites

- This repo pushed to a GitHub repository you control (Render and Vercel both deploy
  from a Git repo, not a zip upload).
- A GitHub account, and a free account on [neon.tech](https://neon.tech),
  [render.com](https://render.com), and [vercel.com](https://vercel.com) — all three let
  you sign up with GitHub directly, which also makes connecting the repo a one-click step.

---

## 1. Database — Neon

1. Go to [neon.tech](https://neon.tech) → sign up / log in → **Create a project**.
2. Name it (e.g. `safarsathi`), pick a region close to you or your judges, and use the
   default Postgres version.
3. Once created, Neon shows a **connection string** on the project dashboard — something
   like:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
   ```
   Click "Copy" — you'll paste this into Render in the next section as `DATABASE_URL`.
4. Nothing else to do here. You do **not** need to create tables manually — the
   backend's Alembic migrations create the schema automatically on first deploy (wired
   into `backend/docker-entrypoint.sh`, which runs `alembic upgrade head` before the app
   starts every time the container boots).
5. Neon's free tier auto-suspends the database after a period of inactivity and wakes it
   up on the next query with a short delay (a few hundred ms to a couple of seconds) —
   this is normal and not a bug you need to work around.

**API keys needed for this step: none.** Neon's connection string doubles as its own
credential — there's no separate API key.

---

## 2. Backend — Render

### 2a. Create the service

1. Go to [render.com](https://render.com) → sign up / log in → **New** → **Blueprint**.
2. Connect your GitHub account and pick this repository. Render will detect
   `render.yaml` at the repo root and propose the `safarsathi-backend` service defined
   in it (Docker runtime, builds from `backend/Dockerfile`, health check at
   `/api/health`).
3. Click through to create it. The first deploy will likely **fail or crash-loop** —
   that's expected, because the required environment variables (marked `sync: false` in
   `render.yaml`) aren't filled in yet. Fill them in next.

### 2b. Set environment variables

In the Render dashboard, open the `safarsathi-backend` service → **Environment** tab,
and set these:

| Variable | Required? | Value | Where to get it |
|---|---|---|---|
| `DATABASE_URL` | **Required** | Your Neon connection string from step 1 | Neon dashboard |
| `AUTH_SECRET` | **Required** | A random 64-char hex string | Run locally: `python -c "import secrets; print(secrets.token_hex(32))"` — paste the output. **Never reuse the repo's dev default; the app refuses to boot in production with it anyway.** |
| `CORS_ORIGINS` | **Required** | Your Vercel frontend URL(s), comma-separated | You won't have this yet on the first pass — use a placeholder like `https://placeholder.vercel.app` for now, come back and set the real one after step 3 |
| `ENVIRONMENT` | Already set | `production` | Set in `render.yaml`, no action needed |
| `REQUIRE_AUTHENTICATION` | Already set | `true` | Set in `render.yaml` — real deployments should not fall back to a demo traveler for unauthenticated requests |
| `SEED_DEMO_DATA` | Already set | `false` | Set in `render.yaml` — keeps your production DB empty of demo trips; use "Continue as Demo Traveler" only in local dev |

Everything else in `render.yaml` is **optional** — the app runs fully without any of
them, falling back to deterministic/heuristic behavior. Fill in only what you want live:

| Variable | What it enables | Where to get it | If left blank |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Real LLM-backed Sathi assistant (tool-calling, conversational answers) | [console.anthropic.com](https://console.anthropic.com) → API Keys | Assistant falls back to a deterministic, engine-grounded responder — the app stays fully functional |
| `NUGEN_API_KEY` | Nugen-aligned model narratives for the Digital Twin what-if flow (HackCelestial Addendum B) | [docs.nugen.in](https://docs.nugen.in) — create an account, generate a key | Digital Twin falls back to the built-in heuristic reasoning engine |
| `AMADEUS_CLIENT_ID` / `AMADEUS_CLIENT_SECRET` | Real flight data instead of mock flights (needs `PROVIDER_MODE=live` too) | [developers.amadeus.com](https://developers.amadeus.com) → free "Self-Service" API key | Flights use the built-in mock provider |
| `AVIATIONSTACK_API_KEY` | Live flight tracking data (`/live` endpoints) | [aviationstack.com](https://aviationstack.com) → free tier | That endpoint answers "not configured" instead of erroring |
| `RAILRADAR_API_KEY` | Live Indian rail tracking data | [railradar.in](https://railradar.in) | Same — endpoint answers "not configured" |
| `TICKETMASTER_API_KEY` | Live event/activity data | [developer.ticketmaster.com](https://developer.ticketmaster.com) | Same |
| `SENTRY_DSN` | Error tracking/observability | [sentry.io](https://sentry.io) → create a project → copy DSN | No error tracking, logs only |

**You do not need to touch `PLACES_PROVIDER`/`nominatim`/`overpass`, weather, or social
signals settings** — Open-Meteo (weather) and Mastodon public search (social signals)
are both free and keyless, already on by default.

### 2c. Deploy and verify

1. Save the environment variables — Render redeploys automatically.
2. Watch the deploy log. You should see:
   ```
   Running database migrations (alembic upgrade head)...
   ...
   Running upgrade  -> 02f207f86d70, initial schema
   ...
   Starting application...
   ```
   If migrations fail here, it's almost always a wrong `DATABASE_URL` — double-check you
   copied Neon's full connection string including `?sslmode=require`.
3. Once live, visit `https://<your-service>.onrender.com/api/health` — you should get a
   JSON `200 OK` response. **Copy this URL** — you need it for Vercel next.

---

## 3. Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → sign up / log in → **Add New** → **Project**.
2. Import the same GitHub repository.
3. When Vercel asks for the project's root directory, set it to `frontend` (this repo is
   a monorepo with `backend/` and `frontend/` as siblings — Vercel needs to know the
   frontend lives in a subfolder). Vercel will auto-detect Vite from `frontend/vercel.json`.
4. Before deploying, add one environment variable under **Settings → Environment
   Variables**:

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | Your Render backend URL from step 2c, e.g. `https://safarsathi-backend.onrender.com` |

   Leave `VITE_BASE_PATH` unset — it defaults to `/`, which is correct for a Vercel
   project served from its own domain (it's only needed for sub-path hosts like GitHub
   Pages).
5. Click **Deploy**. Vercel builds and gives you a URL like
   `https://safarsathi.vercel.app`.

**API keys needed for this step: none.** Vercel needs no third-party keys of its own —
it's purely a static host for the built frontend.

---

## 4. Close the loop: point the backend at the real frontend URL

Go back to Render (§2b) and update `CORS_ORIGINS` from the placeholder to your real
Vercel URL, e.g.:

```
CORS_ORIGINS=https://safarsathi.vercel.app
```

Add more comma-separated origins if you also want a custom domain or a preview URL to
work. Save — Render redeploys. **This step is easy to forget and the failure mode is
confusing**: the frontend will load fine, but every API call from the browser will fail
with a CORS error in the console, while `curl`-ing the backend directly works perfectly.
If that happens, this is the first thing to check.

---

## 5. Post-deploy checklist

- [ ] Visit the Vercel URL, click "Get Started" / sign up a real account, and confirm
      you can create a trip end-to-end (not "Continue as Demo Traveler" — that signs in
      as the shared seeded demo traveler, which only exists while `SEED_DEMO_DATA` is on).
- [ ] Confirm `REQUIRE_AUTHENTICATION=true` and `SEED_DEMO_DATA=false` are actually set
      on Render (§2b) — these are the two settings that most distinguish "hackathon demo
      config" from "real deployment config."
- [ ] If you filled in `ANTHROPIC_API_KEY` and/or `NUGEN_API_KEY`, actually exercise the
      Sathi assistant and the Digital Twin what-if simulation once each, live, to confirm
      the keys work — don't just trust that setting the env var was enough (see
      `IMPLEMENTATION-CHECKLIST.md` §8, this exact gap is called out there).
- [ ] Update `README.md` §26 "Live Demo" with your real Vercel/Render URLs (currently
      TODO placeholders after the branding cleanup).

---

## Troubleshooting

- **Render free-tier cold start**: the free plan spins the service down after ~15
  minutes of no traffic. The first request after that takes up to ~60 seconds while it
  spins back up. Mention this up front in a live demo so nobody thinks it's hung — or
  hit the health endpoint yourself a minute before you present.
- **"relation does not exist" errors on first use**: migrations didn't run. Check the
  Render deploy log for the `alembic upgrade head` output described in §2c; if it's
  missing entirely, confirm the Dockerfile still has the `ENTRYPOINT
  ["/docker-entrypoint.sh"]` line and that `docker-entrypoint.sh` was actually committed
  (`git status` — it's a new file added during the deployment-hardening pass and easy to
  forget to `git add`).
- **CORS errors in the browser console, backend works via curl**: see §4 — `CORS_ORIGINS`
  on Render doesn't match your actual Vercel URL.
- **App won't boot at all on Render, log says "Refusing to start"**: this is the
  intentional guard in `app/config.py::enforce_secure_auth_secret` — `AUTH_SECRET` is
  still the insecure default. Set a real one (§2b).
- **Neon connection errors under load**: the free tier caps concurrent connections; the
  backend's pool settings (`DB_POOL_SIZE=5`, `DB_MAX_OVERFLOW=10`) are already
  conservative for this reason — don't raise them on a free-tier Neon database.
- **Local Docker Compose verification**:
  ```bash
  # Test the full stack locally with compose
  docker compose up --build -d
  # Verify backend health check
  curl -s http://localhost:8000/api/health
  # View backend logs
  docker compose logs -f backend
  ```
- **Checking Migration State**:
  ```bash
  # Check current Alembic migration revision
  docker compose exec backend alembic current
  ```

