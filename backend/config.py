import os
import secrets
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the secret key from environment variable
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    # For development, use a consistent secret key that persists across server restarts
    # This ensures JWT tokens remain valid across server restarts during development
    print("WARNING: BETTER_AUTH_SECRET not set in environment. Using default development key.")
    print("For production, please set BETTER_AUTH_SECRET in your environment variables.")

    # Try to load from a dev file first, otherwise generate and save it
    dev_secret_file = ".dev_secret"
    if os.path.exists(dev_secret_file):
        with open(dev_secret_file, 'r') as f:
            SECRET_KEY = f.read().strip()
    else:
        SECRET_KEY = secrets.token_hex(32)
        with open(dev_secret_file, 'w') as f:
            f.write(SECRET_KEY)
        print(f"Generated and saved development SECRET_KEY to {dev_secret_file}")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30