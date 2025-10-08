from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# Routers
from .routers import workouts

# DB bootstrap remove after Alembic
from .core.database import Base, engine

app = FastAPI(title="SWEat API", version="0.1.0")

# CORS: wildcard cannot be used with allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   #keep False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables on startup (remove when migrations are used)
@app.on_event("startup")
def _create_tables():
    Base.metadata.create_all(bind=engine)

@app.get("/health", response_class=JSONResponse)
def health() -> dict[str, str]:
    return {"status": "ok"}

# Register routes
app.include_router(workouts.router)