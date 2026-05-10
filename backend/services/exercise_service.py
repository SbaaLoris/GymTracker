from sqlalchemy.orm import Session

from backend.models.exercise import Exercise, MuscleGroupEnum
from backend.schemas.exercise import ExerciseCreate
from backend.services.exceptions import ExerciseNameConflict, ExerciseNotFound


def _get_exercise_or_raise(db: Session, exercise_id: int) -> Exercise:
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if exercise is None:
        raise ExerciseNotFound(f"Exercise with id {exercise_id} not found")
    return exercise


def _assert_name_is_free(db: Session, name: str, exclude_id: int | None = None) -> None:
    query = db.query(Exercise).filter(Exercise.name.ilike(name))
    if exclude_id is not None:
        query = query.filter(Exercise.id != exclude_id)
    if query.first() is not None:
        raise ExerciseNameConflict(f"An exercise with the name '{name}' already exists")


def list_exercises(
    db: Session,
    muscle_group: MuscleGroupEnum | None,
    is_cardio: bool | None,
    include_inactive: bool,
    search: str | None,
) -> list[Exercise]:
    query = db.query(Exercise)

    if not include_inactive:
        query = query.filter(Exercise.is_active == True)

    if muscle_group is not None:
        query = query.filter(Exercise.muscle_group == muscle_group)

    if is_cardio is not None:
        query = query.filter(Exercise.is_cardio == is_cardio)

    if search is not None:
        query = query.filter(Exercise.name.ilike(f"%{search}%"))

    return query.order_by(Exercise.id.asc()).all()


def get_exercise(db: Session, exercise_id: int) -> Exercise:
    return _get_exercise_or_raise(db, exercise_id)


def create_exercise(db: Session, payload: ExerciseCreate) -> Exercise:
    _assert_name_is_free(db, payload.name)

    new_exercise = Exercise(
        name=payload.name,
        muscle_group=payload.muscle_group,
        is_cardio=payload.is_cardio,
    )
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return new_exercise


def update_exercise(db: Session, exercise_id: int, payload: ExerciseCreate) -> Exercise:
    exercise = _get_exercise_or_raise(db, exercise_id)
    _assert_name_is_free(db, payload.name, exclude_id=exercise_id)

    exercise.name = payload.name
    exercise.muscle_group = payload.muscle_group
    exercise.is_cardio = payload.is_cardio

    db.commit()
    db.refresh(exercise)
    return exercise


def soft_delete_exercise(db: Session, exercise_id: int) -> Exercise:
    exercise = _get_exercise_or_raise(db, exercise_id)
    exercise.is_active = False

    db.commit()
    db.refresh(exercise)
    return exercise