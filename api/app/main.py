from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import Base, engine
from .routers import workouts

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# BASIC TEST ROUTE
# ==================================================
@app.get("/health")
def health():
    return {"status": "ok"}

# ==================================================
# ROUTERS
# ==================================================
# Attach your workouts API endpoints
app.include_router(workouts.router)
