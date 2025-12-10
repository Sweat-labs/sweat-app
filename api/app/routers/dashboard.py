from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

TEMP_USER_ID = 1  

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    steps_today = 0         
    steps_goal = 8000       
    if steps_goal > 0:
        percent_complete = round((steps_today / steps_goal) * 100, 1)
    else:
        percent_complete = 0

    calories_burned = 0     

    return {
        "greeting_name": user.username,
        "steps_today": steps_today,
        "steps_goal": steps_goal,
        "percent_complete": percent_complete,
        "calories_burned": calories_burned,
        "activity_level": user.activity_level,
        "main_goal": user.main_goal,
        "timestamp": datetime.utcnow()
    }