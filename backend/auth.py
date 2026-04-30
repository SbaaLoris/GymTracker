from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.role import RoleEnum

_basic = HTTPBasic()


@dataclass
class CurrentUser:
    id: int
    username: str
    role: RoleEnum


def get_current_user(
    credentials: HTTPBasicCredentials = Depends(_basic),
    db: Session = Depends(get_db),
) -> CurrentUser:
    from backend.services import user_service
    from backend.services.exceptions import InvalidCredentials
    try:
        user = user_service.authenticate_user(db, credentials.username, credentials.password)
    except InvalidCredentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return CurrentUser(id=user.id, username=user.username, role=user.role)


def require_admin(
    current_user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required",
        )
    return current_user


def require_user(
    current_user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    if current_user.role != RoleEnum.USER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role required (admins cannot perform this action)",
        )
    return current_user