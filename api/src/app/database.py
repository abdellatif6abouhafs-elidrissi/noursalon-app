from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.salons.create_index("ownerId")
    await db.appointments.create_index([("salonId", 1), ("date", 1)])
    await db.clients.create_index([("salonId", 1), ("phone", 1)])
    await db.staff.create_index("salonId")
    print(f"✅ MongoDB connected: {settings.DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB disconnected")


def get_db():
    return db
