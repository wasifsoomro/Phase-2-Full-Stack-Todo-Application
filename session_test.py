import requests
import json
import jwt

# Test the session endpoint specifically

BASE_URL = "http://localhost:8000"

def test_session_endpoints():
    """Test session endpoints specifically"""

    # Login first
    login_data = {
        "email": "test_api@example.com",
        "password": "password123"
    }

    print("Testing login...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print("Login response:", login_response.status_code)

    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data["access_token"]
        user_id = token_data["user"]["id"]

        print(f"Access token received: {access_token[:20]}...")
        print(f"User ID: {user_id}")

        # Decode the token to inspect its contents
        try:
            decoded = jwt.decode(access_token, options={"verify_signature": False})
            print(f"Decoded token contents: {decoded}")
        except Exception as e:
            print(f"Error decoding token: {e}")

        # Test getting user session with /session endpoint
        print("\nTesting /api/auth/session endpoint...")
        session_response = requests.get(
            f"{BASE_URL}/api/auth/session",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        print("Session response:", session_response.status_code, session_response.json())

        # Test getting user session with /get-session endpoint
        print("\nTesting /api/auth/get-session endpoint...")
        get_session_response = requests.get(
            f"{BASE_URL}/api/auth/get-session",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        print("Get session response:", get_session_response.status_code, get_session_response.json())

if __name__ == "__main__":
    test_session_endpoints()