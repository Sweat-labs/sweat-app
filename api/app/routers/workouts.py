from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.workout import WorkoutSession, WorkoutSet
from ..schemas.workout import WorkoutSessionCreate, WorkoutSessionOut, WorkoutSetCreate, WorkoutSetOut

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.post("/sessions", response_model=WorkoutSessionOut, status_code=201)
def create_session(payload: WorkoutSessionCreate, db: Session = Depends(get_db)):
    session = WorkoutSession(note=payload.note)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/sessions", response_model=list[WorkoutSessionOut])
def list_sessions(db: Session = Depends(get_db)):
    return db.query(WorkoutSession).all()

@router.post("/sessions/{session_id}/sets", response_model=WorkoutSetOut, status_code=201)
def add_set(session_id: int, payload: WorkoutSetCreate, db: Session = Depends(get_db)):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    new_set = WorkoutSet(session_id=session_id, **payload.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set