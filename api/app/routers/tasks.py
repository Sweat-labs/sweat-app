from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from ..core.database import get_db
from ..models.tasks import DailyTask
from ..schemas.tasks import TaskCreate, TaskOut

router = APIRouter(prefix="/tasks", tags=["tasks"])

TEMP_USER_ID = 1


@router.get("/today", response_model=list[TaskOut])
def get_today_tasks(db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):
    today = date.today()

    tasks = (
        db.query(DailyTask)
        .filter(DailyTask.user_id == user_id, DailyTask.day == today)
        .all()
    )

    return tasks


@router.post("/add", response_model=TaskOut)
def add_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    user_id: int = TEMP_USER_ID
):
    today = date.today()

    new_task = DailyTask(
        user_id=user_id,
        task_name=payload.task_name,
        calories=payload.calories,
        day=today
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.put("/complete/{task_id}", response_model=TaskOut)
def complete_task(task_id: int, db: Session = Depends(get_db), user_id: int = TEMP_USER_ID):
    task = db.get(DailyTask, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = True
    db.commit()
    db.refresh(task)
    return task
