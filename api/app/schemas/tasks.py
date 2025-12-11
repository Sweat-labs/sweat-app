from datetime import date
from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    task_name: str
    calories: Optional[int] = None

class TaskOut(BaseModel):
    id: int
    task_name: str
    calories: Optional[int]
    completed: bool
    day: date
    user_id: int

    model_config = {"from_attributes": True}