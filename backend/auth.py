from dataclasses import dataclass
from fastapi import Depends, HTTPException, status

from backend.models.role import RoleEnum


@dataclass
class CurrentUser:
    id: int
    role: RoleEnum


# TODO: Remove this module-level switch once Nico's real auth is wired.
#       Toggle this to test user-role behavior without real authentication.
_STUB_USER = CurrentUser(id=1, role=RoleEnum.ADMIN)


def get_current_user() -> CurrentUser:
    # TODO: Replace this stub once Nico's User Management is ready.
    return _STUB_USER


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