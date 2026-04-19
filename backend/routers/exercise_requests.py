from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.models.exercise_request import ExerciseRequest as RequestModel, RequestStatusEnum
from backend.schemas.exercise_request import ExerciseRequestCreate, ExerciseRequest as RequestSchema
from backend.services import exercise_request_service
from backend.services.exceptions import PendingRequestLimitReached


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
    current_user: CurrentUser = Depends(get_current_user),
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