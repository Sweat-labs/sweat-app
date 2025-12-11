from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.progression import ExerciseProgress

router = APIRouter(prefix="/progression", tags=["progression"])

TEMP_USER_ID = 1

@router.get("/overview")
def progression_overview(db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):
    rows = (
        db.query(ExerciseProgress)
        .filter(ExerciseProgress.user_id == user_id)
        .all()
    )

    return [
        {
            "exercise": r.exercise,
            "current_weight": r.current_weight,
            "best_reps_first_set": r.best_reps_first_set,
            "recommended_next_weight": r.recommended_next_weight,
            "updated_at": r.updated_at
        }
        for r in rows
    ]


@router.get("/{exercise_name}")
def progression_history(exercise_name: str, db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):
    rows = (
        db.query(ExerciseProgress)
        .filter(
            ExerciseProgress.user_id == user_id,
            ExerciseProgress.exercise == exercise_name
        )
        .order_by(ExerciseProgress.updated_at.desc())
        .all()
    )

    if not rows:
        raise HTTPException(404, "No progression found for this exercise.")

    return rows