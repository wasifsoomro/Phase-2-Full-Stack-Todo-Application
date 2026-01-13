import requests
import jwt
from backend.config import SECRET_KEY

# Test the SECRET_KEY and decode the token manually
BASE_URL = "http://localhost:8000"

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
    print(f"SECRET_KEY used: {SECRET_KEY[:20]}...")

    # Decode the token using the same SECRET_KEY
    try:
        decoded = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        print(f"Successfully decoded token with SECRET_KEY: {decoded}")
    except jwt.ExpiredSignatureError:
        print("Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {e}")

    # Try verifying the token manually
    from jose import jwt as jose_jwt
    try:
        payload = jose_jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        print(f"Successfully verified token with jose: {payload}")
    except Exception as e:
        print(f"Verification failed with jose: {e}")