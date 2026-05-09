from datetime import date
from sqlalchemy.orm import Session, selectinload

from backend.models.workout_session import WorkoutSession, WorkoutSet
from backend.models.workout_plan import WorkoutPlan
from backend.models.exercise import Exercise
from backend.models.role import RoleEnum
from backend.schemas.workout_session import WorkoutSessionCreate
from backend.services.exceptions import (
    SessionNotFound,
    PermissionDenied,
    InactiveExerciseReferenced,
    ExerciseTypeMismatch,
    PlanNotVisible,
    PlanNotFound,
)

def _get_session_or_raise(
    db: Session,
    session_id: int,
    path_user_id: int,
) -> WorkoutSession:
    session = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id)
        .filter(WorkoutSession.user_id == path_user_id)
        .first()
    )
    if session is None:
        raise SessionNotFound(
            f"Workout session with id {session_id} not found for user {path_user_id}"
        )
    return session

def _assert_user_id_matches(
    path_user_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    if current_user_role == RoleEnum.ADMIN:
        return
    if path_user_id != current_user_id:
        raise PermissionDenied("You can only access your own workout sessions")

def _assert_can_view(
    session: WorkoutSession,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    if current_user_role == RoleEnum.ADMIN:
        return
    if session.user_id != current_user_id:
        raise PermissionDenied("You are not allowed to view this workout session")

def _assert_can_modify(
    session: WorkoutSession,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    if session.user_id != current_user_id:
        raise PermissionDenied("You are not allowed to modify this workout session")

def _assert_exercises_valid_for_sets(
    db: Session,
    sets_input: list,
) -> None:
    exercise_ids = [s.exercise_id for s in sets_input]
    exercises = (
        db.query(Exercise)
        .filter(Exercise.id.in_(exercise_ids))
        .filter(Exercise.is_active == True)
        .all()
    )
    by_id = {ex.id: ex for ex in exercises}

    for s in sets_input:
        ex = by_id.get(s.exercise_id)
        if ex is None:
            raise InactiveExerciseReferenced(
                f"Exercise {s.exercise_id} does not exist or is not active"
            )
        if s.type == "strength" and ex.is_cardio:
            raise ExerciseTypeMismatch(
                f"Exercise {ex.id} ({ex.name}) is cardio — use a cardio set instead"
            )
        if s.type == "cardio" and not ex.is_cardio:
            raise ExerciseTypeMismatch(
                f"Exercise {ex.id} ({ex.name}) is not cardio — use a strength set instead"
            )

def _assert_plan_is_visible(
    db: Session,
    plan_id: int | None,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    if plan_id is None:
        return
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if plan is None:
        raise PlanNotFound(f"Workout plan with id {plan_id} not found")
    if current_user_role == RoleEnum.ADMIN:
        return
    if plan.is_template or plan.creator_id == current_user_id:
        return
    raise PlanNotVisible(
        f"Plan {plan_id} exists but you are not allowed to use it"
    )

def list_sessions(
    db: Session,
    path_user_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
    from_date: date | None,
    to_date: date | None,
) -> list[WorkoutSession]:
    _assert_user_id_matches(path_user_id, current_user_id, current_user_role)

    query = (
        db.query(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .filter(WorkoutSession.user_id == path_user_id)
    )

    if from_date is not None:
        query = query.filter(WorkoutSession.date >= from_date)
    if to_date is not None:
        query = query.filter(WorkoutSession.date <= to_date)

    return query.order_by(WorkoutSession.date.desc()).all()

def get_session(
    db: Session,
    path_user_id: int,
    session_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> WorkoutSession:
    _assert_user_id_matches(path_user_id, current_user_id, current_user_role)
    session = _get_session_or_raise(db, session_id, path_user_id)
    _assert_can_view(session, current_user_id, current_user_role)
    return session

def create_session(
    db: Session,
    path_user_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
    payload: WorkoutSessionCreate,
) -> WorkoutSession:
    _assert_user_id_matches(path_user_id, current_user_id, current_user_role)

    # Admins shouldn't create sessions on behalf of others — only owners log their own workouts.
    if current_user_role == RoleEnum.ADMIN and path_user_id != current_user_id:
        raise PermissionDenied("Admins cannot create workout sessions for other users")

    _assert_exercises_valid_for_sets(db, payload.sets)
    _assert_plan_is_visible(db, payload.plan_id, current_user_id, current_user_role)

    new_session = WorkoutSession(
        user_id=path_user_id,
        date=payload.date,
        plan_id=payload.plan_id,
    )

    for s in payload.sets:
        new_session.sets.append(
            WorkoutSet(
                exercise_id=s.exercise_id,
                type=s.type,
                reps=getattr(s, "reps", None),
                weight=getattr(s, "weight", None),
                duration=getattr(s, "duration", None),
            )
        )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def update_session(
    db: Session,
    path_user_id: int,
    session_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
    payload: WorkoutSessionCreate,
) -> WorkoutSession:
    _assert_user_id_matches(path_user_id, current_user_id, current_user_role)
    session = _get_session_or_raise(db, session_id,path_user_id)
    _assert_can_modify(session, current_user_id, current_user_role)

    _assert_exercises_valid_for_sets(db, payload.sets)
    _assert_plan_is_visible(db, payload.plan_id, current_user_id, current_user_role)

    session.date = payload.date
    session.plan_id = payload.plan_id

    # REPLACE-ALL: same pattern as workout_plan_service.update_plan
    session.sets = [
        WorkoutSet(
            exercise_id=s.exercise_id,
            type=s.type,
            reps=getattr(s, "reps", None),
            weight=getattr(s, "weight", None),
            duration=getattr(s, "duration", None),
        )
        for s in payload.sets
    ]

    db.commit()
    db.refresh(session)
    return session

def delete_session(
    db: Session,
    path_user_id: int,
    session_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    _assert_user_id_matches(path_user_id, current_user_id, current_user_role)
    session = _get_session_or_raise(db, session_id, path_user_id)

    # Admins can delete any session (cleanup support); owner can delete their own.
    if current_user_role != RoleEnum.ADMIN and session.user_id != current_user_id:
        raise PermissionDenied("You are not allowed to delete this workout session")

    db.delete(session)
    db.commit()