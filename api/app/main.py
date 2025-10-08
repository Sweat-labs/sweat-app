from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import Base, engine
from .routers import workouts

<<<<<<< HEAD
# ==================================================
# DATABASE INITIALIZATION
# ==================================================
Base.metadata.create_all(bind=engine)

# ==================================================
# APP INITIALIZATION
# ==================================================
app = FastAPI(title="SWEat API", version="0.1.0")

# ==================================================
# CORS CONFIGURATION
# ==================================================
origins = [
    "http://localhost:3000",   # Next.js web frontend
    "http://127.0.0.1:3000",   # Alternate loopback URL
    "http://localhost:8081",   # Expo web preview
    "exp://127.0.0.1:19000",   # Expo mobile dev
    "http://127.0.0.1:19006",  # Expo web dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
=======
# create tables (dev only; later we'll use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SWEat API", version="0.1.0")

# Allow frontend apps (web + mobile) to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow everything; later: ["http://localhost:3000"]
>>>>>>> 27446b45ab138a19dd56044d78e25fe0338096d3
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# ==================================================
# BASIC TEST ROUTE
# ==================================================
=======
# Simple test route
>>>>>>> 27446b45ab138a19dd56044d78e25fe0338096d3
@app.get("/health")
def health():
    return {"status": "ok"}

<<<<<<< HEAD
# ==================================================
# ROUTERS
# ==================================================
# Attach your workouts API endpoints
app.include_router(workouts.router)
=======
# Include the workout-related routes
app.include_router(workouts.router)
>>>>>>> 27446b45ab138a19dd56044d78e25fe0338096d3
