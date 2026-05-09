from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import date
import os

# Render uses "postgres://", but SQLAlchemy 2.x requires "postgresql://"
db_url = os.environ.get("DATABASE_URL", "sqlite:///./mova.db")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# SQLite specific connect_args
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Foreign key enforcement for SQLite
if db_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

Base = declarative_base()

def _bootstrap_admin(db):
    from backend.models.user import User
    from backend.models.role import RoleEnum
    from backend.services.user_service import hash_password

    admin_username = os.environ.get("MOVA_BOOTSTRAP_ADMIN_USERNAME")
    admin_password = os.environ.get("MOVA_BOOTSTRAP_ADMIN_PASSWORD")

    if admin_username and admin_password:
        # Check if any admin already exists to remain idempotent
        admin_exists = db.query(User).filter(User.role == RoleEnum.ADMIN).first() is not None
        if not admin_exists:
            print(f"Bootstrapping admin user: {admin_username}")
            admin = User(
                username=admin_username,
                hashed_password=hash_password(admin_password),
                role=RoleEnum.ADMIN
            )
            db.add(admin)
            db.commit()

def _seed_demo_users(db):
    from backend.models.user import User
    from backend.models.body_metric import BodyMetric
    from backend.models.role import RoleEnum
    from backend.services.user_service import hash_password

    if db.query(User).count() == 0:
        print("Seeding demo users...")
        # Note: We rely on database identity generation (don't hardcode IDs)
        # for Postgres compatibility.
        users = [
            User(username="nicokoechli", hashed_password=hash_password("12345678"), role=RoleEnum.ADMIN),
            User(username="lorissbaa", hashed_password=hash_password("12345678"), role=RoleEnum.USER),
            User(username="patrickzobrist", hashed_password=hash_password("12345678"), role=RoleEnum.USER),
        ]
        db.add_all(users)
        db.commit()

        # Seed metrics for the first user (nicokoechli)
        first_user = db.query(User).filter_by(username="nicokoechli").first()
        if first_user and db.query(BodyMetric).count() == 0:
            metrics = [
                BodyMetric(user_id=first_user.id, date=date(2024, 1, 1), body_weight=79.5),
                BodyMetric(user_id=first_user.id, date=date(2024, 1, 8), body_weight=79.0),
                BodyMetric(user_id=first_user.id, date=date(2024, 1, 15), body_weight=78.7),
                BodyMetric(user_id=first_user.id, date=date(2024, 1, 22), body_weight=78.2),
                BodyMetric(user_id=first_user.id, date=date(2024, 1, 29), body_weight=77.8),
                BodyMetric(user_id=first_user.id, date=date(2024, 2, 5), body_weight=77.5),
            ]
            db.add_all(metrics)
            db.commit()

def _seed_starter_data(db):
    from backend.models.exercise import Exercise, MuscleGroupEnum
    from backend.models.workout_plan import WorkoutPlan, PlanExercise
    from backend.models.user import User
    from backend.models.role import RoleEnum

    if db.query(Exercise).count() == 0:
        print("Seeding starter exercises...")
        exercises = [
            # Strength
            Exercise(name="Bench Press", muscle_group=MuscleGroupEnum.CHEST, is_cardio=False),
            Exercise(name="Incline Dumbbell Press", muscle_group=MuscleGroupEnum.CHEST, is_cardio=False),
            Exercise(name="Pull-Up", muscle_group=MuscleGroupEnum.BACK, is_cardio=False),
            Exercise(name="Barbell Row", muscle_group=MuscleGroupEnum.BACK, is_cardio=False),
            Exercise(name="Barbell Squat", muscle_group=MuscleGroupEnum.LEGS, is_cardio=False),
            Exercise(name="Leg Press", muscle_group=MuscleGroupEnum.LEGS, is_cardio=False),
            Exercise(name="Overhead Press", muscle_group=MuscleGroupEnum.SHOULDERS, is_cardio=False),
            Exercise(name="Lateral Raise", muscle_group=MuscleGroupEnum.SHOULDERS, is_cardio=False),
            Exercise(name="Barbell Curl", muscle_group=MuscleGroupEnum.ARMS, is_cardio=False),
            Exercise(name="Triceps Pushdown", muscle_group=MuscleGroupEnum.ARMS, is_cardio=False),
            Exercise(name="Plank", muscle_group=MuscleGroupEnum.CORE, is_cardio=False),
            Exercise(name="Hanging Leg Raise", muscle_group=MuscleGroupEnum.CORE, is_cardio=False),
            # Cardio
            Exercise(name="Treadmill Running", muscle_group=MuscleGroupEnum.CARDIO, is_cardio=True),
            Exercise(name="Stationary Bike", muscle_group=MuscleGroupEnum.CARDIO, is_cardio=True),
            Exercise(name="Rowing Machine", muscle_group=MuscleGroupEnum.CARDIO, is_cardio=True),
        ]
        db.add_all(exercises)
        db.commit()

    # Create one template plan if none exists and we have an admin
    if db.query(WorkoutPlan).filter(WorkoutPlan.is_template == True).count() == 0:
        admin = db.query(User).filter(User.role == RoleEnum.ADMIN).first()
        if admin:
            print("Seeding beginner template plan...")
            ex1 = db.query(Exercise).filter_by(name="Bench Press").first()
            ex2 = db.query(Exercise).filter_by(name="Barbell Squat").first()
            ex3 = db.query(Exercise).filter_by(name="Pull-Up").first()

            if ex1 and ex2 and ex3:
                template = WorkoutPlan(
                    name="Full Body Beginner",
                    creator_id=admin.id,
                    is_template=True
                )
                template.exercises = [
                    PlanExercise(exercise_id=ex1.id, order_index=1, target_sets=3, target_reps=10, target_weight=40),
                    PlanExercise(exercise_id=ex2.id, order_index=2, target_sets=3, target_reps=10, target_weight=50),
                    PlanExercise(exercise_id=ex3.id, order_index=3, target_sets=3, target_reps=8, target_weight=0),
                ]
                db.add(template)
                db.commit()

def init_db():
    # Import all models here to ensure they are registered with Base
    from backend.models.body_metric import BodyMetric
    from backend.models.exercise import Exercise
    from backend.models.exercise_request import ExerciseRequest
    from backend.models.user import User
    from backend.models.workout_plan import WorkoutPlan, PlanExercise
    from backend.models.workout_session import WorkoutSession, WorkoutSet
    
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Bootstrap Admin (always runs, idempotent)
        _bootstrap_admin(db)

        # 2. Seed Demo Users (opt-in, default off)
        if os.environ.get("MOVA_SEED_DEMO_USERS", "0") == "1":
            _seed_demo_users(db)

        # 3. Seed Starter Exercises/Templates (opt-in, default off)
        if os.environ.get("MOVA_SEED_STARTER_DATA", "0") == "1":
            _seed_starter_data(db)
            
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
