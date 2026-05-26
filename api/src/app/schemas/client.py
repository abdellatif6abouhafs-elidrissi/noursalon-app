from pydantic import BaseModel, EmailStr
from typing import Optional


class ClientCreate(BaseModel):
    firstName: str
    lastName: str
    phone: str
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    notes: Optional[str] = None


class ClientUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    notes: Optional[str] = None


class ClientOut(BaseModel):
    id: str
    salonId: str
    firstName: str
    lastName: str
    phone: str
    email: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None
    totalVisits: int = 0
    totalSpent: float = 0
    lastVisit: Optional[str] = None
    createdAt: str
