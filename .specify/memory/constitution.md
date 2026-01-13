<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.0.1
Modified principles: [PRINCIPLE_1_NAME] → Phase 2 Full-Stack Web Application
Added sections: Technology Stack, API Requirements, Security Requirements, Development Workflow
Removed sections: None
Templates requiring updates: ✅ Updated / ⚠ pending: .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# hackathon-todo Constitution

## Core Principles

### Phase 2 Full-Stack Web Application
Development of a multi-user full-stack web application with persistent storage and JWT-based authentication. Follow Agentic Dev Stack workflow strictly: Write/Update Spec → Generate Plan → Break into Tasks → Implement via Claude Code. No manual coding allowed. All development must reference specs with @specs/... and read relevant CLAUDE.md files before any action.

### Monorepo Structure
Maintain a clear monorepo structure with frontend/, backend/, specs/, .spec-kit/config.yaml, and docker-compose.yml directories. All components must be organized within this structure with clear separation of concerns between frontend and backend code.

### Technology Stack Compliance
Use the specified technology stack exactly: Frontend - Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui; Backend - FastAPI, SQLModel, Neon Serverless PostgreSQL; Auth - Better Auth with JWT (shared secret BETTER_AUTH_SECRET); Database - Use DATABASE_URL env var.

### Security-First Development
Enforce user isolation on EVERY operation: user_id from token MUST match {user_id} in path. Return 401 if no/invalid token, 403 if user mismatch. All endpoints require JWT: Authorization: Bearer <token>. Prioritize security over convenience in all implementation decisions.

### API Contract Adherence
Implement API endpoints exactly as specified: GET /api/{user_id}/tasks (list, query params: status, sort), POST /api/{user_id}/tasks (create: title required, description optional), GET /api/{user_id}/tasks/{id} (details), PUT /api/{user_id}/tasks/{id} (update), DELETE /api/{user_id}/tasks/{id} (delete), PATCH /api/{user_id}/tasks/{id}/complete (toggle). Any deviation must be explicitly approved.

### Type Safety and Validation
Use TypeScript and Pydantic models for strict type safety and validation throughout the application. All frontend components should use server components by default, with 'use client' only when needed. All backend endpoints should use Pydantic models for request/response validation with strict validation.

## Technology Stack Requirements

- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, SQLModel, Neon Serverless PostgreSQL
- Auth: Better Auth with JWT (shared secret BETTER_AUTH_SECRET)
- Database: Use DATABASE_URL env var
- Additional: Docker for containerization, docker-compose.yml for orchestration

## API Requirements

All API endpoints must follow the exact specifications:
- GET /api/{user_id}/tasks - List tasks with query params: status, sort
- POST /api/{user_id}/tasks - Create task (title required, description optional)
- GET /api/{user_id}/tasks/{id} - Get task details
- PUT /api/{user_id}/tasks/{id} - Update task
- DELETE /api/{user_id}/tasks/{id} - Delete task
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion

Database schema for tasks table:
- id: int PK
- user_id: str FK to users.id
- title: str NOT NULL
- description: text NULL
- completed: bool default false
- created_at, updated_at: timestamp

Users table managed by Better Auth: id (str PK), email, name, created_at

## Security Requirements

- User isolation enforcement: user_id from token must match {user_id} in path for all operations
- JWT authentication required for all endpoints
- Return 401 for no/invalid token, 403 for user mismatch
- Use BETTER_AUTH_SECRET for JWT verification
- All API calls must include Authorization: Bearer <token> header
- Frontend must handle authentication state properly

## Development Workflow

- Always use Spec-Kit Plus: Reference specs with @specs/... (e.g., @specs/features/task-crud.md)
- Read relevant CLAUDE.md files before any action: Root CLAUDE.md, frontend/CLAUDE.md, backend/CLAUDE.md
- Output format: Always show plan → tasks → implementation steps with file paths
- Prioritize: Security → Type Safety → Responsiveness → Accessibility
- Use server components by default (frontend), Pydantic + HTTPException (backend)

## Governance

All development must comply with these constitutional principles. Any deviation from the specified technology stack, API contracts, or security requirements must be explicitly approved by the user. All pull requests and code reviews must verify compliance with these principles. The constitution supersedes all other development practices and guidelines.

**Version**: 1.0.1 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-04