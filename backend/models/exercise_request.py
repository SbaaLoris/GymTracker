from enum import Enum
from sqlalchemy import Column, Integer, String, Enum as SQLEnum
from backend.database import Base
from backend.models.exercise import MuscleGroupEnum


class RequestStatusEnum(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"


class ExerciseRequest(Base):
    __tablename__ = "exercise_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    suggested_name = Column(String(100), nullable=False)
    muscle_group = Column(SQLEnum(MuscleGroupEnum), nullable=False)
    status = Column(
        SQLEnum(RequestStatusEnum),
        nullable=False,
        default=RequestStatusEnum.PENDING,
        index=True,
    )
    