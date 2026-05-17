# ADR 0005: Use FastAPI for the Backend

## Status

Accepted

## Context

Mova requires a backend framework to expose a REST API, handle authentication, implement business rules, connect to the database, and provide interactive API documentation.

The team had previous programming experience mainly with Java. For this project, the team wanted to learn and apply Python in a real full-stack application.

## Decision

We decided to use FastAPI as the backend framework.

## Reasons

FastAPI was selected because it provides:

- A modern, high-performance Python backend framework
- Excellent support for standard REST APIs
- Automatic interactive OpenAPI documentation (Swagger UI / ReDoc)
- Strong integration with Pydantic for data validation and serialization
- A clean structure for routers, schemas, services, and dependencies
- A good opportunity for the team to learn Python in a practical project

## Alternatives Considered

Possible alternatives would have included:

- Flask
- Django
- Node.js with Express
- Spring Boot (Java)

These alternatives were not selected because the team wanted to gain practical experience with Python and use a modern API-first framework.

## Consequences

### Positive

- The team gained practical experience with Python backend development.
- The API is automatically documented through OpenAPI and Swagger UI.
- The backend structure is understandable and suitable for a university full-stack project.
- FastAPI works well with SQLAlchemy, Alembic, and Pydantic.

### Negative

- The team had to learn a new programming language and framework.
- Some implementation decisions required additional research because the team had less prior Python experience.
