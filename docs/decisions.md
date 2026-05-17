# Architecture Decisions (ADRs)

This index page lists all the Architecture Decision Records (ADRs) established for the **Mova Gym Tracker** project, following industry-standard practices.

## Decisions Index

| ID | Title | Status | Category | Description |
|---|---|---|---|---|
| **0001** | [Use Vercel for Frontend Hosting](adr/0001-use-vercel-for-frontend-hosting.md) | Accepted | Infrastructure | Simple, cost-efficient, React/Vite-native static hosting. |
| **0002** | [Use Render for Backend Hosting](adr/0002-use-render-for-backend-hosting.md) | Accepted | Infrastructure | FastAPI Python backend hosting with custom environment, logs, and cron keep-alive. |
| **0003** | [Use Supabase PostgreSQL for Database](adr/0003-use-supabase-postgresql-for-database.md) | Accepted | Infrastructure | External, highly persistent managed SQL database to separate data from ephemeral runtimes. |
| **0004** | [Separate Frontend, Backend, and Database](adr/0004-separate-frontend-backend-and-database.md) | Accepted | Architecture | Three-tier client-server structure with centralized business logic in the backend. |
| **0005** | [Use FastAPI for the Backend](adr/0005-use-fastapi-for-backend.md) | Accepted | Tech Stack | Modern, fast Python framework with built-in validation (Pydantic) and automatic OpenAPI. |
| **0006** | [Use React, Vite, and TypeScript for the Frontend](adr/0006-use-react-vite-and-typescript-for-frontend.md) | Accepted | Tech Stack | Modern standard single-page app stack with component-based design and type safety. |
| **0007** | [Use SQLAlchemy and Alembic](adr/0007-use-sqlalchemy-and-alembic.md) | Accepted | Tech Stack | ORM database mapping and versioned migration schema controls. |
| **0008** | [Use HTTP Basic Authentication](adr/0008-use-http-basic-authentication.md) | Accepted | Security | Simple, sufficient protocol meeting university guidelines with secure password hashing. |
| **0009** | [Use shadcn/ui and Tailwind CSS](adr/0009-use-shadcn-ui-and-tailwind-css.md) | Accepted | Tech Stack | Utility-first styling combined with prebuilt responsive components for professional UX. |
| **0010** | [Use Admin and User Roles](adr/0010-use-admin-and-user-roles.md) | Accepted | Features | Role-based access control with two separate, comprehensive user flows. |
| **0011** | [Use Exercise Requests Instead of Direct Creation](adr/0011-use-exercise-requests-instead-of-direct-creation.md) | Accepted | Features | Controls global catalog data quality via regular user suggestion and admin review pipeline. |
| **0012** | [Use Soft Delete for Exercises](adr/0012-use-soft-delete-for-exercises.md) | Accepted | Features | Safe exercises deletion preserving users' session history by using an `is_active` flag. |
| **0013** | [Provide CSV and PDF Export](adr/0013-provide-csv-and-pdf-export.md) | Accepted | Features | Gives users full ownership of data and enables structured analysis and AI contextualization. |
| **0014** | [Use Seed Data for Local Development](adr/0014-use-seed-data-for-local-development.md) | Accepted | Features | Speeds up onboarding and review via automatic demo accounts, metrics, and template seeding. |
| **0015** | [Add a Health Endpoint](adr/0015-add-health-endpoint.md) | Accepted | Architecture | Harmless public ping endpoint for Render readiness checks and keep-alive cron calls. |

---

## Category Overview

Our decisions fall into four main categories:

### 1. Infrastructure
We rely entirely on modern, cloud-native **Serverless & PaaS** providers (Vercel, Render, Supabase) using their free tiers. This allows us to support fully persistent, production-grade applications without maintaining physical infrastructure or incurring operational costs.

### 2. Architecture & Design
Mova implements a strictly separated **three-tier architecture**. By keeping the Database behind a custom Backend REST API layer, we protect private user records, restrict direct database interactions, and enforce consistent backend-controlled domain operations.

### 3. Technology Stack
We picked a standard, type-safe development environment. On the backend, we use **Python with FastAPI, SQLAlchemy, and Alembic** to enforce structured data mapping. On the frontend, we use **React 19, TypeScript, and Vite** styled using **Tailwind CSS 4 and shadcn/ui** for an elite user experience.

### 4. Features & Controls
Features are designed to support data integrity and developer quality of life. The system supports **role-based flows**, an **exercise review pipeline** to protect shared catalog quality, **soft deletes** to preserve workout session history, **CSV/PDF data exports**, and **optional seeding** to enable immediate local verification.
