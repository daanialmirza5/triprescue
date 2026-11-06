"""merge email opt-in and recovery data source heads

Two migrations were created in parallel on top of 7e91a2c4b5d6 (one per
branch), which left alembic with two heads and made `alembic upgrade head`
fail. This empty merge revision joins them back into a single history.

Revision ID: c4d2a8e6f1b3
Revises: 3a54c862ee52, 9b3c1d2e4f50
"""
from typing import Sequence, Union

revision: str = "c4d2a8e6f1b3"
down_revision: Union[str, Sequence[str], None] = ("3a54c862ee52", "9b3c1d2e4f50")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
