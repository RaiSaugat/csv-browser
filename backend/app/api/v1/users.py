from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.database.models import User
from app.api.deps import require_admin
from app.schemas.user import UserListResponse
from app.services.user_service import get_all_users, delete_user

router = APIRouter()


@router.get("", response_model=List[UserListResponse])
def list_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    users = get_all_users(db)
    return users


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete a user (admin only)"""
    # Prevent self-deletion
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    delete_user(db, user_id)
    return None
