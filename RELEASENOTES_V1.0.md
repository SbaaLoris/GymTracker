# GymTracker Release Notes

**Version:** 1.0  
**Author:** Nico Köchli  

## Overview
GymTracker Version 1.0 represents the first major milestone for the project, successfully uniting our frontend and backend services into a working local environment. This release focuses on the core Body Metrics feature (UC-4) and establishes a clean repository foundation for the team.

## Environment & Architecture
**Local Development Setup:**
- Docker (installed locally)
- Budibase (installed locally)
- Node.js (installed locally)
- Standard/default installation setup

**Python Environment (Backend):**
- `fastapi`
- `uvicorn`
- `sqlalchemy`
- `pydantic`

## Milestone Highlights
- **First Push:** Successfully established and connected the frontend and backend services.
- **Dashboard Completion:** The primary dashboard page has been successfully created.
- **UC-4 Completed:** Full core functionality for tracking body metrics.
- **Full CRUD Support:** `GET`, `POST`, `PUT`, and `DELETE` endpoints for body metrics are fully operational.
- **Data Visualization:** Body weight progress is now graphically displayed on the dashboard.
- **UI Interaction:** Users can seamlessly update and delete body metric entries directly through the Budibase frontend.

## Repository Cleanup
The repository has been sanitized to ensure a clean collaboration space for all developers:
- Removed macOS system artifacts (`.DS_Store`).
- Removed compiled Python cache directories (`__pycache__`).
- Removed redundant `.gitkeep` placeholder files.
- Added a comprehensive `.gitignore` configured for our specific stack.

## Deployment Strategy
Currently, the application is optimized for **local development**. The architecture and clean repository setup are designed with future cloud deployment in mind, with an intended transition to **Render**.
