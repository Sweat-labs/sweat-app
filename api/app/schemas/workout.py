from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class WorkoutSetCreate(BaseModel):
    exercise: str = Field(min_length=1)
    reps: int = Field(gt=0)
    weight: float = Field(ge=0)


class WorkoutSetOut(WorkoutSetCreate):
    id: int

    class Config:
        from_attributes = True


class WorkoutSessionCreate(BaseModel):
    # Optional name/title for the session
    name: Optional[str] = None
    # Optional note/description
    note: Optional[str] = None


class WorkoutSessionUpdate(BaseModel):
    # Fields that can be updated
    name: Optional[str] = None
    note: Optional[str] = None


class WorkoutSessionOut(BaseModel):
    id: int
    started_at: datetime
    name: Optional[str] = None
    note: Optional[str] = None
    sets: List[WorkoutSetOut] = []

    class Config:
        from_attributes = True
