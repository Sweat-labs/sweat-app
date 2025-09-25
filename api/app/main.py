from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import Base, engine
from .routers import workouts

# create tables (dev only; later we'll use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SWEat API", version="0.1.0")

# Allow frontend apps (web + mobile) to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow everything; later: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple test route
@app.get("/health")
def health():
    return {"status": "ok"}

# Include the workout-related routes
app.include_router(workouts.router)