"""add park policy push tables

Revision ID: c2f1d9b7a001
Revises: ab12c3d4e5f6
Create Date: 2026-03-16 11:55:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "c2f1d9b7a001"
down_revision = "ab12c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "park_policy_pushes",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("park_id", sa.String(length=32), nullable=False),
        sa.Column("policy_title", sa.String(length=255), nullable=False),
        sa.Column("policy_level", sa.String(length=20), nullable=True),
        sa.Column("issuing_department", sa.String(length=100), nullable=True),
        sa.Column("publish_date", sa.Date(), nullable=True),
        sa.Column("deadline", sa.Date(), nullable=True),
        sa.Column("applicable_targets", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("regions", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("channels", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("target_tags", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("keywords", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("push_scope", sa.String(length=50), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
        sa.Column("reach_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("open_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("click_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("intent_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("conversion_rate", sa.Float(), nullable=False, server_default="0"),
        sa.Column("last_pushed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["park_id"], ["parks.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_park_policy_pushes_park_id"), "park_policy_pushes", ["park_id"], unique=False)
    op.create_index(op.f("ix_park_policy_pushes_policy_title"), "park_policy_pushes", ["policy_title"], unique=False)
    op.create_index(op.f("ix_park_policy_pushes_status"), "park_policy_pushes", ["status"], unique=False)

    op.create_table(
        "park_policy_push_logs",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("push_id", sa.String(length=32), nullable=False),
        sa.Column("channel", sa.String(length=30), nullable=False, server_default="站内消息"),
        sa.Column("batch_no", sa.String(length=64), nullable=True),
        sa.Column("reach_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("open_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("click_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("intent_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["push_id"], ["park_policy_pushes.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_park_policy_push_logs_push_id"), "park_policy_push_logs", ["push_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_park_policy_push_logs_push_id"), table_name="park_policy_push_logs")
    op.drop_table("park_policy_push_logs")

    op.drop_index(op.f("ix_park_policy_pushes_status"), table_name="park_policy_pushes")
    op.drop_index(op.f("ix_park_policy_pushes_policy_title"), table_name="park_policy_pushes")
    op.drop_index(op.f("ix_park_policy_pushes_park_id"), table_name="park_policy_pushes")
    op.drop_table("park_policy_pushes")
