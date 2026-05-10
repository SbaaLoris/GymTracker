from sqlalchemy import Column, Integer, Float, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class BodyMetric(Base):
    __tablename__ = "body_metrics"
    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_body_metric_user_date'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    body_weight = Column(Float, nullable=False)

    user = relationship("User")
