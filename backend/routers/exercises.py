from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.exercise import MuscleGroupEnum
from backend.schemas.exercise import Exercise as ExerciseSchema, ExerciseCreate
from backend.services import exercise_service
from backend.services.exceptions import ExerciseNameConflict, ExerciseNotFound


router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("", response_model=list[ExerciseSchema])
def list_exercises(
    muscle_group: MuscleGroupEnum | None = Query(default=None),
    is_cardio: bool | None = Query(default=None),
    include_inactive: bool = Query(default=False),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
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
):
    try:
        return exercise_service.create_exercise(db=db, payload=payload)
    except ExerciseNameConflict as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/{exercise_id}", response_model=ExerciseSchema)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
):
    try:
        return exercise_service.get_exercise(db=db, exercise_id=exercise_id)
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{exercise_id}", response_model=ExerciseSchema)
def update_exercise(
    exercise_id: int,
    payload: ExerciseCreate,
    db: Session = Depends(get_db),
):
    try:
        return exercise_service.update_exercise(
            db=db, exercise_id=exercise_id, payload=payload
        )
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ExerciseNameConflict as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.delete("/{exercise_id}", response_model=ExerciseSchema)
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
):
    try:
        return exercise_service.soft_delete_exercise(db=db, exercise_id=exercise_id)
    except ExerciseNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))