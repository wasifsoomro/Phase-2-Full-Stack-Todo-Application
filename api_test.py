import requests
import json

# Test the backend API endpoints

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health check:", response.json())

def test_register_and_login():
    """Test user registration and login"""
    # Register a new user
    register_data = {
        "email": "test_api@example.com",
        "name": "Test API User",
        "password": "password123"
    }

    print("\nTesting registration...")
    register_response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    print("Register response:", register_response.status_code, register_response.json())

    # Login with the new user
    login_data = {
        "email": "test_api@example.com",
        "password": "password123"
    }

    print("\nTesting login...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print("Login response:", login_response.status_code)

    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data["access_token"]
        user_id = token_data["user"]["id"]

        print(f"Access token received: {access_token[:20]}...")
        print(f"User ID: {user_id}")

        # Test getting user session
        print("\nTesting session retrieval...")
        session_response = requests.get(
            f"{BASE_URL}/api/auth/session",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        print("Session response:", session_response.status_code, session_response.json())

        # Test creating a task
        print("\nTesting task creation...")
        task_data = {
            "title": "Test Task",
            "description": "This is a test task"
        }

        task_response = requests.post(
            f"{BASE_URL}/api/{user_id}/tasks",
            json=task_data,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        print("Task creation response:", task_response.status_code, task_response.json())

        if task_response.status_code == 201:
            task_id = task_response.json()["id"]
            print(f"Created task ID: {task_id}")

            # Test getting tasks
            print("\nTesting task retrieval...")
            get_tasks_response = requests.get(
                f"{BASE_URL}/api/{user_id}/tasks",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print("Get tasks response:", get_tasks_response.status_code, len(get_tasks_response.json()))

            # Test updating task
            print("\nTesting task update...")
            update_data = {
                "title": "Updated Test Task",
                "completed": True
            }
            update_response = requests.put(
                f"{BASE_URL}/api/{user_id}/tasks/{task_id}",
                json=update_data,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print("Task update response:", update_response.status_code, update_response.json())

            # Test toggling task completion
            print("\nTesting task completion toggle...")
            toggle_response = requests.patch(
                f"{BASE_URL}/api/{user_id}/tasks/{task_id}/complete",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print("Task toggle response:", toggle_response.status_code, toggle_response.json())

            # Test deleting task
            print("\nTesting task deletion...")
            delete_response = requests.delete(
                f"{BASE_URL}/api/{user_id}/tasks/{task_id}",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            print("Task deletion response:", delete_response.status_code)

        return access_token, user_id

if __name__ == "__main__":
    test_health()
    test_register_and_login()