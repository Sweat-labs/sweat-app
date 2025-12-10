from __future__ import annotations

from datetime import datetime
from sqlalchemy import (
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Use a Python-side default for SQLite.
    # If/when we move to Postgres, we can switch to server_default=text("now() at time zone 'utc'")).
    started_at: Mapped[datetime] = mapped_column(
        DateTime,                 # SQLite ignores tz; keep it naive UTC
        default=datetime.utcnow,  # <-- fixed
        nullable=False,
    )

    note: Mapped[str | None] = mapped_column(String(500))

    sets: Mapped[list["WorkoutSet"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="WorkoutSet.id",
        passive_deletes=True,
    )

    __table_args__ = (
        Index("ix_workout_sessions_started_at", "started_at"),
    )

class WorkoutSet(Base):
    __tablename__ = "workout_sets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    session_id: Mapped[int] = mapped_column(
        ForeignKey("workout_sessions.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    exercise: Mapped[str] = mapped_column(String(120), nullable=False)
    reps: Mapped[int] = mapped_column(Integer, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)

    session: Mapped[WorkoutSession] = relationship(back_populates="sets")

    __table_args__ = (
        CheckConstraint("reps >= 1", name="ck_workout_sets_reps_ge_1"),
        CheckConstraint("weight >= 0", name="ck_workout_sets_weight_ge_0"),
        Index("ix_workout_sets_session_exercise", "session_id", "exercise"),
    )

