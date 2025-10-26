"""
Role-based Access Control middleware for PNC Backend
"""
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.auth import UserPublic, Role
from auth.utils import verify_token
from db import user_db
from typing import Callable, Optional


class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: UserPublic) -> bool:
        if user.role in self.allowed_roles or Role.ADMIN in self.allowed_roles:
            return True
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation not permitted, requires one of roles: {self.allowed_roles}"
        )


def get_current_user_from_token(token: str) -> Optional[UserPublic]:
    """Helper function to get user from token"""
    token_data = verify_token(token)
    if token_data is None:
        return None
    
    # Try to get user by email or user_id
    user = None
    if token_data.email:
        user = user_db.get_user_by_email(token_data.email)
    elif token_data.user_id:
        user = user_db.get_user_by_id(token_data.user_id)
    
    return user


def require_roles(*roles: Role):
    """Decorator to require specific roles for endpoints"""
    def role_checker(token: str) -> UserPublic:
        user = get_current_user_from_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        # Admin can access any role-protected endpoint
        if user.role == Role.ADMIN or user.role in roles:
            return user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Requires one of: {roles}"
        )
    
    return role_checker


# Common role checkers
require_admin = require_roles(Role.ADMIN)
require_moderator = require_roles(Role.ADMIN, Role.MODERATOR)
require_member = require_roles(Role.ADMIN, Role.MODERATOR, Role.MEMBER)