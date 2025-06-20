from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.space import SpaceConfiguration
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.schemas.space import SpaceCreate, SpaceUpdate, SpaceResponse

router = APIRouter()

@router.post("/", response_model=SpaceResponse)
def create_space(
    space: SpaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new space configuration for the current user."""
    # Check if user already has a space with the same name
    existing = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.user_id == current_user.id,
        SpaceConfiguration.name == space.name
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Space with this name already exists"
        )
    
    db_space = SpaceConfiguration(
        user_id=current_user.id,
        **space.dict()
    )
    db.add(db_space)
    db.commit()
    db.refresh(db_space)
    return db_space

@router.get("/", response_model=List[SpaceResponse])
def get_spaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all space configurations for the current user."""
    spaces = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.user_id == current_user.id
    ).all()
    return spaces

@router.get("/active", response_model=SpaceResponse)
def get_active_space(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the currently active space for the user."""
    space = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.user_id == current_user.id,
        SpaceConfiguration.is_active == True
    ).first()
    
    if not space:
        # If no active space, get the first one or create default
        space = db.query(SpaceConfiguration).filter(
            SpaceConfiguration.user_id == current_user.id
        ).first()
        
        if not space:
            # Create default space
            space = SpaceConfiguration(
                user_id=current_user.id,
                name="My Workspace",
                world_theme="default",
                is_active=True
            )
            db.add(space)
            db.commit()
            db.refresh(space)
    
    return space

@router.get("/{space_id}", response_model=SpaceResponse)
def get_space(
    space_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific space configuration."""
    space = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.id == space_id,
        SpaceConfiguration.user_id == current_user.id
    ).first()
    
    if not space:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Space not found"
        )
    
    return space

@router.patch("/{space_id}", response_model=SpaceResponse)
def update_space(
    space_id: int,
    space_update: SpaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a space configuration."""
    space = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.id == space_id,
        SpaceConfiguration.user_id == current_user.id
    ).first()
    
    if not space:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Space not found"
        )
    
    update_data = space_update.dict(exclude_unset=True)
    
    # If setting this space as active, deactivate others
    if update_data.get("is_active", False):
        db.query(SpaceConfiguration).filter(
            SpaceConfiguration.user_id == current_user.id,
            SpaceConfiguration.id != space_id
        ).update({"is_active": False})
    
    for field, value in update_data.items():
        setattr(space, field, value)
    
    db.commit()
    db.refresh(space)
    return space

@router.delete("/{space_id}")
def delete_space(
    space_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a space configuration."""
    space = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.id == space_id,
        SpaceConfiguration.user_id == current_user.id
    ).first()
    
    if not space:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Space not found"
        )
    
    # Don't delete if it's the only space
    space_count = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.user_id == current_user.id
    ).count()
    
    if space_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the only space"
        )
    
    # If deleting active space, activate another one
    if space.is_active:
        another_space = db.query(SpaceConfiguration).filter(
            SpaceConfiguration.user_id == current_user.id,
            SpaceConfiguration.id != space_id
        ).first()
        if another_space:
            another_space.is_active = True
    
    db.delete(space)
    db.commit()
    return {"detail": "Space deleted successfully"}

@router.post("/{space_id}/activate", response_model=SpaceResponse)
def activate_space(
    space_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Activate a specific space."""
    space = db.query(SpaceConfiguration).filter(
        SpaceConfiguration.id == space_id,
        SpaceConfiguration.user_id == current_user.id
    ).first()
    
    if not space:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Space not found"
        )
    
    # Deactivate all other spaces
    db.query(SpaceConfiguration).filter(
        SpaceConfiguration.user_id == current_user.id,
        SpaceConfiguration.id != space_id
    ).update({"is_active": False})
    
    space.is_active = True
    db.commit()
    db.refresh(space)
    return space