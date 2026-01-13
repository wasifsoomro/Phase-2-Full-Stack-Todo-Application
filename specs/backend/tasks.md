# Implementation Tasks: Backend for Todo Full-Stack Web Application Phase 2

**Feature**: Backend for Todo App with FastAPI, SQLModel, JWT Auth
**Plan**: @specs/backend/plan.md
**Spec**: @specs/backend/full-backend-spec.md
**Branch**: 1-backend
**Created**: 2026-01-09
**Status**: Ready for Implementation

## Dependencies

- User Story 1 (Secure Task Management) must be completed before User Story 2 (JWT Authentication Integration)
- User Story 2 must be completed before User Story 3 (Task Filtering and Sorting)
- User Story 1/2/3 must be completed before User Story 4 (Database Persistence) can be fully tested

## Parallel Execution Examples

- **User Story 1**: Tasks T003 [P] [US1], T004 [P] [US1], T005 [P] [US1] can run in parallel after foundational setup
- **User Story 2**: Tasks T007 [P] [US2], T008 [P] [US2] can run in parallel after JWT setup
- **User Story 3**: Tasks T010 [P] [US3], T011 [P] [US3] can run in parallel after core endpoints exist

## Implementation Strategy

**MVP Scope**: Complete User Story 1 (Secure Task Management) with minimal JWT authentication. This will provide a functional CRUD system with basic security.

**Incremental Delivery**:
1. Phase 1-2: Foundation (database, models, auth)
2. Phase 3: Core task management (US1)
3. Phase 4: Enhanced authentication (US2)
4. Phase 5: Advanced features (US3)
5. Phase 6: Polish and documentation (US4)

## Phase 1: Setup

### Goal
Initialize project structure and install required dependencies for backend implementation.

- [x] T001 Create backend/ directory structure with required files
- [x] T002 Install core dependencies (fastapi, sqlmodel, python-jose, uvicorn)
- [x] T003 Create requirements.txt with all necessary packages
- [x] T004 Set up environment variables configuration (DATABASE_URL, BETTER_AUTH_SECRET)

## Phase 2: Foundational Components

### Goal
Implement foundational components that all user stories depend on.

- [x] T005 [P] Create backend/db.py with database engine and SessionLocal setup
- [x] T006 [P] Create backend/models.py with Task SQLModel and Pydantic schemas
- [x] T007 [P] Create backend/dependencies.py with JWT verification functions
- [x] T008 [P] Create backend/routes/tasks.py with basic route structure

## Phase 3: User Story 1 - Secure Task Management (Priority: P1)

### Goal
As a registered user, I want to securely create, read, update, and delete my personal tasks so that I can manage my daily activities while ensuring my data remains private and isolated from other users.

### Independent Test
Can be fully tested by creating tasks under one user account, verifying they appear only for that user, and ensuring other users cannot access them. Delivers the fundamental value of a secure multi-user todo system.

- [x] T009 [P] [US1] Implement GET /api/{user_id}/tasks endpoint with user isolation
- [x] T010 [P] [US1] Implement POST /api/{user_id}/tasks endpoint for task creation
- [x] T011 [P] [US1] Implement GET /api/{user_id}/tasks/{id} endpoint for task details
- [x] T012 [P] [US1] Implement PUT /api/{user_id}/tasks/{id} endpoint for task updates
- [x] T013 [US1] Implement DELETE /api/{user_id}/tasks/{id} endpoint for task deletion
- [x] T014 [US1] Add proper user isolation checks in all task operations
- [x] T015 [US1] Implement input validation for task creation (title length, description limits)

## Phase 4: User Story 2 - JWT Authentication Integration (Priority: P1)

### Goal
As a user of the todo app, I want the backend to verify JWT tokens issued by the frontend authentication system so that I can access my tasks securely without re-authenticating.

### Independent Test
Can be tested by sending requests with valid JWT tokens and verifying access, and sending requests with invalid/expired tokens and receiving 401 errors. Delivers the security foundation for the entire system.

- [x] T016 [P] [US2] Implement JWT token verification using BETTER_AUTH_SECRET
- [x] T017 [P] [US2] Add OAuth2PasswordBearer scheme for token extraction
- [x] T018 [US2] Implement get_current_user function to extract user_id from token
- [x] T019 [US2] Add 401 Unauthorized responses for invalid/expired tokens
- [x] T020 [US2] Add 403 Forbidden responses when token user_id doesn't match path user_id
- [x] T021 [US2] Integrate JWT verification with all existing task endpoints

## Phase 5: User Story 3 - Task Filtering and Sorting (Priority: P2)

### Goal
As a user with many tasks, I want to filter and sort my tasks by status and creation date so that I can efficiently manage and find specific tasks.

### Independent Test
Can be tested by creating multiple tasks with different statuses and creation dates, then requesting filtered/sorted lists. Delivers improved usability for users with many tasks.

- [x] T022 [P] [US3] Add status query parameter support to GET /api/{user_id}/tasks
- [x] T023 [P] [US3] Add sort query parameter support to GET /api/{user_id}/tasks
- [x] T024 [US3] Implement filtering logic for "all", "pending", "completed" status
- [x] T025 [US3] Implement sorting logic for "created", "title", "due_date"
- [x] T026 [US3] Add proper error handling for invalid query parameters

## Phase 6: User Story 4 - Database Persistence (Priority: P1)

### Goal
As a user of the todo app, I want my tasks to be persistently stored in a database so that my data remains available across sessions and device changes.

### Independent Test
Can be tested by creating tasks, ending the session, starting a new session, and verifying that tasks still exist. Delivers the core persistence requirement.

- [x] T027 [P] [US4] Add proper database indexing for user_id and completed fields
- [x] T028 [P] [US4] Implement database transaction handling for all operations
- [x] T029 [US4] Add database connection pooling and optimization
- [x] T030 [US4] Implement proper timestamp handling for created_at and updated_at fields
- [x] T031 [US4] Add database migration support if needed

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Complete the implementation with proper error handling, documentation, and operational readiness.

- [x] T032 Add consistent error responses in format {"detail": "message"} for all endpoints
- [x] T033 Add proper logging for all operations and error cases
- [x] T034 Create README.md with setup and run instructions
- [x] T035 Add API documentation via FastAPI/Swagger
- [x] T036 Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint for toggling completion
- [x] T037 Add database health checks and monitoring endpoints
- [x] T038 Configure production-ready settings for uvicorn