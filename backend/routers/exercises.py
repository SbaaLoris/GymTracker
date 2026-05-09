from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.exercise import MuscleGroupEnum
from backend.schemas.exercise import Exercise as ExerciseSchema, ExerciseCreate
from backend.services import exercise_service
from backend.services.exceptions import ExerciseNameConflict, ExerciseNotFound
from backend.auth import CurrentUser, require_admin, get_current_user
from backend.models.role import RoleEnum


router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("", response_model=list[ExerciseSchema])
def list_exercises(
    muscle_group: MuscleGroupEnum | None = Query(default=None),
    is_cardio: bool | None = Query(default=None),
    include_inactive: bool = Query(default=False),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
 # include_inactive is admin-only; silently drop for non-admins (per spec)
    if include_inactive and current_user.role != RoleEnum.ADMIN:
        include_inactive = False

    return exercise_service.list_exercises(
        db=db,
        muscle_group=muscle_group,
        is_cardio=is_cardio,
        include_inactive=include_inactive,
        search=search,
    )


@router.post("", response_model=ExerciseSchema, status_code=status.HTTP_201_CREATED)
def create_exercise(
    payload: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_admin),
):
    try:
        return exercise_service.create_exercise(db=db, payload=payload)
    except ExerciseNameConflict as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/{exerciseId}", response_model=ExerciseSchema)
def get_exercise(
    exerciseId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return exercise_service.get_exercise(db=db, exercise_id=exerciseId)
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{exerciseId}", response_model=ExerciseSchema)
def update_exercise(
    exerciseId: int,
    payload: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_admin),
):
    try:
        return exercise_service.update_exercise(
            db=db, exercise_id=exerciseId, payload=payload
        )
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ExerciseNameConflict as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{exerciseId}", response_model=ExerciseSchema)
def delete_exercise(
    exerciseId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_admin),
):
    try:
        return exercise_service.soft_delete_exercise(db=db, exercise_id=exerciseId)
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))