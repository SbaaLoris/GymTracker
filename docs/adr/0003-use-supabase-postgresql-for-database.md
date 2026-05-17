# ADR 0003: Use Supabase PostgreSQL for Database Hosting

## Status

Accepted

## Context

Mova requires persistent data storage for users, exercises, workout plans, workout sessions, body metrics, and exercise requests.

The backend is deployed on Render. Since the backend service itself should not be responsible for storing persistent application data locally, the database needed to be hosted separately through a managed database provider.

The database solution needed to be reliable, easy to connect to from the FastAPI backend, and manageable without operating a custom database server.

## Decision

We decided to use Supabase PostgreSQL as the production database.

## Reasons

Supabase was selected because it provides:

- Managed PostgreSQL database
- A free tier that is sufficient for the project use case
- A database connection string that can be used by the Render backend
- A web dashboard for database inspection and management
- A SQL editor for administrative tasks
- No need to operate or maintain a separate database server

PostgreSQL was selected because it is a widely used relational database and fits the structured data model of the application.

## Alternatives Considered

No major alternatives were evaluated in detail after deciding to separate the database from the backend hosting provider.

Possible alternatives would have included:

- Render PostgreSQL (requires premium or has limited persistence on free tiers)
- Railway PostgreSQL
- Neon
- Local PostgreSQL server
- SQLite (not suitable for multi-user production deployment due to persistence constraints)

## Consequences

### Positive

- Application data is stored independently from the backend runtime.
- The database remains separate from Render's application hosting.
- The FastAPI backend can connect to Supabase through `DATABASE_URL`.
- The team can manage the database through the Supabase dashboard.
- PostgreSQL fits well with SQLAlchemy and Alembic.

### Negative

- The system depends on an additional external provider.
- The database connection must be configured securely through environment variables.
- The frontend must not access Supabase directly, because application logic and authorization are handled by the backend.
