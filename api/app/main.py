from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from .core.database import Base, engine

from . import models

from .routers import workouts, auth   # <--- add auth here

# create tables (dev only; later use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SWEat API", version="0.1.0")

# CORS so web frontend can talk to API
origins = [
    "http://localhost:3000",

    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/health")

def health():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router)

app.include_router(workouts.router)

