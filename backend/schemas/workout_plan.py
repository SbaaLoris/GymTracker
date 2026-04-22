from pydantic import BaseModel, ConfigDict, Field


class PlanExerciseInput(BaseModel):
    exercise_id: int
    order_index: int = Field(..., ge=1)
    target_sets: int = Field(..., ge=1)
    target_reps: int = Field(..., ge=1)
    target_weight: float | None = Field(default=None, ge=0)


class PlanExerciseOut(BaseModel):
    id: int
    exercise_id: int
    order_index: int
    target_sets: int
    target_reps: int
    target_weight: float | None

    model_config = ConfigDict(from_attributes=True)


class WorkoutPlanCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    is_template: bool = False
    exercises: list[PlanExerciseInput] = Field(..., min_length=1)


class WorkoutPlan(BaseModel):
    id: int
    name: str
    creator_id: int
    is_template: bool
    exercises: list[PlanExerciseOut]

    model_config = ConfigDict(from_attributes=True)
