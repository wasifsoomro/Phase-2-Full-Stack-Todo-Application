# FastAPI Backend Expert

A reusable skill for generating high-quality FastAPI backend code following best practices and consistent patterns for user-isolated applications.

## Core Principles

- Use FastAPI + SQLModel for routes and models
- Always enforce user ownership/isolation: user_id from JWT token must match {user_id} in path
- Use PyJWT or jose for JWT verification
- Shared secret from env var: BETTER_AUTH_SECRET
- Use Pydantic models for request/response with strict validation
- Raise HTTPException for auth errors (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error)
- All routes under /api/{user_id}/...
- Use dependency injection for auth (e.g., get_current_user)
- Include basic logging and error handling
- Async support if needed (but sync is fine for simplicity)
- File structure: routes/tasks.py, models.py, dependencies.py, main.py

## Interface

This skill accepts natural language descriptions of desired functionality (e.g., "Create a GET /api/{user_id}/tasks endpoint that returns tasks for the authenticated user").

## Database Setup

- Assumes SQLModel is already configured with database connection (engine, session from db.py, get_db dependency)
- Use existing get_db() dependency in routes
- If needed, include a basic template suggestion for db.py, but don't force full setup

## Authentication Pattern

Always use the same dependency pattern:

```python
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # or your login endpoint

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

Use this in every protected route: `current_user: str = Depends(get_current_user)`
Enforce user_id from token == {user_id} in path

## Route Generation

- Granular by default: Generate single endpoints or one operation (e.g., only POST, only GET list)
- If user asks for "full CRUD", generate all in one file (routes/tasks.py) with clear separation
- Always include the full route code + router inclusion in main.py if needed

## Testing Approach

Generate comprehensive pytest tests covering all CRUD operations + auth:
- Happy path for each operation
- Auth failures (401 no token, 403 wrong user, 422 validation)
- User isolation (test with two users)
- Use fixtures for test users, tokens, and db session

## Error Handling Consistency

Always use specific HTTP status codes:
- 401 Unauthorized → no/invalid token
- 403 Forbidden → wrong user_id / ownership
- 404 Not Found → task not found
- 422 Unprocessable Entity → validation error
- 500 for unexpected server errors

Consistent JSON error response: `{"detail": "message"}`

## Typical Use Cases

### Create a new CRUD endpoint
```
User: "Create a GET /api/{user_id}/tasks endpoint that returns tasks for the authenticated user"
Skill: Generates route with auth dependency, user_id validation, and proper error handling
```

### Generate SQLModel class with user_id foreign key
```
User: "Create a Task SQLModel with user_id foreign key and proper validation"
Skill: Generates Task model with user relationship, validation, and Pydantic configs
```

### Implement JWT verification dependency
```
User: "Show the JWT verification middleware pattern for user isolation"
Skill: Generates get_current_user dependency with token validation and user_id extraction
```

### Add user filtering to queries
```
User: "Show how to filter tasks by user_id in SQLModel queries"
Skill: Demonstrates proper query filtering with user_id validation
```

### Write comprehensive pytest tests
```
User: "Create tests for task CRUD operations with auth"
Skill: Generates tests covering auth, user isolation, validation, and error cases
```

## Code Patterns to Follow

### SQLModel Model Example
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import uuid

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)

    # Relationship to user if needed
    # user: Optional["User"] = Relationship()

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: uuid.UUID
    user_id: str

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
```

### Route with Auth Dependency
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from uuid import UUID

from models import Task, TaskRead, TaskCreate
from dependencies import get_current_user
from db import get_db

router = APIRouter(prefix="/api/{user_id}")

@router.get("/tasks", response_model=List[TaskRead])
async def get_tasks(
    user_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")

    tasks = db.exec(select(Task).where(Task.user_id == user_id)).all()
    return tasks

@router.post("/tasks", response_model=TaskRead)
async def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")

    db_task = Task.from_orm(task)
    db_task.user_id = user_id
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
```

### Pytest Test Example
```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from app import create_app
from models import User, Task

@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as client:
        yield client

def test_get_tasks_auth_success(client: TestClient, db_session: Session, valid_token: str, user_id: str):
    # Create test tasks for user
    # Make request with valid token
    # Assert 200 and correct tasks returned

def test_get_tasks_wrong_user(client: TestClient, db_session: Session, valid_token: str, user_id: str, other_user_id: str):
    # Test that user can't access other user's tasks
    # Assert 403 Forbidden

def test_create_task_validation_error(client: TestClient, valid_token: str, user_id: str):
    # Test invalid input
    # Assert 422 Unprocessable Entity
```

## Quality Standards

- All models must have proper validation
- Always validate user_id from token matches path parameter
- Include proper error handling with appropriate status codes
- Use consistent response models with Pydantic
- Follow SQLModel best practices
- Include comprehensive tests for all endpoints
- Use dependency injection consistently
- Follow FastAPI conventions and patterns