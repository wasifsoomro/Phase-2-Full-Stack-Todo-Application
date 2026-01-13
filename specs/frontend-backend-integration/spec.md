# Feature Specification: Frontend-Backend Integration for Todo App

**Feature Branch**: `1-frontend-backend-integration`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Create a detailed specification for frontend-backend integration in Phase 2 Todo App. Focus on secure connection: - Frontend (Next.js) uses lib/api.ts to call backend endpoints - Attach JWT token from Better Auth in Authorization header - Handle 401 → redirect to login - Handle 403 → show 'Access denied' - Use TypeScript interfaces matching backend Pydantic models - Update existing frontend pages to use real API calls (not mock) - Test full flow: login → create task → see in list"

## User Scenarios & Testing *(mandatory)*   

### User Story 1 - Secure API Integration (Priority: P1)

As a user of the Todo App, I want the frontend to securely connect to the backend API using JWT tokens so that my data is protected and I can access my tasks without exposing sensitive information.

**Why this priority**: Security is paramount for protecting user data. Without secure API integration, users' personal information could be compromised.

**Independent Test**: Can be tested by verifying that all API requests include proper Authorization headers with JWT tokens and that unauthorized requests are properly handled with redirects or error messages.

**Acceptance Scenarios**:

1. **Given** I am logged in with a valid JWT token, **When** I perform any action requiring backend API, **Then** the API request includes the Authorization header with Bearer token
2. **Given** I make an API request without a valid JWT token, **When** the backend returns a 401 status, **Then** I am redirected to the login page
3. **Given** I make an API request with insufficient permissions, **When** the backend returns a 403 status, **Then** I see an "Access denied" message
4. **Given** I make an API request with valid token and sufficient permissions, **When** the request is processed, **Then** I receive the expected data response

---

### User Story 2 - Real API Data Integration (Priority: P1)

As a user of the Todo App, I want the frontend to use real API calls instead of mock data so that I can interact with my actual tasks stored in the database.

**Why this priority**: The application is useless with mock data. Real data persistence and retrieval is fundamental to the app's value proposition.

**Independent Test**: Can be tested by creating a task on the frontend and verifying it appears in the backend database, and vice versa.

**Acceptance Scenarios**:

1. **Given** I create a task on the frontend, **When** I submit the form, **Then** the task is saved to the backend and appears in my task list
2. **Given** I have tasks in the backend database, **When** I load the task list page, **Then** all my tasks are displayed from the backend API
3. **Given** I update a task on the frontend, **When** I save the changes, **Then** the changes are persisted in the backend and reflected in the UI
4. **Given** I delete a task on the frontend, **When** I confirm the deletion, **Then** the task is removed from the backend and disappears from the UI

---

### User Story 3 - Type Safety & Data Consistency (Priority: P2)

As a developer maintaining the Todo App, I want TypeScript interfaces that match the backend Pydantic models so that data consistency is maintained between frontend and backend and type errors are caught at compile time.

**Why this priority**: Type safety reduces runtime errors and improves development productivity by catching issues early.

**Independent Test**: Can be tested by ensuring that all API responses conform to the defined TypeScript interfaces and that incorrect data types cause compilation errors.

**Acceptance Scenarios**:

1. **Given** the backend returns task data in a specific format, **When** it's received by the frontend, **Then** it conforms to the defined TypeScript interface
2. **Given** I try to assign incorrect data types to API response fields, **When** I compile the code, **Then** I get a type error
3. **Given** backend Pydantic models change, **When** TypeScript interfaces are updated accordingly, **Then** frontend code reflects the new data structure

---

### User Story 4 - End-to-End Workflow (Priority: P1)

As a user of the Todo App, I want to complete the full workflow from login to task creation to seeing the task in my list so that I can verify the entire integrated system works properly.

**Why this priority**: This validates the complete user journey and ensures all integration points work together seamlessly.

**Independent Test**: Can be tested by performing the complete flow: logging in, creating a task, and verifying it appears in the task list.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I enter valid credentials and submit, **Then** I am redirected to the dashboard
2. **Given** I am on the dashboard, **When** I create a new task, **Then** the task appears in my task list immediately
3. **Given** I have created tasks, **When** I refresh the page, **Then** the tasks still appear in my list
4. **Given** I am logged in and using the app, **When** my JWT token expires, **Then** I am redirected to login and prompted to authenticate again

---

### Edge Cases

- What happens when the backend server is temporarily unavailable?
- How does the system handle network timeouts during API calls?
- What happens when the JWT token expires mid-session?
- How does the system handle partial data updates (some fields succeed, others fail)?
- What happens when a user tries to access another user's data?
- How does the system handle concurrent updates to the same task?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST attach JWT tokens from Better Auth in the Authorization header for all backend API requests
- **FR-002**: System MUST redirect users to login page when receiving a 401 Unauthorized response
- **FR-003**: System MUST display "Access denied" message when receiving a 403 Forbidden response
- **FR-004**: System MUST use TypeScript interfaces that match backend Pydantic models for all API communications
- **FR-005**: System MUST replace all mock API calls with real backend API calls in frontend pages
- **FR-006**: Frontend MUST call backend endpoints following the established REST API patterns (GET /api/{user_id}/tasks, POST /api/{user_id}/tasks, etc.)
- **FR-007**: System MUST implement proper error handling for network failures and API errors
- **FR-008**: All task operations (create, read, update, delete, toggle completion) MUST use the backend API
- **FR-009**: System MUST maintain user isolation - users can only access their own tasks
- **FR-010**: System MUST implement proper loading states during API calls to provide user feedback
- **FR-011**: System MUST cache or optimistically update UI to improve perceived performance
- **FR-012**: System MUST validate input on the frontend before sending to backend (consistent with backend validation)

### Key Entities

- **Task Interface**: TypeScript interface matching the backend Task Pydantic model with id, user_id, title, description, completed, created_at, updated_at
- **API Client**: Module at lib/api.ts that handles HTTP requests with proper authentication headers
- **Authentication Handler**: Service that manages JWT tokens and redirects for 401/403 responses
- **Data Transformers**: Functions that convert between frontend and backend data formats when necessary

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of API calls from frontend include proper JWT authentication headers
- **SC-002**: 100% of 401 responses result in redirection to login page within 1 second
- **SC-003**: 100% of 403 responses display "Access denied" message to user
- **SC-004**: 100% of frontend components use real API calls instead of mock data
- **SC-005**: 99% of end-to-end workflow tests (login → create task → see in list) pass successfully
- **SC-006**: TypeScript compilation succeeds with type safety between frontend interfaces and backend models
- **SC-007**: User data isolation is maintained with 100% accuracy across all API operations
- **SC-008**: API response time remains under 2 seconds for 95% of requests under normal load
- **SC-009**: 99% of user sessions maintain authentication state properly without unexpected logouts