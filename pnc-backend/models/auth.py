"""
Authentication and Authorization Models for PNC Backend
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum
from domain.models.member import Role, UserStatus  # Import from domain layer


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Role = Role.MEMBER
    status: UserStatus = UserStatus.PENDING
    department: Optional[str] = None
    year: Optional[str] = None  # e.g., "24-25" or "25-26"


class UserCreate(UserBase):
    password: str
    confirm_password: str
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[Role] = None
    status: Optional[UserStatus] = None
    department: Optional[str] = None
    year: Optional[str] = None
    email: Optional[EmailStr] = None


class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    email_verified: bool = False
    profile_picture: Optional[str] = None


class UserPublic(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    email_verified: bool = False
    profile_picture: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match")


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_new_password: str
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match")


class Permission(BaseModel):
    resource: str
    action: str  # create, read, update, delete
    allowed: bool = True


class RolePermissions(BaseModel):
    role: Role
    permissions: List[Permission]