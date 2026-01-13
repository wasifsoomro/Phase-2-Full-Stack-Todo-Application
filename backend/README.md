# Todo Backend API

This is the backend for the Todo Full-Stack Web Application Phase 2, built with FastAPI and SQLModel.

## Features

- Secure JWT-based authentication
- Full CRUD operations for tasks
- User isolation (users can only access their own tasks)
- Task filtering and sorting
- PostgreSQL database integration

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost/dbname
BETTER_AUTH_SECRET=your-secret-key-here
```

## Running the Application

To run the application in development mode:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

## API Endpoints

The API provides the following endpoints:

### Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Task Operations

- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{task_id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion status

### Query Parameters

For the GET /tasks endpoint, you can use:

- `status`: Filter by status (all/pending/completed)
- `sort`: Sort by (created/title/due_date)

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection string
- `BETTER_AUTH_SECRET`: Secret key for JWT token verification

## Security

- All endpoints require JWT authentication
- User isolation is enforced: users can only access their own data
- User ID in the JWT token is validated against the user_id in the path
- Proper error responses for unauthorized access (401/403)