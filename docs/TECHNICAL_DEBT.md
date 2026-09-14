# Technical Debt & Known Limitations

Honest accounting of pragmatic shortcuts in the *current* implementation that
are worth revisiting, distinct from `docs/FUTURE_ROADMAP.md` (deferred
features/integrations not built yet at all). See `docs/ARCHITECTURE.md` for
how the pieces fit together and `docs/TESTING.md` for what's covered by
tests.

## Debt items

**[Medium, resolved] Non-expiring session tokens.**
`app/services/auth_service.py`'s `verify_token` now rejects any token older
than `AUTH_TOKEN_TTL_DAYS` (default 30) by checking the timestamp already
embedded in the HMAC-signed payload against the current time. A token that
fails verification for any reason (bad signature or expiry) is rejected
with 401 by `app/api/deps.py:get_current_traveler_id`, not silently
downgraded to the demo traveler - that fallback only applies when no
`Authorization` header is sent at all. Covered by
`app/tests/test_auth.py` (expired/tampered/garbage-token cases) and
`app/tests/test_config.py`.

**[Medium, resolved] No login/register rate limiting.**
`app/api/routes/auth.py`'s `/login` and `/register` endpoints are now
rate-limited via `slowapi` (`app/core/rate_limiting.py`), keyed by client
IP, with configurable limits (`LOGIN_RATE_LIMIT`/`REGISTER_RATE_LIMIT`,
defaulting to 10/minute and 5/minute) and a 429 response on excess. This is
in-process/in-memory - fine for the current single-instance deployment, not
a substitute for a real WAF/edge rate limiter if this ever runs behind
multiple instances. Covered by `app/tests/test_auth.py`.

**[Low] Large frontend bundle, no code-splitting.** `npm run build`
currently produces a single ~588 KB (176 KB gzipped) main JS chunk; Vite's
own build output flags this as over its default chunk-size warning
threshold. `vite.config.ts` has no `manualChunks`/route-level
`React.lazy()` splitting configured.
*Fix*: split heavy routes (e.g. `RecoveryCenter`, `ItineraryGraph`'s React
Flow dependency) behind `React.lazy`/dynamic `import()`.

**[Low] Anthropic model default requires periodic review.**
`app/config.py`'s `anthropic_model` defaults to a fixed model string,
overridable via the `ANTHROPIC_MODEL` env var but not otherwise validated
against currently-available Claude models.
*Fix*: treat this default as something to revisit whenever a newer Claude
model is released, not a fixed constant.

**[Low, resolved] Pydantic `alias_generator` false-positive warning.**
Pydantic 2.12+ emits `UnsupportedFieldAttributeWarning` for the camelCase
aliases `CamelModel`'s `alias_generator` produces (`app/schemas/base.py`),
the first time each affected schema validates/serializes through FastAPI's
request/response pipeline. Confirmed (by direct reproduction on both Python
3.12 and 3.14 with the same pydantic version) to be a known upstream false
positive - pydantic's own maintainers closed
[pydantic/pydantic#12362](https://github.com/pydantic/pydantic/issues/12362),
a report of this exact warning firing incorrectly, as "not planned" - and
verified not to affect actual camelCase request/response behavior. Fixed by
scoping a `warnings.filterwarnings` to this exact warning class
(`app/schemas/base.py`) plus a matching `backend/pytest.ini` entry, rather
than changing the pinned pydantic/FastAPI versions without evidence that
doing so was necessary. A separate, unrelated `DeprecationWarning` volume
from `anyio`/`pytest-asyncio` on Python 3.14 (upstream `asyncio` API
deprecations) remains in test output and is not addressed by this fix.

## Current limitations

**Provider layer is entirely mocked.** `app/providers/base.py` defines four
interfaces (`FlightProvider`, `HotelProvider`, `ActivityProvider`,
`TransferProvider`). The only implementations that exist are the
`Mock*Provider` classes (`app/providers/mock_*_provider.py`), each holding a
small hardcoded catalogue of alternatives for the seeded demo trips. There is
no integration with Amadeus, FlightAware, Sabre, Duffel, or any other live
travel data/GDS provider - `RecoveryEngine` depends only on the interfaces,
so a real integration means implementing those same four methods and
swapping the `Mock*Provider()` instantiations in `recovery_service.py`; no
engine changes required. See `docs/FUTURE_ROADMAP.md`'s "Real travel
providers" section for the same point in more detail.

**[Resolved] No database migration tooling.** Alembic is now set up
(`backend/alembic/`), with an initial migration
(`02f207f86d70_initial_schema.py`) that reproduces the full current schema
from empty, verified to match `Base.metadata` exactly (see
`app/tests/test_migrations.py`). `create_all()` still runs automatically
against SQLite for local-dev convenience only; against Postgres it's
skipped entirely and `alembic upgrade head` is the only thing that creates
or changes schema (see `docs/DEPLOYMENT.md`'s "Database migrations"
section for the exact production procedure).

**SQLite is still the default for local development; production uses
Supabase PostgreSQL.** A standard web-service host's filesystem (Render's
included) is typically ephemeral, so a SQLite file in production loses all
data - every registered user's account and trips - on the next
restart/redeploy. `app/config.py`'s `resolved_database_url` normalizes both
`postgres://` and `postgresql://` connection strings to the installed
psycopg3 driver, so Supabase's connection string works unmodified once set
as `DATABASE_URL` in Render's environment settings. Local Postgres via
Docker (`docker-compose.yml`, repo root) is also fully supported for
development, verified against a real Postgres 16 instance - not just
SQLite - including connection pooling (`app/database/session.py`'s
`engine_kwargs_for`, Postgres-only `pool_pre_ping`/pool sizing tuned for a
hosted, connection-capped database) and the Alembic migration cycle (see
`app/tests/test_postgres_integration.py`, `app/tests/test_migrations.py`).
Supabase's free tier currently caps database size at 500 MB - fine for
development/demo/early-user stage, not assumed to be a permanent ceiling.
See `docs/DEPLOYMENT.md`.

## Deferred features

See `docs/FUTURE_ROADMAP.md` for the current, actively-maintained list of
deferred features and integrations. Several items originally listed there
(multi-trip UI, activity-vs-activity conflict resolution, multi-trip auth,
committed frontend automated tests) have since been implemented and are
marked done in that document rather than duplicated here.
