from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import date
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./mova.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

Base = declarative_base()

def init_db():
    from backend.models.body_metric import BodyMetric
    from backend.models.exercise import Exercise
    from backend.models.exercise_request import ExerciseRequest
    from backend.models.user import User
    from backend.models.workout_plan import WorkoutPlan, PlanExercise
    from backend.models.workout_session import WorkoutSession, WorkoutSet
    from backend.models.role import RoleEnum
    from backend.services.user_service import hash_password

    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if os.environ.get("MOVA_SEED_DEMO_USERS", "1") == "1":
            # Seed users only if the table is empty
            if db.query(User).count() == 0:
                db.add_all([
                    User(id=1, username="nicokoechli",   hashed_password=hash_password("12345678"), role=RoleEnum.ADMIN),
                    User(id=2, username="lorissbaa",     hashed_password=hash_password("12345678"), role=RoleEnum.USER),
                    User(id=3, username="patrickzobrist", hashed_password=hash_password("12345678"), role=RoleEnum.USER),
                ])
                db.commit()

            if db.query(BodyMetric).count() == 0:
                metrics = [
                    BodyMetric(user_id=1, date=date(2024, 1, 1), body_weight=79.5),
                    BodyMetric(user_id=1, date=date(2024, 1, 8), body_weight=79.0),
                    BodyMetric(user_id=1, date=date(2024, 1, 15), body_weight=78.7),
                    BodyMetric(user_id=1, date=date(2024, 1, 22), body_weight=78.2),
                    BodyMetric(user_id=1, date=date(2024, 1, 29), body_weight=77.8),
                    BodyMetric(user_id=1, date=date(2024, 2, 5), body_weight=77.5),
                ]
                db.add_all(metrics)
                db.commit()
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
