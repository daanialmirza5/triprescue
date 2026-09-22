# ADR-003: Strict Multi-Tenant Authorization and Demo Session Isolation

## Status
Accepted

## Context
TripRescue supports both authenticated user accounts and an unauthenticated demo mode for interactive evaluation during hackathons and product demonstrations. We must guarantee that:
1. Authenticated travelers can never view, mutate, disrupt, or recover trips belonging to another traveler.
2. Demo mode users can explore seeded trips without polluting production traveler accounts.
3. Client request bodies can never override or supply arbitrary traveler IDs to spoof trip ownership.

## Decision
We enforce authorization at the dependency injection and repository layers:
- `get_current_traveler_id`: FastAPI dependency extracting `traveler_id` exclusively from verified JWT tokens in the `Authorization: Bearer <token>` header. If no header is present, it falls back to the deterministic demo traveler ID.
- If a malformed or expired token is passed, the request is immediately rejected with HTTP 401 Unauthorized (never silently downgraded to demo).
- Request schemas (`TripCreateRequest`, `NodeCreateRequest`) omit `traveler_id` entirely—ownership is always bound by the authenticated session token.
- Repositories filter all trip mutations with `WHERE trip_id = :trip_id AND traveler_id = :traveler_id`.

## Consequences
### Positive
- Zero horizontal privilege escalation risk between travelers.
- Clean isolation between demo exploration and real user trips.
- Verifiable security through automated multi-user test fixtures.

### Negative / Trade-offs
- Every API route modifying or fetching trip state must invoke the ownership dependency.
