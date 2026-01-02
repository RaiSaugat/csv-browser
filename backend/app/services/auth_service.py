from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.database.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserSignup, UserLogin
from datetime import timedelta
from app.config import settings


def signup_user(db: Session, user_data: UserSignup) -> User:
    """Register a new user with default role 'user'"""
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        password_hash=hashed_password,
        role="user"  # Default role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def login_user(db: Session, user_data: UserLogin) -> str:
    """Authenticate user and return JWT token"""
    user = db.query(User).filter(User.username == user_data.username).first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    # Create JWT token
    access_token_expires = timedelta(minutes=settings.jwt_access_token_expire_minutes)
    token_data = {
        "sub": user.username,
        "role": user.role
    }
    access_token = create_access_token(data=token_data, expires_delta=access_token_expires)

    return access_token
