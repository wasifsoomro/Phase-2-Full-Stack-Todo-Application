import os
os.environ['DATABASE_URL'] = 'sqlite:///./todo_app_local.db'
os.environ['BETTER_AUTH_SECRET'] = 'b2cc922692e2c370c6053643b5ad41300449b5f2b1543719746d5a05c8c20b70'

from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
import uuid

# Updated User model with proper ID generation
class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, nullable=False)
    name: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Test the model
print("Testing User model...")
try:
    engine = create_engine(os.getenv("DATABASE_URL"))
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        user = User(email="test@example.com", name="Test User")
        session.add(user)
        session.commit()
        session.refresh(user)

        print(f"Created user with ID: {user.id}")
        print("User model is working correctly!")
except Exception as e:
    print(f"Error with User model: {str(e)}")
    import traceback
    traceback.print_exc()