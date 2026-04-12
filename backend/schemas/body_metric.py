from pydantic import BaseModel, ConfigDict, Field
from datetime import date

# Base schema for creating a new body metric.
# It defines the expected input when a user submits a new entry.
class BodyMetricCreate(BaseModel):
    user_id: int
    date: date
    # Validates that the body weight provided is strictly greater than 0
    body_weight: float = Field(..., gt=0)

# Schema for updating an existing body metric.
# Requires the unique id of the metric being updated.
class BodyMetricUpdate(BaseModel):
    id: int
    date: date
    # Ensures the updated body weight is valid (greater than 0)
    body_weight: float = Field(..., gt=0)

# Schema to specifically handle deletion requests where the id is passed in the body.
class BodyMetricDelete(BaseModel):
    id: int

# Schema for the output sent back to the client.
# This dictates what fields are visible in the API response.
class BodyMetricOut(BaseModel):
    id: int
    date: date
    body_weight: float

    # Allows Pydantic to read data directly from the SQLAlchemy ORM model objects
    model_config = ConfigDict(from_attributes=True)
