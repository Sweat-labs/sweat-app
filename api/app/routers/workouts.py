from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, Response, Body
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from datetime import datetime

from ..core.database import get_db
from ..models.workout import WorkoutSession, WorkoutSet
from ..models.progression import ExerciseProgress
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
    return db.execute(stmt).scalars().all()


@router.post("/sessions/{session_id}/sets", response_model=WorkoutSetOut, status_code=201)
def add_set(session_id: int, payload: WorkoutSetCreate, db: DBSession, response: Response):

    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    new_set = WorkoutSet(session_id=session_id, **payload.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)

    first_set = (
        db.query(WorkoutSet)
        .filter(WorkoutSet.session_id == session_id)
        .order_by(WorkoutSet.id.asc())
        .first()
    )

    if first_set and first_set.id == new_set.id:
        exercise = new_set.exercise
        weight = new_set.weight
        reps = new_set.reps
        user_id = 1  

        existing = (
            db.query(ExerciseProgress)
            .filter(
                ExerciseProgress.user_id == user_id,
                ExerciseProgress.exercise == exercise,
            )
            .first()
        )

        next_weight = weight + 5 if reps >= 12 else None

        if existing:
            existing.current_weight = weight
            existing.best_reps_first_set = reps
            existing.recommended_next_weight = next_weight
            existing.updated_at = datetime.utcnow()
        else:
            db.add(
                ExerciseProgress(
                    user_id=user_id,
                    exercise=exercise,
                    current_weight=weight,
                    best_reps_first_set=reps,
                    recommended_next_weight=next_weight,
                )
            )

        db.commit()

    response.headers["Location"] = f"/workouts/sessions/{session_id}/sets/{new_set.id}"
    return new_set


@router.get("/sessions/{session_id}", response_model=WorkoutSessionOut)
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


@router.get("/sessions/{session_id}/sets", response_model=list[WorkoutSetOut])
def list_sets_for_session(session_id: int, db: DBSession):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session.sets

@router.put("/sessions/{session_id}", response_model=WorkoutSessionOut)
def update_session(
    session_id: int,
    payload: dict = Body(...),
    db: DBSession = Depends(get_db),
):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if "note" in payload:
        session.note = payload["note"]

    if "name" in payload and hasattr(session, "name"):
        session.name = payload["name"]

    db.commit()
    db.refresh(session)
    return session


@router.delete("/sessions/{session_id}", status_code=204)
def delete_session(session_id: int, db: DBSession):
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    for s in list(session.sets):
        db.delete(s)

    db.delete(session)
    db.commit()
    return Response(status_code=204)


@router.delete("/sets/{set_id}", status_code=204)
def delete_set(set_id: int, db: DBSession):
    the_set = db.get(WorkoutSet, set_id)
    if not the_set:
        raise HTTPException(status_code=404, detail="Set not found")

    db.delete(the_set)
    db.commit()
    return Response(status_code=204)
