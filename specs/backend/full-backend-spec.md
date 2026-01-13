# Backend Specification: Todo Full-Stack Web Application Phase 2

**Feature Branch**: `1-backend`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Create a detailed, comprehensive backend specification for Phase 2 of the Todo Full-Stack Web Application. Focus EXCLUSIVELY on backend (FastAPI, SQLModel, Neon PostgreSQL, JWT auth integration). Reference frontend details only where necessary for auth bridge (e.g., JWT from Better Auth in frontend verified in backend)."

## User Stories (Backend-focused)

### User Story 1 - Secure Task Management (Priority: P1)

As a registered user, I want to securely create, read, update, and delete my personal tasks so that I can manage my daily activities while ensuring my data remains private and isolated from other users.

**Why this priority**: This is the core functionality of the todo app and represents the primary value proposition. Without secure task CRUD operations, the application has no value.

**Independent Test**: Can be fully tested by creating tasks under one user account, verifying they appear only for that user, and ensuring other users cannot access them. Delivers the fundamental value of a secure multi-user todo system.

**Acceptance Scenarios**:

1. **Given** I am authenticated with a valid JWT token, **When** I create a new task, **Then** the task is saved with my user_id and only accessible to me
2. **Given** I have existing tasks, **When** I request my task list, **Then** I only see tasks that belong to my user_id
3. **Given** I have a task, **When** I update its status to completed, **Then** the change is persisted and reflected in my task list
4. **Given** I have a task, **When** I delete it, **Then** it's removed from my task list and no longer accessible

---

### User Story 2 - JWT Authentication Integration (Priority: P1)

As a user of the todo app, I want the backend to verify JWT tokens issued by the frontend authentication system so that I can access my tasks securely without re-authenticating.

**Why this priority**: Security is paramount for user data isolation. Without proper JWT verification, users could access other users' data or perform unauthorized operations.

**Independent Test**: Can be tested by sending requests with valid JWT tokens and verifying access, and sending requests with invalid/expired tokens and receiving 401 errors. Delivers the security foundation for the entire system.

**Acceptance Scenarios**:

1. **Given** I have a valid JWT token from the frontend auth system, **When** I make a request to the backend, **Then** I am authenticated and can access my resources
2. **Given** I have an expired JWT token, **When** I make a request to the backend, **Then** I receive a 401 Unauthorized response
3. **Given** I have no JWT token, **When** I make a request to a protected endpoint, **Then** I receive a 401 Unauthorized response
4. **Given** I have a JWT token with a different user_id than the requested resource, **When** I try to access that resource, **Then** I receive a 403 Forbidden response

---

### User Story 3 - Task Filtering and Sorting (Priority: P2)

As a user with many tasks, I want to filter and sort my tasks by status and creation date so that I can efficiently manage and find specific tasks.

**Why this priority**: This enhances user experience by making it easier to manage large numbers of tasks, improving the overall usability of the system.

**Independent Test**: Can be tested by creating multiple tasks with different statuses and creation dates, then requesting filtered/sorted lists. Delivers improved usability for users with many tasks.

**Acceptance Scenarios**:

1. **Given** I have tasks with mixed completion status, **When** I request tasks with status="completed", **Then** only completed tasks are returned
2. **Given** I have tasks with mixed completion status, **When** I request tasks with status="pending", **Then** only pending tasks are returned
3. **Given** I have multiple tasks, **When** I request tasks sorted by "created", **Then** tasks are returned in chronological order
4. **Given** I have multiple tasks, **When** I request tasks sorted by "title", **Then** tasks are returned alphabetically by title

---

### User Story 4 - Database Persistence (Priority: P1)

As a user of the todo app, I want my tasks to be persistently stored in a database so that my data remains available across sessions and device changes.

**Why this priority**: Without persistent storage, the application would be useless as tasks would disappear when the session ends. This is fundamental to the value proposition.

**Independent Test**: Can be tested by creating tasks, ending the session, starting a new session, and verifying that tasks still exist. Delivers the core persistence requirement.

**Acceptance Scenarios**:

1. **Given** I create a task, **When** I close the application and return later, **Then** my task still exists
2. **Given** I have multiple tasks, **When** I update one of them, **Then** the change is persisted to the database
3. **Given** I have a task, **When** I delete it, **Then** it's permanently removed from the database

---

### Edge Cases

- What happens when a user tries to access tasks with an invalid user_id format in the path?
- How does the system handle requests with malformed JWT tokens?
- What happens when database connection fails during an operation?
- How does the system handle requests for non-existent task IDs?
- What happens when a user tries to create a task with a title that exceeds character limits?
- How does the system handle concurrent requests from the same user?
- What happens when the database is temporarily unavailable?

## Acceptance Criteria (detailed, testable for security/isolation)

### Authentication & Authorization
- **AC-001**: Requests without JWT tokens return 401 Unauthorized
- **AC-002**: Requests with invalid/expired JWT tokens return 401 Unauthorized
- **AC-003**: Requests where token user_id != path user_id return 403 Forbidden
- **AC-004**: Valid requests with matching user_ids proceed to business logic
- **AC-005**: All database queries are filtered by authenticated user_id

### Task Operations
- **AC-006**: Task creation requires valid title (1-200 chars), optional description (max 1000 chars)
- **AC-007**: Task retrieval returns only tasks belonging to authenticated user
- **AC-008**: Task updates are only allowed for tasks belonging to authenticated user
- **AC-009**: Task deletion is only allowed for tasks belonging to authenticated user
- **AC-010**: Task completion toggle is only allowed for tasks belonging to authenticated user

### Data Validation
- **AC-011**: Task titles must be 1-200 characters, reject with 422 if outside range
- **AC-012**: Task descriptions must be max 1000 characters, reject with 422 if exceeded
- **AC-013**: Invalid task IDs in requests return 404 Not Found
- **AC-014**: Invalid user_id formats return 404 Not Found

### Performance & Reliability
- **AC-015**: All operations complete within 500ms under normal load
- **AC-016**: Database operations maintain ACID properties
- **AC-017**: Proper database indexing ensures query performance

## Endpoint Specifications

### GET /api/{user_id}/tasks
- **Method**: GET
- **Path Parameters**: user_id (str) - authenticated user ID
- **Query Parameters**:
  - status (optional): "all", "pending", "completed" (default: "all")
  - sort (optional): "created", "title", "due_date" (default: "created")
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 200 OK with array of Task objects
- **Errors**: 401, 403, 404, 422
- **Authentication Required**: Yes

### POST /api/{user_id}/tasks
- **Method**: POST
- **Path Parameters**: user_id (str) - authenticated user ID
- **Request Body**: TaskCreate model with title (required), description (optional)
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 201 Created with created Task object
- **Errors**: 401, 403, 422
- **Authentication Required**: Yes

### GET /api/{user_id}/tasks/{id}
- **Method**: GET
- **Path Parameters**: user_id (str), id (int) - task ID
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 200 OK with Task object
- **Errors**: 401, 403, 404
- **Authentication Required**: Yes

### PUT /api/{user_id}/tasks/{id}
- **Method**: PUT
- **Path Parameters**: user_id (str), id (int) - task ID
- **Request Body**: TaskUpdate model with any fields to update
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 200 OK with updated Task object
- **Errors**: 401, 403, 404, 422
- **Authentication Required**: Yes

### DELETE /api/{user_id}/tasks/{id}
- **Method**: DELETE
- **Path Parameters**: user_id (str), id (int) - task ID
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 204 No Content
- **Errors**: 401, 403, 404
- **Authentication Required**: Yes

### PATCH /api/{user_id}/tasks/{id}/complete
- **Method**: PATCH
- **Path Parameters**: user_id (str), id (int) - task ID
- **Request Headers**: Authorization: Bearer {token}
- **Response**: 200 OK with updated Task object (toggled completion status)
- **Errors**: 401, 403, 404
- **Authentication Required**: Yes

## Database & Model Specifications

### Users Table (managed by Better Auth)
- **id**: str (Primary Key) - user identifier from authentication system
- **email**: str (Unique) - user's email address
- **name**: str (Nullable) - user's display name
- **created_at**: timestamp - account creation time

### Tasks Table
- **id**: int (Primary Key, Auto-increment) - unique task identifier
- **user_id**: str (Foreign Key to users.id) - owner of the task
- **title**: str (NOT NULL, 1-200 characters) - task title
- **description**: text (Nullable, max 1000 characters) - task description
- **completed**: bool (Default: false) - completion status
- **created_at**: timestamp (Default: now) - creation time
- **updated_at**: timestamp (Default: now, auto-update) - last modification time

### Database Indexes
- **tasks.user_id**: Index on user_id for efficient filtering by owner
- **tasks.completed**: Index on completed status for efficient status queries
- **tasks.created_at**: Index on creation time for efficient sorting

## Auth Flow & Integration

### JWT Token Handling
- **Token Source**: Frontend authentication system (Better Auth) issues JWT tokens
- **Token Verification**: Backend verifies tokens using BETTER_AUTH_SECRET environment variable
- **User ID Extraction**: Extract user_id from token payload (typically "sub" field)
- **Token Expiry**: Handle expired tokens by returning 401 Unauthorized
- **Stateless Authentication**: No shared database sessions with frontend

### Authorization Flow
1. Request arrives with Authorization: Bearer {token} header
2. JWT token is decoded and verified using BETTER_AUTH_SECRET
3. User ID is extracted from token payload
4. Path parameter {user_id} is compared with token user_id
5. If matching, request proceeds with authenticated context
6. If not matching, return 403 Forbidden
7. If invalid token, return 401 Unauthorized

### User Isolation Enforcement
- All database queries must filter by authenticated user_id
- Example: `select().where(Task.user_id == current_user.id)`
- Prevents users from accessing other users' data
- Enforced at the application layer for all operations

## File Structure & Code Patterns

### Backend Directory Structure
```
backend/
├── main.py              # FastAPI app, include routers
├── models.py            # SQLModel classes (Task, Base)
├── routes/
│   └── tasks.py         # API handlers with dependencies
├── dependencies.py      # Auth functions (oauth2_scheme, get_current_user)
├── db.py                # Engine, sessionmaker, get_db
└── requirements.txt     # Python dependencies
```

### Code Patterns
- **Type Hints**: All functions must use type hints
- **Pydantic Models**: Use for request/response validation (TaskCreate, TaskUpdate, etc.)
- **Dependency Injection**: Use FastAPI dependencies for auth and database connections
- **Error Handling**: Use HTTPException for error responses with consistent format
- **Async Support**: Use async/await where appropriate, but sync is acceptable for simplicity

## Required Dependencies to Install

### Core Dependencies
- fastapi: Web framework for API development
- sqlmodel: ORM for database operations
- pydantic: Data validation and settings management
- python-jose[cryptography]: JWT token handling
- uvicorn: ASGI server for running the application
- psycopg2-binary: PostgreSQL database adapter
- python-multipart: For handling form data
- typing-extensions: For type hinting support

### Development Dependencies
- pytest: Testing framework
- httpx: For making HTTP requests in tests
- pytest-asyncio: Async testing support
- black: Code formatting
- isort: Import sorting
- mypy: Static type checking

## Final Acceptance Checklist

### Implementation Requirements
- [ ] All API endpoints implemented with proper authentication
- [ ] Database models created with SQLModel
- [ ] JWT authentication dependency implemented
- [ ] User isolation enforced in all operations
- [ ] Input validation implemented with Pydantic models
- [ ] Proper error handling with HTTPException
- [ ] Database connection and session management implemented
- [ ] Indexes created for performance optimization

### Security Requirements
- [ ] All endpoints require authentication
- [ ] User isolation verified for all operations
- [ ] JWT tokens properly verified
- [ ] Expired tokens handled correctly
- [ ] No SQL injection vulnerabilities
- [ ] Proper input sanitization

### Performance Requirements
- [ ] Database queries properly indexed
- [ ] Efficient filtering by user_id
- [ ] Task list pagination implemented if needed
- [ ] Response times under 500ms for normal operations

### Testing Requirements
- [ ] Unit tests for all endpoints
- [ ] Integration tests for authentication flow
- [ ] Security tests for user isolation
- [ ] Error handling tests
- [ ] Database operation tests

### Documentation Requirements
- [ ] API documentation generated via FastAPI/Swagger
- [ ] Code comments for complex logic
- [ ] README with setup instructions
- [ ] Environment variable documentation