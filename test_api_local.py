import os
import requests
import json
import time

# Set environment variables for local database
os.environ['DATABASE_URL'] = 'sqlite:///./todo_app_local.db'
os.environ['BETTER_AUTH_SECRET'] = 'b2cc922692e2c370c6053643b5ad41300449b5f2b1543719746d5a05c8c20b70'

BASE_URL = "http://127.0.0.1:8000"

def test_registration():
    print("Testing user registration...")

    # Register first user
    user1_data = {
        "email": "user1@test.com",
        "name": "User One",
        "password": "password123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user1_data)
        print(f"User 1 registration - Status: {response.status_code}")
        if response.status_code == 200:
            user1 = response.json()
            print(f"User 1 registered: {user1['email']}")
        else:
            print(f"User 1 registration failed: {response.text}")
            user1 = None
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        user1 = None

    # Register second user
    user2_data = {
        "email": "user2@test.com",
        "name": "User Two",
        "password": "password123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user2_data)
        print(f"User 2 registration - Status: {response.status_code}")
        if response.status_code == 200:
            user2 = response.json()
            print(f"User 2 registered: {user2['email']}")
        else:
            print(f"User 2 registration failed: {response.text}")
            user2 = None
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        user2 = None

    return user1, user2

def test_login(user_data):
    if not user_data:
        return None

    print(f"Testing login for {user_data['email']}...")

    login_data = {
        "email": user_data["email"],
        "password": "password123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login - Status: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(f"Login successful for {user_data['email']}")
            return result["access_token"]
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return None

def test_task_operations(user_token, user_id, user_name):
    if not user_token:
        print(f"Cannot test tasks for {user_name} - no token")
        return

    headers = {"Authorization": f"Bearer {user_token}"}

    print(f"\n--- Testing tasks for {user_name} ---")

    # Create a task
    print("Creating task...")
    task_data = {
        "title": f"Task for {user_name}",
        "description": f"This is a test task created by {user_name}"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/{user_id}/tasks", json=task_data, headers=headers)
        print(f"Task creation - Status: {response.status_code}")

        if response.status_code == 201:
            task = response.json()
            print(f"Task created: {task['title']}")
            task_id = task['id']
        else:
            print(f"Task creation failed: {response.text}")
            return
    except Exception as e:
        print(f"Error during task creation: {str(e)}")
        return

    # Get all tasks for this user
    print("Getting all tasks...")
    try:
        response = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)
        print(f"Get tasks - Status: {response.status_code}")

        if response.status_code == 200:
            tasks = response.json()
            print(f"Found {len(tasks)} tasks for {user_name}")
            for task in tasks:
                print(f"  - {task['title']} (ID: {task['id']})")
        else:
            print(f"Get tasks failed: {response.text}")
    except Exception as e:
        print(f"Error getting tasks: {str(e)}")

    # Update the task
    print("Updating task...")
    update_data = {
        "title": f"Updated task for {user_name}",
        "description": f"This task has been updated by {user_name}"
    }

    try:
        response = requests.put(f"{BASE_URL}/api/{user_id}/tasks/{task_id}", json=update_data, headers=headers)
        print(f"Task update - Status: {response.status_code}")

        if response.status_code == 200:
            updated_task = response.json()
            print(f"Task updated: {updated_task['title']}")
        else:
            print(f"Task update failed: {response.text}")
    except Exception as e:
        print(f"Error during task update: {str(e)}")

    # Toggle task completion
    print("Toggling task completion...")
    try:
        response = requests.patch(f"{BASE_URL}/api/{user_id}/tasks/{task_id}/complete", headers=headers)
        print(f"Toggle completion - Status: {response.status_code}")

        if response.status_code == 200:
            toggled_task = response.json()
            print(f"Task completion toggled. Completed: {toggled_task['completed']}")
        else:
            print(f"Toggle completion failed: {response.text}")
    except Exception as e:
        print(f"Error toggling completion: {str(e)}")

    # Delete the task
    print("Deleting task...")
    try:
        response = requests.delete(f"{BASE_URL}/api/{user_id}/tasks/{task_id}", headers=headers)
        print(f"Task deletion - Status: {response.status_code}")

        if response.status_code == 204:
            print("Task deleted successfully")
        else:
            print(f"Task deletion failed: {response.text}")
    except Exception as e:
        print(f"Error during task deletion: {str(e)}")

def test_user_isolation(user1_token, user1_id, user2_token, user2_id):
    print("\n--- Testing user isolation ---")

    if not user1_token or not user2_token:
        print("Cannot test user isolation - missing tokens")
        return

    headers1 = {"Authorization": f"Bearer {user1_token}"}
    headers2 = {"Authorization": f"Bearer {user2_token}"}

    # User 1 creates a task
    task_data = {
        "title": "User 1's private task",
        "description": "This should only be visible to User 1"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/{user1_id}/tasks", json=task_data, headers=headers1)
        if response.status_code == 201:
            task = response.json()
            task_id = task['id']
            print(f"User 1 created task with ID: {task_id}")

            # User 2 tries to access User 1's task (should fail)
            response = requests.get(f"{BASE_URL}/api/{user1_id}/tasks/{task_id}", headers=headers2)
            print(f"User 2 trying to access User 1's task - Status: {response.status_code}")
            if response.status_code == 403:
                print("✓ User isolation working - User 2 cannot access User 1's task")
            else:
                print(f"✗ User isolation failed - User 2 could access User 1's task: {response.text}")

            # User 1 tries to access User 2's tasks (should be empty or fail)
            response = requests.get(f"{BASE_URL}/api/{user2_id}/tasks", headers=headers1)
            print(f"User 1 trying to access User 2's tasks - Status: {response.status_code}")
            if response.status_code == 200:
                user1_on_user2_tasks = response.json()
                print(f"User 1 sees {len(user1_on_user2_tasks)} tasks from User 2's account")
                if len(user1_on_user2_tasks) == 0:
                    print("✓ User isolation working - User 1 cannot see User 2's tasks")
                else:
                    print("✗ User isolation failed - User 1 can see User 2's tasks")

            # Clean up: User 1 deletes their task
            response = requests.delete(f"{BASE_URL}/api/{user1_id}/tasks/{task_id}", headers=headers1)
            if response.status_code == 204:
                print("Cleaned up User 1's task")
        else:
            print(f"Failed to create test task for user isolation: {response.text}")
    except Exception as e:
        print(f"Error during user isolation test: {str(e)}")

def main():
    print("Starting API functionality tests...\n")

    # Test registration
    user1, user2 = test_registration()

    # Test login
    user1_token = test_login(user1)
    user2_token = test_login(user2)

    # Test task operations for both users
    if user1 and user1_token:
        test_task_operations(user1_token, user1['id'], user1['name'])

    if user2 and user2_token:
        test_task_operations(user2_token, user2['id'], user2['name'])

    # Test user isolation
    if user1 and user2 and user1_token and user2_token:
        test_user_isolation(user1_token, user1['id'], user2_token, user2['id'])

    print("\nAPI functionality tests completed!")

if __name__ == "__main__":
    main()