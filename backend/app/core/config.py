from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_SECRET_KEY: str
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    PROJECT_NAME: str = "Vibe Productivity"
    API_V1_STR: str = "/api/v1"
    
    class Config:
        env_file = ".env"


settings = Settings()