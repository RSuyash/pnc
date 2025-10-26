"""
Simple In-Memory Database for User Storage
(In production, use a proper database like PostgreSQL)
"""
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from models.auth import UserInDB, Role, UserStatus, UserBase


class InMemoryUserDB:
    def __init__(self):
        self.users: Dict[str, UserInDB] = {}
        self.email_to_id: Dict[str, str] = {}
        
        # Pre-populate with an admin user for testing
        self._create_initial_admin()
    
    def _create_initial_admin(self):
        """Create an initial admin user"""
        try:
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            admin_user = UserInDB(
                id=str(uuid.uuid4()),
                email="admin@pnclub.org",
                full_name="Admin User",
                role=Role.ADMIN,
                status=UserStatus.ACTIVE,
                department="Executive",
                year="25-26",
                hashed_password=pwd_context.hash("admin123"),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                email_verified=True
            )
            
            self.users[admin_user.id] = admin_user
            self.email_to_id[admin_user.email] = admin_user.id
            
            # Add Suyash Rahegaonkar as admin and treasurer from the team.ts data
            suyash_user = UserInDB(
                id=str(uuid.uuid4()),
                email="1332250296@mitwpu.edu.in",  # From team.ts file
                full_name="Suyash Rahegaonkar",
                role=Role.ADMIN,
                status=UserStatus.ACTIVE,
                department="Executive",
                year="25-26",
                hashed_password=pwd_context.hash("1234ABCD"),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                email_verified=True
            )
            
            self.users[suyash_user.id] = suyash_user
            self.email_to_id[suyash_user.email] = suyash_user.id
        except ImportError:
            # If passlib is not available, create user with plain text password (not secure)
            admin_user = UserInDB(
                id=str(uuid.uuid4()),
                email="admin@pnclub.org",
                full_name="Admin User",
                role=Role.ADMIN,
                status=UserStatus.ACTIVE,
                department="Executive",
                year="25-26",
                hashed_password="admin123",  # This is insecure, just for testing purposes
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                email_verified=True
            )
            
            self.users[admin_user.id] = admin_user
            self.email_to_id[admin_user.email] = admin_user.id
            
            # Add Suyash Rahegaonkar as admin and treasurer from the team.ts data with plain text password (not secure)
            suyash_user = UserInDB(
                id=str(uuid.uuid4()),
                email="1332250296@mitwpu.edu.in",  # From team.ts file
                full_name="Suyash Rahegaonkar",
                role=Role.ADMIN,
                status=UserStatus.ACTIVE,
                department="Executive",
                year="25-26",
                hashed_password="1234ABCD",  # Plain text (insecure)
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                email_verified=True
            )
            
            self.users[suyash_user.id] = suyash_user
            self.email_to_id[suyash_user.email] = suyash_user.id
    
    def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        return self.users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        user_id = self.email_to_id.get(email)
        if user_id:
            return self.users.get(user_id)
        return None
    
    def create_user(self, user: UserInDB) -> UserInDB:
        self.users[user.id] = user
        self.email_to_id[user.email] = user.id
        return user
    
    def update_user(self, user_id: str, user_data: dict) -> Optional[UserInDB]:
        if user_id not in self.users:
            return None
        
        user = self.users[user_id]
        update_data = {k: v for k, v in user_data.items() if v is not None}
        
        # Update user fields
        for field, value in update_data.items():
            if hasattr(user, field):
                setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        self.users[user_id] = user
        return user
    
    def delete_user(self, user_id: str) -> bool:
        if user_id in self.users:
            user = self.users[user_id]
            if user.email in self.email_to_id:
                del self.email_to_id[user.email]
            del self.users[user_id]
            return True
        return False
    
    def list_users(self, role: Optional[Role] = None, status: Optional[UserStatus] = None) -> List[UserInDB]:
        users = list(self.users.values())
        
        if role:
            users = [u for u in users if u.role == role]
        if status:
            users = [u for u in users if u.status == status]
            
        return users


# Global instance
user_db = InMemoryUserDB()