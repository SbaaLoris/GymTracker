# ADR 0014: Use Seed Data for Local Development

## Status

Accepted

## Context

Mova should be easy to start and test locally. Without initial data, new developers or reviewers would need to manually create users, exercises, and sample content before understanding how the application works.

The team wanted the project to be demonstrable quickly after setup.

## Decision

We decided to provide optional, automated seed data for local development and initial setup.

## Reasons

Seed data was selected because it provides:

- Faster local project setup
- Easier testing and demonstration
- A realistic starting point for exploring the application
- Less manual setup for reviewers and team members
- A better first impression when running the project locally

## Alternatives Considered

Possible alternatives would have included:

- Starting with an empty database
- Manually inserting test data through the UI
- Providing separate SQL scripts only
- Hardcoding demo data in the frontend

These alternatives were not selected because optional backend-controlled seed data is easier to manage and closer to a realistic backend workflow.

## Consequences

### Positive

- The app can be tested immediately after setup.
- Reviewers can understand the functionality without creating all data manually.
- Local development becomes more efficient.
- Demo users and starter exercises support testing of user flows.

### Negative

- Seed data must be disabled or controlled carefully in production to avoid security risks.
- The team must document the relevant environment variables.
- Seed data must stay consistent with the current data model.
