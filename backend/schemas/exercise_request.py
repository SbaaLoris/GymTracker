from pydantic import BaseModel, ConfigDict, Field
from backend.models.exercise import MuscleGroupEnum
from backend.models.exercise_request import RequestStatusEnum


class ExerciseRequestBase(BaseModel):
    suggested_name: str = Field(..., min_length=2, max_length=100)
    muscle_group: MuscleGroupEnum
    is_cardio: bool


class ExerciseRequestCreate(ExerciseRequestBase):
    pass


class ExerciseRequest(ExerciseRequestBase):
    id: int
    user_id: int
    status: RequestStatusEnum

    model_config = ConfigDict(from_attributes=True)