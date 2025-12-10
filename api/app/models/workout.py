from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    name = Column(String, nullable=True)
    note = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    sets = relationship("WorkoutSet", back_populates="session", cascade="all, delete-orphan")

class WorkoutSet(Base):
    __tablename__ = "workout_sets"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id", ondelete="CASCADE"), nullable=False)
    exercise = Column(String, nullable=False)
    reps = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)

    session = relationship("WorkoutSession", back_populates="sets")
