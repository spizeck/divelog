"""Updated models to include first name and changed a few methods

Revision ID: 6beb8cc60967
Revises: 5e69cc67b620
Create Date: 2023-07-10 16:26:16.726919

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6beb8cc60967'
down_revision = '5e69cc67b620'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_preferences', sa.Column('first_name', sa.String(length=255), nullable=True))
    op.alter_column('user_preferences', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user_preferences', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.drop_column('user_preferences', 'first_name')
    # ### end Alembic commands ###