from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import init_db
from backend.routers import auth
from backend.routers import body_metrics
from backend.routers import exercises
from backend.routers import exercise_requests
from backend.routers import workout_plans
from backend.routers import workout_sessions

app = FastAPI(title="GymTracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router)
app.include_router(body_metrics.router, tags=["Body Metrics"])
app.include_router(exercises.router)
app.include_router(exercise_requests.router)
app.include_router(workout_plans.router)
app.include_router(workout_sessions.router)
