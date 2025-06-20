# Import all models to ensure they're registered with SQLAlchemy
from app.db.database import Base
from app.models.user import User
from app.models.task import Task
from app.models.pomodoro import PomodoroSession
from app.models.achievement import Achievement, UserAchievement
from app.models.space import SpaceConfiguration

# This ensures all models are imported and registered with SQLAlchemy
__all__ = ["Base", "User", "Task", "PomodoroSession", "Achievement", "UserAchievement", "SpaceConfiguration"]