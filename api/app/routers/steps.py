from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from ..core.database import get_db
from ..models.steps import DailySteps

router = APIRouter(prefix="/steps", tags=["steps"])

@router.post("/update")
def update_steps(user_id: int, steps: int, db: Session = Depends(get_db)):
    today = date.today()

    entry = (
        db.query(DailySteps)
        .filter(DailySteps.user_id == user_id, DailySteps.day == today)
        .first()
    )

    if entry:
        entry.steps = steps
    else:
        entry = DailySteps(user_id=user_id, steps=steps, day=today)
        db.add(entry)

    db.commit()
    return {"message": "Steps updated"}