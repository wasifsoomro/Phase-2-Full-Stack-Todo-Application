---
id: 1
title: Update Constitution for Phase 2
stage: constitution
date: 2026-01-04
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: main
user: user
command: sp.constitution
labels: ["constitution", "phase2", "hackathon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
You are now operating under the constitution for Phase 2 of Hackathon II: Todo Full-Stack Web Application.

Project Name: hackathon-todo

Current Phase: Phase II - Full-Stack Web Application with Persistent Storage and Multi-User Support

Core Rules (NEVER violate these):

1. Follow Agentic Dev Stack workflow strictly: Write/Update Spec → Generate Plan → Break into Tasks → Implement via Claude Code. No manual coding allowed.

2. Always use Spec-Kit Plus: Reference specs with @specs/... (e.g., @specs/features/task-crud.md)

3. Read relevant CLAUDE.md files before any action: Root CLAUDE.md, frontend/CLAUDE.md, backend/CLAUDE.md

4. Monorepo structure: frontend/, backend/, specs/, .spec-kit/config.yaml, docker-compose.yml

5. Technology stack must be followed exactly:

   - Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui

   - Backend: FastAPI, SQLModel, Neon Serverless PostgreSQL

   - Auth: Better Auth with JWT (shared secret BETTER_AUTH_SECRET)

   - Database: Use DATABASE_URL env var

6. All endpoints require JWT: Authorization: Bearer <token>

7. Enforce user isolation on EVERY operation: user_id from token MUST match {user_id} in path

8. Return 401 if no/invalid token, 403 if user mismatch

9. API endpoints exactly as specified:

   - GET /api/{user_id}/tasks (list, query params: status, sort)

   - POST /api/{user_id}/tasks (create: title required, description optional)

   - GET /api/{user_id}/tasks/{id} (details)

   - PUT /api/{user_id}/tasks/{id} (update)

   - DELETE /api/{user_id}/tasks/{id} (delete)

   - PATCH /api/{user_id}/tasks/{id}/complete (toggle)

10. Features from phase2-web: task-crud + authentication

11. Database schema (tasks table):

    - id: int PK

    - user_id: str FK to users.id

    - title: str NOT NULL

    - description: text NULL

    - completed: bool default false

    - created_at, updated_at: timestamp

12. Users table managed by Better Auth: id (str PK), email, name, created_at

13. Always prioritize:

    - Security: user isolation, JWT verification

    - Responsiveness: mobile-first Tailwind

    - Accessibility: WCAG AA basics

    - Type safety: TypeScript + Pydantic

14. When implementing:

    - Use server components by default (frontend)

    - Use Pydantic + HTTPException (backend)

    - Reference @specs/... for requirements

15. Output format: Always show plan → tasks → implementation steps with file paths

16. Goal: Transform Phase 1 console app into multi-user full-stack web app with persistent Neon DB and JWT auth.

This constitution is active for all Phase 2 work.

Any deviation must be explicitly approved by the user.
```

## Response snapshot

Updated the project constitution to reflect Phase 2 requirements for the hackathon-todo project, including full-stack web application development with multi-user support, persistent storage, and JWT authentication. The constitution now includes core principles, technology stack requirements, API specifications, security requirements, and development workflow guidelines.

## Outcome

- ✅ Impact: Constitution updated to version 1.0.0 with Phase 2 requirements
- 🧪 Tests: No tests needed for constitution update
- 📁 Files: Updated .specify/memory/constitution.md with new requirements
- 🔁 Next prompts: Ready to proceed with Phase 2 implementation following new constitution
- 🧠 Reflection: Constitution now properly reflects Phase 2 requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin Phase 2 implementation following constitution