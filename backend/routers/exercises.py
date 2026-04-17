from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.exercise import Exercise as ExcerciseModel, MuscleGroup
from backend.schemas.exercise import ExerciseCreate, Exercise as ExerciseSchema

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("", response_model = list[ExerciseSchema])
def list_exercises(
    muscle_group: MuscleGroup | None = Query(default=None),
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


@router.post("", response_model =ExerciseSchema, status_code = status.HTTP_201_CREATED)
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
    