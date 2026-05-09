from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.schemas.workout_session import (
    WorkoutSession as WorkoutSessionSchema,
    WorkoutSessionCreate,
)
from backend.services import workout_session_service
from backend.services.exceptions import (
    SessionNotFound,
    PermissionDenied,
    InactiveExerciseReferenced,
    ExerciseTypeMismatch,
    PlanNotVisible,
    PlanNotFound,
)


router = APIRouter(
    prefix="/users/{userId}/workout-sessions",
    tags=["Workout Sessions"],
)


@router.get("", response_model=list[WorkoutSessionSchema])
def list_workout_sessions(
    userId: int,
    from_date: date | None = Query(default=None, alias="from"),
    to_date: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_session_service.list_sessions(
            db=db, path_user_id=userId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            from_date=from_date,
            to_date=to_date,
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("", response_model=WorkoutSessionSchema, status_code=status.HTTP_201_CREATED)
def create_workout_session(
    userId: int,
    payload: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_session_service.create_session(
            db=db, path_user_id=userId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            payload=payload,
        )
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except PlanNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (InactiveExerciseReferenced, ExerciseTypeMismatch, PlanNotVisible) as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.get("/{sessionId}", response_model=WorkoutSessionSchema)
def get_workout_session(
    userId: int,
    sessionId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_session_service.get_session(
            db=db, path_user_id=userId,
            session_id=sessionId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except SessionNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.put("/{sessionId}", response_model=WorkoutSessionSchema)
def update_workout_session(
    userId: int,
    sessionId: int,
    payload: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return workout_session_service.update_session(
            db=db, path_user_id=userId,
            session_id=sessionId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
            payload=payload,
        )
    except SessionNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except PlanNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (InactiveExerciseReferenced, ExerciseTypeMismatch, PlanNotVisible) as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.delete("/{sessionId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout_session(
    userId: int,
    sessionId: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        workout_session_service.delete_session(
            db=db, path_user_id=userId,
            session_id=sessionId,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except SessionNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))