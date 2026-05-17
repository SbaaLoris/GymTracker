# Verification and Testing

This document details the testing architecture, data validation systems, integration testing runners, and deployment verification processes in **Mova Gym Tracker**.

---

## 1. Multi-Tier Schema Validation

To guarantee complete consistency and safety across the API boundary, Mova implements strict validation schemas at both the client and server levels.

```mermaid
graph TD;
    subgraph Client (Vercel)
        UI[User Input Form] -->|Validates via Zod| FE[React Client]
    end
    subgraph Server (Render)
        FE -->|HTTP Payload| BE[FastAPI Endpoint]
        BE -->|Validates via Pydantic| DB[PostgreSQL]
    end
```

### Client-Side Validation (Zod)
The React frontend uses **Zod** to validate form inputs before sending request payloads. This prevents unnecessary HTTP roundtrips for obviously malformed inputs.
- Schemas are defined in `frontend/src/schemas/`.
- Example schema from [workout-plan.ts](file:///Users/lorissbaa/Desktop/GymTracker/frontend/src/schemas/workout-plan.ts):
```typescript
import { z } from 'zod'

export const WorkoutPlanCreateSchema = z.object({
  name: z.string().min(2).max(100),
  is_template: z.boolean().optional(),
  exercises: z.array(PlanExerciseInputSchema).min(1),
})
```

### Server-Side Validation (Pydantic v2)
The backend FastAPI service uses **Pydantic v2** to rigorously parse and validate incoming payloads on receipt. Any mismatch automatically throws an HTTP `422 Unprocessable Entity` response with detail payloads showing the failed fields.
- Schemas are defined in `backend/schemas/`.
- Example schema from [workout_plan.py](file:///Users/lorissbaa/Desktop/GymTracker/backend/schemas/workout_plan.py):
```python
from pydantic import BaseModel, Field

class WorkoutPlanCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    is_template: bool = False
    exercises: list[PlanExerciseInput] = Field(..., min_length=1)
```

---

## 2. Shell Integration Test Suite (`integration_test.sh`)

Mova features a comprehensive, automated end-to-end integration test runner written in Bash: `backend/tests/integration_test.sh`.

This script programmatically simulates client interactions to verify that authentication, role gating, business rules, and database operations work correctly under realistic workloads.

### Key Aspects Verified
1. **Authentication Flows**: Validates standard user registration, correct user profile loading, and rejects invalid credentials with a `401 Unauthorized` status.
2. **Admin Gating**: Confirms that only administrators can write to the exercise catalogue and denies regular users with a `403 Forbidden` status.
3. **Anti-Spam Thresholds**: Confirms that regular users are blocked from sending more than 5 concurrent pending exercise requests (`429 Too Many Requests`).
4. **Business Validations**:
   - Rejects workout plans containing cardio exercises (which lack sets/reps target support) with a `422` error.
   - Rejects workout plans containing duplicate exercise `order_index` assignments.
   - Rejects workout sessions recorded with zero sets.
5. **Data Export Integrity**: Tests binary stream handlers to confirm that workout sessions and body metrics are exported in CSV and PDF formats correctly (expecting a `200 OK` status and valid content headers).

### How to Run the Test Suite Locally

1. **Reset and Prepare the Database**:
   Configure the database seed parameters so that demo users are populated, but no exercises are present initially (the script expects a blank catalogue to verify exercise creation and request approval flows):
   ```bash
   export MOVA_DEV_MODE=1
   export MOVA_SEED_DEMO_USERS=1
   export MOVA_SEED_STARTER_DATA=0
   rm -f mova.db
   ```

2. **Upgrade the Local Database**:
   ```bash
   cd backend
   alembic upgrade head
   cd ..
   ```

3. **Start the API Server**:
   ```bash
   uvicorn backend.main:app --port 8000
   ```

4. **Execute the Script**:
   In a separate terminal window, execute the integration test runner (requires `jq` for checking JSON response elements):
   ```bash
   ./backend/tests/integration_test.sh
   ```

---

## 3. Post-Deployment Verification Plan

When updates are pushed to production, the following manual and automated steps verify that the system remains fully functional.

### 1. Endpoint Availability Check
Ping the public `/health` endpoint to verify that the backend process has booted successfully on Render and database connections are established:
```bash
curl -s https://your-backend-render-url.onrender.com/health
```
**Expected Response:**
```json
{
  "status": "ok"
}
```

### 2. Manual User Verification Flows
Perform these quick sanity checks in the deployed application to ensure operational health:

- **Register a New Account**: Go to the signup page, register a test user, and verify successful redirection to the main dashboard.
- **Log a Workout Set**: Access the Logger module, log a set with a weight and rep count, and confirm that the set appears on the Dashboard list.
- **Record a Metric Point**: Record a body weight measurement, and confirm that the Weight History graph updates dynamically.
- **Download Data**: Click "Export to CSV" on the progress screen, and verify that the browser downloads a valid file named `workout_sessions_export.csv` containing your recorded sets.
