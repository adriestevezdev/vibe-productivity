from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any, List

class SpaceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    world_theme: str = "default"
    is_active: bool = False

class SpaceCreate(SpaceBase):
    pass

class SpaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    world_theme: Optional[str] = None
    is_active: Optional[bool] = None
    islands_layout: Optional[Dict[str, Any]] = None
    camera_settings: Optional[Dict[str, Any]] = None
    lighting_config: Optional[Dict[str, Any]] = None
    unlocked_blocks: Optional[List[str]] = None
    unlocked_decorations: Optional[List[str]] = None
    unlocked_effects: Optional[List[str]] = None

class SpaceResponse(SpaceBase):
    id: int
    user_id: str
    islands_layout: Optional[Dict[str, Any]] = None
    camera_settings: Optional[Dict[str, Any]] = None
    lighting_config: Optional[Dict[str, Any]] = None
    unlocked_blocks: List[str] = []
    unlocked_decorations: List[str] = []
    unlocked_effects: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True