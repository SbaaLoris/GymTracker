from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.exercise import Exercise as ExcerciseModel, MuscleGroupEnum
from backend.schemas.exercise import ExerciseCreate, Exercise as ExerciseSchema

router = APIRouter(prefix="/exercises", tags=["Exercises"])

#Private functions / helper methods
def _get_exercise_or_404(exercise_id: int, db: Session) -> ExcerciseModel:
    exercise = db.query(ExcerciseModel).filter(ExcerciseModel.id == exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    return exercise

#Routers

@router.get("", response_model = list[ExerciseSchema])
def list_exercises(
    muscle_group: MuscleGroupEnum | None = Query(default=None),
    is_cardio: bool | None = Query(default=None),
    include_inactive: bool = Query(default=False),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(ExcerciseModel)

    if not include_inactive:
        query = query.filter(ExcerciseModel.is_active == True)

    if muscle_group is not None:
        query = query.filter(ExcerciseModel.muscle_group == muscle_group)
    
    if is_cardio is not None:
        query = query.filter(ExcerciseModel.is_cardio == is_cardio)
    
    if search is not None:
        query = query.filter(ExcerciseModel.name.ilike(f"%{search}%"))
    
    return query.all()

@router.post("", response_model = ExerciseSchema, status_code = status.HTTP_201_CREATED)
def create_exercise(
    payload: ExerciseCreate,
    db: Session = Depends(get_db),
):
    existing = db.query(ExcerciseModel).filter(ExcerciseModel.name == payload.name).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail= "An exercise with this name already exists"
        )
    new_exercise = ExcerciseModel(
        name = payload.name,
        muscle_group = payload.muscle_group,
        is_cardio = payload.is_cardio
    )

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise

@router.get("/{exercise_id}", response_model = ExerciseSchema)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db)
):
    return _get_exercise_or_404(exercise_id, db)

@router.put("/{exercise_id}", response_model = ExerciseSchema)
def update_exercise(
    exercise_id : int,
    payload: ExerciseCreate,
    db: Session = Depends(get_db),
):
    exercise = _get_exercise_or_404(exercise_id, db)

    name_conflict = (
        db.query(ExcerciseModel)
        .filter(ExcerciseModel.name == payload.name)
        .filter(ExcerciseModel.id != exercise_id)
        .first()
    )

    if name_conflict is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An exercise with this name already exists",
        )
    
    exercise.name = payload.name
    exercise.muscle_group = payload.muscle_group
    exercise.is_cardio = payload.is_cardio

    db.commit()
    db.refresh(exercise)

    return exercise

@router.delete("/{exercise_id}", response_model = ExerciseSchema)
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db)
):
    exercise = _get_exercise_or_404(exercise_id, db)
    exercise.is_active = False
    
    db.commit()
    db.refresh(exercise)
    return exercise
