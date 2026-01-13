import os
import sys
sys.path.append('.')

# Set up environment
os.environ['DATABASE_URL'] = 'sqlite:///./todo_app_local.db'
os.environ['BETTER_AUTH_SECRET'] = 'b2cc922692e2c370c6053643b5ad41300449b5f2b1543719746d5a05c8c20b70'

# Import and test individual components
from sqlmodel import SQLModel, Field, create_engine
from db import get_session
from models import User, UserCreate
from routes.auth import get_password_hash, verify_password
from passlib.context import CryptContext

print("Testing database connection...")
try:
    engine = create_engine(os.getenv("DATABASE_URL"))
    print("Database engine created successfully")

    # Test password hashing separately
    print("Testing password hashing...")
    hashed = get_password_hash("password123")
    print("Password hashed successfully")

    # Verify the hash
    verified = verify_password("password123", hashed)
    print(f"Password verification: {verified}")

    # Create tables
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully")

    # Test creating a user directly
    print("Testing direct user creation...")
    from sqlmodel import Session

    with Session(engine) as session:
        # Check if user already exists
        from sqlalchemy import select
        existing_user = session.exec(select(User).where(User.email == "test@test.com")).first()
        if existing_user:
            print("User already exists, skipping creation")
        else:
            # Create a new user
            new_user = User(
                email="test@test.com",
                name="Test User",
                password=get_password_hash("password123")
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            print(f"User created successfully: {new_user.id}")

    print("All individual components work correctly!")

except Exception as e:
    print(f"Error in component test: {str(e)}")
    import traceback
    traceback.print_exc()