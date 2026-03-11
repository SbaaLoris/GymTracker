# Gym Tracker Project

This is our project repository for the Internet Technology module. 

## Analysis

### Scenario
The Gym Tracker is a comprehensive web application designed to help fitness enthusiasts log their workouts, track their body metrics, and follow structured training plans. To maintain data consistency, only an Administrator can manage the master list of available exercises. Users can utilize Admin-created templates, save their own custom workout plans, log daily sessions (manual weightlifting and cardio entries), track progress, and export their historical data. 

### User Stories
**Admin User Stories:**
1. As an Admin, I want to have a responsive Web app so I can comfortably manage the platform on mobile devices while walking the gym floor, or on a desktop computer.
2. As an Admin, I want to see a consistent visual appearance to navigate the backend easily without confusion.
3. As an Admin, I want to use list views to explore the master database of exercises, review user-submitted exercise requests, and manage standardized workout templates (e.g., "Beginner Leg Day").
4. As an Admin, I want to use edit and create views to add new exercises (specifying targeted muscle groups), approve/deny user requests, and maintain the platform's business data.
5. As an Admin, I want to log-in securely so that I can authenticate myself and ensure only authorized staff can alter the master exercise database.

**User User Stories:**
1. As a User, I want to use list views on public pages to browse available workout templates and the master exercise list before I commit to a workout.
2. As a User, I want to authenticate myself so that I can access my private dashboard, log my personal workout sessions, and track my confidential body metrics.
3. **(Progress & Export)** As a User, I want to track my progress over time and export my logged data (workouts and body metrics) into a PDF or CSV file for personal record-keeping or sharing with a coach.
4. **(Save Plans)** As a User, I want to save my own customized workout routines based on the master exercise list, so I don't have to rebuild my workout from scratch every time.
5. **(Suggest Exercises)** As a User, I want to be able to request a new exercise to be added to the platform, so that I can track specific movements not currently in the master list.

### Use Case
- **UC-1 [Manage Master Exercises]:** Admin can create, read, update, and soft-delete exercises from the master database. 
- **UC-2 [Manage Plans & Templates]:** Admin can bundle exercises into reusable workout templates. Users can also save custom workout routines to their personal profiles.
- **UC-3 [Log Workout]:** User can select a template or build a session from the master exercise list, manually logging weightlifting (reps/weight) or cardio (duration/distance).
- **UC-4 [Track & Export Progress]:** User can view historical data of their logged workouts and body metrics, and export this data as CSV/PDF.
- **UC-5 [Request Exercises]:** User can submit a request for a new exercise, which the Admin can review and approve.

## Design

### Domain Design
Our domain model consists of the following primary entities to fulfill the requirements:
1. **User:** (ID, Username, Password, Role)
2. **Exercise:** (ID, Name, MuscleGroup, IsCardio, IsActive) - *Strictly managed by Admin*
3. **WorkoutPlan:** (ID, Name, CreatorID) - *Can be an Admin template or a User's saved routine*
4. **WorkoutSession:** (ID, Date, UserID) 
5. **WorkoutSet:** (ID, SessionID, ExerciseID, Reps, Weight, Duration)
6. **BodyMetric:** (ID, UserID, Date, BodyWeight)
7. **ExerciseRequest:** (ID, UserID, SuggestedName, Status)



### Business Logic 
We are implementing the following strict business rules in our backend:
- **Rule 1 (Exercise Authority & Integrity):** Users cannot create custom exercises on the fly; they must select from the Admin's master list. If an Admin "deletes" an exercise, it is only soft-deleted (marked as inactive). It becomes unavailable for future workouts but remains visible in users' past logs so historical data is preserved.
- **Rule 2 (Anti-Spam Security):** To prevent database spam, a standard User can only have a maximum of 5 "Pending" exercise requests in the system at any given time.
- **Rule 3 (Data Validation):** A `WorkoutSession` cannot be saved unless it contains at least one completed `WorkoutSet`. 

## Implementation

### Backend Technology
> **Note on Technology Stack:** Following a discussion with and approval from our lecturer, our backend will be implemented using Python (e.g., FastAPI/Flask) rather than the default Spring Boot/Java stack. 

This Web application relies on:
- Python (FastAPI/Flask) for the backend service layer.
- SQLite or PostgreSQL for the relational database management.
- OpenAPI 3.0 (Swagger) for API endpoint documentation.

### Frontend Technology
The front-end will be developed using a low-code approach via Budibase to ensure a responsive layout across desktop and mobile devices.

## Project Management

### Roles
*Note: As beginners, we are utilizing a highly collaborative, cross-functional approach where all team members share responsibilities across the stack.*
- **Loris:** Cross-Functional / Full-Stack Developer
- **Patrick:** Cross-Functional / Full-Stack Developer
- **Nico:** Cross-Functional / Full-Stack Developer

### Milestones
1. **Analysis:** Scenario ideation, use case analysis and user story writing. *(Completed)*
2. **Domain Design:** Definition of domain model.
3. **Frontend implementation:** Design, prototyping and realization of frontend functionality.
4. **Business Logic and API design:** Definition of business logic and API.
5. **Data and API implementation:** Implementation of data access and business logic layers and API.
6. **Security:** Implementation of API-level security (Basic Auth).
7. **Demonstrator:** Integration of frontend and backend to realize an end-to-end application.
