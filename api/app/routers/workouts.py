from typing import Annotated, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Response
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


# ------------------------------
# Sessions
# ------------------------------


@router.post("/sessions", response_model=WorkoutSessionOut, status_code=201)
def create_session(
    payload: WorkoutSessionCreate,
    db: DBSession,
    response: Response,
):
    """
    Create a new workout session.
    Currently uses the note from the payload; if your schema
    has more fields (e.g., name), you can add them here later.
    """
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
    """
    List workout sessions with their sets.
    """
    stmt = (
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .order_by(WorkoutSession.started_at.desc(), WorkoutSession.id.desc())
        .limit(limit)
        .offset(offset)
    )
    result = db.execute(stmt).scalars().all()
    return result


@router.get(
    "/sessions/{session_id}",
    response_model=WorkoutSessionOut,
    summary="Get one session (with sets)",
)
def get_session(session_id: int, db: DBSession):
    """
    Get a single workout session and its sets.
    """
    stmt = (
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.sets))
        .where(WorkoutSession.id == session_id)
    )
    session = db.execute(stmt).scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.put(
    "/sessions/{session_id}",
    response_model=WorkoutSessionOut,
    summary="Update a workout session",
)
def update_session(
    session_id: int,
    db: DBSession,
    payload: dict = Body(...),
):
    """
    Update an existing workout session.

    Frontend sends:
      { "note": string, "name": string | null }

    Some versions of this project use `name`,
    others use `title` for the session label.
    We update both if they exist on the model.
    """
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Pull fields from the incoming JSON
    new_note = payload.get("note", None)
    new_name = payload.get("name", None)

    # Update note if provided
    if new_note is not None:
        session.note = new_note

    # Update whatever label field your model actually has
    if new_name is not None:
        # Most likely field
        if hasattr(session, "name"):
            session.name = new_name

        # Mobile / older versions sometimes use "title"
        if hasattr(session, "title"):
            session.title = new_name

    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.delete(
    "/sessions/{session_id}",
    status_code=204,
    summary="Delete a workout session and its sets",
)
def delete_session(session_id: int, db: DBSession):
    """
    Delete a whole workout session and all its sets.
    """
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # If cascade is configured on the relationship, this loop is optional.
    for s in list(session.sets):
        db.delete(s)

    db.delete(session)
    db.commit()
    return Response(status_code=204)


# ------------------------------
# Sets
# ------------------------------


@router.post(
    "/sessions/{session_id}/sets",
    response_model=WorkoutSetOut,
    status_code=201,
)
def add_set(
    session_id: int,
    payload: WorkoutSetCreate,
    db: DBSession,
    response: Response,
):
    """
    Add a set to an existing session.
    """
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    new_set = WorkoutSet(session_id=session_id, **payload.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)

    response.headers["Location"] = f"/workouts/sessions/{session_id}/sets/{new_set.id}"
    return new_set


@router.get(
    "/sessions/{session_id}/sets",
    response_model=list[WorkoutSetOut],
    summary="List sets in a session",
)
def list_sets_for_session(session_id: int, db: DBSession):
    """
    List all sets for a given session.
    """
    session = db.get(WorkoutSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Return in the same order they’re stored; change to explicit order_by if you want
    return session.sets


@router.delete("/sets/{set_id}", status_code=204, summary="Delete a single set")
def delete_set(set_id: int, db: DBSession):
    """
    Delete a single set by ID.
    """
    the_set = db.get(WorkoutSet, set_id)
    if not the_set:
        raise HTTPException(status_code=404, detail="Set not found")

    db.delete(the_set)
    db.commit()
    return Response(status_code=204)
