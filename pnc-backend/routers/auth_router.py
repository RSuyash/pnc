"""
Authentication Router for PNC Backend API
Handles user registration, login, password management, and profile management
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
import uuid
from datetime import datetime, timedelta
from models.auth import (
    UserCreate, UserUpdate, UserPublic, Token, LoginRequest,
    ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest,
    Role
)
from auth.utils import (
    verify_password, get_password_hash, create_access_token,
    verify_token, authenticate_user
)
from db import user_db

router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Import authentication dependencies
from auth.dependencies import get_current_user, get_current_active_user, require_role


@router.post("/register", response_model=UserPublic)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = user_db.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = UserPublic(
        id=str(uuid.uuid4()),
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        status=user_data.status,
        department=user_data.department,
        year=user_data.year,
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified=False  # In a real app, you'd send verification email
    )
    
    # Add user to database
    created_user = user_db.create_user(new_user)
    
    # Return public version (without password)
    public_user = UserPublic(
        id=created_user.id,
        email=created_user.email,
        full_name=created_user.full_name,
        role=created_user.role,
        status=created_user.status,
        department=created_user.department,
        year=created_user.year,
        created_at=created_user.created_at,
        updated_at=created_user.updated_at,
        last_login=created_user.last_login,
        email_verified=created_user.email_verified,
        profile_picture=created_user.profile_picture
    )
    
    return public_user


@router.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token (form data)"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password or account inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    user_db.update_user(user.id, {"last_login": datetime.utcnow()})
    
    # Create access token
    access_token_expires = timedelta(minutes=30)  # Configurable
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            status=user.status,
            department=user.department,
            year=user.year,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture
        )
    )


@router.post("/login-json", response_model=Token)
async def login_user_json(login_request: LoginRequest):
    """Login user with JSON request and return access token"""
    user = authenticate_user(login_request.email, login_request.password)
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password or account inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    user_db.update_user(user.id, {"last_login": datetime.utcnow()})
    
    # Create access token
    access_token_expires = timedelta(minutes=30)  # Configurable
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            status=user.status,
            department=user.department,
            year=user.year,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture
        )
    )


@router.post("/login-extended", response_model=Token)
async def login_user_extended(login_request: LoginRequest):
    """Extended login with additional options"""
    user = authenticate_user(login_request.email, login_request.password)
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password or account inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    user_db.update_user(user.id, {"last_login": datetime.utcnow()})
    
    # Set token expiration based on remember_me
    if login_request.remember_me:
        access_token_expires = timedelta(days=7)  # Longer token for "remember me"
    else:
        access_token_expires = timedelta(minutes=30)
    
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            status=user.status,
            department=user.department,
            year=user.year,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture
        )
    )


@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: UserPublic = Depends(get_current_active_user)):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserPublic)
async def update_profile(user_update: UserUpdate, current_user: UserPublic = Depends(get_current_active_user)):
    """Update current user's profile"""
    update_data = user_update.dict(exclude_unset=True)
    updated_user = user_db.update_user(current_user.id, update_data)
    
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserPublic(
        id=updated_user.id,
        email=updated_user.email,
        full_name=updated_user.full_name,
        role=updated_user.role,
        status=updated_user.status,
        department=updated_user.department,
        year=updated_user.year,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at,
        last_login=updated_user.last_login,
        email_verified=updated_user.email_verified,
        profile_picture=updated_user.profile_picture
    )


@router.put("/me/change-password")
async def change_password(password_request: ChangePasswordRequest, current_user: UserPublic = Depends(get_current_active_user)):
    """Change current user's password"""
    if not verify_password(password_request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    new_hashed_password = get_password_hash(password_request.new_password)
    user_db.update_user(current_user.id, {"hashed_password": new_hashed_password})
    
    return {"message": "Password changed successfully"}


@router.get("/users/{user_id}", response_model=UserPublic)
async def get_user(user_id: str, current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """Get user by ID (admin only)"""
    user = user_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        status=user.status,
        department=user.department,
        year=user.year,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=user.last_login,
        email_verified=user.email_verified,
        profile_picture=user.profile_picture
    )


@router.get("/users", response_model=list)
async def list_users(current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """List all users (admin only)"""
    users = user_db.list_users()
    return [
        UserPublic(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            status=user.status,
            department=user.department,
            year=user.year,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture
        )
        for user in users
    ]


@router.put("/users/{user_id}", response_model=UserPublic)
async def update_user(user_id: str, user_update: UserUpdate, current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """Update user by ID (admin only)"""
    update_data = user_update.dict(exclude_unset=True)
    
    # Don't allow updating password through this endpoint
    if "password" in update_data:
        del update_data["password"]
    
    updated_user = user_db.update_user(user_id, update_data)
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserPublic(
        id=updated_user.id,
        email=updated_user.email,
        full_name=updated_user.full_name,
        role=updated_user.role,
        status=updated_user.status,
        department=updated_user.department,
        year=updated_user.year,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at,
        last_login=updated_user.last_login,
        email_verified=updated_user.email_verified,
        profile_picture=updated_user.profile_picture
    )


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """Delete user by ID (admin only)"""
    success = user_db.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Initiate password reset process"""
    # In a real app, you would send an email with a reset token
    # For now, just acknowledge the request
    user = user_db.get_user_by_email(request.email)
    if user:  # Only send response if user exists, but don't reveal if email exists
        return {"message": "If email exists, password reset instructions have been sent"}
    else:
        return {"message": "If email exists, password reset instructions have been sent"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    # In a real app, you would verify the token and reset the password
    # For now, this is a placeholder
    return {"message": "Password reset functionality would be implemented here"}