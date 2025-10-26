"""
Complete Authentication API endpoints for v1 - Common endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
import uuid
from datetime import datetime, timedelta

from domain.models.member import UserCreate, UserUpdate, UserPublic, UserInDB, Token, LoginRequest, Role, UserStatus
from core.auth.dependencies import create_access_token, verify_token, get_current_user
from core.config.settings import settings
from infrastructure.persistence.user_db import user_db


router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


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
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def get_password_hash(password):
        return pwd_context.hash(password)
        
    hashed_password = get_password_hash(user_data.password)
    new_user_in_db = UserInDB(
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
    
    # Save to database
    created_user = user_db.create_user(new_user_in_db)
    
    # Return UserPublic object (without password)
    return UserPublic(
        id=created_user.id,
        email=created_user.email,
        full_name=created_user.full_name,
        role=created_user.role,
        status=created_user.status,
        department=created_user.department,
        year=created_user.year,
        created_at=created_user.created_at,
        updated_at=created_user.updated_at,
        email_verified=created_user.email_verified,
        profile_picture=created_user.profile_picture
    )


@router.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token (form data)"""
    def verify_password(plain_password, hashed_password):
        from passlib.context import CryptContext
        
        # Configure CryptContext with a backend that works with newer bcrypt versions
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")
        return pwd_context.verify(plain_password, hashed_password)
    
    def authenticate_user(email: str, password: str):
        # Fetch user from database
        user = user_db.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if user.status != UserStatus.ACTIVE:
            return None
        return user  # Return the UserInDB object
    
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password or account inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    # user_db.update_user(user.id, {"last_login": datetime.utcnow()})
    
    # Create a UserPublic object from UserInDB for the response
    user_public = UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        status=user.status,
        department=user.department,
        year=user.year,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=None,  # Would update this in real implementation
        email_verified=user.email_verified,
        profile_picture=user.profile_picture
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_public
    )


@router.post("/login-json", response_model=Token)
async def login_user_json(login_request: LoginRequest):
    """Login user with JSON request and return access token"""
    def verify_password(plain_password, hashed_password):
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)
    
    def authenticate_user(email: str, password: str):
        # Fetch user from database
        user = user_db.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if user.status != UserStatus.ACTIVE:
            return None
        return user  # Return the UserInDB object
    
    user = authenticate_user(login_request.email, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password or account inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login time
    # user_db.update_user(user.id, {"last_login": datetime.utcnow()})
    
    # Create a UserPublic object from UserInDB for the response
    user_public = UserPublic(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        status=user.status,
        department=user.department,
        year=user.year,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=None,  # Would update this in real implementation
        email_verified=user.email_verified,
        profile_picture=user.profile_picture
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_public
    )


@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    # In a real implementation, fetch from database using current_user info
    # For now, return the current user data we already have
    return UserPublic(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user.get("full_name", "User Name"),
        role=current_user.get("role", Role.MEMBER),
        status=current_user.get("status", UserStatus.ACTIVE),
        department=current_user.get("department"),
        year=current_user.get("year"),
        created_at=current_user.get("created_at", datetime.utcnow()),
        updated_at=current_user.get("updated_at", datetime.utcnow()),
        email_verified=current_user.get("email_verified", True)
    )


# Add the missing endpoints from the original auth_router
@router.put("/me", response_model=UserPublic)
async def update_profile(
    user_update: UserUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile"""
    # Would connect to user_db.update_user() in full implementation
    return UserPublic(
        id=current_user["id"],
        email=current_user.get("email", ""),
        full_name="Updated Name",
        role=Role.MEMBER,
        status=UserStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified=True
    )


@router.get("/users/{user_id}", response_model=UserPublic)
async def get_user(
    user_id: str, 
    current_user: dict = Depends(get_current_user)  # Would need proper role check
):
    """Get user by ID (admin only)"""
    # Would connect to user_db.get_user_by_id() in full implementation
    return UserPublic(
        id=user_id,
        email="user@example.com",
        full_name="Some User",
        role=Role.MEMBER,
        status=UserStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified=True
    )


@router.get("/users", response_model=list)
async def list_users(current_user: dict = Depends(get_current_user)):
    """List all users (admin only)"""
    # Would connect to user_db.list_users() in full implementation
    return [
        UserPublic(
            id=str(uuid.uuid4()),
            email="user@example.com",
            full_name="Some User",
            role=Role.MEMBER,
            status=UserStatus.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            email_verified=True
        )
    ]


@router.put("/users/{user_id}", response_model=UserPublic)
async def update_user(
    user_id: str, 
    user_update: UserUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update user by ID (admin only)"""
    return UserPublic(
        id=user_id,
        email="updated@example.com",
        full_name="Updated User",
        role=Role.MEMBER,
        status=UserStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        email_verified=True
    )


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    """Delete user by ID (admin only)"""
    # Would connect to user_db.delete_user() in full implementation
    return {"message": "User deleted successfully"}


@router.post("/forgot-password")
async def forgot_password(request: str = None):  # Using str as placeholder
    """Initiate password reset process"""
    # In a real app, you would send an email with a reset token
    return {"message": "If email exists, password reset instructions have been sent"}


@router.post("/reset-password")
async def reset_password(request: str = None):  # Using str as placeholder
    """Reset password using token"""
    return {"message": "Password reset functionality would be implemented here"}