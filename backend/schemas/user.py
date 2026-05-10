from pydantic import BaseModel, ConfigDict, Field

from backend.models.role import RoleEnum


class UserRegistration(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=72)


class User(BaseModel):
    id: int
    username: str
    role: RoleEnum

    model_config = ConfigDict(from_attributes=True)
