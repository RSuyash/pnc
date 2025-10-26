"""
Simple in-memory user database for PNC Backend
In production, this would connect to a real database like PostgreSQL
"""
from typing import Dict, List, Optional
from domain.models.member import UserPublic, UserInDB, Role, UserStatus
import uuid
from datetime import datetime


class UserDatabase:
    def __init__(self):
        # In-memory storage - in production, use a real database
        self.users: Dict[str, UserInDB] = {}
        # Email to user_id mapping for quick lookup
        self.email_to_id: Dict[str, str] = {}
    
    def create_user(self, user: UserInDB) -> UserInDB:
        """Create a new user in the database"""
        self.users[user.id] = user
        self.email_to_id[user.email] = user.id
        return user
    
    def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Get a user by their ID"""
        return self.users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get a user by their email"""
        user_id = self.email_to_id.get(email.lower())
        if user_id:
            return self.users.get(user_id)
        return None
    
    def update_user(self, user_id: str, update_data: dict) -> Optional[UserInDB]:
        """Update a user's information"""
        user = self.users.get(user_id)
        if not user:
            return None
        
        # Create a new user object with updated data
        user_dict = user.dict()
        user_dict.update(update_data)
        updated_user = UserInDB(**user_dict)
        
        self.users[user_id] = updated_user
        
        # Update email mapping if email changed
        if "email" in update_data:
            old_email = self.email_to_id.get(user.email)
            if old_email:
                del self.email_to_id[user.email]
            self.email_to_id[updated_user.email] = updated_user.id
        
        return updated_user
    
    def delete_user(self, user_id: str) -> bool:
        """Delete a user from the database"""
        user = self.users.get(user_id)
        if not user:
            return False
        
        del self.users[user_id]
        if user.email in self.email_to_id:
            del self.email_to_id[user.email]
        
        return True
    
    def list_users(self) -> List[UserInDB]:
        """List all users in the database"""
        return list(self.users.values())


# Create a singleton instance
user_db = UserDatabase()

# Add default users for testing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# Add the actual admin user with the credentials mentioned on the login page
admin_user = UserInDB(
    id=str(uuid.uuid4()),
    email="1332250296@mitwpu.edu.in",  # The actual admin email from the login page
    full_name="Suyash Rahegaonkar",  # Using a name for the admin user
    role=Role.ADMIN,
    status=UserStatus.ACTIVE,
    department="Executive",
    year="25-26",
    hashed_password=get_password_hash("1234ABCD"),  # Hashed password from login page
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow(),
    email_verified=True
)

user_db.create_user(admin_user)

# Debug: Print all users for verification
print("=== USER DATABASE DEBUG ===")
for user in user_db.list_users():
    print(f"User: {user.email} (ID: {user.id}) - Role: {user.role.value} - Status: {user.status.value}")
print("=== END USER DATABASE DEBUG ===")

# Add a default admin user as backup
default_admin = UserInDB(
    id=str(uuid.uuid4()),
    email="admin@prithvinatureclub.org",
    full_name="Admin User",
    role=Role.ADMIN,
    status=UserStatus.ACTIVE,
    department="Admin",
    year="25-26",
    hashed_password=get_password_hash("admin123"),
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow(),
    email_verified=True
)

user_db.create_user(default_admin)