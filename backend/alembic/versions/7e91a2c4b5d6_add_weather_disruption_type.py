"""add weather disruption type

Revision ID: 7e91a2c4b5d6
Revises: 6d8b7d9e1c22
"""
from typing import Sequence, Union

from alembic import op

revision: str = "7e91a2c4b5d6"
down_revision: Union[str, None] = "6d8b7d9e1c22"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL stores DisruptionType as a named enum. SQLite stores it as a
    # string/check constraint in this project, so no dialect-specific work is
    # needed there. PostgreSQL enum values are append-only.
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TYPE disruptiontype ADD VALUE IF NOT EXISTS 'WEATHER_DISRUPTION'")


def downgrade() -> None:
    # PostgreSQL cannot safely remove an enum value that may already be stored
    # without rebuilding the enum type. Leave the value in place on downgrade.
    pass
