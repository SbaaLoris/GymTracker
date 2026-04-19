from dataclasses import dataclass
from fastapi import Depends

from backend.models.role import RoleEnum


@dataclass
class CurrentUser:
    id: int
    role: RoleEnum


def get_current_user() -> CurrentUser:
    # TODO: Replace this stub once Nico's User Management is ready.
    #       Will then read the Authorization header, look up the user in DB,
    #       and return the real user. Until then: pretend every request comes
    #       from user 1 as admin. Change role=RoleEnum.USER to test user-role logic.
    return CurrentUser(id=1, role=RoleEnum.ADMIN)


def require_admin(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    # TODO: When auth is ready, raise 403 if role != admin.
    return current_user