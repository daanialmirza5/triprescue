# Contributing to TripRescue

Thank you for your interest in contributing to TripRescue! This document outlines our development workflow, coding standards, and guidelines for submitting contributions.

---

## 1. Development Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Python**: `3.11+` (3.12 or 3.14 compatible)
- **Package Managers**: `npm` for frontend, Python `venv` + `pip` for backend
- **Optional**: Docker & Docker Compose for local PostgreSQL testing

---

## 2. Local Setup Workflow

### Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
npm install
npm run dev
```

---

## 3. Running Automated Tests

Before opening a pull request, ensure all frontend and backend tests pass:

```powershell
# Windows PowerShell (Full suite):
.\scripts\test-all.ps1

# Or independently:
npm test -- --run                     # Frontend Vitest Suite
pytest backend/app/tests -v           # Backend Pytest Suite
```

---

## 4. Commit Message Conventions

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(scope)`: A new feature or user-visible enhancement
- `fix(scope)`: A bug fix
- `test(scope)`: Adding missing tests or correcting existing tests
- `docs(scope)`: Documentation changes only
- `refactor(scope)`: A code change that neither fixes a bug nor adds a feature
- `perf(scope)`: A code change that improves performance
- `chore(scope)`: Build scripts, package configuration, dev tooling

**Example**:
```text
feat(backend): add trip JSON export endpoint for traveler itinerary backups
fix(frontend): handle empty recovery candidate edge cases gracefully
test(backend): add unit tests for graph engine isolated nodes
```

---

## 5. Submitting Pull Requests

1. Fork the repository and create a new feature branch from `main`:
   ```bash
   git checkout -b feat/my-enhancement
   ```
2. Make your commits with clear, atomic commit messages.
3. Run the complete test suite to confirm zero regressions.
4. Push your branch and submit a Pull Request against `main`.
5. Provide a concise summary of changes and verification steps in your PR description.
