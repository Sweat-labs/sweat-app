from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# Routers
from .routers import workouts
from .routers import meta
from .routers import auth
from .routers import user        
from .routers import goals         
from .routers import recommendations
from .routers import dashboard
from .routers import steps
from .routers import tasks

from .models import workout, user as user_model, goal, steps as steps_model, tasks as tasks_model


from .core.database import Base, engine

app = FastAPI(title="SWEat API", version="0.1.0")

# CORS SETTINGS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def _create_tables():
    Base.metadata.create_all(bind=engine)

@app.get("/health", response_class=JSONResponse)
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(meta.router)
app.include_router(workouts.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(goals.router)
app.include_router(recommendations.router)
app.include_router(dashboard.router)
app.include_router(steps.router)
app.include_router(tasks.router)