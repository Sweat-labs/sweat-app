from pydantic import BaseModel

class GoalCreate(BaseModel):
    goal_type: str
    target_value: float

class GoalUpdate(BaseModel):
    progress_value: float

class GoalOut(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_value: float
    progress_value: float

    model_config = {"from_attributes": True}