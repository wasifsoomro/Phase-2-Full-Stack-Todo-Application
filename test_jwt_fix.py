#!/usr/bin/env python3
"""
Test script to verify JWT token creation and validation work correctly
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Test JWT functionality in isolation
from backend.routes.auth import create_access_token
from backend.dependencies import verify_token
from backend.config import SECRET_KEY, ALGORITHM
from datetime import timedelta

print(f"Testing JWT functionality...")
print(f"SECRET_KEY: {SECRET_KEY[:20]}...")
print(f"ALGORITHM: {ALGORITHM}")

# Create a test token
test_user_id = "test-user-id-12345"
token = create_access_token(
    data={"sub": test_user_id},
    expires_delta=timedelta(minutes=30)  # 30 minutes expiry
)

print(f"Created token: {token[:50]}...")

# Try to verify the token
try:
    verified_user_id = verify_token(token)
    print(f"✓ Token verification successful!")
    print(f"Verified user ID: {verified_user_id}")
    print(f"Match: {verified_user_id == test_user_id}")
except Exception as e:
    print(f"✗ Token verification failed: {e}")
    print(f"Token: {token}")