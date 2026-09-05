# API Pipeline

The actual endpoints, as implemented in `backend/app/api/routes/`. All request/response bodies are camelCase JSON (via `schemas/base.py:CamelModel`); all routes except `/api/health` and `/api/auth/*` resolve the caller through `api/deps.py:get_current_traveler_id` and enforce trip ownership in the service layer (a trip you don't own 404s).

## Health

| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | `{status, database, environment}` - `database` reflects a real `SELECT 1`, not a hardcoded `"ok"`. |

## Auth (`routes/auth.py`)

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` | Creates a traveler, returns `{token, travelerId, name, email}`. |
| POST | `/api/auth/login` | PBKDF2-verified password check. |
| GET | `/api/auth/demo-account` | Token for the seeded demo traveler (`traveler-aisha`). |
| GET | `/api/auth/me` | Current traveler's profile (name/email/home airport/loyalty tier). |

## Trips (`routes/trips.py`)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/trips` | Filtered to the caller's own trips. |
| GET | `/api/trips/{id}` | Full trip: nodes, edges, days, health score. |
| GET | `/api/trips/{id}/graph` | Same payload as above (frontend graph view addresses it separately). |
| GET | `/api/trips/{id}/risks` | `RiskAnalysisOut` - score + per-node risk cards + alerts, computed fresh, works with no active disruption. |
| GET | `/api/trips/{id}/bookings` | Booking-shaped view of the bookable nodes. |
| GET | `/api/trips/{id}/activity` | Activity log, chronological. |
| GET | `/api/trips/{id}/notifications` | Notification list. |
| POST | `/api/trips/{id}/notifications/read` | Marks all read. |
| GET | `/api/trips/{id}/preferences` | Persisted `TravelerPreferences`. |
| POST | `/api/trips/{id}/preferences` | Persists preferences (this is what actually re-weights recovery ranking). |
| POST | `/api/trips/{id}/reset` | Restores the seeded healthy state deterministically. |

## Disruptions (`routes/disruptions.py`)

| Method | Path | Notes |
|---|---|---|
| POST | `/api/trips/{id}/disruptions` | Runs `PropagationEngine`, persists the `Disruption` + `CascadeStep` rows, updates every node/edge status, returns `PropagationResultOut`. |
| POST | `/api/trips/{id}/simulate` | Dry-run preview for the disruption picker UI - computes the same propagation + financial exposure + health score, persists nothing. |
| POST | `/api/trips/{id}/propagate` | Re-runs propagation for the currently active disruption without creating a new one. |

## Recovery (`routes/recovery.py`)

| Method | Path | Notes |
|---|---|---|
| POST | `/api/trips/{id}/recovery-options/generate` | Requires an active disruption (400 otherwise); returns ranked `RecoveryOptionOut[]`, at least 3 for the hero scenario. |
| POST | `/api/trips/{id}/recovery/apply` | Body: `{recoveryId}`. Transactional apply - see `docs/BACKEND_PIPELINE.md`. |

## Assistant (`routes/assistant.py`)

| Method | Path | Notes |
|---|---|---|
| POST | `/api/assistant` | Body: `{tripId, message}`. Grounded in live trip/disruption/recovery/risk state; deterministic fallback when no LLM key is configured. |

## Error shape

Every non-2xx response is `{"detail": "<message>"}`. Unhandled exceptions are caught by a generic handler in `main.py` and returned as a sanitized `500` (no stack trace, no internals) - verified in production-mode testing (see `docs/DEPLOYMENT.md`).
