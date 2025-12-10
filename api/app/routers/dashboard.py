from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date

from ..core.database import get_db
from ..models.user import User
from ..models.steps import DailySteps  


router = APIRouter(prefix="/dashboard", tags=["dashboard"])

TEMP_USER_ID = 1  


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()
    steps_entry = (
        db.query(DailySteps)
        .filter(DailySteps.user_id == user.id, DailySteps.day == today)
        .first()
    )

    steps_today = steps_entry.steps if steps_entry else 0

    steps_goal = user.daily_step_goal or 8000

    percent_complete = (
        round((steps_today / steps_goal) * 100, 1)
        if steps_goal > 0 else 0
    )

    calories_burned = round(steps_today * 0.04, 1)

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