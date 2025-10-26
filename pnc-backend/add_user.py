"""
Script to add a user directly to the database for testing purposes
"""
import sys
import os
import uuid
from datetime import datetime
from models.auth import UserInDB, Role, UserStatus

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import user_db
from auth.utils import get_password_hash

def add_user():
    # Create a new user with your credentials
    user = UserInDB(
        id=str(uuid.uuid4()),
        email="rsuyash123@gmail.com",
        full_name="Suyash Rai",
        role=Role.MEMBER,  # or Role.ADMIN if you want admin access
        status=UserStatus.ACTIVE,
        department="Executive",  # or whatever department you prefer
        year="25-26",  # or current academic year
        hashed_password=get_password_hash("1234ABCD"),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified=True,
        profile_picture=None
    )
    
    # Add the user to the database
    created_user = user_db.create_user(user)
    print(f"User created successfully with ID: {created_user.id}")
    print(f"Email: {created_user.email}")
    print(f"Role: {created_user.role}")
    print(f"Status: {created_user.status}")

if __name__ == "__main__":
    add_user()