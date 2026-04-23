import bcrypt as _bcrypt
from sqlalchemy.orm import Session

from backend.models.role import RoleEnum
from backend.models.user import User
from backend.schemas.user import UserRegistration
from backend.services.exceptions import InvalidCredentials, UsernameConflict

def hash_password(plain: str) -> str:
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt()).decode()


def _get_user_by_username_or_raise(db: Session, username: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise InvalidCredentials("Invalid username or password")
    return user


def _assert_username_is_free(db: Session, username: str) -> None:
    if db.query(User).filter(User.username == username).first() is not None:
        raise UsernameConflict(f"Username '{username}' is already taken")


def create_user(db: Session, payload: UserRegistration) -> User:
    _assert_username_is_free(db, payload.username)

    new_user = User(
        username=payload.username,
        hashed_password=hash_password(payload.password),
        role=RoleEnum.USER,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, username: str, password: str) -> User:
    user = _get_user_by_username_or_raise(db, username)
    if not _bcrypt.checkpw(password.encode(), user.hashed_password.encode()):
        raise InvalidCredentials("Invalid username or password")
    return user
