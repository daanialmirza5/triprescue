# Security Policy

## Supported Versions

TripRescue actively maintains security patches and updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Architecture & Controls

TripRescue is engineered with security and tenant isolation by design:

1. **Authentication & JWT Token Verification**:
   - Authentication utilizes stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`).
   - Passwords are encrypted using salted `bcrypt` hashes.
   - Tokens carry an expiration timestamp and traveler identity (`sub` claim).
   - Tampered, expired, or malformed tokens are rejected with `HTTP 401 Unauthorized`.

2. **Data & Multi-Tenant Isolation**:
   - Every itinerary node, booking, disruption, preference, and notification is strictly scoped to the authenticated `traveler_id`.
   - Access attempts to itineraries or nodes belonging to other users return `HTTP 404 Not Found` without disclosing resource existence.

3. **Input Validation & Sanitization**:
   - All REST API endpoints enforce Pydantic schema validation.
   - String inputs are trimmed and bounded to prevent buffer overload or memory exhaustion.
   - Dates and times are strictly checked for chronological order (e.g. end date >= start date).

4. **Rate Limiting & Abuse Prevention**:
   - Sensitive endpoints (authentication, disruption simulation, AI queries) are protected by IP-based rate limiting via SlowAPI to prevent brute-force attacks and resource exhaustion.

5. **Cross-Origin Resource Sharing (CORS)**:
   - Configurable allowed origins via `CORS_ORIGINS` environment variable. Production builds reject wildcard `*` origins with credentials.

---

## Reporting a Vulnerability

If you discover a potential security vulnerability in TripRescue, please report it responsibly:

- **Email**: `daanialmirza@gmail.com`
- **Subject**: `[TripRescue Security Disclosure] <Short Description>`
- Please include steps to reproduce, expected vs actual behavior, and potential impact.

We appreciate your responsible disclosure and will respond promptly to investigate and patch confirmed issues.
