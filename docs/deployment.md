# Deployment Documentation

This document describes the current production deployment setup for the Mova Gym Tracker backend.

## Production Architecture

The application is deployed with three separate components.

| Component | Provider | Purpose |
|---|---|---|
| Backend API | Render | Hosts the FastAPI application and exposes the REST API. |
| Database | Supabase | Hosts the PostgreSQL database used by the backend. |
| Keep alive check | cron-job.org | Calls the backend health endpoint regularly to reduce cold starts on the free Render instance. |

The intended request flow is:

```text
Frontend or API client -> Render FastAPI backend -> Supabase PostgreSQL database
```

The frontend should not connect directly to Supabase tables. All application logic, authentication checks, and business rules are handled by the FastAPI backend.

## Render Backend Service

Current production backend URL:

```text
https://mova-backend-05ic.onrender.com
```

Health endpoint:

```text
https://mova-backend-05ic.onrender.com/health
```

Interactive API documentation:

```text
https://mova-backend-05ic.onrender.com/docs
```

## Render Settings

The Render service is configured as a Web Service.

| Setting | Value |
|---|---|
| Repository | `SbaaLoris/GymTracker` |
| Runtime | Python |
| Root Directory | empty |
| Python version | controlled by `.python-version` |
| Build Command | `pip install -r backend/requirements.txt && cd backend && alembic upgrade head` |
| Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |
| Auto Deploy | On Commit |

## Python Version

Render must use Python 3.11.9. This is pinned in the repository root through:

```text
.python-version
```

Required content:

```text
3.11.9
```

This prevents Render from using a newer unsupported default Python version that can break dependency installation for packages such as `pydantic-core`.

## Required Render Environment Variables

The following environment variables are required in Render. Secrets must be stored only in Render, never in GitHub.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string. |
| `MOVA_BOOTSTRAP_ADMIN_USERNAME` | Username for the first admin account. |
| `MOVA_BOOTSTRAP_ADMIN_PASSWORD` | Strong password for the first admin account. |
| `MOVA_CORS_ORIGINS` | Comma separated list of allowed frontend origins. |
| `MOVA_SEED_DEMO_USERS` | Should be `0` in production. |
| `MOVA_SEED_STARTER_DATA` | Can be set to `1` once for initial starter data, then set back to `0`. |

Recommended production values:

```text
MOVA_SEED_DEMO_USERS=0
MOVA_SEED_STARTER_DATA=0
```

The starter data can be enabled temporarily during initial setup, but should not stay enabled permanently unless intentionally needed.

## Supabase Database

Supabase is used as a managed PostgreSQL database. The backend connects to it through `DATABASE_URL` using SQLAlchemy.

Expected database tables include:

| Table | Purpose |
|---|---|
| `alembic_version` | Tracks the current Alembic migration version. |
| `users` | Stores application users and roles. |
| `exercises` | Stores the master exercise catalogue. |
| `exercise_requests` | Stores user requests for new exercises. |
| `workout_plans` | Stores workout plans and templates. |
| `plan_exercises` | Stores exercises assigned to a plan. |
| `workout_sessions` | Stores logged workout sessions. |
| `workout_sets` | Stores individual sets inside a session. |
| `body_metrics` | Stores body weight progress records. |

## Supabase Security

Row Level Security should be enabled for all public tables in Supabase.

Recommended SQL:

```sql
alter table public.users enable row level security;
alter table public.body_metrics enable row level security;
alter table public.exercise_requests enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;
alter table public.alembic_version enable row level security;
```

No public Supabase table access should be used by the frontend. The frontend should call the Render API instead.

## Database Migrations

Database schema changes are managed with Alembic.

The migration command runs automatically during Render builds:

```bash
cd backend && alembic upgrade head
```

This command is included in the Render Build Command.

## Cron Job

A cron job is configured through cron-job.org to reduce cold starts on the free Render instance.

| Setting | Value |
|---|---|
| URL | `https://mova-backend-05ic.onrender.com/health` |
| Method | GET |
| Interval | Every 15 minutes |
| Expected response | HTTP 200 with `{ "status": "ok" }` |

The cron job does not access private data and does not modify the database. It only calls the public health endpoint.

## Verification Checklist

After every deployment, verify the following endpoints.

```text
https://mova-backend-05ic.onrender.com/health
```

Expected response:

```json
{"status":"ok"}
```

```text
https://mova-backend-05ic.onrender.com/docs
```

Expected result: FastAPI Swagger documentation loads successfully.

Also verify in Render logs that the service starts with:

```text
Application startup complete.
```

## Team Access

Team members should be invited through the platform access systems instead of sharing passwords.

For Supabase:

```text
Organization Settings -> Team -> Invite member
```

For Render:

```text
Workspace Settings -> Members -> Invite member
```

Normal collaborators should usually receive a developer role, not owner access.

## Important Security Rules

1. Do not commit `DATABASE_URL` to GitHub.
2. Do not commit Supabase passwords or API keys to GitHub.
3. Use a strong admin password in Render.
4. Keep `MOVA_SEED_DEMO_USERS=0` in production.
5. Keep Supabase Row Level Security enabled for public tables.
6. Connect the frontend to the Render backend URL, not directly to Supabase tables.
7. Restrict `MOVA_CORS_ORIGINS` to the real frontend URL once the frontend is deployed.

## Current Deployment Status

The backend has been successfully deployed on Render and connected to Supabase PostgreSQL. The cron job is configured to call `/health` every 15 minutes. Supabase Row Level Security has been enabled for the public tables.