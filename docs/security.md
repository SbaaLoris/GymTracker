# Security and Authentication

This document details the security model, credential management, role authorization, and CORS configurations implemented in **Mova Gym Tracker**.

---

## 1. HTTP Basic Authentication

Mova uses **HTTP Basic Authentication** as its primary authentication mechanism to keep the design lightweight and easy to understand.

### Flow Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant API as Backend (FastAPI)
    participant DB as Database (Postgres)

    User->>API: HTTP Request + Authorization Header (Basic Base64(usr:pwd))
    Note over API: HTTPBasic() parses credentials
    API->>DB: Query user by username
    DB-->>API: User details + bcrypt Hashed Password
    API->>API: Verify password via bcrypt.checkpw()
    alt Credentials Valid
        API-->>User: Return requested data (200 OK)
    else Credentials Invalid
        API-->>User: HTTP 401 Unauthorized (WWW-Authenticate: Basic)
    end
```

### Authorization Header
The client sends the standard HTTP `Authorization` header containing the prefix `Basic` followed by the base64-encoded credentials:
```http
Authorization: Basic bG9yaXNzYmFhOjEyMzQ1Njc4
```

### Backend Credentials Verification
The backend intercepts these credentials using FastAPI's built-in `HTTPBasic` security dependency. Inside `get_current_user` ([auth.py](../backend/auth.py)), the database session and raw credentials are verified:
```python
_basic = HTTPBasic(auto_error=True)

def get_current_user(
    credentials: HTTPBasicCredentials | None = Depends(_basic),
    db: Session = Depends(get_db),
) -> CurrentUser:
    ...
    try:
        user = user_service.authenticate_user(db, credentials.username, credentials.password)
    except InvalidCredentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return CurrentUser(id=user.id, username=user.username, role=user.role)
```

---

## 2. Secure Password Hashing

Mova never stores raw, plain-text passwords in the database. Instead, passwords are securely hashed using **bcrypt** inside `user_service.py` with a salt cost factor.

### Hashing on Registration
When a new user registers, the backend generates a random salt and creates a bcrypt hash:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
```

### Verification on Authentication
During login, the incoming plain password is compared with the stored hash. The comparison is timing-attack resistant:
```python
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

---

## 3. Role-Based Endpoint Gating

Mova implements role-based access control (RBAC) to enforce distinct features for **Admins** and **Users**.

FastAPI's dependency injection system gates endpoints using helper functions from `backend/auth.py`:

| Role Dependency | Target Role | Access Scope |
|---|---|---|
| `get_current_user` | Any authenticated account | Access basic profile info or public catalogue items |
| `require_user` | `user` | Allowed to record metrics, log workouts, suggest exercises, and export CSV/PDF data |
| `require_admin` | `admin` | Allowed to manage global exercises, approve/deny requests, and configure starter templates |

### Endpoint Gating Example
Here is how routes are gated in FastAPI:
```python
from backend.auth import require_admin, require_user, CurrentUser

# Gated to Admins only
@router.post("/exercises", response_model=ExerciseOut)
def create_exercise(
    exercise_in: ExerciseCreate,
    db: Session = Depends(get_db),
    admin: CurrentUser = Depends(require_admin)
):
    return exercise_service.create_exercise(db, exercise_in)

# Gated to Regular Users only
@router.post("/workout-sessions", response_model=SessionOut)
def log_session(
    session_in: SessionCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_user)
):
    return workout_service.create_session(db, user.id, session_in)
```

---

## 4. Cross-Origin Resource Sharing (CORS)

To allow the Vercel-hosted frontend to securely communicate with the Render-hosted backend, CORS is explicitly configured on the FastAPI app in `backend/main.py`.

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("MOVA_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)
```

### Critical CORS Settings
- **`allow_origins`**: Reads from the `MOVA_CORS_ORIGINS` environment variable (falling back to standard local ports during development). This prevents unauthorized websites from calling the API.
- **`allow_credentials=True`**: Essential for HTTP Basic Auth because it permits browsers to transmit the authorization headers across domains.
- **`expose_headers=["Content-Disposition"]`**: Required to allow the React client to read the file name when downloading CSV/PDF exports. Without this, standard browser security blocks frontend access to custom response headers.
