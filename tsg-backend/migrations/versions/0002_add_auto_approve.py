"""add auto_approve to tier_thresholds

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-15

"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'tier_thresholds',
        sa.Column('auto_approve', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.execute(
        "UPDATE tier_thresholds SET auto_approve = true WHERE tier IN ('elite', 'black')"
    )


def downgrade() -> None:
    op.drop_column('tier_thresholds', 'auto_approve')
