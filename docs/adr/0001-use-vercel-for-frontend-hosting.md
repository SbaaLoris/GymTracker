# ADR 0001: Use Vercel for Frontend Hosting

## Status

Accepted

## Context

Mova requires a reliable and simple hosting solution for the React/Vite frontend. The frontend should be easy to deploy, integrate well with GitHub, and support automatic deployments after code changes.

The project is developed as part of a university module, so the hosting solution also needed to be cost-efficient and simple enough for the team to manage without unnecessary infrastructure complexity.

## Decision

We decided to deploy the frontend on Vercel.

## Reasons

Vercel was selected because it provides:

- Simple deployment for frontend applications
- Native support for React and Vite projects
- Seamless GitHub integration
- Automatic deployments after pushes to the repository
- Fast setup with minimal configuration
- A free tier that is sufficient for the project use case

## Alternatives Considered

No major alternatives were evaluated in detail because Vercel already met the project requirements and was quick to set up.

Possible alternatives would have included:

- Netlify
- Render Static Sites
- GitHub Pages
- Railway

## Consequences

### Positive

- Frontend deployment is simple and automated.
- The team can deploy changes through GitHub without manual server configuration.
- The free tier is sufficient for the expected project usage.
- The frontend can be hosted independently from the backend.

### Negative

- Environment variables such as `VITE_API_URL` are baked into the frontend build and require a redeployment when changed.
- The project depends on an external hosting provider.
