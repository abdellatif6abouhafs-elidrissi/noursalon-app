from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db
from app.routers.auth import get_current_user
from app.schemas.staff import StaffCreate, StaffUpdate, StaffOut

router = APIRouter(prefix="/staff", tags=["staff"])


def fmt(s: dict) -> StaffOut:
    return StaffOut(
        id=str(s["_id"]),
        salonId=str(s["salonId"]),
        firstName=s["firstName"],
        lastName=s["lastName"],
        phone=s["phone"],
        email=s.get("email"),
        role=s.get("role", "stylist"),
        color=s.get("color", "#1D9E75"),
        specialties=s.get("specialties", []),
        workingDays=s.get("workingDays", []),
        active=s.get("active", True),
        createdAt=s["createdAt"].isoformat() if isinstance(s["createdAt"], datetime) else s["createdAt"],
    )


@router.get("")
async def list_staff(db=Depends(get_db), current_user=Depends(get_current_user)):
    staff = await db.staff.find({"salonId": current_user["salonId"], "active": True}).to_list(100)
    return [fmt(s) for s in staff]


@router.get("/{staff_id}", response_model=StaffOut)
async def get_staff(staff_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    s = await db.staff.find_one({"_id": ObjectId(staff_id), "salonId": current_user["salonId"]})
    if not s:
        raise HTTPException(status_code=404, detail="Coiffeur introuvable")
    return fmt(s)


@router.post("", response_model=StaffOut, status_code=201)
async def create_staff(data: StaffCreate, db=Depends(get_db), current_user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    staff = {**data.model_dump(), "salonId": current_user["salonId"], "role": "stylist", "active": True, "createdAt": now}
    result = await db.staff.insert_one(staff)
    staff["_id"] = result.inserted_id
    return fmt(staff)


@router.patch("/{staff_id}", response_model=StaffOut)
async def update_staff(staff_id: str, data: StaffUpdate, db=Depends(get_db), current_user=Depends(get_current_user)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await db.staff.find_one_and_update(
        {"_id": ObjectId(staff_id), "salonId": current_user["salonId"]},
        {"$set": update},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Coiffeur introuvable")
    return fmt(result)


@router.delete("/{staff_id}", status_code=204)
async def delete_staff(staff_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    await db.staff.update_one(
        {"_id": ObjectId(staff_id), "salonId": current_user["salonId"]},
        {"$set": {"active": False}},
    )
