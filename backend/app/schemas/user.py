from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: str
    fullname: Optional[str] = None
    species: Optional[str] = "human"
    avatar_config: Optional[dict] = None
    preferences: Optional[dict] = None


class UserCreate(UserBase):
    id: str  # Clerk user ID


class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    species: Optional[str] = None
    avatar_config: Optional[dict] = None
    preferences: Optional[dict] = None


class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True