from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.models.exercise_request import ExerciseRequest, RequestStatusEnum
from backend.models.role import RoleEnum
from backend.models.exercise import Exercise
from backend.schemas.exercise_request import ExerciseRequestCreate
from backend.services.exceptions import (
    PendingRequestLimitReached,
    RequestNotFound,
    PermissionDenied,
    RequestNotPending,
    ExerciseNameConflict
)

#Constants

MAX_PENDING_PER_USER = 5

#Privat Functions

def _get_request_or_raise(db: Session, request_id: int) -> ExerciseRequest:
    request = db.query(ExerciseRequest).filter(ExerciseRequest.id == request_id).first()
    if request is None:
        raise RequestNotFound(f"Exercise request with id{request_id} not found")
    return request

def _assert_can_view_or_modify(
    request: ExerciseRequest,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    is_admin = current_user_role == RoleEnum.ADMIN
    is_owner = request.user_id == current_user_id
    if not (is_admin or is_owner):
        raise PermissionDenied("You are not allowed to access this exercise request")

def _assert_is_admin(current_user_role: RoleEnum) -> None:
    if current_user_role != RoleEnum.ADMIN:
         raise PermissionDenied("Only admins can perform this action")

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

#Public Functions

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

    return query.order_by(ExerciseRequest.id.asc()).all()

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
        is_cardio = payload.is_cardio,
        status = RequestStatusEnum.PENDING,
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def get_request(
    db: Session,
    current_user_id: int,
    request_id: int,
    current_user_role: RoleEnum,
) -> ExerciseRequest:
    request = _get_request_or_raise(db,request_id)
    _assert_can_view_or_modify(request, current_user_id, current_user_role)
    return request

def delete_request(
    db: Session,
    request_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    request = _get_request_or_raise(db, request_id)
    _assert_can_view_or_modify(request,current_user_id,current_user_role)

    if request.status != RequestStatusEnum.PENDING:
        raise RequestNotPending("Cannot delete a request that is not pending")

    db.delete(request)
    db.commit()

def approve_request(
    db: Session,
    request_id: int,
    current_user_role: RoleEnum,
) -> ExerciseRequest:
    _assert_is_admin(current_user_role)
   
    request = _get_request_or_raise(db, request_id)
    
    if request.status != RequestStatusEnum.PENDING:
        raise RequestNotPending("Request is not in 'pending' status")
    
    existing_exercise = db.query(Exercise).filter(Exercise.name.ilike(request.suggested_name)).first()
    if existing_exercise is not None:
        raise ExerciseNameConflict(f"An exercise named '{request.suggested_name}' already exists.")

    request.status = RequestStatusEnum.APPROVED

    new_exercise = Exercise(
        name=request.suggested_name,
        muscle_group=request.muscle_group,
        is_cardio=request.is_cardio,
        is_active=True
    )
    db.add(new_exercise)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ExerciseNameConflict(f"An exercise named '{request.suggested_name}' was just created concurrently.")
        
    db.refresh(request)
    return request

def deny_request(
    db: Session,
    request_id: int,
    current_user_role: RoleEnum
)-> ExerciseRequest:
    _assert_is_admin(current_user_role)
    request = _get_request_or_raise(db, request_id)

    if request.status != RequestStatusEnum.PENDING:
        raise RequestNotPending("Request is not in 'pending' status")

    request.status = RequestStatusEnum.DENIED
    db.commit()
    db.refresh(request)
    return request
