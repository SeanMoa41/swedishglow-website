"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-05-08

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enums
    op.execute("CREATE TYPE resellerstatus AS ENUM ('pending', 'active', 'inactive')")
    op.execute("CREATE TYPE tier AS ENUM ('pearl', 'rose', 'pro', 'elite', 'black')")
    op.execute("CREATE TYPE applicationstatus AS ENUM ('pending', 'approved', 'rejected')")
    op.execute("CREATE TYPE quotationstatus AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired')")
    op.execute("CREATE TYPE invoicestatus AS ENUM ('draft', 'outstanding', 'paid', 'overdue')")
    op.execute("CREATE TYPE filetier AS ENUM ('all', 'rose', 'pro', 'elite', 'black')")

    op.create_table('resellers',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('company', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'active', 'inactive', name='resellerstatus'), nullable=False, server_default='pending'),
        sa.Column('tier', sa.Enum('pearl', 'rose', 'pro', 'elite', 'black', name='tier'), nullable=False, server_default='pearl'),
        sa.Column('tier_override', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('teamleader_id', sa.String(), nullable=True),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )

    op.create_table('tier_thresholds',
        sa.Column('tier', sa.Enum('pearl', 'rose', 'pro', 'elite', 'black', name='tier'), nullable=False),
        sa.Column('min_revenue_eur', sa.Numeric(10, 2), nullable=True, server_default='0'),
        sa.Column('discount_pct', sa.Numeric(5, 2), nullable=True, server_default='0'),
        sa.Column('benefits', postgresql.JSONB(), nullable=True, server_default='[]'),
        sa.PrimaryKeyConstraint('tier'),
    )

    op.create_table('applications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('company', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('message', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', name='applicationstatus'), nullable=False, server_default='pending'),
        sa.Column('assigned_tier', sa.Enum('pearl', 'rose', 'pro', 'elite', 'black', name='tier'), nullable=False, server_default='pearl'),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['reviewed_by'], ['resellers.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('products',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('wc_product_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('tag', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('list_price_eur', sa.Numeric(10, 2), nullable=False),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('quotations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reseller_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tl_quotation_id', sa.String(), nullable=True),
        sa.Column('tl_deal_id', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('draft', 'sent', 'accepted', 'rejected', 'expired', name='quotationstatus'), nullable=False, server_default='draft'),
        sa.Column('total_eur', sa.Numeric(10, 2), nullable=True),
        sa.Column('line_items', postgresql.JSONB(), nullable=True, server_default='[]'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['reseller_id'], ['resellers.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('invoices',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reseller_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tl_invoice_id', sa.String(), nullable=False),
        sa.Column('invoice_number', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('draft', 'outstanding', 'paid', 'overdue', name='invoicestatus'), nullable=False, server_default='outstanding'),
        sa.Column('total_eur', sa.Numeric(10, 2), nullable=False),
        sa.Column('invoice_date', sa.Date(), nullable=True),
        sa.Column('due_date', sa.Date(), nullable=True),
        sa.Column('synced_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['reseller_id'], ['resellers.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tl_invoice_id'),
    )

    op.create_table('marketing_files',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('blob_url', sa.String(), nullable=False),
        sa.Column('min_tier', sa.Enum('all', 'rose', 'pro', 'elite', 'black', name='filetier'), nullable=False, server_default='all'),
        sa.Column('file_size_bytes', sa.BigInteger(), nullable=True),
        sa.Column('uploaded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('download_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['uploaded_by'], ['resellers.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('file_downloads',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reseller_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('downloaded_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['file_id'], ['marketing_files.id']),
        sa.ForeignKeyConstraint(['reseller_id'], ['resellers.id']),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('wc_orders',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('wc_order_id', sa.Integer(), nullable=False),
        sa.Column('customer_email', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('payment_method', sa.String(), nullable=True),
        sa.Column('total_eur', sa.Numeric(10, 2), nullable=True),
        sa.Column('line_items', postgresql.JSONB(), nullable=True),
        sa.Column('order_date', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('synced_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('wc_order_id'),
    )


def downgrade() -> None:
    op.drop_table('wc_orders')
    op.drop_table('file_downloads')
    op.drop_table('marketing_files')
    op.drop_table('invoices')
    op.drop_table('quotations')
    op.drop_table('products')
    op.drop_table('applications')
    op.drop_table('tier_thresholds')
    op.drop_table('resellers')
    op.execute("DROP TYPE IF EXISTS filetier")
    op.execute("DROP TYPE IF EXISTS invoicestatus")
    op.execute("DROP TYPE IF EXISTS quotationstatus")
    op.execute("DROP TYPE IF EXISTS applicationstatus")
    op.execute("DROP TYPE IF EXISTS tier")
    op.execute("DROP TYPE IF EXISTS resellerstatus")
