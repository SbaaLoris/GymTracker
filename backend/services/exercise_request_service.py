from sqlalchemy.orm import Session

from backend.models.exercise_request import ExerciseRequest, RequestStatusEnum
from backend.models.role import RoleEnum
from backend.schemas.exercise_request import ExerciseRequestCreate
from backend.services.exceptions import PendingRequestLimitReached

MAX_PENDING_PER_USER = 5

def list_requests_for_user(
    db: Session,
    current_user_id: int,
    current_user_role: RoleEnum,
    status_filter: RequestStatusEnum | None,
) -> list[ExerciseRequest]:
    query = db.query(ExerciseRequest)

    if current_user_role != RoleEnum.ADMIN:
        query = query.filter(ExerciseRequest.user_id == current_user_id)

    if status_filter is not None:
        query = query.filter(ExerciseRequest.status == status_filter)

    return query.all()

def _count_pending_requests_for_user(
    db: Session,
    current_user_id: int,
) -> int:
    pending_count = (
        db.query(ExerciseRequest)
        .filter(ExerciseRequest.user_id == current_user_id)
        .filter(ExerciseRequest.status == RequestStatusEnum.PENDING)
        .count()
    )

    return pending_count

def create_request(
    db: Session,
    current_user_id: int,
    payload: ExerciseRequestCreate
) -> ExerciseRequest:
    pending_count = _count_pending_requests_for_user(db, current_user_id)

    if pending_count >= MAX_PENDING_PER_USER:
        raise PendingRequestLimitReached(
            f"User has reached the maximum of {MAX_PENDING_PER_USER} pending requests"
        )

    new_request = ExerciseRequest(
        user_id = current_user_id,
        suggested_name = payload.suggested_name,
        muscle_group = payload.muscle_group,
        status = RequestStatusEnum.PENDING,
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request 