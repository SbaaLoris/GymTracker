from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import date

SQLALCHEMY_DATABASE_URL = "sqlite:///./mova.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    from backend.models.body_metric import BodyMetric
    from backend.models.exercise import Exercise
    from backend.models.exercise_request import ExerciseRequest
    from backend.models.user import User
    from backend.models.workout_plan import WorkoutPlan, PlanExercise
    from backend.models.workout_session import WorkoutSession, WorkoutSet
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Seed body metrics only if table is empty
        if db.query(BodyMetric).count() == 0:
            metrics = [
                BodyMetric(date=date(2024, 1, 1), body_weight=79.5),
                BodyMetric(date=date(2024, 1, 8), body_weight=79.0),
                BodyMetric(date=date(2024, 1, 15), body_weight=78.7),
                BodyMetric(date=date(2024, 1, 22), body_weight=78.2),
                BodyMetric(date=date(2024, 1, 29), body_weight=77.8),
                BodyMetric(date=date(2024, 2, 5), body_weight=77.5),
            ]
            db.add_all(metrics)
            db.commit()

        # Always reset seed users so exactly these 3 exist with the correct IDs
        from backend.models.role import RoleEnum
        from backend.services.user_service import hash_password
        db.query(User).delete()
        db.commit()
        db.add_all([
            User(id=1, username="nicokoechli",   hashed_password=hash_password("12345678"), role=RoleEnum.ADMIN),
            User(id=2, username="lorissbaa",     hashed_password=hash_password("12345678"), role=RoleEnum.USER),
            User(id=3, username="patrickzobrist", hashed_password=hash_password("12345678"), role=RoleEnum.USER),
        ])
        db.commit()
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
