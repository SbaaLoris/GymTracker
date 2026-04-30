from pydantic import BaseModel, ConfigDict, Field
from datetime import date

# Base schema for body metric.
class BodyMetricBase(BaseModel):
    date: date
    body_weight: float = Field(..., gt=0)

# Schema for creating a new body metric entry.
class BodyMetricCreate(BodyMetricBase):
    pass

# Schema for the output sent back to the client.
class BodyMetric(BodyMetricBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
