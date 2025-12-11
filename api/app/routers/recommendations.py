from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..core.recommendations import build_recommendation, get_recommended_tasks


router = APIRouter(prefix="/recommend", tags=["recommend"])

TEMP_USER_ID = 1

@router.get("/weight")
def recommend_weight(user_id: int = TEMP_USER_ID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.weight_lbs is None or user.height_in is None:
        raise HTTPException(status_code=400, detail="Missing weight or height on profile")

    rec = build_recommendation(user.weight_lbs, user.height_in)

    return {
        "user_id": user.id,
        "activity_level": user.activity_level,
        "main_goal": user.main_goal,
        **rec,
    }

@router.get("/tasks")
def recommend_tasks(user_id: int = TEMP_USER_ID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    main_goal = user.main_goal or "be_healthier"
    activity_level = user.activity_level or "3-5"

    recommendations = get_recommended_tasks(main_goal, activity_level)

    return {
        "user_id": user.id,
        "main_goal": main_goal,
        "activity_level": activity_level,
        "recommended_tasks": recommendations,
    }