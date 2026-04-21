from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.auth import CurrentUser, get_current_user, require_admin, require_user
from backend.database import get_db
from backend.models.exercise_request import ExerciseRequest as RequestModel, RequestStatusEnum
from backend.schemas.exercise_request import ExerciseRequestCreate, ExerciseRequest as RequestSchema
from backend.services import exercise_request_service
from backend.services.exceptions import (
    PendingRequestLimitReached,
    RequestNotFound,
    PermissionDenied,
    RequestNotPending,
    ExerciseNameConflict
)


router = APIRouter(prefix="/exercise-requests", tags=["Exercise Requests"])

@router.get("", response_model=list[RequestSchema])
def list_exercise_requests(
    status_filter: RequestStatusEnum | None = Query(default=None, alias= "status"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return exercise_request_service.list_requests_for_user(
        db=db,
        current_user_id=current_user.id,
        current_user_role=current_user.role,
        status_filter=status_filter,
    )

@router.post("", response_model= RequestSchema, status_code=status.HTTP_201_CREATED)
def create_exercise_request(
    payload: ExerciseRequestCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_user),
):
    try:
        return exercise_request_service.create_request(
            db = db,
            current_user_id=current_user.id,
            payload=payload
        )
    except PendingRequestLimitReached as e:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(e),
        )

@router.get("/{request_id}", response_model=RequestSchema)
def get_exercise_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return exercise_request_service.get_request(
            db=db,
            request_id=request_id,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except RequestNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exercise_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        exercise_request_service.delete_request(
            db=db,
            request_id=request_id,
            current_user_id=current_user.id,
            current_user_role=current_user.role,
        )
    except RequestNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except RequestNotPending as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.post("/{request_id}/approve", response_model=RequestSchema)
def approve_exercise_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_admin), # Sicherheitsschicht 1: Router lässt nur Admins durch
):
    try:
        return exercise_request_service.approve_request(
            db=db,
            request_id=request_id,
            current_user_role=current_user.role # Sicherheitsschicht 2: Service checkt die Rolle noch einmal
        )
    except RequestNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RequestNotPending as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ExerciseNameConflict as e:
        # Neu: Wenn der Name schon existiert, schmeißen wir einen Conflict-Error!
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{request_id}/deny", response_model=RequestSchema)
def deny_exercise_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(require_admin),
):
    try:
        return exercise_request_service.deny_request(
            db=db,
            request_id=request_id,
            current_user_role=current_user.role
        )
    except RequestNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RequestNotPending as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except PermissionDenied as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
