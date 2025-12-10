# api/app/routers/meta.py
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/meta", tags=["meta"])

class ServiceInfo(BaseModel):
    name: str
    version: str
    description: str
    time_utc: datetime

@router.get("/info", response_model=ServiceInfo, summary="Service info")
def get_info():
    return ServiceInfo(
        name="SWEat API",
        version="0.1.1",
        description="Fitness tracking backend for workouts, goals, and progress.",
        time_utc=datetime.now(timezone.utc),
    )

class Feature(BaseModel):
    key: str
    title: str
    status: str  # planned | in-progress | done

@router.get("/features", response_model=list[Feature], summary="Product roadmap snapshot")
def list_features():
    return [
        Feature(key="workouts_search", title="Search workouts by name/tags", status="in-progress"),
        Feature(key="goals_api", title="Goals and streak tracking", status="planned"),
        Feature(key="export_csv", title="Data export (CSV/JSON)", status="planned"),
    ]

@router.get("/metrics", summary="Lightweight service metrics (stub)")
def metrics():
    return {
        "uptime_seconds": 0,
        "requests_total": 0,
        "workouts_in_db": "unknown (stub)",
    }