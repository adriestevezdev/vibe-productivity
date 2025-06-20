from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.achievement import Achievement, UserAchievement
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.schemas.achievement import AchievementResponse, UserAchievementResponse, UnlockAchievement
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[AchievementResponse])
def get_all_achievements(
    db: Session = Depends(get_db)
):
    """Get all available achievements."""
    achievements = db.query(Achievement).all()
    return achievements

@router.get("/user", response_model=List[UserAchievementResponse])
def get_user_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all achievements for the current user."""
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    return user_achievements

@router.get("/user/unlocked", response_model=List[UserAchievementResponse])
def get_unlocked_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all unlocked achievements for the current user."""
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.unlocked == True
    ).all()
    return user_achievements

@router.get("/user/progress", response_model=List[UserAchievementResponse])
def get_achievements_in_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all achievements in progress for the current user."""
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.unlocked == False,
        UserAchievement.progress > 0
    ).all()
    return user_achievements

@router.post("/unlock", response_model=UserAchievementResponse)
def unlock_achievement(
    unlock_data: UnlockAchievement,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlock an achievement for the current user."""
    # Check if achievement exists
    achievement = db.query(Achievement).filter(
        Achievement.code == unlock_data.achievement_code
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    # Check if user already has this achievement
    existing = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement.id
    ).first()
    
    if existing:
        if existing.unlocked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Achievement already unlocked"
            )
        # Update existing achievement
        existing.unlocked = True
        existing.unlocked_at = datetime.utcnow()
        existing.progress = 100
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new user achievement
        user_achievement = UserAchievement(
            user_id=current_user.id,
            achievement_id=achievement.id,
            unlocked=True,
            unlocked_at=datetime.utcnow(),
            progress=100
        )
        db.add(user_achievement)
        db.commit()
        db.refresh(user_achievement)
        return user_achievement

@router.patch("/progress/{achievement_code}", response_model=UserAchievementResponse)
def update_achievement_progress(
    achievement_code: str,
    progress: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update progress for an achievement."""
    # Check if achievement exists
    achievement = db.query(Achievement).filter(
        Achievement.code == achievement_code
    ).first()
    
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found"
        )
    
    # Get or create user achievement
    user_achievement = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achievement_id == achievement.id
    ).first()
    
    if not user_achievement:
        user_achievement = UserAchievement(
            user_id=current_user.id,
            achievement_id=achievement.id,
            progress=progress
        )
        db.add(user_achievement)
    else:
        if user_achievement.unlocked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update progress for unlocked achievement"
            )
        user_achievement.progress = min(progress, 100)
        
        # Auto-unlock if progress reaches 100
        if user_achievement.progress >= 100:
            user_achievement.unlocked = True
            user_achievement.unlocked_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user_achievement)
    return user_achievement

@router.get("/stats")
def get_achievement_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get achievement statistics for the current user."""
    total_achievements = db.query(Achievement).count()
    unlocked_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.unlocked == True
    ).count()
    
    total_points = db.query(Achievement).join(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.unlocked == True
    ).with_entities(db.func.sum(Achievement.points)).scalar() or 0
    
    return {
        "total_achievements": total_achievements,
        "unlocked_achievements": unlocked_achievements,
        "completion_percentage": (unlocked_achievements / total_achievements * 100) if total_achievements > 0 else 0,
        "total_points": total_points
    }