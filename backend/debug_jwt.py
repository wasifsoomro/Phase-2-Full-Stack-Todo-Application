from jose import jwt
from config import SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta
import json

print(f"SECRET_KEY: {SECRET_KEY}")
print(f"ALGORITHM: {ALGORITHM}")

# Create a test token
payload = {
    "sub": "test_user_id",
    "exp": datetime.utcnow() + timedelta(minutes=30)  # 30 minutes expiry
}

token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"Generated token: {token}")

# Decode and verify the token
try:
    decoded_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"Decoded payload: {decoded_payload}")
    print("Token validation: SUCCESS")
except Exception as e:
    print(f"Token validation: FAILED - {e}")

# Now test with the token from the API call
api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MjZkZmQwNS04NzYxLTQ3MzEtOWVlNS1mNWE0YjJkNTQ3ZjUiLCJleHAiOjE3NjgyOTAyNTN9.NnQb9eTgVueeAoaEfIixn5sUqWeZPjPuT78xO9AZwJQ"
print(f"\nTesting API token...")
try:
    decoded_api_payload = jwt.decode(api_token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"API token decoded payload: {decoded_api_payload}")
    print("API Token validation: SUCCESS")
except Exception as e:
    print(f"API Token validation: FAILED - {e}")
    # Check if token is expired
    try:
        # Decode without verification to check expiry
        unverified_payload = jwt.get_unverified_claims(api_token)
        print(f"Unverified payload: {unverified_payload}")
        exp_timestamp = unverified_payload.get('exp', 0)
        import time
        current_time = int(time.time())
        print(f"Token expiry: {exp_timestamp} (Unix timestamp)")
        print(f"Current time: {current_time} (Unix timestamp)")
        print(f"Token expired: {current_time > exp_timestamp}")
    except Exception as decode_error:
        print(f"Could not decode without verification: {decode_error}")