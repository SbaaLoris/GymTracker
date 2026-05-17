# ADR 0006: Use React, Vite, and TypeScript for the Frontend

## Status

Accepted

## Context

Mova requires a modern frontend for browsing exercises, managing workout plans, logging sessions, tracking body metrics, and interacting with the backend API.

The team wanted the frontend to be close to current industry practice and to use technologies that are widely used in modern web development.

## Decision

We decided to build the frontend with React, Vite, and TypeScript.

## Reasons

React, Vite, and TypeScript were selected because they provide:

- A modern and widely used frontend stack
- Component-based UI development
- Fast local development with Vite (Hot Module Replacement)
- Static typing through TypeScript, which catches errors early
- Better maintainability for a growing frontend codebase
- A setup that is close to current industry standards and best practices

## Alternatives Considered

Possible alternatives would have included:

- Plain HTML, CSS, and JavaScript
- Next.js
- Vue
- Angular

These alternatives were not selected because React with Vite and TypeScript provided a good balance between modern development practices, simplicity, and flexibility for the project scope.

## Consequences

### Positive

- The frontend is structured around reusable components.
- TypeScript improves code reliability and developer feedback.
- Vite provides fast development and build performance.
- The stack is compatible with Vercel deployment.
- The team gained experience with a modern frontend workflow.

### Negative

- The setup is more complex than plain HTML, CSS, and JavaScript.
- TypeScript requires additional learning and stricter code discipline.
- Frontend state, API calls, routing, and validation require clear structure to remain maintainable.
