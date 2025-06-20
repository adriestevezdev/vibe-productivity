from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from typing import Optional
from datetime import datetime
import enum

from app.db.database import Base


class PomodoroPhase(str, enum.Enum):
    WORK = "work"
    SHORT_BREAK = "short_break"
    LONG_BREAK = "long_break"


class PomodoroStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    task_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("tasks.id"), nullable=True)
    
    phase: Mapped[PomodoroPhase] = mapped_column(
        SQLEnum(PomodoroPhase), 
        default=PomodoroPhase.WORK
    )
    status: Mapped[PomodoroStatus] = mapped_column(
        SQLEnum(PomodoroStatus), 
        default=PomodoroStatus.ACTIVE
    )
    
    duration_minutes: Mapped[int] = mapped_column(Integer, default=25)
    elapsed_seconds: Mapped[int] = mapped_column(Integer, default=0)
    
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    paused_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", backref="pomodoro_sessions")
    task: Mapped[Optional["Task"]] = relationship("Task", backref="pomodoro_sessions")