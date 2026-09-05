# API Spec

Base URL: `http://localhost:8000` (configured on the frontend via
`VITE_API_BASE_URL`). Interactive docs at `/docs` (Swagger) once the backend
is running. All bodies/responses are JSON; response field names are
camelCase to match the frontend's existing TypeScript types exactly.

## Health

`GET /api/health` → `{ "status": "ok" }`

## Trips

`GET /api/trips` → list of trip summaries (id, name, route, dates, value,
health score, status, node/edge counts). Seeded with three trips:
`trip-ladakh-2025`, `trip-goa-2026`, `trip-rajasthan-2026`.

`GET /api/trips/{trip_id}` → full `Trip` object: nodes, edges, days,
value/health/status. 404 if the trip doesn't exist.

`GET /api/trips/{trip_id}/graph` → identical payload to the above (nodes+edges
*are* the graph); kept as its own endpoint since the frontend's graph view
addresses it separately.

`GET /api/trips/{trip_id}/risks` → `{ score, cards, alerts }` - trip-level
risk score breakdown, per-node risk cards, and proactive alerts, all computed
live from current itinerary state.

`GET /api/trips/{trip_id}/bookings` → list of bookings (excludes the
synthetic connection node - 7 for the Ladakh trip's 8 nodes).

`GET /api/trips/{trip_id}/activity` → activity log, newest first.

`GET /api/trips/{trip_id}/notifications` → notifications, newest first.

`POST /api/trips/{trip_id}/notifications/read` → marks all read. 204.

`POST /api/trips/{trip_id}/preferences` → body: `TravelerPreferences`
(`costVsSpeed`, `disruptionVsComfort`, `recoveryPriorities`). Persists to the
traveler record; does **not** itself regenerate recovery options - call
`recovery-options/generate` again to re-rank with the new weights. 204.

`POST /api/trips/{trip_id}/reset` → restores the trip to its original seeded
state (nodes/edges/bookings/status/health score) and clears any
disruption/recovery history. Returns the restored `Trip`.

## Disruptions

`POST /api/trips/{trip_id}/disruptions` → body: `{ type, primaryNodeId?,
delayMinutes? }`. `type` is one of `flight-delay`, `flight-cancellation`,
`missed-connection`, `hotel-conflict`, `hotel-cancellation`,
`transfer-failure`, `activity-cancellation`, `activity-delay`,
`airport-closure`. `primaryNodeId` defaults to a sensible node for that type
on the Ladakh trip (or the first node of the matching category on other
trips) if omitted. Runs propagation, **persists** the disruption/cascade
steps/updated node+edge statuses/activity+notification, and returns
`{ disruption, impacts[], sequence[], tripHealthScore }`. 400 for an unknown
type or invalid node id.

`POST /api/trips/{trip_id}/propagate` → re-runs propagation for the
currently active (unresolved) disruption without creating a new one. 400 if
there's no active disruption.

`POST /api/trips/{trip_id}/simulate` → same computation as `/disruptions`
but **writes nothing to the database** - a dry-run preview used by the
disruption picker UI to show live impact numbers before committing.

## Recovery

`POST /api/trips/{trip_id}/recovery-options/generate` → runs the recovery
search against the currently active disruption and the trip's current
traveler preferences, persists the resulting plans (replacing any
previously-generated, not-yet-applied ones for that disruption), and returns
them ranked by score, richest-first. 400 if there's no active disruption.

`POST /api/trips/{trip_id}/recovery/apply` → body: `{ recoveryId }`. Applies
every action in that plan (rebooks/reschedules nodes and their bookings,
detaches them from whatever dependency broke them), re-propagates, recomputes
health score, marks the disruption resolved if nothing remains broken,
creates an activity event + notification, and returns
`{ trip, appliedRecovery, activityEvent, notification }`. 404 if the plan id
doesn't belong to this trip.

## Assistant

`POST /api/assistant` → body: `{ tripId, message }`. Returns
`{ content, references[], source }` where `source` is `"llm"` (Anthropic API
key configured and reachable) or `"deterministic"` (fallback, always
available). The assistant only ever answers from the trip's actual current
state (nodes, active/resolved disruption, recovery options, risk) - it does
not have general knowledge of the trip beyond what's in the database.

## Auth (not wired into the frontend)

`POST /api/auth/register`, `POST /api/auth/login`, `GET
/api/auth/demo-account` - see `ARCHITECTURE.md` and `FUTURE_ROADMAP.md` for
why these exist without a login screen consuming them yet.

## Error shape

Every error response is `{ "detail": "<message>" }` with an appropriate HTTP
status (400 invalid input, 404 not found, 500 unhandled - the last one always
returns a generic message, never a stack trace, via the global exception
handler in `app/main.py`).
