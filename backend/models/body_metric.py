from sqlalchemy import Column, Integer, Float, Date
from backend.database import Base

class BodyMetric(Base):
    __tablename__ = "body_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    date = Column(Date, index=True)
    body_weight = Column(Float)
