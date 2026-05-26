from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db
from app.routers.auth import get_current_user
from app.schemas.client import ClientCreate, ClientUpdate, ClientOut

router = APIRouter(prefix="/clients", tags=["clients"])


def fmt(c: dict) -> ClientOut:
    return ClientOut(
        id=str(c["_id"]),
        salonId=str(c["salonId"]),
        firstName=c["firstName"],
        lastName=c["lastName"],
        phone=c["phone"],
        email=c.get("email"),
        city=c.get("city"),
        notes=c.get("notes"),
        totalVisits=c.get("totalVisits", 0),
        totalSpent=c.get("totalSpent", 0),
        lastVisit=c["lastVisit"].isoformat() if isinstance(c.get("lastVisit"), datetime) else c.get("lastVisit"),
        createdAt=c["createdAt"].isoformat() if isinstance(c["createdAt"], datetime) else c["createdAt"],
    )


@router.get("")
async def list_clients(
    search: str = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    salon_id = current_user["salonId"]
    query = {"salonId": salon_id}
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
        ]
    total = await db.clients.count_documents(query)
    clients = await db.clients.find(query).skip((page - 1) * size).limit(size).to_list(size)
    return {
        "items": [fmt(c) for c in clients],
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size,
    }


@router.get("/{client_id}", response_model=ClientOut)
async def get_client(client_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    c = await db.clients.find_one({"_id": ObjectId(client_id), "salonId": current_user["salonId"]})
    if not c:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return fmt(c)


@router.post("", response_model=ClientOut, status_code=201)
async def create_client(data: ClientCreate, db=Depends(get_db), current_user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    client = {**data.model_dump(), "salonId": current_user["salonId"], "totalVisits": 0, "totalSpent": 0, "createdAt": now}
    result = await db.clients.insert_one(client)
    client["_id"] = result.inserted_id
    return fmt(client)


@router.patch("/{client_id}", response_model=ClientOut)
async def update_client(client_id: str, data: ClientUpdate, db=Depends(get_db), current_user=Depends(get_current_user)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    result = await db.clients.find_one_and_update(
        {"_id": ObjectId(client_id), "salonId": current_user["salonId"]},
        {"$set": update},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return fmt(result)


@router.delete("/{client_id}", status_code=204)
async def delete_client(client_id: str, db=Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.clients.delete_one({"_id": ObjectId(client_id), "salonId": current_user["salonId"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client introuvable")
