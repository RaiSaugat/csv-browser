from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import UserSignup, UserLogin, Token
from app.services.auth_service import signup_user, login_user

router = APIRouter()


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """Register a new user (default role: 'user')"""
    user = signup_user(db, user_data)
    return {
        "message": "User created successfully",
        "user_id": user.id,
        "username": user.username
    }


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get JWT token"""
    user_data = UserLogin(username=form_data.username, password=form_data.password)
    access_token = login_user(db, user_data)
    return {"access_token": access_token, "token_type": "bearer"}
