"""add external_item_links (live/discovery items added to trips)

Revision ID: d7e3b9a1c5f2
Revises: c4d2a8e6f1b3
Create Date: 2026-09-27 05:00:00.000000

Additive only: a new table, no changes to existing ones.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d7e3b9a1c5f2"
down_revision: Union[str, Sequence[str], None] = "c4d2a8e6f1b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "external_item_links",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("trip_id", sa.String(), nullable=False),
        sa.Column("node_id", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False),
        sa.Column("source", sa.String(), nullable=False),
        sa.Column("external_id", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("trip_id", "source", "external_id", name="uq_external_item_trip_source_id"),
    )
    op.create_index(op.f("ix_external_item_links_trip_id"), "external_item_links", ["trip_id"], unique=False)
    op.create_index(op.f("ix_external_item_links_node_id"), "external_item_links", ["node_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_external_item_links_node_id"), table_name="external_item_links")
    op.drop_index(op.f("ix_external_item_links_trip_id"), table_name="external_item_links")
    op.drop_table("external_item_links")
