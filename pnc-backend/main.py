from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers from the new architecture
from api.v1.common.dashboard_router import router as dashboard_router
from api.v1.common.notion_router import router as notion_router
from api.v1.common.auth_router import router as auth_router  # We'll create this
from core.config.settings import settings

app = FastAPI(
    title=settings.app_name,
    description="Backend API for PNC organization with Notion integration - Multi-platform ready",
    version=settings.app_version
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with backward compatibility for existing frontend
app.include_router(auth_router, prefix="/api", tags=["authentication"])  # For existing frontend
app.include_router(auth_router, prefix="/api/v1", tags=["authentication"])  # For new architecture
app.include_router(dashboard_router, prefix="/api", tags=["dashboard"])  # For existing frontend
app.include_router(dashboard_router, prefix="/api/v1", tags=["dashboard"])  # For new architecture
app.include_router(notion_router, prefix="/api", tags=["notion"])  # For existing frontend
app.include_router(notion_router, prefix="/api/v1", tags=["notion"])  # For new architecture

# Future: Include platform-specific routers
# app.include_router(web_router, prefix="/api/v1/web", tags=["web-platform"])
# app.include_router(mobile_router, prefix="/api/v1/mobile", tags=["mobile-platform"])
# app.include_router(desktop_router, prefix="/api/v1/desktop", tags=["desktop-platform"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to PNC Backend API v2.0", 
        "status": "running",
        "version": settings.app_version,
        "platform_support": ["web", "mobile", "desktop"]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok", 
        "service": "pnc-backend-v2",
        "timestamp": __import__('datetime').datetime.utcnow().isoformat()
    }

@app.get("/api/v1/health")
def v1_health_check():
    return {"status": "ok", "version": "v1", "service": "pnc-backend"}