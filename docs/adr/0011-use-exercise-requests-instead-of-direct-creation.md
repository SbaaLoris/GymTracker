# ADR 0011: Use Exercise Requests Instead of Direct User-Created Exercises

## Status

Accepted

## Context

Mova includes a shared exercise catalogue that is visible to users and used for workout plans and workout logging.

If every user could directly create global exercises, the catalogue could become inconsistent, duplicated, or low quality. The team wanted to protect the shared exercise list and keep responsibility for global exercises with the admin role.

## Decision

We decided that regular users cannot directly create global exercises. Instead, they can submit exercise requests. Admins can review these requests and approve or deny them.

## Reasons

The exercise request workflow was selected because it provides:

- Better control over the shared exercise catalogue
- Protection against random or duplicate exercise entries
- Clear responsibility for exercise quality
- A realistic admin review flow
- A clean separation between user suggestions and official catalogue entries
- Protection against spam by limiting users to a maximum of 5 pending requests at any time

## Alternatives Considered

Possible alternatives would have included:

- Allowing every user to create global exercises directly
- Allowing users to create only private exercises
- Not allowing users to suggest new exercises at all

These alternatives were not selected because the team wanted both user participation and admin-controlled data quality.

## Consequences

### Positive

- The global exercise catalogue remains consistent and clean.
- Admins can ensure that approved exercises are correct and useful.
- Users can still contribute suggestions.
- The app demonstrates a realistic approval workflow.

### Negative

- Users cannot instantly add new global exercises.
- Admins must actively review requests.
- Additional backend and frontend logic is required for request handling.
