from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator


class WorkoutSetCreate(BaseModel):
    exercise: str = Field(min_length=1)
    reps: int = Field(gt=0)
    weight: float = Field(ge=0)

    # Trim surrounding whitespace in exercise names
    @field_validator("exercise")
    @classmethod
    def _strip_exercise(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("exercise cannot be empty")
        return v


class WorkoutSetOut(WorkoutSetCreate):
    id: int
    # Optional but helpful for users
    session_id: int

    model_config = ConfigDict(from_attributes=True)


class WorkoutSessionCreate(BaseModel):
    note: Optional[str] = Field(default=None, max_length=500)


class WorkoutSessionOut(BaseModel):
    id: int
    started_at: datetime
    note: Optional[str] = None
    # Use default_factory to avoid mutable default pitfalls
    sets: list[WorkoutSetOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)