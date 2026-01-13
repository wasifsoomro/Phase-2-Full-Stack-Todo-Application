# Tasks: Frontend-Backend Integration for Todo App

## Feature Overview

This document outlines the implementation tasks for integrating the Next.js frontend with the FastAPI backend for the Todo App. The focus is on establishing secure API communication using JWT tokens from Better Auth, implementing proper error handling, and replacing mock data with real API calls.

## Dependencies

- Backend API endpoints exist and follow specified patterns
- Better Auth is configured and providing JWT tokens
- Frontend UI components exist and need to be connected to real API

## Implementation Strategy

We'll follow an incremental approach, starting with the foundational API client infrastructure, then connecting individual user stories one by one. Each user story will be implemented as a complete, independently testable increment.

---

## Phase 1: Setup

- [x] T001 Create directory structure for API client: frontend/lib/api.ts
- [x] T002 Set up TypeScript interfaces directory: frontend/types/
- [x] T003 Verify backend endpoints exist and accessible via API

## Phase 2: Foundational Infrastructure

- [x] T004 [P] Create centralized API client in frontend/lib/api.ts with base configuration
- [x] T005 [P] Define TypeScript interface for Task entity matching backend Pydantic model
- [x] T006 [P] Implement JWT token retrieval utility function
- [x] T007 [P] Add request interceptor to API client to attach Authorization header
- [x] T008 [P] Add response interceptor to handle 401/403 error responses
- [x] T009 [P] Implement redirect function for 401 Unauthorized responses
- [x] T010 [P] Implement error display for 403 Forbidden responses

## Phase 3: User Story 1 - Secure API Integration (Priority: P1)

**Goal**: Establish secure communication between frontend and backend using JWT tokens

**Independent Test**: Verify that all API requests include proper Authorization headers with JWT tokens and that unauthorized requests are properly handled with redirects or error messages.

- [x] T011 [US1] Update API client to automatically retrieve JWT token from Better Auth session
- [x] T012 [US1] Test API client with mock endpoint to verify Authorization header attachment
- [x] T013 [US1] Implement 401 redirect to login page when token is invalid/expired
- [x] T014 [US1] Implement 403 error handling to display "Access denied" message
- [x] T015 [US1] Add token validation and refresh mechanism if needed
- [x] T016 [US1] Verify all authenticated API calls work with valid JWT tokens

## Phase 4: User Story 2 - Real API Data Integration (Priority: P1)

**Goal**: Replace mock data in frontend with real API calls to backend

**Independent Test**: Create a task on the frontend and verify it appears in the backend database, and vice versa.

- [x] T017 [US2] Implement GET /api/{user_id}/tasks API call in API client
- [x] T018 [US2] Update task list component to fetch data from backend API
- [x] T019 [US2] Implement POST /api/{user_id}/tasks API call in API client
- [x] T020 [US2] Update task creation form to use real POST endpoint
- [x] T021 [US2] Implement PUT /api/{user_id}/tasks/{id} API call in API client
- [x] T022 [US2] Implement task update functionality using real endpoint
- [x] T023 [US2] Implement DELETE /api/{user_id}/tasks/{id} API call in API client
- [x] T024 [US2] Implement task deletion functionality with confirmation
- [x] T025 [US2] Implement PATCH /api/{user_id}/tasks/{id}/complete API call in API client
- [x] T026 [US2] Connect task completion toggle to real endpoint
- [x] T027 [US2] Replace all mock data calls in app/(dashboard)/tasks/page.tsx with real API calls

## Phase 5: User Story 3 - Type Safety & Data Consistency (Priority: P2)

**Goal**: Ensure TypeScript interfaces match backend Pydantic models for type safety

**Independent Test**: Ensure all API responses conform to defined TypeScript interfaces and incorrect data types cause compilation errors.

- [x] T028 [US3] Create comprehensive Task interface in frontend/types/task.ts
- [x] T029 [US3] Add validation for all Task properties to match backend Pydantic model
- [x] T030 [US3] Create API response interfaces for all endpoints (CreateTaskResponse, GetTasksResponse, etc.)
- [x] T031 [US3] Update API client to use typed responses for all endpoints
- [x] T032 [US3] Add input validation interfaces for request payloads
- [x] T033 [US3] Verify TypeScript compilation succeeds with all API integrations

## Phase 6: User Story 4 - End-to-End Workflow (Priority: P1)

**Goal**: Enable complete user workflow from login to task creation to viewing tasks

**Independent Test**: Perform complete flow: logging in, creating a task, and verifying it appears in the task list.

- [x] T034 [US4] Test complete user flow: login → create task → see in list
- [x] T035 [US4] Verify user isolation: users can only access their own tasks via {user_id} in URL
- [x] T036 [US4] Test JWT token expiration handling during active session
- [x] T037 [US4] Validate all CRUD operations work correctly with real API
- [x] T038 [US4] Test error handling for network failures and API errors
- [x] T039 [US4] Verify proper loading states during API calls
- [x] T040 [US4] Test refresh functionality preserves task list from backend

## Phase 7: Error Handling & User Experience

- [x] T041 Add loading states to UI components during API calls using Suspense
- [x] T042 Implement toast notifications for API success/error messages using shadcn/ui
- [x] T043 Add proper error boundaries to handle API failures gracefully
- [x] T044 Add network error handling with retry mechanisms
- [x] T045 Implement optimistic updates for task completion toggle
- [x] T046 Add timeout handling for API requests

## Phase 8: Testing & Validation

- [x] T047 Test authentication failure scenarios (expired tokens, invalid tokens)
- [x] T048 Verify user isolation with different user accounts
- [x] T049 Test all CRUD operations with edge cases (empty titles, long descriptions, etc.)
- [x] T050 Perform end-to-end testing of complete user workflow
- [x] T051 Verify 100% of API calls include proper JWT authentication headers
- [x] T052 Confirm 100% of 401 responses redirect to login page
- [x] T053 Confirm 100% of 403 responses display "Access denied" message

## Phase 9: Polish & Cross-Cutting Concerns

- [x] T054 Update documentation with new API integration patterns
- [x] T055 Add comprehensive error logging for debugging
- [x] T056 Optimize API calls to reduce redundant requests
- [x] T057 Final end-to-end testing of complete integration
- [x] T058 Performance testing to ensure API response times under 2 seconds

---

## Dependencies Summary

- Tasks T011-T016 depend on foundational infrastructure (T004-T010)
- Tasks T017-T027 depend on API client infrastructure (T004-T010)
- Tasks T034-T040 depend on all previous phases being complete
- All story-specific tasks depend on the foundational infrastructure

## Parallel Execution Opportunities

- T005, T006, T007, T008 can run in parallel (different aspects of API client)
- T017, T019, T021, T023, T025 can run in parallel (different API endpoints)
- T028, T029, T030, T031 can run in parallel (type definitions)

## MVP Scope

The MVP would include:
- T001-T010 (Foundational infrastructure)
- T011-T016 (Secure API integration)
- T017-T020 (Task listing and creation)
- T034 (Basic end-to-end flow)