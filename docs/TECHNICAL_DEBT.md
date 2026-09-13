# Technical Debt & Known Limitations

Honest accounting of pragmatic shortcuts in the *current* implementation that
are worth revisiting, distinct from `docs/FUTURE_ROADMAP.md` (deferred
features/integrations not built yet at all). See `docs/ARCHITECTURE.md` for
how the pieces fit together and `docs/TESTING.md` for what's covered by
tests.

## Debt items

**[Medium] Non-expiring session tokens.** `app/services/auth_service.py`'s
`create_token`/`verify_token` embed a timestamp in the HMAC-signed token but
never check its age - a token remains valid indefinitely once issued, as
long as `AUTH_SECRET` doesn't change. The auth system's own docstring
already describes it as "minimal local-development authentication," which
this is consistent with; it isn't sized for a real deployment.
*Fix*: reject tokens older than a fixed TTL in `verify_token`.

**[Medium] No login/register rate limiting.** `app/api/routes/auth.py`'s
`/login` and `/register` endpoints have no throttling - nothing in
`requirements.txt` or `app/main.py` rate-limits repeated failed logins or
account-creation requests at the API layer.
*Fix*: add a rate-limiting dependency (e.g. `slowapi`) or enforce a limit at
the reverse-proxy layer before any non-local deployment.

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

**No database migration tooling.** Schema changes currently mean deleting
`triprescue.db` and letting SQLAlchemy's `create_all()` rebuild it - fine
while there's no persisted user data worth preserving. See
`docs/FUTURE_ROADMAP.md`.

## Deferred features

See `docs/FUTURE_ROADMAP.md` for the current, actively-maintained list of
deferred features and integrations. Several items originally listed there
(multi-trip UI, activity-vs-activity conflict resolution, multi-trip auth,
committed frontend automated tests) have since been implemented and are
marked done in that document rather than duplicated here.
