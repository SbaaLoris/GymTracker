from enum import Enum
from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from backend.database import Base

class MuscleGroupEnum(str, Enum):
    CHEST = "Chest"
    BACK = "Back"
    LEGS = "Legs"
    SHOULDERS = "Shoulders"
    ARMS = "Arms"
    CORE = "Core"
    CARDIO = "Cardio"

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key= True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    muscle_group = Column(SQLEnum(MuscleGroupEnum), nullable = False, index = True)
    is_cardio = Column(Boolean, nullable = False, default = False)
    is_active = Column(Boolean, nullable = False, default = True)
