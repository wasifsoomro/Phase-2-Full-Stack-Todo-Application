# Implementation Plan: Frontend-Backend Integration for Todo App

## Technical Context

**Feature**: Frontend-Backend Integration
**Branch**: 1-frontend-backend-integration (assumed)
**Dependencies**:
- Backend API endpoints exist and follow specified patterns
- Better Auth is configured and providing JWT tokens
- Frontend UI components exist and need to be connected to real API
- TypeScript interfaces need to match backend Pydantic models

**Unknowns to resolve**:
- Current state of backend API endpoints
- Current state of frontend API client (if any exists)
- Exact implementation of Better Auth integration
- Existing TypeScript interfaces in frontend

## Constitution Check

✅ **Technology Stack Compliance**: Plan uses Next.js 16+, FastAPI, TypeScript, and Better Auth as required
✅ **Security-First Development**: Plan enforces user isolation and JWT authentication
✅ **API Contract Adherence**: Plan follows specified API endpoint patterns
✅ **Type Safety and Validation**: Plan includes TypeScript interfaces matching backend models

## Gates

✅ **Implementation approach aligns with constitution**
✅ **No architectural violations identified**
✅ **All required technology stack elements addressed**

---

## Phase 0: Research & Discovery

1. **Investigate current backend API endpoints** - Verify existing endpoints match required patterns
2. **Examine current frontend state** - Check for existing API client, mock data, and UI components
3. **Review Better Auth integration** - Understand how JWT tokens are currently obtained and stored
4. **Document current data models** - Identify existing TypeScript interfaces and backend Pydantic models

**Output**: research.md with current state assessment

## Phase 1: Data Model & API Contracts

1. **Define TypeScript interfaces** based on backend Pydantic models for tasks entity
2. **Document API contracts** for all required endpoints:
   - GET /api/{user_id}/tasks
   - POST /api/{user_id}/tasks
   - GET /api/{user_id}/tasks/{id}
   - PUT /api/{user_id}/tasks/{id}
   - DELETE /api/{user_id}/tasks/{id}
   - PATCH /api/{user_id}/tasks/{id}/complete
3. **Create data transformation layer** if needed between frontend and backend formats
4. **Specify error response formats** for 401, 403, and other error cases

**Output**: data-model.md, API contracts in /contracts/

## Phase 2: Implementation Plan

### Phase 2.1: API Client Infrastructure
Dependencies: Backend endpoints confirmed to exist
1. Create/update `frontend/lib/api.ts` with centralized API client
2. Implement JWT token retrieval from Better Auth session
3. Add request interceptor to attach Authorization header automatically
4. Implement response interceptor for 401/403 error handling
5. Create typed API functions for all required endpoints

### Phase 2.2: Authentication Flow Integration
Dependencies: API client infrastructure complete
1. Configure authentication context to manage token state
2. Implement 401 redirect to login page
3. Implement 403 "Access denied" handling
4. Add token refresh mechanism if needed
5. Test authentication flow with expired tokens

### Phase 2.3: UI Integration with Real API
Dependencies: API client and auth flow working
1. Replace mock data in `app/(dashboard)/tasks/page.tsx` with real API calls
2. Connect task creation form to POST endpoint
3. Connect task list display to GET endpoint
4. Implement task update functionality using PUT endpoint
5. Connect task completion toggle to PATCH endpoint
6. Implement task deletion using DELETE endpoint

### Phase 2.4: Error Handling & User Experience
Dependencies: UI integration with real API working
1. Add loading states using Suspense components
2. Implement toast notifications for success/error messages
3. Add proper error boundaries for API failures
4. Implement optimistic updates where appropriate
5. Add network error handling with retry mechanisms

### Phase 2.5: Testing & Validation
Dependencies: All previous phases complete
1. Test complete user flow: login → create task → see in list
2. Verify user isolation: users can only access their own tasks
3. Test authentication failure scenarios
4. Validate all CRUD operations work correctly
5. Test error handling for all edge cases

## Phase 3: Quickstart Guide

**For developers implementing this plan:**

1. Start with Phase 2.1 - API Client Infrastructure
2. Verify backend endpoints exist before proceeding
3. Test authentication flow before connecting UI components
4. Replace one UI component at a time to isolate issues
5. Test user isolation after each CRUD operation implementation

**Key files to modify:**
- `frontend/lib/api.ts` - API client
- `frontend/types/` - TypeScript interfaces
- `app/(dashboard)/tasks/page.tsx` - Main task page
- Various component files to connect to real API

## Next Steps

1. Begin with Phase 0: Research & Discovery to understand current state
2. Document findings in research.md
3. Move to Phase 1: Data Model & API Contracts
4. Proceed with implementation following the phased approach