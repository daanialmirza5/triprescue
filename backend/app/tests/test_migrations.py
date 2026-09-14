"""Verifies the Alembic migration set actually matches the ORM models, by
running `alembic` the same way a real deploy would - as a separate process,
against a throwaway SQLite file, driven purely through DATABASE_URL (see
alembic/env.py). This is what proves the initial migration is not just
syntactically valid but produces the exact schema `Base.metadata` describes.
"""

import subprocess
import sys
from pathlib import Path

import sqlalchemy as sa

from app import models  # noqa: F401  (register every model on Base.metadata)
from app.database.base import Base

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


def _run_alembic(*args: str, db_path: Path) -> subprocess.CompletedProcess:
    env = {
        **__import__("os").environ,
        "DATABASE_URL": f"sqlite:///{db_path.as_posix()}",
    }
    return subprocess.run(
        [sys.executable, "-m", "alembic", *args],
        cwd=BACKEND_DIR,
        env=env,
        capture_output=True,
        text=True,
    )


def _expected_app_tables() -> set[str]:
    return set(Base.metadata.tables.keys())


def test_alembic_upgrade_head_creates_every_model_table(tmp_path):
    db_path = tmp_path / "migration_test.db"
    result = _run_alembic("upgrade", "head", db_path=db_path)
    assert result.returncode == 0, result.stdout + result.stderr

    engine = sa.create_engine(f"sqlite:///{db_path.as_posix()}")
    actual_tables = set(sa.inspect(engine).get_table_names()) - {"alembic_version"}
    assert actual_tables == _expected_app_tables()


def test_alembic_downgrade_base_removes_every_app_table(tmp_path):
    db_path = tmp_path / "migration_downgrade_test.db"
    upgrade_result = _run_alembic("upgrade", "head", db_path=db_path)
    assert upgrade_result.returncode == 0, upgrade_result.stdout + upgrade_result.stderr

    downgrade_result = _run_alembic("downgrade", "base", db_path=db_path)
    assert downgrade_result.returncode == 0, downgrade_result.stdout + downgrade_result.stderr

    engine = sa.create_engine(f"sqlite:///{db_path.as_posix()}")
    remaining_app_tables = set(sa.inspect(engine).get_table_names()) & _expected_app_tables()
    assert remaining_app_tables == set()


def test_alembic_upgrade_head_is_safely_re_runnable(tmp_path):
    """Deploys can retry a stalled/interrupted step - re-running `upgrade
    head` against an already-migrated database must be a no-op, not an
    error, since that's exactly what a retried deploy step will do."""
    db_path = tmp_path / "migration_rerun_test.db"
    first = _run_alembic("upgrade", "head", db_path=db_path)
    assert first.returncode == 0, first.stdout + first.stderr

    second = _run_alembic("upgrade", "head", db_path=db_path)
    assert second.returncode == 0, second.stdout + second.stderr
