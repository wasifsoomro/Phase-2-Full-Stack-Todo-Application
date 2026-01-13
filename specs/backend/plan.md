# Implementation Plan: Backend for Todo Full-Stack Web Application Phase 2

**Feature**: Backend for Todo App with FastAPI, SQLModel, JWT Auth
**Spec**: @specs/backend/full-backend-spec.md
**Branch**: 1-backend
**Created**: 2026-01-09
**Status**: Ready for Implementation

## Technical Context

This plan outlines the implementation of a secure, multi-user todo backend using FastAPI, SQLModel, and JWT authentication. The backend will connect to Neon PostgreSQL and implement strict user isolation to ensure data privacy.

**Technologies**:
- Python 3.9+
- FastAPI (web framework)
- SQLModel (ORM)
- Neon PostgreSQL (database)
- python-jose (JWT handling)
- Pydantic (validation)

**Architecture**:
- Monorepo structure with backend/ directory
- Stateful authentication using JWT tokens
- User isolation through user_id validation
- RESTful API design with proper error handling

## Constitution Check

✅ **Security First**: Plan includes JWT authentication and user isolation enforcement
✅ **Minimal Viable Change**: Focused on backend functionality only
✅ **Testable Requirements**: Each component can be tested individually
✅ **Clear Boundaries**: Well-defined API contracts and data models
✅ **Error Handling**: Comprehensive error response patterns included

## Phase 0: Research & Resolution of Unknowns

### research.md

**Decision**: Database connection pooling strategy
**Rationale**: Using SQLModel's recommended approach with context managers for session handling
**Alternatives considered**: Raw SQLAlchemy, manual connection management

**Decision**: JWT token validation approach
**Rationale**: Using python-jose with BETTER_AUTH_SECRET environment variable as specified
**Alternatives considered**: Custom validation, other JWT libraries

**Decision**: Error response format
**Rationale**: Consistent {"detail": "message"} format as specified in requirements
**Alternatives considered**: Different error response structures

## Phase 1: Data Model & API Design

### data-model.md

**Task Entity**:
- id: int (Primary Key, Auto-increment)
- user_id: str (Foreign Key to users.id, required)
- title: str (1-200 characters, required)
- description: str (max 1000 characters, optional)
- completed: bool (default: false)
- created_at: datetime (default: now)
- updated_at: datetime (default: now, auto-update)

**User Entity** (managed by Better Auth):
- id: str (Primary Key)
- email: str (Unique)
- name: str (Optional)
- created_at: datetime

### API Contracts

**GET /api/{user_id}/tasks**
- Method: GET
- Auth: Required (JWT)
- Query: status (all/pending/completed), sort (created/title/due_date)
- Response: 200 [Task]
- Errors: 401, 403, 422

**POST /api/{user_id}/tasks**
- Method: POST
- Auth: Required (JWT)
- Body: TaskCreate (title req, desc opt)
- Response: 201 Task
- Errors: 401, 403, 422

**GET /api/{user_id}/tasks/{id}**
- Method: GET
- Auth: Required (JWT)
- Response: 200 Task
- Errors: 401, 403, 404

**PUT /api/{user_id}/tasks/{id}**
- Method: PUT
- Auth: Required (JWT)
- Body: TaskUpdate
- Response: 200 Task
- Errors: 401, 403, 404, 422

**DELETE /api/{user_id}/tasks/{id}**
- Method: DELETE
- Auth: Required (JWT)
- Response: 204 No Content
- Errors: 401, 403, 404

**PATCH /api/{user_id}/tasks/{id}/complete**
- Method: PATCH
- Auth: Required (JWT)
- Response: 200 Task
- Errors: 401, 403, 404

## Phase 2: Implementation Plan

### 1. High-Level Overview

The backend implementation will follow a layered architecture with database models, authentication dependencies, and API routes. We'll implement JWT verification, user isolation, and full CRUD operations for tasks with proper error handling.

### 2. Numbered Phases

#### Phase 1: Database Setup & Models
- Create db.py with database engine and SessionLocal
- Create models.py with Task model and Pydantic schemas
- Set up database connection using DATABASE_URL environment variable
- Add proper indexes for performance (user_id, completed)
- Dependencies: None

#### Phase 2: Auth Dependency & JWT Verification
- Create dependencies.py with JWT token verification
- Implement get_current_user function to extract user_id from token
- Create OAuth2PasswordBearer scheme for token extraction
- Verify tokens using BETTER_AUTH_SECRET environment variable
- Dependencies: models.py (for user_id extraction)

#### Phase 3: API Routes & CRUD Operations
- Create routes/tasks.py with all required endpoints
- Implement GET /api/{user_id}/tasks with filtering and sorting
- Implement POST /api/{user_id}/tasks for task creation
- Implement GET/PUT/DELETE /api/{user_id}/tasks/{id}
- Implement PATCH /api/{user_id}/tasks/{id}/complete
- Dependencies: db.py, models.py, dependencies.py

#### Phase 4: Main App & Error Handling
- Create main.py with FastAPI app and router inclusion
- Add proper error handling with HTTPException
- Set up database session dependency
- Add startup/shutdown events for database connection
- Dependencies: All other modules

### 3. Atomic Task List

1. [backend] Create backend/db.py with database engine and SessionLocal setup
2. [backend] Create backend/models.py with Task SQLModel and Pydantic schemas
3. [backend] Create backend/dependencies.py with JWT verification functions
4. [backend] Create backend/routes/tasks.py with basic route structure
5. [backend] Implement GET /api/{user_id}/tasks endpoint with filtering and sorting
6. [backend] Implement POST /api/{user_id}/tasks endpoint for task creation
7. [backend] Implement GET /api/{user_id}/tasks/{id} endpoint for task details
8. [backend] Implement PUT /api/{user_id}/tasks/{id} endpoint for task updates
9. [backend] Implement DELETE /api/{user_id}/tasks/{id} endpoint for task deletion
10. [backend] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint for toggling completion
11. [backend] Create backend/main.py with FastAPI app and include routes
12. [backend] Add database session dependency and startup/shutdown events
13. [backend] Add proper error handling with HTTPException for all endpoints
14. [backend] Add requirements.txt with all necessary dependencies
15. [backend] Create README.md with setup and run instructions

### 4. Next Steps Recommendation

Start with task #1: Create backend/db.py with database engine and SessionLocal setup. This foundational component is required by all other parts of the application.

## Implementation Gates

✅ **Architecture Alignment**: Plan aligns with layered architecture requirements
✅ **Security Compliance**: JWT verification and user isolation are core to the plan
✅ **Dependency Order**: Proper sequence ensures each component builds on the previous
✅ **Error Handling**: Comprehensive error handling planned for all endpoints
✅ **Data Validation**: Pydantic models will ensure proper data validation