from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate, UserUpdate
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user = db.query(UserModel).filter(
        UserModel.id == current_user["user_id"]
    ).first()
    
    if not user:
        # Create user if doesn't exist
        user = UserModel(
            id=current_user["user_id"],
            email=current_user["email"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user


@router.patch("/me", response_model=User)
async def update_current_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user = db.query(UserModel).filter(
        UserModel.id == current_user["user_id"]
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user