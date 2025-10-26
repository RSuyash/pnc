"""
Main configuration for PNC Backend
"""
import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application settings
    app_name: str = "PNC Backend API"
    app_version: str = "2.0.0"
    debug: bool = False
    
    # Database settings
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./pnc.db")
    database_pool_size: int = 20
    
    # Security settings
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Notion integration
    notion_token: str = os.getenv("NOTION_TOKEN", "")
    members_database_id: str = os.getenv("MEMBERS_DATABASE_ID", "")
    
    # CORS settings
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "https://prithvi-nature-club.vercel.app"]
    
    # Cache settings
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    # API versions
    api_versions: List[str] = ["v1"]
    
    # Platform-specific settings
    web_max_page_size: int = 50
    mobile_max_page_size: int = 20
    desktop_max_page_size: int = 100
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "allow"  # This will allow extra fields like NOTION_TOKEN
    }


settings = Settings()