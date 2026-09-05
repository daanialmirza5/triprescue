# Deployment

Target architecture:

```
Frontend (static build)  →  Backend API (FastAPI/uvicorn)  →  Database (SQLite)
```

The frontend is a static single-page app; the backend is a standard ASGI
app. Nothing here requires a specific host - any place that can serve
static files and run a long-lived Python process works (a VM, a container
platform, a PaaS).

## 1. Backend

### Install and configure

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
```

Then edit `.env` for the target environment - at minimum:

- `AUTH_SECRET` - **must** be changed from the default. Generate one with
  `python -c "import secrets; print(secrets.token_hex(32))"`. The app logs a
  startup warning (visible in your process logs) if this is still the
  insecure default - treat that warning as a deploy blocker.
- `CORS_ORIGINS` - the real origin(s) your deployed frontend will be served
  from (e.g. `https://triprescue.example.com`). Never `*` - it's paired with
  `allow_credentials=True`, and browsers reject a wildcard origin under
  credentialed CORS anyway.
- `ENVIRONMENT` - set to something other than `development` so `GET
  /api/health` reflects reality.
- `DATABASE_URL` - the default SQLite file is fine for a single-instance
  demo deployment. It has no concurrent-writer story beyond what SQLite
  itself provides, and there's no migration tooling yet (see
  `docs/FUTURE_ROADMAP.md`) - a schema change means recreating the DB file.
- `ANTHROPIC_API_KEY` - optional. Leave unset to run entirely on the
  deterministic assistant fallback.

### Run it

Development (`--reload`) is **not** a production configuration - it watches
the filesystem and restarts on every change, which is unnecessary overhead
and a larger attack surface in a real deployment:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For more than a single demo instance, run multiple uvicorn workers behind a
process manager, e.g.:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

On startup the app creates the SQLite schema (`Base.metadata.create_all`) if
it doesn't exist yet, and seeds the three demo trips + demo traveler if the
database is empty (`seed_if_empty`) - this is idempotent and safe to run on
every restart.

### Verify

```powershell
curl http://<host>:8000/api/health
```

A healthy response looks like:

```json
{"status": "ok", "database": "ok", "environment": "production"}
```

`status` becomes `"degraded"` if the database check fails, without leaking
any connection details or stack traces.

## 2. Frontend

### Build

```powershell
npm install
copy .env.example .env.production   # or set VITE_API_BASE_URL some other way
npm run build
```

`VITE_API_BASE_URL` must point at wherever the backend from step 1 is
reachable (its public URL, not `localhost`, once deployed). Vite bakes this
into the build at build time - it's a `VITE_`-prefixed variable, so it's
already public in the shipped JS; never put a backend secret in it.

This produces a static `dist/` directory - `npm run preview` serves it
locally to sanity-check the production build; in a real deployment, serve
`dist/` from any static file host (a CDN, a simple nginx/static file server,
a platform's static-site hosting) - there is no Node.js server required at
runtime for the frontend.

### CORS

The backend's `CORS_ORIGINS` (step 1) must include the exact origin the
static frontend is served from, or every API call from the browser will be
blocked by CORS.

## 3. Checklist before calling a deployment done

- [ ] `AUTH_SECRET` changed from the default (check the backend's startup
      logs for the warning - it should be absent)
- [ ] `CORS_ORIGINS` set to the real frontend origin(s), not `*` and not
      `localhost`
- [ ] `ENVIRONMENT` set to a non-`development` value
- [ ] Backend run without `--reload`
- [ ] `GET /api/health` returns `"status": "ok"` from the deployed backend
- [ ] Frontend `VITE_API_BASE_URL` points at the deployed backend's public
      URL, and a fresh `npm run build` was done after setting it
      (Vite env vars are baked in at build time, not read at runtime)
- [ ] A browser hitting the deployed frontend can log in (demo account or
      register) and load a trip with no CORS/console errors

## Not currently included

- **Docker**: not provided. Both halves are simple enough to run directly
  (a Python venv + uvicorn; a static `dist/` folder) that a container adds
  packaging overhead without solving a real problem for this project's
  current size - see `docs/FUTURE_ROADMAP.md` if that changes.
- **Database migrations**: schema changes mean recreating the SQLite file.
  Fine pre-launch; introduce Alembic once there's real user data worth
  preserving across a schema change.
- **HTTPS/TLS termination**: expected to be handled by whatever's in front
  of uvicorn (a reverse proxy, load balancer, or platform), not by the app
  itself.
