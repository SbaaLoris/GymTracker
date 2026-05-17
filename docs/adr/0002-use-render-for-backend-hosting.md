# ADR 0002: Use Render for Backend Hosting

## Status

Accepted

## Context

Mova requires a backend hosting platform for the FastAPI application. The backend must expose the REST API, connect to the PostgreSQL database, run database migrations, and provide a stable production URL for the frontend.

The team compared Render and Railway as possible backend hosting providers. Since the project is part of a university module, the selected platform needed to be simple to use, cost-efficient, and suitable for a small production deployment.

## Decision

We decided to deploy the FastAPI backend on Render.

## Reasons

Render was selected because it provides:

- Simple deployment for Python/FastAPI applications
- GitHub integration
- Environment variable management
- Build and start command configuration
- Application logs
- Health check support
- A free tier that is sufficient for the project use case

The main limitation of the free tier is that the backend service can spin down after inactivity. To reduce cold starts, we added an external cron job that regularly calls the public `/health` endpoint.

## Alternatives Considered

The main alternative was Railway.

Railway was considered because it also provides simple deployment and good developer experience. However, the team selected Render because it was straightforward to configure and sufficient for the project requirements.

Other possible alternatives would have included:

- Fly.io
- Heroku
- Vercel Serverless Functions
- Supabase Edge Functions

## Consequences

### Positive

- Backend deployment is simple and connected to GitHub.
- The backend can be configured with environment variables.
- The health endpoint can be used for monitoring and keep-alive checks.
- Alembic migrations can be executed during deployment through the build command.

### Negative

- The free tier can introduce cold starts if the service becomes inactive.
- The project depends on an external hosting provider.
- Render is used for application hosting only, while persistent data storage is handled separately by Supabase.
