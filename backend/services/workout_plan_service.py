from sqlalchemy.orm import Session

from backend.models.workout_plan import WorkoutPlan, PlanExercise
from backend.models.exercise import Exercise
from backend.models.role import RoleEnum
from backend.schemas.workout_plan import WorkoutPlanCreate, PlanExerciseInput
from backend.services.exceptions import (
    PlanNotFound,
    PermissionDenied,
    InactiveExerciseInPlan,
    DuplicateOrderIndex,
    CardioExerciseInPlan,
)


def _get_plan_or_raise(db: Session, plan_id: int) -> WorkoutPlan:
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if plan is None:
        raise PlanNotFound(f"Workout plan with id {plan_id} not found")
    return plan


def _assert_exercises_are_active(
    db: Session,
    exercise_inputs: list[PlanExerciseInput],
) -> None:
    exercise_ids = [item.exercise_id for item in exercise_inputs]
    active_exercises = (
        db.query(Exercise)
        .filter(Exercise.id.in_(exercise_ids))
        .filter(Exercise.is_active == True)
        .all()
    )
    active_ids = {ex.id for ex in active_exercises}
    
    for wanted_id in exercise_ids:
        if wanted_id not in active_ids:
            raise InactiveExerciseInPlan(
                f"Exercise {wanted_id} does not exist or is not active"
            )

    for ex in active_exercises:
        if ex.is_cardio:
            raise CardioExerciseInPlan(
                f"Exercise {ex.id} ({ex.name}) is cardio and cannot be added to a plan"
            )


def _assert_unique_order_indices(exercise_inputs: list[PlanExerciseInput]) -> None:
    seen = set()
    for item in exercise_inputs:
        if item.order_index in seen:
            raise DuplicateOrderIndex(
                f"order_index {item.order_index} appears more than once"
            )
        seen.add(item.order_index)


def list_plans(
    db: Session,
    current_user_id: int,
    current_user_role: RoleEnum,
    is_template_filter: bool | None,
) -> list[WorkoutPlan]:
    query = db.query(WorkoutPlan)

    if current_user_role != RoleEnum.ADMIN:
        query = query.filter(
            (WorkoutPlan.is_template == True)
            | (WorkoutPlan.creator_id == current_user_id)
        )

    if is_template_filter is not None:
        query = query.filter(WorkoutPlan.is_template == is_template_filter)

    return query.all()


def get_plan(
    db: Session,
    plan_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> WorkoutPlan:
    plan = _get_plan_or_raise(db, plan_id)

    if current_user_role == RoleEnum.ADMIN:
        return plan

    if plan.is_template:
        return plan

    if plan.creator_id == current_user_id:
        return plan

    raise PermissionDenied("You are not allowed to view this workout plan")


def create_plan(
    db: Session,
    current_user_id: int,
    current_user_role: RoleEnum,
    payload: WorkoutPlanCreate,
) -> WorkoutPlan:
    if payload.is_template and current_user_role != RoleEnum.ADMIN:
        raise PermissionDenied("Only admins can create template plans")

    _assert_exercises_are_active(db, payload.exercises)
    _assert_unique_order_indices(payload.exercises)

    new_plan = WorkoutPlan(
        name=payload.name,
        creator_id=current_user_id,
        is_template=payload.is_template,
    )

    for item in payload.exercises:
        new_plan.exercises.append(
            PlanExercise(
                exercise_id=item.exercise_id,
                order_index=item.order_index,
                target_sets=item.target_sets,
                target_reps=item.target_reps,
                target_weight=item.target_weight,
            )
        )

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan


def update_plan(
    db: Session,
    plan_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
    payload: WorkoutPlanCreate,
) -> WorkoutPlan:
    plan = _get_plan_or_raise(db, plan_id)

    is_admin = current_user_role == RoleEnum.ADMIN
    is_owner = plan.creator_id == current_user_id
    if not (is_admin or is_owner):
        raise PermissionDenied("You are not allowed to modify this workout plan")

    if payload.is_template and not is_admin:
        raise PermissionDenied("Only admins can mark a plan as template")

    _assert_exercises_are_active(db, payload.exercises)
    _assert_unique_order_indices(payload.exercises)

    plan.name = payload.name
    plan.is_template = payload.is_template

    # REPLACE-ALL: Because of `cascade="all, delete-orphan"` old objects are automatically deleted
    plan.exercises = [
        PlanExercise(
            exercise_id=item.exercise_id,
            order_index=item.order_index,
            target_sets=item.target_sets,
            target_reps=item.target_reps,
            target_weight=item.target_weight,
        )
        for item in payload.exercises
    ]

    db.commit()
    db.refresh(plan)
    return plan


def delete_plan(
    db: Session,
    plan_id: int,
    current_user_id: int,
    current_user_role: RoleEnum,
) -> None:
    plan = _get_plan_or_raise(db, plan_id)

    is_admin = current_user_role == RoleEnum.ADMIN
    is_owner = plan.creator_id == current_user_id
    if not (is_admin or is_owner):
        raise PermissionDenied("You are not allowed to delete this workout plan")

    # WICHTIG (für später): Wenn WorkoutSessions existieren, muss die Beziehung
    # plan_id bei Sessions wahrscheinlich auf NULL gesetzt werden (SET NULL), 
    # damit die historischen Sessions erhalten bleiben (Business Rule 1).
    db.delete(plan)
    db.commit()
