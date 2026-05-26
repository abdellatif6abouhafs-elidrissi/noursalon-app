from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


def fmt_user(u: dict) -> UserOut:
    return UserOut(
        id=str(u["_id"]),
        email=u["email"],
        firstName=u["firstName"],
        lastName=u["lastName"],
        role=u["role"],
        salonId=str(u["salonId"]),
        phone=u.get("phone"),
        createdAt=u["createdAt"].isoformat() if isinstance(u["createdAt"], datetime) else u["createdAt"],
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db=Depends(get_db),
):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db=Depends(get_db)):
    # Check email unique
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    now = datetime.now(timezone.utc)

    # Create salon
    salon = {
        "name": data.salonName,
        "phone": data.phone,
        "email": data.email,
        "city": data.city,
        "plan": "free",
        "services": [],
        "workingHours": {
            "0": {"open": "09:00", "close": "20:00", "closed": True},
            "1": {"open": "09:00", "close": "20:00", "closed": False},
            "2": {"open": "09:00", "close": "20:00", "closed": False},
            "3": {"open": "09:00", "close": "20:00", "closed": False},
            "4": {"open": "09:00", "close": "20:00", "closed": False},
            "5": {"open": "09:00", "close": "20:00", "closed": False},
            "6": {"open": "09:00", "close": "20:00", "closed": False},
        },
        "createdAt": now,
    }
    salon_result = await db.salons.insert_one(salon)
    salon_id = salon_result.inserted_id

    # Create user
    user = {
        "email": data.email,
        "firstName": data.firstName,
        "lastName": data.lastName,
        "phone": data.phone,
        "role": data.role,
        "salonId": salon_id,
        "passwordHash": hash_password(data.password),
        "createdAt": now,
    }
    user_result = await db.users.insert_one(user)
    user["_id"] = user_result.inserted_id

    token = create_access_token({"sub": str(user_result.inserted_id)})
    return TokenResponse(access_token=token, user=fmt_user(user))


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db=Depends(get_db)):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["passwordHash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = create_access_token({"sub": str(user["_id"])})
    return TokenResponse(access_token=token, user=fmt_user(user))


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return fmt_user(current_user)
