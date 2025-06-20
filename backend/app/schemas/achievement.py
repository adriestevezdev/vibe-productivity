from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class AchievementBase(BaseModel):
    code: str
    name: str
    description: str
    icon: Optional[str] = None
    points: int = 0
    category: Optional[str] = None

class AchievementResponse(AchievementBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserAchievementResponse(BaseModel):
    id: int
    user_id: str
    achievement_id: int
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None
    progress: int = 0
    achievement: AchievementResponse
    
    class Config:
        from_attributes = True

class UnlockAchievement(BaseModel):
    achievement_code: str

class VisualUnlock(BaseModel):
    unlock_type: str  # "block_type", "decoration", "effect"
    unlock_value: str  # The specific unlock identifier