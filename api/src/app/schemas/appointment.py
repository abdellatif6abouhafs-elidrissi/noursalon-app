from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime


class AppointmentStatus(str, Enum):
    confirmed = "confirmed"
    pending = "pending"
    done = "done"
    cancelled = "cancelled"
    no_show = "no_show"


class AppointmentCreate(BaseModel):
    clientId: str
    staffId: str
    serviceId: str
    date: str        # "2026-04-24"
    startTime: str   # "09:00"
    notes: Optional[str] = None
    price: Optional[float] = None


class AppointmentUpdate(BaseModel):
    clientId: Optional[str] = None
    staffId: Optional[str] = None
    serviceId: Optional[str] = None
    date: Optional[str] = None
    startTime: Optional[str] = None
    notes: Optional[str] = None
    price: Optional[float] = None


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class AppointmentOut(BaseModel):
    id: str
    salonId: str
    clientId: str
    client: dict
    staffId: str
    staff: dict
    serviceId: str
    service: dict
    date: str
    startTime: str
    endTime: str
    status: AppointmentStatus
    notes: Optional[str] = None
    price: float
    createdAt: str
