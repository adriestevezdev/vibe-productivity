from fastapi import APIRouter

from app.api.v1 import tasks, users
from app.api.v1.endpoints import pomodoros, achievements, spaces

api_router = APIRouter()

api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(pomodoros.router, prefix="/pomodoros", tags=["pomodoros"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
api_router.include_router(spaces.router, prefix="/spaces", tags=["spaces"])