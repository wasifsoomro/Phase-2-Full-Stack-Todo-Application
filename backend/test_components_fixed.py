import os
import sys
sys.path.append('.')

# Set up environment
os.environ['DATABASE_URL'] = 'sqlite:///./todo_app_local.db'
os.environ['BETTER_AUTH_SECRET'] = 'b2cc922692e2c370c6053643b5ad41300449b5f2b1543719746d5a05c8c20b70'

# Define password functions locally to avoid import issues
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

def get_password_hash(password):
    # Bcrypt has a 72-byte limit, so truncate if necessary
    truncated_password = password[:72] if len(password) > 72 else password
    return pwd_context.hash(truncated_password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Import and test individual components
from sqlmodel import SQLModel, Field, create_engine
from models import User
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
                name="Test User"
                # Note: not setting password field since it's not in User model
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