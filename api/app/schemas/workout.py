from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class WorkoutSetCreate(BaseModel):
    exercise: str = Field(min_length=1)
    reps: int = Field(gt=0)
    weight: float = Field(ge=0)

class WorkoutSetOut(WorkoutSetCreate):
    id: int
    class Config:
        from_attributes = True

class WorkoutSessionCreate(BaseModel):
    note: Optional[str] = None

class WorkoutSessionOut(BaseModel):
    id: int
    started_at: datetime
    note: Optional[str] = None
    sets: List[WorkoutSetOut] = []
    class Config:
        from_attributes = True
