from datetime import date
from typing import Annotated, Literal, Union
from pydantic import BaseModel, ConfigDict, Field

class StrengthSetInput(BaseModel):
    type: Literal["strength"]
    exercise_id: int
    reps: int = Field(..., ge=1)
    weight: float = Field(..., ge=0)

    model_config = ConfigDict(extra="forbid")

class CardioSetInput(BaseModel):
    type: Literal["cardio"]
    exercise_id: int
    duration: int = Field(..., ge=1)

    model_config = ConfigDict(extra="forbid")

WorkoutSetInput = Annotated[
    Union[StrengthSetInput, CardioSetInput],
    Field(discriminator="type"),
]

class WorkoutSessionCreate(BaseModel):
    date: date
    plan_id: int | None = None
    sets: list[WorkoutSetInput] = Field(..., min_length=1)

class StrengthSetOut(BaseModel):
    type: Literal["strength"]
    id: int
    exercise_id: int
    reps: int
    weight: float

    model_config = ConfigDict(from_attributes=True)

class CardioSetOut(BaseModel):
    type: Literal["cardio"]
    id: int
    exercise_id: int
    duration: int

    model_config = ConfigDict(from_attributes=True)

WorkoutSetOut = Annotated[
    Union[StrengthSetOut, CardioSetOut],
    Field(discriminator="type"),
]

class WorkoutSession(BaseModel):
    id: int
    user_id: int
    date: date
    plan_id: int | None
    sets: list[WorkoutSetOut]

    model_config = ConfigDict(from_attributes=True)