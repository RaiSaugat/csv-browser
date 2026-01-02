from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import auth, csv, users, websocket
from app.database.connection import engine
from app.database.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CSV Browser API",
    description="Real-Time CSV Browser with Role-Based Access Control",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(csv.router, prefix="/api/v1/csv", tags=["CSV Management"])
app.include_router(users.router, prefix="/api/v1/users", tags=["User Management"])
app.include_router(websocket.router, prefix="/api/v1", tags=["WebSocket"])


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "CSV Browser API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
