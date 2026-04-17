from pydantic import BaseModel, ConfigDict, Field
from backend.models.exercise import MuscleGroup

class ExerciseBase(BaseModel):
    name: str = Field(..., min_lenght=2, max_length=100)
    muscle_group: MuscleGroup
    is_cardio: bool

class ExerciseCreate(ExerciseBase):
    pass

class Exercise (ExerciseBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
