from datetime import datetime
from sqlalchemy import Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base

class ExerciseProgress(Base):
    __tablename__ = "exercise_progress"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    exercise: Mapped[str] = mapped_column(String(120), nullable=False)
    current_weight: Mapped[float] = mapped_column(Float, nullable=False)
    best_reps_first_set: Mapped[int] = mapped_column(Integer, default=0)
    recommended_next_weight: Mapped[float | None] = mapped_column(Float, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )