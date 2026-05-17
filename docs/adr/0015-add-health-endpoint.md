# ADR 0015: Add a Health Endpoint

## Status

Accepted

## Context

The backend is deployed on Render. The application needs a simple endpoint that can be used to verify whether the backend service is reachable.

The Render free tier can introduce cold starts when the service becomes inactive. The team also uses an external cron job to call the backend regularly.

## Decision

We decided to add a public `/health` endpoint.

The endpoint returns a simple JSON response:

```json
{
  "status": "ok"
}
```

## Reasons

The health endpoint was selected because it provides:

- A simple way to verify that the backend is running
- A stable target for Render health checks
- A stable target for the external cron job
- A simple endpoint for manual post-deployment verification
- A public check that does not access private data or modify the database

## Alternatives Considered

Possible alternatives would have included:

- Using the Swagger documentation endpoint as a check
- Calling a real application endpoint (which requires auth)
- Not having a dedicated health endpoint

These alternatives were not selected because a dedicated health endpoint is simpler, safer, and clearer.

## Consequences

### Positive

- Backend availability can be checked easily.
- The cron job can ping a harmless endpoint.
- Deployment verification becomes easier.
- The endpoint does not require authentication and does not expose sensitive data.

### Negative

- The endpoint only confirms that the backend process is reachable.
- It does not fully verify database connectivity unless extended in the future.
