"""
Test script to verify user authentication
"""
import sys
import os

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import user_db
from auth.utils import authenticate_user

def test_auth():
    print("Testing authentication...")
    print("Email: rsuyash123@gmail.com")
    print("Password: 1234ABCD")
    
    result = authenticate_user("rsuyash123@gmail.com", "1234ABCD")
    print(f"Authentication result: {result}")
    
    # Also check if the user exists in the database
    user = user_db.get_user_by_email("rsuyash123@gmail.com")
    print(f"User found in DB: {user is not None}")
    if user:
        print(f"User email: {user.email}")
        print(f"User status: {user.status}")
        print(f"User role: {user.role}")
        print(f"User ID: {user.id}")

if __name__ == "__main__":
    test_auth()