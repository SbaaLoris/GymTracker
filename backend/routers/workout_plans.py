from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.schemas.workout_plan import (
    WorkoutPlan as WorkoutPlanSchema,
    WorkoutPlanCreate,
)
from backend.services import workout_plan_service
from backend.services.exceptions import (
    PlanNotFound,
    PermissionDenied,
    InactiveExerciseReferenced,
    DuplicateOrderIndex,
    CardioExerciseInPlan,
)


router = APIRouter(prefix="/workout-plans", tags=["Workout Plans"])

@router.get("", response_model=list[WorkoutPlanSchema])
def list_workout_plans(
    is_template: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return workout_plan_service.list_plans(
        db=db,
        current_user_id=current_user.id,
        current_user_role=current_user.role,
        is_template_filter=is_template,
    )

@router.post("", response_model=WorkoutPlanSchema, status_code=status.HTTP_201_CREATED)
def create_workout_plan(
    payload: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_plan_service.create_plan(
            db=db,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            payload=payload,
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except (InactiveExerciseReferenced, DuplicateOrderIndex, CardioExerciseInPlan) as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

@router.get("/{planId}", response_model=WorkoutPlanSchema)
def get_workout_plan(
    planId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_plan_service.get_plan(
            db=db, plan_id=planId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except PlanNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.put("/{planId}", response_model=WorkoutPlanSchema)
def update_workout_plan(
    planId: int,
    payload: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_plan_service.update_plan(
            db=db, plan_id=planId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            payload=payload,
        )
    except PlanNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except (InactiveExerciseReferenced, DuplicateOrderIndex, CardioExerciseInPlan) as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

@router.delete("/{planId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout_plan(
    planId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        workout_plan_service.delete_plan(
            db=db, plan_id=planId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except PlanNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
