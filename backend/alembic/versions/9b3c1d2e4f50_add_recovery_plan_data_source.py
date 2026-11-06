"""add recovery plan data source

Revision ID: 9b3c1d2e4f50
Revises: 7e91a2c4b5d6
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "9b3c1d2e4f50"
down_revision: Union[str, None] = "7e91a2c4b5d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # "live" when a plan was built from a real provider API, "simulated" otherwise.
    op.add_column(
        "recovery_plans",
        sa.Column("data_source", sa.String(), nullable=False, server_default="simulated"),
    )


def downgrade() -> None:
    op.drop_column("recovery_plans", "data_source")
