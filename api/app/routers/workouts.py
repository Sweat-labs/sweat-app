from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.workout import WorkoutSession, WorkoutSet
from ..models.user import User
from ..schemas.workout import (
    WorkoutSessionCreate,
    WorkoutSessionUpdate,
    WorkoutSessionOut,
    WorkoutSetCreate,
    WorkoutSetOut,
)
from ..routers.auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])


# ---- Sessions ----

@router.post(
    "/sessions",
    response_model=WorkoutSessionOut,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    payload: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new workout session owned by the current user.
    """
    session = WorkoutSession(
        name=payload.name,
        note=payload.note,
        user_id=current_user.id,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=list[WorkoutSessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List sessions that belong only to the current user.
    """
    return (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == current_user.id)
        .all()
    )


@router.put("/sessions/{session_id}", response_model=WorkoutSessionOut)
def update_session(
    session_id: int,
    payload: WorkoutSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update a session's name and/or note, only if it belongs to the current user.
    """
    session = db.get(WorkoutSession, session_id)
    if not session or session.user_id != current_user.id:
        # 404 so we don't leak IDs of other users' sessions
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    if payload.name is not None:
        session.name = payload.name
    if payload.note is not None:
        session.note = payload.note

    db.commit()
    db.refresh(session)
    return session


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a session and all its sets, only if it belongs to the current user.
    """
    session = db.get(WorkoutSession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    # Delete associated sets first (if cascade isn't configured)
    db.query(WorkoutSet).filter(WorkoutSet.session_id == session.id).delete()
    db.delete(session)
    db.commit()
    return


# ---- Sets ----

@router.post(
    "/sessions/{session_id}/sets",
    response_model=WorkoutSetOut,
    status_code=status.HTTP_201_CREATED,
)
def add_set(
    session_id: int,
    payload: WorkoutSetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add a set to a session, only if that session belongs to the current user.
    """
    session = db.get(WorkoutSession, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    new_set = WorkoutSet(session_id=session_id, **payload.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set


@router.delete("/sets/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_set(
    set_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a single set, only if the parent session belongs to the current user.
    """
    workout_set = db.get(WorkoutSet, set_id)
    if not workout_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Set not found",
        )

    session = db.get(WorkoutSession, workout_set.session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Set not found",
        )

    db.delete(workout_set)
    db.commit()
    return
