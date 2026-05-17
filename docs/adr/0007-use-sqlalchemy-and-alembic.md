# ADR 0007: Use SQLAlchemy and Alembic for Database Access and Migrations

## Status

Accepted

## Context

Mova stores structured relational data such as users, exercises, workout plans, workout sessions, workout sets, body metrics, and exercise requests.

The backend needs a reliable way to interact with the PostgreSQL database and to manage schema changes over time.

## Decision

We decided to use SQLAlchemy as the Object-Relational Mapper (ORM) and Alembic for database migrations.

## Reasons

SQLAlchemy and Alembic were selected because they provide:

- A common and established Python database stack
- Object-relational mapping between Python models and database tables
- More structure and safety than writing all SQL manually
- Migration files to track database schema changes
- Better reproducibility between local development and production
- Native compatibility with PostgreSQL and FastAPI

## Alternatives Considered

Possible alternatives would have included:

- Writing raw SQL manually
- Using another Python ORM (like SQLModel or Tortoise ORM)
- Managing database schema changes manually in Supabase
- Using a Backend-as-a-Service approach without a custom ORM layer

These alternatives were not selected because the team wanted a structured and maintainable database workflow.

## Consequences

### Positive

- Database models are represented clearly in the backend code.
- Schema changes can be versioned through Alembic migrations.
- Production migrations can be executed during deployment automatically.
- The database workflow is closer to common backend best practices.

### Negative

- The team had to understand ORM concepts and migration workflows.
- Incorrect migrations can create deployment issues if not tested carefully.
- SQLAlchemy adds abstraction, which can make the generated SQL less visible to beginners.
