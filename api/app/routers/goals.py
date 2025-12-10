from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.goal import Goal
from ..schemas.goal import GoalCreate, GoalUpdate, GoalOut

router = APIRouter(prefix="/goals", tags=["goals"])

# TEMPORARY USER ID = 1 (replace with auth later)
TEMP_USER_ID = 1

@router.post("/", response_model=GoalOut)
def create_goal(payload: GoalCreate, db: Session = Depends(get_db)):
    goal = Goal(
        user_id=TEMP_USER_ID,
        goal_type=payload.goal_type,
        target_value=payload.target_value,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.get("/", response_model=list[GoalOut])
def list_goals(db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == TEMP_USER_ID).all()

@router.put("/{goal_id}", response_model=GoalOut)
def update_goal(goal_id: int, payload: GoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.progress_value = payload.progress_value
    db.commit()
    db.refresh(goal)
    return goal
