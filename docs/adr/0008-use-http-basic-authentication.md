# ADR 0008: Use HTTP Basic Authentication

## Status

Accepted

## Context

Mova requires authentication so that users can register, log in, access their own workout data, and use role-based functionality. Admin users need additional permissions to manage the exercise catalogue, review exercise requests, and create global templates.

The module requirements allowed HTTP Basic Authentication for the project scope. The team also wanted an authentication mechanism that was simple to understand and implement within the available time.

## Decision

We decided to use HTTP Basic Authentication with secure password hashing (bcrypt) on the backend.

## Reasons

HTTP Basic Authentication was selected because:

- It was fully sufficient for the module requirements
- It is simple to understand and implement
- It allowed the team to focus on the full-stack architecture and business logic
- It made the authentication flow easier to explain and document
- It provides a clear foundation for understanding how credentials are sent and validated
- It is lightweight and integrates natively with standard browser and HTTP APIs

## Alternatives Considered

Possible alternatives would have included:

- JWT-based authentication
- OAuth 2.0 / OpenID Connect
- Supabase Auth (managed identity service)
- Session-based authentication with cookies

These alternatives were not selected because they would have increased implementation complexity beyond the required project scope.

## Consequences

### Positive

- Authentication could be implemented with limited complexity.
- The team could focus on role-based access control and core application features.
- The approach is easy to explain in a university project context.
- It creates a foundation for understanding more advanced authentication approaches later.

### Negative

- Basic Auth is simpler than modern production authentication solutions.
- Future production versions should consider JWT, session-based auth, or OAuth depending on requirements.
- Credentials must always be transmitted over HTTPS in production to prevent credential interception.
