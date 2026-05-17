# ADR 0012: Use Soft Delete for Exercises

## Status

Accepted

## Context

Exercises are referenced by workout plans and workout sessions. If an exercise was physically deleted from the database, historical workout data could become incomplete or inconsistent.

The team wanted to preserve workout history even if an exercise should no longer be available for new plans or future logging.

## Decision

We decided to soft-delete exercises instead of permanently deleting them.

A deleted exercise is marked as inactive (`is_active = false`) and hidden from active exercise selection lists, while historical records can still reference it.

## Reasons

Soft delete was selected because it provides:

- Preservation of workout history
- Excellent database integrity and foreign key safety
- Protection against broken references in existing plans/sessions
- A safer admin workflow
- The possibility to keep old sessions understandable even after an exercise is removed from the active catalogue

## Alternatives Considered

Possible alternatives would have included:

- Permanently deleting exercises from the database (causes cascade deletions or orphaned references)
- Preventing deletion if an exercise is already used (forces admins to keep outdated exercises active)
- Archiving exercises in a separate table (increases schema complexity)

These alternatives were not selected because soft delete offered the best balance between simplicity and historical data preservation.

## Consequences

### Positive

- Historical workout sessions remain fully readable.
- Existing references to exercises are not broken.
- Admins can remove exercises from active use without destroying data.
- The application behaves safely with user-generated history.

### Negative

- Queries must distinguish between active and inactive exercises.
- The database keeps old exercise records indefinitely.
- Admin views may need to show inactive exercises differently if needed.
