# CRUD Test Writer

A reusable skill for generating high-quality tests for CRUD operations following best practices and consistent patterns.

## Core Principles

- Backend: pytest + FastAPI TestClient for API testing
- Focus on tasks endpoints (/api/{user_id}/tasks, etc.)
- Always test user isolation (different users only see their own tasks)
- Test authentication: 401 without token, 403 with wrong user_id
- Cover happy path + error cases (invalid data, missing fields, non-existent ID)
- Use clear test names (e.g., test_create_task_success, test_get_tasks_wrong_user_forbidden)
- Include setup: create test users, tasks, get tokens
- Use fixtures where appropriate
- For frontend/E2E: Playwright tests for user flows when explicitly requested
- Keep tests focused and readable

## Test Structure

- Use function-based structure (individual test functions) with descriptive names
- Avoid class-based unless user specifically asks
- Each test should be focused and independent

## Fixture Strategy

- Assume fixtures already exist in conftest.py (e.g., test_client, test_user1, test_user2, auth_token_user1, etc.)
- Include simple inline setup or suggest fixture definitions as fallback
- Prioritize reusing existing fixtures for consistency

## Backend vs Frontend Focus

- Primarily focus on backend API tests (pytest + FastAPI TestClient)
- This is the core value for API reliability
- Include optional Playwright E2E snippets only when user explicitly asks for frontend/user-flow tests
- Default to backend unless otherwise specified

## Mocking Approach

- Prefer actual database calls (true integration tests) using the real TestClient and get_db override
- This ensures real behavior (including user isolation)
- Suggest optional mocking only for performance-critical or external dependencies
- Not the default approach

## Test Data Management

- Use simple direct creation in setup functions (e.g., client.post(...) to create a test task)
- No factory_boy needed unless user asks for it
- Keep it lightweight and explicit for clarity

## Playwright Configuration

- When generating Playwright tests, assume a basic authenticated state
- Generate full flow (login → actions → assertions) but keep it simple
- Do not include full global setup unless requested

## Typical Use Cases

### Generate pytest tests for task CRUD endpoints
```
User: "Create tests for task CRUD endpoints"
Skill: Generates function-based tests covering create, read, update, delete with proper authentication and user isolation
```

### Write Playwright E2E test for user flow
```
User: "Include E2E - create Playwright test for creating and listing tasks as a logged-in user"
Skill: Generates Playwright test for login → create task → see list → complete → delete flow
```

### Test user isolation
```
User: "Test that one user cannot see or modify another user's tasks"
Skill: Generates tests verifying user isolation with different users and tokens
```

## Code Patterns to Follow

### Backend Test Pattern Example
```python
import pytest
from fastapi.testclient import TestClient
from uuid import UUID

def test_create_task_success(client: TestClient, auth_token_user1: str, user1_id: str):
    """Test successful task creation for authenticated user"""
    response = client.post(
        f"/api/{user1_id}/tasks",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
        json={"title": "Test task", "description": "Test description"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test task"
    assert data["user_id"] == user1_id
    assert UUID(data["id"])  # Validate UUID format

def test_get_tasks_wrong_user_forbidden(client: TestClient, auth_token_user1: str, user2_id: str):
    """Test that user1 cannot access user2's tasks (user isolation)"""
    response = client.get(
        f"/api/{user2_id}/tasks",
        headers={"Authorization": f"Bearer {auth_token_user1}"}
    )

    assert response.status_code == 403
    assert "detail" in response.json()

def test_create_task_validation_error(client: TestClient, auth_token_user1: str, user1_id: str):
    """Test task creation with invalid data returns 422"""
    response = client.post(
        f"/api/{user1_id}/tasks",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
        json={"title": ""}  # Invalid: empty title
    )

    assert response.status_code == 422
    assert "detail" in response.json()

def test_get_nonexistent_task_404(client: TestClient, auth_token_user1: str, user1_id: str):
    """Test getting a non-existent task returns 404"""
    fake_task_id = "123e4567-e89b-12d3-a456-426614174000"
    response = client.get(
        f"/api/{user1_id}/tasks/{fake_task_id}",
        headers={"Authorization": f"Bearer {auth_token_user1}"}
    )

    assert response.status_code == 404
```

### Playwright Test Pattern Example (when explicitly requested)
```typescript
import { test, expect } from '@playwright/test';

test('user can create and complete tasks', async ({ page }) => {
  // Login as user
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard');

  // Create a new task
  await page.fill('[data-testid="task-input"]', 'Test task');
  await page.click('[data-testid="create-task"]');

  // Verify task appears in list
  await expect(page.locator('text="Test task"')).toBeVisible();

  // Complete the task
  await page.click('[data-testid="complete-task"]');

  // Verify task is marked as completed
  await expect(page.locator('[data-testid="task-completed"]')).toBeVisible();
});
```

## Quality Standards

- Each test should verify one specific behavior
- Use descriptive test names that clearly indicate what is being tested
- Include proper assertions for status codes, response data, and error messages
- Test both happy path and error cases
- Ensure user isolation is verified in all applicable tests
- Use consistent patterns for headers, request bodies, and assertions
- Include comments explaining what each test verifies
- Follow pytest best practices for test organization

## Run Commands

- Backend tests: `pytest tests/` or `pytest tests/test_tasks.py`
- Frontend tests: `npx playwright test` or `npx playwright test e2e/todo-flow.spec.ts`
- With coverage: `pytest --cov=app tests/`