"""convert to citext

Revision ID: bc8c7dc3ba10
Revises: 6beb8cc60967
Create Date: 2023-09-23 15:35:39.763665

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc8c7dc3ba10'
down_revision = '6beb8cc60967'
branch_labels = None
depends_on = None


def upgrade():
    # Create the CITEXT extension if it doesn't exist
    op.execute('CREATE EXTENSION IF NOT EXISTS citext')
    
    # Alter columns
    op.alter_column('users', 'username', type_=sa.dialects.postgresql.CITEXT())
    op.alter_column('users', 'email', type_=sa.dialects.postgresql.CITEXT())

def downgrade():
    # You can optionally provide a way to downgrade the migration,
    # such as converting the columns back to TEXT
    op.alter_column('users', 'username', type_=sa.String())
    op.alter_column('users', 'email', type_=sa.String())
