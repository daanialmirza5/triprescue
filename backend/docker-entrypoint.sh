#!/bin/sh
# Runs on every container start (local Docker Compose and Render alike).
#
# Postgres schema is Alembic-managed - app/main.py deliberately skips
# `Base.metadata.create_all()` for any non-SQLite DATABASE_URL (see the
# comment there), so without this step a fresh Neon database would have no
# tables at all and every request would fail. `alembic upgrade head` is
# idempotent - running it against an already-current database is a safe
# no-op, so this is safe to run on every deploy, not just the first one.
#
# SQLite (local dev without Docker Postgres) still uses create_all() inside
# the app itself, so this step harmlessly no-ops there too (alembic upgrade
# head against a fresh SQLite file just runs the same migrations once).
set -e

echo "Running database migrations (alembic upgrade head)..."
alembic upgrade head

echo "Starting application..."
exec "$@"
