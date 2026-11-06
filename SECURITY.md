# Security Policy

## Supported Versions

SafarSathi actively maintains security patches and updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Security Architecture & Controls

SafarSathi is engineered with security and tenant isolation by design:

1. **Authentication & Session Token Verification**:
   - Sessions use a small, stdlib-only signed token (`traveler_id:issued_at:signature`, base64-encoded), HMAC-signed with SHA-256 using `AUTH_SECRET`, and verified with `hmac.compare_digest` (constant-time comparison) - see `app/services/auth_service.py`. This is a custom scheme, not a JWT library, to keep the dependency footprint minimal.
   - Passwords are hashed with salted PBKDF2-HMAC-SHA256 (200,000 iterations, stdlib `hashlib`), not bcrypt.
   - Tokens embed an issued-at timestamp; requests older than `AUTH_TOKEN_TTL_DAYS` are rejected. There is no server-side revocation list, so expiry is the only way a token stops working before its holder logs in again.
   - Tampered, expired, or malformed tokens are rejected with `HTTP 401 Unauthorized`.
   - The backend refuses to boot with the default `AUTH_SECRET` ("dev-secret-change-me") whenever `ENVIRONMENT` is not `development` - enforced at startup, not just documented (see `app/config.py`).

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

If you discover a potential security vulnerability in SafarSathi, please report it responsibly:

- **Email**: `your-team-email@example.com` (⚠️ TODO: replace with your real contact email before publishing)
- **Subject**: `[SafarSathi Security Disclosure] <Short Description>`
- Please include steps to reproduce, expected vs actual behavior, and potential impact.

We appreciate your responsible disclosure and will respond promptly to investigate and patch confirmed issues.
