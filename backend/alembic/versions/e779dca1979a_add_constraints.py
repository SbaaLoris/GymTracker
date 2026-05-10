"""add_constraints

Revision ID: e779dca1979a
Revises: 5163e37d2899
Create Date: 2026-05-10 16:48:16.107319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e779dca1979a'
down_revision: Union[str, None] = '5163e37d2899'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Body Metric Constraint
    with op.batch_alter_table('body_metrics') as batch_op:
        batch_op.create_unique_constraint('uq_body_metric_user_date', ['user_id', 'date'])

    # Exercise Functional Index
    with op.batch_alter_table('exercises') as batch_op:
        batch_op.drop_index('ix_exercises_name')
        batch_op.create_index('ix_exercise_name_lower', [sa.text('lower(name)')], unique=True)


def downgrade() -> None:
    with op.batch_alter_table('exercises') as batch_op:
        batch_op.drop_index('ix_exercise_name_lower')
        batch_op.create_index('ix_exercises_name', ['name'], unique=True)
    
    with op.batch_alter_table('body_metrics') as batch_op:
        batch_op.drop_constraint('uq_body_metric_user_date', type_='unique')
