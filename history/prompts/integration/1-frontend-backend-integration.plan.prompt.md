---
id: 1
title: Frontend-Backend Integration Plan
stage: plan
date: 2026-01-09
surface: agent
model: Claude Sonnet 4.5
feature: integration
branch: main
user: user
command: /sp.plan Create a detailed, step-by-step development plan for frontend-backend integration
labels: ["integration", "plan", "frontend", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:/Hackathons/Hackathon Phase 2/specs/frontend-backend-integration/spec.md
 - D:/Hackathons/Hackathon Phase 2/history/prompts/integration/1-frontend-backend-integration.plan.prompt.md
tests:
 - D:/Hackathons/Hackathon Phase 2/specs/frontend-backend-integration/spec.md
---

## Prompt

Create a detailed, step-by-step development plan for frontend-backend integration in Phase 2 Todo Full-Stack Web Application, based strictly on the specification @specs/integration/frontend-backend-connection.md.

Focus ONLY on secure connection and data flow between frontend (Next.js) and backend (FastAPI). This is the bridge phase — ensure JWT token from Better Auth is sent, backend verifies it, and frontend handles responses correctly.

Core Requirements for the Plan:
- Follow Agentic Dev Stack strictly: Spec → Plan → Tasks → Implement
- Use monorepo: frontend/lib/api.ts + backend routes
- Prioritize security: token attachment, 401/403 handling, user isolation verification
- Assume frontend UI and backend endpoints already exist
- Use existing agents/skills: nextjs-app-router-expert, fastapi-backend-expert, integration-agent
- Centralized API client in frontend/lib/api.ts must attach JWT automatically
- Handle loading/error states in UI (Suspense, toast notifications)
- Test full user flow: login → create task → see list → toggle → delete

Plan Structure (strict output format):
1. High-Level Overview (1-2 sentences)
2. Numbered Phases (e.g. 1. API Client Setup, 2. Token Attachment & Auth Flow, 3. Update UI Pages with Real API Calls, 4. Error Handling & User Feedback, 5. End-to-End Testing)
   - For each phase: 3-6 concrete steps
   - Note dependencies (e.g., backend endpoints must exist)
3. Atomic Task List (8-15 small tasks total)
   - Tag each task with [integration], [frontend], or [backend] if needed
   - Include exact file paths (e.g., frontend/lib/api.ts, app/(dashboard)/tasks/page.tsx)
   - Phrase tasks as actionable: "Update...", "Add...", "Implement..."
   - Prioritize: API client first → token handling → page updates → error UI → testing
4. Next Steps Recommendation (which task to start first)

Make this plan so clear, secure, and complete that implementation will connect frontend and backend perfectly, enabling full multi-user functionality for hackathon judging.

Output the plan now.

## Response snapshot

# Detailed Development Plan: Frontend-Backend Integration for Todo App

## 1. High-Level Overview

The plan establishes secure communication between the Next.js frontend and FastAPI backend by implementing a centralized API client that automatically attaches JWT tokens from Better Auth, handles authentication errors appropriately, and replaces all mock data calls with real API endpoints while maintaining user data isolation.

## 2. Numbered Phases

### Phase 1: API Client Setup
Dependencies: Backend endpoints exist, Better Auth configured
1. Create/Update `frontend/lib/api.ts` with centralized API client that intercepts requests to add Authorization header
2. Implement token retrieval from Better Auth session in the API client
3. Set up base URL configuration for backend API calls
4. Add request/response interceptors for consistent error handling
5. Export typed API functions for all required endpoints (tasks CRUD operations)

### Phase 2: Token Attachment & Auth Flow
Dependencies: API client implemented, JWT tokens available from Better Auth
1. Configure API client to automatically attach `Authorization: Bearer <token>` header to all requests
2. Implement 401 Unauthorized handler that redirects to login page
3. Implement 403 Forbidden handler that displays "Access denied" message
4. Add token validation and refresh mechanisms
5. Set up authentication context/state management in frontend

### Phase 3: Update UI Pages with Real API Calls
Dependencies: Backend endpoints exist, API client configured with auth
1. Replace mock data calls in `app/(dashboard)/tasks/page.tsx` with real API calls
2. Update task creation form to use real POST endpoint
3. Modify task list component to fetch data from backend API
4. Implement task update/delete functionality using real endpoints
5. Connect task completion toggle to the PATCH endpoint

### Phase 4: Error Handling & User Feedback
Dependencies: API client with auth implemented, UI pages updated
1. Add loading states to UI components during API calls using Suspense
2. Implement toast notifications for API success/error messages
3. Add network error handling with user-friendly messages
4. Create proper error boundaries for API failures
5. Add optimistic UI updates where appropriate for better UX

### Phase 5: End-to-End Testing
Dependencies: All previous phases completed
1. Test complete user flow: login → create task → see in list
2. Verify user isolation: users can only access their own tasks
3. Test authentication failure scenarios (expired tokens, invalid tokens)
4. Validate all CRUD operations work correctly with real API
5. Verify proper error handling for all edge cases

## 3. Atomic Task List

1. [integration] Update `frontend/lib/api.ts` to create centralized API client with JWT token attachment
2. [integration] Implement request interceptor in API client to add Authorization header with JWT token
3. [integration] Add 401 error handler in API client that redirects to login page
4. [integration] Add 403 error handler in API client that shows "Access denied" message
5. [frontend] Replace mock data in `app/(dashboard)/tasks/page.tsx` with real API calls to fetch user tasks
6. [frontend] Update task creation form to use POST `/api/{user_id}/tasks` endpoint with proper authentication
7. [frontend] Modify task list component to use GET `/api/{user_id}/tasks` endpoint and handle loading states
8. [frontend] Implement task update functionality using PUT `/api/{user_id}/tasks/{id}` endpoint
9. [frontend] Implement task deletion using DELETE `/api/{user_id}/tasks/{id}` endpoint with confirmation
10. [frontend] Connect task completion toggle to PATCH `/api/{user_id}/tasks/{id}/complete` endpoint
11. [frontend] Add TypeScript interfaces in `frontend/types/` that match backend Pydantic models for tasks
12. [integration] Add proper error boundary components to handle API failures gracefully
13. [frontend] Implement toast notifications for API success and error messages using shadcn/ui
14. [integration] Add loading states with Suspense components during API calls for better UX
15. [integration] Test complete user flow: login → create task → see in list → toggle completion → delete

## 4. Next Steps Recommendation

Start with task #1: Update `frontend/lib/api.ts` to create centralized API client with JWT token attachment. This is foundational for all other tasks since every API call needs to go through this client to ensure proper authentication and error handling.

---

This plan follows the Agentic Dev Stack approach (Spec → Plan → Tasks → Implement) and ensures secure, type-safe communication between the frontend and backend while maintaining user data isolation as required by the constitution.

## Outcome

- ✅ Impact: Created comprehensive plan for frontend-backend integration following Agentic Dev Stack
- 🧪 Tests: Plan includes end-to-end testing scenarios and user isolation verification
- 📁 Files: Referenced spec file and created PHR record
- 🔁 Next prompts: Implementation tasks based on this plan
- 🧠 Reflection: Plan prioritizes security with centralized API client and proper auth handling

## Evaluation notes (flywheel)

- Failure modes observed: None at planning stage
- Graders run and results (PASS/FAIL): Not applicable at planning stage
- Prompt variant (if applicable): Standard plan generation
- Next experiment (smallest change to try): Proceed with task implementation based on this plan