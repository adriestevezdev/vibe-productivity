from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from typing import Optional
from datetime import datetime

from app.db.database import Base


class SpaceConfiguration(Base):
    __tablename__ = "space_configurations"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), unique=True)
    
    # World configuration
    world_theme: Mapped[str] = mapped_column(String, default="default")
    islands_layout: Mapped[dict] = mapped_column(JSON, default=lambda: {
        "work": {"x": 0, "y": 0, "z": 0},
        "completed": {"x": 10, "y": 0, "z": 0},
        "goals": {"x": -10, "y": 0, "z": 0}
    })
    
    # Camera settings
    camera_position: Mapped[dict] = mapped_column(JSON, default=lambda: {"x": 5, "y": 10, "z": 5})
    camera_rotation: Mapped[dict] = mapped_column(JSON, default=lambda: {"x": 0, "y": 0, "z": 0})
    camera_zoom: Mapped[float] = mapped_column(JSON, default=1.0)
    
    # Visual preferences
    lighting_config: Mapped[dict] = mapped_column(JSON, default=lambda: {
        "ambient": 0.6,
        "directional": 0.4,
        "color": "#ffffff"
    })
    
    # Unlocked content
    unlocked_blocks: Mapped[list] = mapped_column(JSON, default=list)
    unlocked_decorations: Mapped[list] = mapped_column(JSON, default=list)
    unlocked_effects: Mapped[list] = mapped_column(JSON, default=list)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", backref="space_configuration", uselist=False)