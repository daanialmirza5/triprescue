"""add recovery provider reason

Revision ID: 6d8b7d9e1c22
Revises: 02f207f86d70
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "6d8b7d9e1c22"
down_revision: Union[str, None] = "02f207f86d70"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("recovery_plans", sa.Column("provider_reason", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("recovery_plans", "provider_reason")
