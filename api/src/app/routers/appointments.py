from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from app.database import get_db
from app.routers.auth import get_current_user
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentStatusUpdate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["appointments"])


def time_to_min(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def min_to_time(m: int) -> str:
    return f"{m // 60:02d}:{m % 60:02d}"


def fmt(a: dict) -> dict:
    return {
        "id": str(a["_id"]),
        "salonId": str(a["salonId"]),
        "clientId": str(a["clientId"]),
        "client": a.get("client", {}),
        "staffId": str(a["staffId"]),
        "staff": a.get("staff", {}),
        "serviceId": str(a.get("serviceId", "")),
        "service": a.get("service", {}),
        "date": a["date"],
        "startTime": a["startTime"],
        "endTime": a.get("endTime", ""),
        "status": a.get("status", "confirmed"),
        "notes": a.get("notes"),
        "price": a.get("price", 0),
        "createdAt": a["createdAt"].isoformat() if isinstance(a["createdAt"], datetime) else a["createdAt"],
    }


@router.get("")
async def list_appointments(
    date: str = Query(None),
    staffId: str = Query(None),
    status: str = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(50),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = {"salonId": current_user["salonId"]}
    if date:
        query["date"] = date
    if staffId:
        query["staffId"] = ObjectId(staffId)
    if status:
        query["status"] = status
    total = await db.appointments.count_documents(query)
    appts = await db.appointments.find(query).sort("startTime", 1).skip((page - 1) * size).limit(size).to_list(size)
    return {"items": [fmt(a) for a in appts], "total": total, "page": page, "size": size}


@router.get("/range")
async def get_by_range(
    start: str = Query(...),
    end: str = Query(...),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    appts = await db.appointments.find({
        "salonId": current_user["salonId"],
        "date": {"$gte": start, "$lte": end},
    }).sort([("date", 1), ("startTime", 1)]).to_list(500)
    return [fmt(a) for a in appts]


@router.get("/slots")
async def get_slots(
    date: str = Query(...),
    staffId: str = Query(...),
    serviceId: str = Query(...),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Get service duration
    salon = await db.salons.find_one({"_id": current_user["salonId"]})
    service = next((s for s in (salon or {}).get("services", []) if str(s.get("id", "")) == serviceId), None)
    duration = service["duration"] if service else 60

    # Get existing appointments for that staff/date
    existing = await db.appointments.find({
        "salonId": current_user["salonId"],
        "staffId": ObjectId(staffId),
        "date": date,
        "status": {"$nin": ["cancelled", "no_show"]},
    }).to_list(100)

    taken_ranges = [(time_to_min(a["startTime"]), time_to_min(a["endTime"])) for a in existing if a.get("endTime")]

    # Generate slots 9:00 → 19:00 every 30 min
    slots = []
    start_min = 9 * 60
    end_min = 19 * 60
    current = start_min
    while current + duration <= end_min:
        slot_end = current + duration
        conflict = any(not (slot_end <= s or current >= e) for s, e in taken_ranges)
        if not conflict:
            slots.append(min_to_time(current))
        current += 30

    return slots


@router.post("", status_code=201)
async def create_appointment(data: AppointmentCreate, db=Depends(get_db), current_user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)

    # Get client info
    client = await db.clients.find_one({"_id": ObjectId(data.clientId)})
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")

    # Get staff info
    staff = await db.staff.find_one({"_id": ObjectId(data.staffId)})
    if not staff:
        raise HTTPException(status_code=404, detail="Coiffeur introuvable")

    # Get service + calculate endTime
    salon = await db.salons.find_one({"_id": current_user["salonId"]})
    service = next((s for s in (salon or {}).get("services", []) if str(s.get("id", "")) == data.serviceId), None)
    duration = service["duration"] if service else 60
    end_min = time_to_min(data.startTime) + duration
    end_time = min_to_time(end_min)

    appt = {
        "salonId": current_user["salonId"],
        "clientId": ObjectId(data.clientId),
        "client": {"id": str(client["_id"]), "firstName": client["firstName"], "lastName": client["lastName"], "phone": client["phone"]},
        "staffId": ObjectId(data.staffId),
        "staff": {"id": str(staff["_id"]), "firstName": staff["firstName"], "lastName": staff["lastName"], "color": staff.get("color", "#1D9E75")},
        "serviceId": data.serviceId,
        "service": service or {"name": "Service", "duration": duration, "price": data.price or 0},
        "date": data.date,
        "startTime": data.startTime,
        "endTime": end_time,
        "status": "confirmed",
        "notes": data.notes,
        "price": data.price or (service["price"] if service else 0),
        "createdAt": now,
    }
    result = await db.appointments.insert_one(appt)
    appt["_id"] = result.inserted_id

    # Update client stats
    await db.clients.update_one(
        {"_id": ObjectId(data.clientId)},
        {"$inc": {"totalVisits": 1, "totalSpent": appt["price"]}, "$set": {"lastVisit": data.date}},
    )
    return fmt(appt)


@router.patch("/{appt_id}/status")
async def update_status(appt_id: str, data: AppointmentStatusUpdate, db=Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.appointments.find_one_and_update(
        {"_id": ObjectId(appt_id), "salonId": current_user["salonId"]},
        {"$set": {"status": data.status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Rendez-vous introuvable")
    return fmt(result)


@router.delete("/{appt_id}", status_code=204)
async def delete_appointment(appt_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    await db.appointments.update_one(
        {"_id": ObjectId(appt_id), "salonId": current_user["salonId"]},
        {"$set": {"status": "cancelled"}},
    )
