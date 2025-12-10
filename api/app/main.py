from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# Routers
from .routers import workouts
from .routers import meta
from .routers import auth
from .routers import user          # NEW
from .routers import goals         # NEW
from .routers import recommendations  # NEW

# Import ALL models so SQLAlchemy can create tables
from .models import workout, user as user_model, goal   # NEW

# DB bootstrap (remove after Alembic)
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

# REGISTER ROUTERS
app.include_router(meta.router)
app.include_router(workouts.router)
app.include_router(auth.router)
app.include_router(user.router)           # NEW
app.include_router(goals.router)          # NEW
app.include_router(recommendations.router)  # NEW