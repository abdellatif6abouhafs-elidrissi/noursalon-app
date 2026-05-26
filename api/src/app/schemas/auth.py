from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    owner = "owner"
    manager = "manager"
    stylist = "stylist"


class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    salonName: str
    phone: str
    email: EmailStr
    password: str
    city: str
    role: UserRole = UserRole.owner


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    role: UserRole
    salonId: str
    phone: Optional[str] = None
    createdAt: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
