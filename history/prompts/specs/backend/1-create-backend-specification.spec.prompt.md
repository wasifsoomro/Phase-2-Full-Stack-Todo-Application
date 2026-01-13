---
id: 1
title: create-backend-specification
stage: spec
date_iso: 2026-01-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: backend
branch: 1-backend
user: user
command: /sp.specify
labels:
  - backend
  - specification
  - fastapi
  - authentication
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/backend/full-backend-spec.md
tests_yaml:
  - specs/backend/checklists/requirements.md
---

# Create Backend Specification

## Original Prompt

```
/sp.specify
Create a detailed, comprehensive backend specification for Phase 2 of the Todo Full-Stack Web Application.

Focus EXCLUSIVELY on backend (FastAPI, SQLModel, Neon PostgreSQL, JWT auth integration). Reference frontend details only where necessary for auth bridge (e.g., JWT from Better Auth in frontend verified in backend).

Project Context:
- Monorepo: hackathon-todo
- Backend folder: backend/
- Stack: Python FastAPI, SQLModel (ORM), Neon Serverless PostgreSQL
- Auth: Better Auth JWT bridge — frontend issues token, backend verifies with BETTER_AUTH_SECRET env var
- Database: DATABASE_URL env var for Neon connection
- Must enforce: user isolation (user_id from token == {user_id} in path), 401 no token, 403 mismatch
- Frontend integration: API client in frontend/lib/api.ts sends Bearer token; backend filters data accordingly

Mandatory Backend Requirements (NEVER compromise):
1. Database Setup & Schema:
   - Use SQLModel for models
   - Users table (managed by Better Auth): id (str PK), email (unique), name, created_at
   - Tasks table: id (int PK), user_id (str FK to users.id), title (str NOT NULL, 1-200 chars), description (text NULL, max 1000), completed (bool default false), created_at/updated_at (timestamp)
   - Indexes: tasks.user_id, tasks.completed
   - Connection: db.py with get_db dependency (SessionLocal)

2. API Endpoints (all under /api/ — full CRUD for tasks):
   - GET /api/{user_id}/tasks: List tasks (query params: status="all/pending/completed", sort="created/title/due_date") — response: array of Task objects
   - POST /api/{user_id}/tasks: Create task (body: title req, desc opt) — response: created Task
   - GET /api/{user_id}/tasks/{id}: Task details — response: Task object
   - PUT /api/{user_id}/tasks/{id}: Update task (body: updated fields) — response: updated Task
   - DELETE /api/{user_id}/tasks/{id}: Delete task — response: 204 No Content
   - PATCH /api/{user_id}/tasks/{id}/complete: Toggle complete — response: updated Task
   - Use Pydantic models for request/response (e.g., TaskCreate, TaskUpdate)
   - Raise HTTPException for errors (401, 403, 404, 422)

3. Authentication & Security:
   - JWT verification dependency: get_current_user (use jose/PyJWT, decode token with BETTER_AUTH_SECRET)
   - Extract user_id from token payload (e.g., "sub")
   - Middleware/dependency: enforce token required, verify signature, match user_id with path
   - Stateless auth — no shared DB session with frontend
   - Filter ALL queries by authenticated user_id (e.g., select().where(Task.user_id == current_user))
   - Token expiry: assume 7 days, but handle expired tokens as 401

4. File Structure:
   - main.py: FastAPI app, include routers
   - models.py: SQLModel classes (Task, Base)
   - routes/tasks.py: API handlers with dependencies
   - dependencies.py: auth functions (oauth2_scheme, get_current_user)
   - db.py: engine, sessionmaker, get_db

5. Best Practices:
   - Type hints everywhere
   - Async if needed, but sync OK for simplicity
   - Consistent error responses: {"detail": "message"}
   - Logging: basic print or loguru for errors
   - Run command: uvicorn main:app --reload --port 8000

Output Format (strict):
- User Stories (backend-focused)
- Acceptance Criteria (detailed, testable for security/isolation)
- Endpoint Specifications (method, path, request/response models, errors)
- Database & Model Specifications (tables, fields, indexes)
- Auth Flow & Integration (how frontend JWT is handled)
- File Structure & Code Patterns
- Required Dependencies to Install (fastapi, sqlmodel, pydantic, jose, uvicorn, etc.)
- Final Acceptance Checklist

Make this specification complete, secure, and aligned with Phase 2 goals for a multi-user todo app with persistent storage.

Save this as @specs/backend/full-backend-spec.md
```

## Response Summary

Created a comprehensive backend specification for the Todo Full-Stack Web Application Phase 2. The specification includes:

- Detailed user stories focused on backend functionality
- Comprehensive acceptance criteria for security and isolation
- Complete endpoint specifications with methods, parameters, and responses
- Database schema definitions for Users and Tasks tables
- Authentication flow and JWT integration details
- File structure and code patterns recommendations
- Required dependencies for implementation
- Final acceptance checklist for implementation verification

The specification addresses all mandatory requirements including FastAPI, SQLModel, Neon PostgreSQL, JWT authentication with Better Auth integration, user isolation enforcement, and proper database schema design. All API endpoints for full CRUD operations are defined with proper authentication and authorization requirements.