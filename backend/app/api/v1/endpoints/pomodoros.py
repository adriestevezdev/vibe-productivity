from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.pomodoro import PomodoroSession
from app.models.task import Task
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.schemas.pomodoro import PomodoroCreate, PomodoroUpdate, PomodoroResponse, PomodoroStats
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/", response_model=PomodoroResponse)
def create_pomodoro(
    pomodoro: PomodoroCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new pomodoro session."""
    # Verify task ownership if task_id is provided
    if pomodoro.task_id:
        task = db.query(Task).filter(
            Task.id == pomodoro.task_id,
            Task.user_id == current_user.id
        ).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
    
    db_pomodoro = PomodoroSession(
        user_id=current_user.id,
        **pomodoro.dict()
    )
    db.add(db_pomodoro)
    db.commit()
    db.refresh(db_pomodoro)
    return db_pomodoro

@router.get("/", response_model=List[PomodoroResponse])
def get_pomodoros(
    skip: int = 0,
    limit: int = 100,
    task_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all pomodoro sessions for the current user."""
    query = db.query(PomodoroSession).filter(PomodoroSession.user_id == current_user.id)
    
    if task_id:
        query = query.filter(PomodoroSession.task_id == task_id)
    
    pomodoros = query.offset(skip).limit(limit).all()
    return pomodoros

@router.get("/active", response_model=PomodoroResponse)
def get_active_pomodoro(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the currently active pomodoro session."""
    pomodoro = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user.id,
        PomodoroSession.status == "active"
    ).first()
    
    if not pomodoro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active pomodoro session found"
        )
    
    return pomodoro

@router.get("/stats", response_model=PomodoroStats)
def get_pomodoro_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pomodoro statistics for the current user."""
    # Get stats for the last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    pomodoros = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user.id,
        PomodoroSession.created_at >= seven_days_ago,
        PomodoroSession.status == "completed"
    ).all()
    
    total_sessions = len(pomodoros)
    total_duration = sum(p.elapsed_time for p in pomodoros)
    work_sessions = sum(1 for p in pomodoros if p.phase == "work")
    break_sessions = total_sessions - work_sessions
    
    # Calculate daily average
    daily_average = total_sessions / 7 if total_sessions > 0 else 0
    
    return PomodoroStats(
        total_sessions=total_sessions,
        total_duration=total_duration,
        work_sessions=work_sessions,
        break_sessions=break_sessions,
        daily_average=daily_average,
        streak=calculate_streak(current_user.id, db)
    )

@router.get("/{pomodoro_id}", response_model=PomodoroResponse)
def get_pomodoro(
    pomodoro_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific pomodoro session."""
    pomodoro = db.query(PomodoroSession).filter(
        PomodoroSession.id == pomodoro_id,
        PomodoroSession.user_id == current_user.id
    ).first()
    
    if not pomodoro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    
    return pomodoro

@router.patch("/{pomodoro_id}", response_model=PomodoroResponse)
def update_pomodoro(
    pomodoro_id: int,
    pomodoro_update: PomodoroUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a pomodoro session."""
    pomodoro = db.query(PomodoroSession).filter(
        PomodoroSession.id == pomodoro_id,
        PomodoroSession.user_id == current_user.id
    ).first()
    
    if not pomodoro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    
    update_data = pomodoro_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pomodoro, field, value)
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

@router.delete("/{pomodoro_id}")
def delete_pomodoro(
    pomodoro_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a pomodoro session."""
    pomodoro = db.query(PomodoroSession).filter(
        PomodoroSession.id == pomodoro_id,
        PomodoroSession.user_id == current_user.id
    ).first()
    
    if not pomodoro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    
    db.delete(pomodoro)
    db.commit()
    return {"detail": "Pomodoro session deleted successfully"}

def calculate_streak(user_id: str, db: Session) -> int:
    """Calculate the current streak of consecutive days with completed pomodoros."""
    today = datetime.utcnow().date()
    streak = 0
    current_date = today
    
    while True:
        pomodoros = db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id,
            PomodoroSession.status == "completed",
            PomodoroSession.created_at >= datetime.combine(current_date, datetime.min.time()),
            PomodoroSession.created_at < datetime.combine(current_date + timedelta(days=1), datetime.min.time())
        ).first()
        
        if pomodoros:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    return streak