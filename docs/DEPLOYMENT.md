# Deployment

Target architecture:

```
Frontend (static build)  →  Backend API (FastAPI/uvicorn)  →  Database
                                                                 - Local dev: PostgreSQL via Docker (SQLite still works too)
                                                                 - Production: Supabase PostgreSQL (Render backend, unchanged)
```

The frontend is a static single-page app; the backend is a standard ASGI
app. Nothing here requires a specific host - any place that can serve
static files and run a long-lived Python process works (a VM, a container
platform, a PaaS). The production database is Supabase's managed Postgres,
selected entirely through `DATABASE_URL` like any other Postgres connection
- there's no Supabase-specific code anywhere in the backend, and no
Supabase SDK dependency.

## 0. Local development database

Two options, both fully supported:

**SQLite (default, zero setup)** - just run the backend; `DATABASE_URL`
defaults to a local SQLite file and everything works exactly as before.

**PostgreSQL via Docker** - closer to what production actually runs on,
useful when testing something Postgres-specific (a migration, a query that
behaves differently under Postgres' stricter typing):

```powershell
# One-time setup
copy docker.env.example .env.docker
# then edit .env.docker and set a real POSTGRES_PASSWORD (any value - this
# only protects a container bound to localhost on your own machine)

# Start it (repo root)
docker compose --env-file .env.docker up -d

# Check it's healthy
docker compose --env-file .env.docker ps

# View logs
docker compose --env-file .env.docker logs -f postgres

# Stop it (keeps data)
docker compose --env-file .env.docker stop

# Stop and remove the container (keeps the named volume - data survives)
docker compose --env-file .env.docker down

# Reset completely - deletes all local Postgres data, starts fresh
docker compose --env-file .env.docker down -v
docker compose --env-file .env.docker up -d
```

The container publishes on host port **5433** by default, not Postgres'
usual 5432, specifically so it won't collide with some other local Postgres
you might already be running for a different project - override
`POSTGRES_PORT` in `.env.docker` if 5433 is also taken. `docker compose
--env-file .env.docker ps` reports `(healthy)` once `pg_isready` succeeds
inside the container - wait for that before connecting.

Then point the backend at it (matching your `.env.docker` values) and run
the migration once (see "Database migrations" below):

```powershell
# backend/.env
DATABASE_URL=postgresql://triprescue:<your .env.docker password>@localhost:5433/triprescue
```

```powershell
cd backend
$env:DATABASE_URL = "postgresql://triprescue:<your .env.docker password>@localhost:5433/triprescue"
.\.venv\Scripts\python.exe -m alembic upgrade head
```

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
  `python -c "import secrets; print(secrets.token_hex(32))"`. This is no
  longer just a warning: if `ENVIRONMENT` is not `development`, the app
  **refuses to start** while `AUTH_SECRET` is left at its default
  (`app/config.py:enforce_secure_auth_secret`, called from the startup
  lifespan) - a forgeable session-token secret in a real deployment is a
  full account-takeover vector, not something to run with while hoping
  someone notices a log line.
- `CORS_ORIGINS` - the real origin(s) your deployed frontend will be served
  from (e.g. `https://triprescue.example.com`). Never `*` - it's paired with
  `allow_credentials=True`, and browsers reject a wildcard origin under
  credentialed CORS anyway.
- `ENVIRONMENT` - set to something other than `development` so `GET
  /api/health` reflects reality (and so `AUTH_SECRET` enforcement above
  actually applies).
- `DATABASE_URL` - SQLite is fine for local dev. **Production uses Supabase
  PostgreSQL** (see "Production database: Supabase" below) - a standard
  web-service filesystem (Render's included) is ephemeral, so a SQLite file
  there is wiped on every restart/redeploy, taking every real registered
  user's account and trips with it. Both `postgres://` and `postgresql://`
  connection-string schemes are accepted and normalized automatically to the
  installed psycopg3 driver (`postgresql+psycopg://`) - paste Supabase's
  connection string in unmodified. See "Database migrations" below for the
  required one-time step before the app can start against a fresh Postgres
  database.
- `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_RECYCLE_SECONDS` - connection
  pool tuning, Postgres-only (SQLite ignores these). Defaults (5, 10, 300s)
  are deliberately conservative - this is one backend instance, and
  Supabase's free tier has a real cap on concurrent connections. `pool_pre_ping`
  is always on for Postgres (not configurable) so a connection Supabase's
  pooler silently dropped while idle gets transparently replaced instead of
  surfacing as a query failure.
- `AUTH_TOKEN_TTL_DAYS`, `LOGIN_RATE_LIMIT`, `REGISTER_RATE_LIMIT` - sane
  defaults are set (30 days; 10/minute; 5/minute); override only if you have
  a specific reason to.
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

On startup, **against SQLite only**, the app creates the schema
(`Base.metadata.create_all`) if it doesn't exist yet - this is dev
convenience and is skipped entirely against Postgres (see "Database
migrations" below). Either way, the app then seeds the three demo trips +
demo traveler if the database is empty (`seed_if_empty`) - this part is
idempotent and safe to run on every restart, regardless of database.

### Database migrations (Alembic)

Schema is Alembic-managed (`backend/alembic/`), driven entirely by
`DATABASE_URL` - there's no separate connection string to keep in sync (see
`backend/alembic/env.py`).

**Local development (SQLite)**: nothing to do. `Base.metadata.create_all`
still runs automatically on startup, exactly as before Alembic was
introduced - Alembic exists for production schema changes, not to add
friction to `npm run dev:all`.

**Production (Postgres)**: the app deliberately does **not** run
`create_all` or any migration automatically on startup against Postgres -
auto-migrating on every process boot is how you get two instances racing to
alter the same table, or a broken deploy silently altering production
schema with no review step. Instead, run this once per schema change, as
its own deploy step, before starting (or restarting) the app process:

```powershell
cd backend
$env:DATABASE_URL = "<your Postgres connection string>"
.\.venv\Scripts\python.exe -m alembic upgrade head
```

Before running `alembic upgrade head` against a database that already has
real data in it (i.e. anything past the very first deploy), inspect the
migration that's about to run (`backend/alembic/versions/`) - confirm it
doesn't drop or alter a column you need to keep. The initial migration
(`02f207f86d70_initial_schema.py`) only *creates* tables and is safe to run
against a genuinely empty database. It's been verified end-to-end against a
real PostgreSQL 16 instance (not just SQLite): `upgrade head` → `downgrade
base` → `upgrade head` again all succeed cleanly, including the Postgres-only
cleanup of the native `ENUM` types each `sa.Enum` column creates (`downgrade`
explicitly drops them - `DROP TABLE` alone does not, which is a genuine
Postgres/SQLite divergence this migration had to account for).

### Production database: Supabase

Production uses [Supabase](https://supabase.com)'s free PostgreSQL tier.
Supabase Free currently provides a 500 MB database - suitable for
development, demos, and early users, not a permanent guarantee at scale;
revisit this if/when real usage approaches that limit. Nothing about the
backend is Supabase-specific - it's a standard Postgres connection string,
same as any other host.

**Connection mode: use Supabase's Session Mode pooler, not the direct
connection.** This isn't a style preference - verified via Supabase's own
docs and Render's own community/feature-request pages:

- Supabase's **direct connection** (`db.<project-ref>.supabase.co:5432`) is
  **IPv6-only** unless you pay for Supabase's IPv4 add-on. Not viable for a
  free-tier setup.
- **Render has no outbound IPv6 support** - a long-standing, still-open
  feature request on Render's own community/Canny boards, with no announced
  timeline. A Render-hosted backend cannot reach an IPv6-only host at all.
- Supabase's **Session Mode pooler** (`aws-0-<region>.pooler.supabase.com:5432`,
  username `postgres.<project-ref>` instead of plain `postgres`) is
  IPv4-compatible and, per Supabase's docs, "equivalent to connecting to the
  database directly" - it supports prepared statements and every other
  session-level feature this app or Alembic uses, unlike Transaction Mode
  (port 6543), which is built for serverless/edge functions opening many
  short-lived connections and explicitly does **not** support prepared
  statements. Session Mode is the correct choice here specifically because
  this is one persistent backend process with its own connection pool
  (`DB_POOL_SIZE` etc.), not a serverless function - using Transaction Mode
  would mean fighting prepared-statement incompatibilities for no benefit.
  No SQLAlchemy/psycopg/Alembic configuration changes are needed for Session
  Mode - it's a normal Postgres connection as far as this app is concerned,
  just reached through a different host/username than the direct connection.
  Concretely: SQLAlchemy's engine/pool (`app/database/session.py`), psycopg3
  (the installed driver), Alembic's migration runner, and FastAPI's
  per-request session handling (`get_db`) all treat it exactly like any
  other `postgresql+psycopg://` URL - none of them know or care that it's a
  pooler connection rather than a direct one.
- The **local Docker connection is unaffected** by any of this - it's a
  plain local IPv4 connection with no pooler involved.

So there are three distinct connection strings in play, and they are **not**
interchangeable:

| Use | Connection string | Why |
|---|---|---|
| Running Render backend (`DATABASE_URL` on the Render service) | Supabase **Session Mode pooler** | Render is IPv4-only; the pooler is IPv4-compatible and supports everything this app needs |
| One-time Alembic migrations (`alembic upgrade head`) | Supabase **Session Mode pooler** (same string) | Run from whatever machine you're on - don't assume it has IPv6 either; the pooler works everywhere and needs no special Alembic/psycopg config |
| Local development | `postgresql://triprescue:<password>@localhost:5433/triprescue` (Docker) | Plain local connection, no pooler, no IPv4/IPv6 concern at all |

Setup steps (one-time, done through Supabase's and Render's own dashboards -
not something this codebase can automate):

1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, find the **Session Mode** connection string
   (Project Settings → Database → Connection string → "Session pooler", not
   "Direct connection" and not "Transaction pooler").
3. In Render's dashboard, open the backend service's Environment settings
   and set `DATABASE_URL` to that Session Mode connection string. **Never
   paste it anywhere else** - not in this repo, not in a commit, not in chat
   with any assistant. Render's environment variable store is the only
   place it should live for production.
4. Set the other required production environment variables on the same
   Render service: `ENVIRONMENT` (anything other than `development`),
   `AUTH_SECRET` (a real generated value - see above), `CORS_ORIGINS` (your
   deployed frontend's real origin).
5. Run the migration against that same Session Mode connection string once,
   from your own machine:
   ```powershell
   cd backend
   $env:DATABASE_URL = "<the same Session Mode connection string, pasted only into your own local shell>"
   .\.venv\Scripts\python.exe -m alembic upgrade head
   ```
6. Deploy/restart the Render backend service so it picks up the new
   `DATABASE_URL`.
7. Verify: hit `GET /api/health` on the deployed backend, then actually
   register a test account, log out, log back in, create a trip, refresh,
   and confirm it's still there - the same checklist as any other deploy
   (see "Checklist" below).

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

- [ ] `DATABASE_URL` points at the Supabase Postgres connection string, not
      SQLite (SQLite in production loses all data on the next
      restart/redeploy) - set in Render's dashboard, never committed
- [ ] `alembic upgrade head` has been run against that Supabase database
      (see "Database migrations" above) - the app will not create the
      schema for you against Postgres
- [ ] `AUTH_SECRET` changed from the default (the app refuses to start
      otherwise, once `ENVIRONMENT` is non-`development` - this should be
      unmissable rather than a log line to remember to check)
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

- **Docker for the app itself**: `docker-compose.yml` at the repo root
  exists only to run local-development PostgreSQL (see "Local development
  database" above) - it does not package or run the FastAPI backend or the
  frontend. Both halves are simple enough to run directly (a Python venv +
  uvicorn; a static `dist/` folder) that containerizing the app itself adds
  packaging overhead without solving a real problem for this project's
  current size - see `docs/FUTURE_ROADMAP.md` if that changes.
- **HTTPS/TLS termination**: expected to be handled by whatever's in front
  of uvicorn (a reverse proxy, load balancer, or platform), not by the app
  itself.
- **Never send `DATABASE_URL` (or any database credential) to the
  frontend.** It's a backend-only environment variable; nothing in
  `src/services/api.ts` or anywhere else in the frontend reads or needs it.
  The backend also never logs it - `GET /api/health`'s `"database": "ok"`
  is a bare status string, not a connection-string echo, and startup
  logging (`app/main.py`) never prints `Settings` field values.
