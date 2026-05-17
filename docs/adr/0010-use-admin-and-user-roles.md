# ADR 0010: Use Admin and User Roles

## Status

Accepted

## Context

Mova requires at least one complete user flow. The team decided to implement two different user flows to make the application more realistic and to demonstrate role-based functionality.

A regular user should be able to use the app for workout planning, exercise browsing, workout logging, progress tracking, and data export. An admin should be responsible for managing shared application content such as the exercise catalogue and global workout templates.

## Decision

We decided to implement two roles:

- `User`
- `Admin`

## Reasons

The role structure was selected because it provides:

- Two clearly separated user flows
- A more realistic application structure
- A clear distinction between personal user data and shared application content
- Better control over who can manage global exercises and templates
- A stronger demonstration of access control and backend authorization

## Alternatives Considered

Possible alternatives would have included:

- A single-user application without roles
- Allowing every user to manage all exercises
- A more complex role model with additional roles (e.g., Trainer, Guest)

These alternatives were not selected because two roles provided enough complexity for the project scope without making authorization unnecessarily complicated.

## Consequences

### Positive

- The application demonstrates role-based access control.
- Admin and user functionality can be clearly separated.
- Shared data such as the exercise catalogue remains controlled.
- The app has more realistic user flows.

### Negative

- The backend must check permissions for role-specific actions.
- The frontend must handle different navigation and views for different roles.
- Testing requires both admin and regular user scenarios.
