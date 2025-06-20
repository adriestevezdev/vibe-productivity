from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class PomodoroPhase(str, Enum):
    work = "work"
    short_break = "short_break"
    long_break = "long_break"

class PomodoroStatus(str, Enum):
    active = "active"
    paused = "paused"
    completed = "completed"
    cancelled = "cancelled"

class PomodoroBase(BaseModel):
    task_id: Optional[int] = None
    phase: PomodoroPhase = PomodoroPhase.work
    duration: int = Field(default=25, ge=1, le=60, description="Duration in minutes")

class PomodoroCreate(PomodoroBase):
    pass

class PomodoroUpdate(BaseModel):
    status: Optional[PomodoroStatus] = None
    elapsed_time: Optional[int] = None
    phase: Optional[PomodoroPhase] = None

class PomodoroResponse(PomodoroBase):
    id: int
    user_id: str
    status: PomodoroStatus
    elapsed_time: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PomodoroStats(BaseModel):
    total_sessions: int
    total_duration: int  # in minutes
    work_sessions: int
    break_sessions: int
    daily_average: float
    streak: int