# TripRescue Production Deployment & Operations Checklist

This document details the complete operational checklist for deploying and maintaining TripRescue in staging and production environments.

---

## 1. Environment & Infrastructure Matrix

| Layer | Recommended Provider | Environment Variables Required |
| :--- | :--- | :--- |
| **Frontend** | Vercel / Netlify / Cloudflare Pages | `VITE_API_BASE_URL` |
| **Backend API** | Render / Railway / AWS ECS | `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`, `ENVIRONMENT=production` |
| **Database** | Supabase (PostgreSQL 16) | Connection Pooling URL (Port 6543 / 5432) |
| **AI Reasoning** | Anthropic Claude 3.5 Sonnet | `ANTHROPIC_API_KEY` (optional, falls back to deterministic engine) |

---

## 2. Pre-Deployment Verification Checklist

- [ ] **Database Connection**: Verify Supabase connection string format:
  `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` (or pooler port `6543`).
- [ ] **Alembic Migrations**: Ensure migration head is applied:
  ```bash
  cd backend
  alembic upgrade head
  ```
- [ ] **Secret Key Safety**: Generate a 256-bit cryptographically secure secret:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
  *Ensure `SECRET_KEY` is not left as default dev string (the backend will abort startup in production if default is detected).*
- [ ] **CORS Policy**: Configure `CORS_ORIGINS` with exact production frontend URL(s):
  `CORS_ORIGINS="https://triprescue.vercel.app,https://app.triprescue.com"`
- [ ] **Test Suite Run**: Execute full regression tests before release:
  ```powershell
  .\scripts\test-all.ps1
  ```

---

## 3. Post-Deployment Smoke Tests

1. **System Health Probe**:
   ```bash
   curl -i https://api.triprescue.com/api/health
   # Expected: HTTP 200 {"status":"healthy","database":"connected","version":"1.0.0"}
   ```

2. **Demo Account Seed Check**:
   ```bash
   curl -i https://api.triprescue.com/api/auth/demo-account
   # Expected: HTTP 200 with JWT bearer token and demo traveler details
   ```

3. **Disruption & Recovery Flow**:
   - Trigger flight disruption via UI or API.
   - Verify DAG graph renders broken status nodes with orange/red outlines.
   - Generate multi-criteria recovery options and confirm Pareto-optimal ranking.
   - Apply recovery plan and confirm atomic node rebooking and notification creation.

---

## 4. Disaster Recovery & Rollback Procedure

- **Database Backup**: Supabase performs continuous WAL archiving and daily automated snapshots.
- **Migration Rollback**:
  ```bash
  alembic downgrade -1
  ```
- **Cold-Start Keep-Alive**: If hosting backend on free-tier instances (Render), configure a 10-minute UptimeRobot ping on `GET /api/health` to prevent sleep cycles during user demos.
