from sqlalchemy import Column, String, DateTime, Integer, Boolean, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from typing import Optional
from datetime import datetime

from app.db.database import Base


class Achievement(Base):
    __tablename__ = "achievements"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    icon: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    points: Mapped[int] = mapped_column(Integer, default=10)
    
    # Visual unlock
    unlocks_block_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    unlocks_decoration: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    unlocks_effect: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    achievement_id: Mapped[int] = mapped_column(Integer, ForeignKey("achievements.id"))
    
    unlocked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", backref="achievements")
    achievement: Mapped["Achievement"] = relationship("Achievement", backref="users")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'achievement_id', name='_user_achievement_uc'),
    )