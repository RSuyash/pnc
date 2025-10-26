"""
Core application dependencies and configurations
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from core.config.settings import settings
from domain.models.member import Role


security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if email is None or user_id is None:
            return None
        return {"email": email, "user_id": user_id}
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Import here to avoid circular imports
    from infrastructure.persistence.user_db import user_db
    
    # Fetch the actual user from the database to get their role and other info
    user_in_db = user_db.get_user_by_email(token_data["email"])
    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in database",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if user_in_db.status.value != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is not active",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Debug logging
    print(f"DEBUG: Authenticated user - Email: '{user_in_db.email}', Role: '{user_in_db.role.value}', Status: '{user_in_db.status.value}'")
    
    # Update last login time
    # In production, you would update this in the database
    # user_db.update_user(user_in_db.id, {"last_login": datetime.utcnow()})
    
    # Return the complete user object with role information
    return {
        "id": user_in_db.id,
        "email": user_in_db.email,
        "full_name": user_in_db.full_name,
        "role": user_in_db.role,
        "status": user_in_db.status,
        "department": user_in_db.department,
        "year": user_in_db.year,
        "created_at": user_in_db.created_at,
        "updated_at": user_in_db.updated_at,
        "email_verified": user_in_db.email_verified
    }


def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    user_role = current_user.get("role")
    if user_role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def require_role(required_role: Role):
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role")
        # If the required role is member, allow any user (or any active user)
        # If the required role is admin, only allow admin users
        if required_role.value == "admin" and user_role.value != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker