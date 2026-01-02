from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.database.models import User
from typing import List


def get_all_users(db: Session) -> List[User]:
    """Get all users (admin only)"""
    return db.query(User).all()


def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user by ID (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()
    return True
