from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.auth import CurrentUser, get_current_user
from backend.database import get_db
from backend.schemas.user import User as UserSchema, UserRegistration
from backend.services import user_service
from backend.services.exceptions import UsernameConflict


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegistration,
    db: Session = Depends(get_db),
):
    try:
        return user_service.create_user(db=db, payload=payload)
    except UsernameConflict as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/me", response_model=UserSchema)
def get_me(
    current_user: CurrentUser = Depends(get_current_user),
):
    return current_user
