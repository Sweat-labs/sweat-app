from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..core.database import get_db
from ..models.workout import WorkoutSession, WorkoutSet
from ..schemas.workout import (
    WorkoutSessionCreate,
    WorkoutSessionOut,
    WorkoutSetCreate,
    WorkoutSetOut,
)

router = APIRouter(prefix="/workouts", tags=["workouts"])

DBSession = Annotated[Session, Depends(get_db)]

@router.post("/sessions", response_model=WorkoutSessionOut, status_code=201)
def create_session(payload: WorkoutSessionCreate, db: DBSession, response: Response):
    session = WorkoutSession(note=payload.note)
    db.add(session)
    db.commit()
    db.refresh(session)
    # Optional: Location header for 201 Created
    response.headers["Location"] = f"/workouts/sessions/{session.id}"
    return session

@router.get("/sessions", response_model=list[WorkoutSessionOut])
def list_sessions(
    db: DBSession,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    stmt = (
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .order_by(WorkoutSession.started_at.desc(), WorkoutSession.id.desc())
        .limit(limit)
        .offset(offset)
    )
    result = db.execute(stmt).scalars().all()
    return result

@router.post("/sessions/{session_id}/sets", response_model=WorkoutSetOut, status_code=201)
def add_set(session_id: int, payload: WorkoutSetCreate, db: DBSession, response: Response):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    new_set = WorkoutSet(session_id=session_id, **payload.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    response.headers["Location"] = f"/workouts/sessions/{session_id}/sets/{new_set.id}"
    return new_set

@router.get("/sessions/{session_id}", response_model=WorkoutSessionOut, summary="Get one session (with sets)")
def get_session(session_id: int, db: DBSession):
    stmt = (
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .where(WorkoutSession.id == session_id)
    )
    session = db.execute(stmt).scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/sessions/{session_id}/sets", response_model=list[WorkoutSetOut], summary="List sets in a session")
def list_sets_for_session(session_id: int, db: DBSession):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    # Return in the same order they’re stored; change to explicit order_by if you want
    return session.sets
