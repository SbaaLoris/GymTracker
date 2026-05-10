# Deployment Documentation

This document describes the production deployment setup for the **Mova Gym Tracker** backend.

## Architecture Overview


| Component | Provider | Purpose |
|---|---|---|
| Backend API | Render | Hosts the FastAPI application and exposes the REST API. |
| Database | Supabase | Hosts the PostgreSQL database. |
| Keep-alive | cron-job.org | Calls `/health` every 15 minutes to reduce cold starts on the free Render tier. |

> **Rule:** The frontend must never connect directly to Supabase. All application logic, authentication, and business rules are handled by the FastAPI backend.

---

## Render Backend Service

| Item | Value |
|---|---|
| Production URL | `https://mova-backend-05ic.onrender.com` |
| Health endpoint | `https://mova-backend-05ic.onrender.com/health` |
| Interactive API docs | `https://mova-backend-05ic.onrender.com/docs` |

### Render Service Settings

| Setting | Value |
|---|---|
| Repository | `SbaaLoris/GymTracker` |
| Runtime | Python |
| Root Directory | *(empty)* |
| Python version | controlled by `.python-version` |
| Build Command | `pip install -r backend/requirements.txt && cd backend && alembic upgrade head` |
| Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |
| Auto Deploy | On Commit |

### Python Version

The `.python-version` file in the repository root pins the runtime to **3.11.9**.

```text
3.11.9
```

This prevents Render from using a newer default Python version that can break dependency installation for packages such as `pydantic-core`.

---

## Environment Variables

All secrets must be stored in Render only — never committed to GitHub.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string. |
| `MOVA_BOOTSTRAP_ADMIN_USERNAME` | Username for the first admin account. |
| `MOVA_BOOTSTRAP_ADMIN_PASSWORD` | Strong password for the first admin account. |
| `MOVA_CORS_ORIGINS` | Comma-separated list of allowed frontend origins. |
| `MOVA_SEED_DEMO_USERS` | Set to `0` in production. |
| `MOVA_SEED_STARTER_DATA` | Set to `1` once for initial data, then back to `0`. |

Recommended production values:

```text
MOVA_SEED_DEMO_USERS=0
MOVA_SEED_STARTER_DATA=0
```

---

## Database Migrations

Schema changes are managed with **Alembic** and run automatically during every Render build:

```bash
cd backend && alembic upgrade head
```

This command is already included in the Render Build Command above.

---

## Supabase Row Level Security

Row Level Security (RLS) must be enabled for all public tables. No table should be accessible from the frontend directly.

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

---

## Cron Job (Keep-alive)

| Setting | Value |
|---|---|
| URL | `https://mova-backend-05ic.onrender.com/health` |
| Method | GET |
| Interval | Every 15 minutes |
| Expected response | HTTP 200 — `{ "status": "ok" }` |

The cron job only calls the public health endpoint. It does not access private data or modify the database.

---

## Post-Deployment Verification

After every deployment, verify the following:

**1. Health check**

```text
GET https://mova-backend-05ic.onrender.com/health
```

Expected response:

```json
{"status": "ok"}
```

**2. API documentation**

```text
GET https://mova-backend-05ic.onrender.com/docs
```

Expected: FastAPI Swagger UI loads successfully.

**3. Render logs**

Verify the service started cleanly:

```text
Application startup complete.
```

---

## Security Checklist

- [ ] `DATABASE_URL` is set in Render only, not committed to GitHub.
- [ ] Admin password is strong and set only in Render.
- [ ] `MOVA_SEED_DEMO_USERS=0` in production.
- [ ] `MOVA_CORS_ORIGINS` is restricted to the real frontend URL.
- [ ] Supabase Row Level Security is enabled on all public tables.
- [ ] Frontend connects to the Render backend URL, not directly to Supabase.