from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database import connect_db, close_db
from app.routers import auth, clients, staff, appointments


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="API NourSalon — Gestion des salons de coiffure au Maroc 🇲🇦",
    lifespan=lifespan,
)

# CORS configuration from settings
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(staff.router)
app.include_router(appointments.router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "khadema ✅",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
