from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.schemas.auth import UserRole


class StaffCreate(BaseModel):
    firstName: str
    lastName: str
    phone: str
    email: Optional[EmailStr] = None
    color: str = "#1D9E75"
    specialties: List[str] = []
    workingDays: List[int] = [1, 2, 3, 4, 5, 6]


class StaffUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    color: Optional[str] = None
    specialties: Optional[List[str]] = None
    workingDays: Optional[List[int]] = None
    active: Optional[bool] = None


class StaffOut(BaseModel):
    id: str
    salonId: str
    firstName: str
    lastName: str
    phone: str
    email: Optional[str] = None
    role: UserRole = UserRole.stylist
    color: str
    specialties: List[str] = []
    workingDays: List[int] = []
    active: bool = True
    appointmentsCount: Optional[int] = None
    createdAt: str
