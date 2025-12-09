from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./sweat.db"

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,  # helps to avoid stale connections (esp. with Postgres later)
)

# Ensure SQLite enforces foreign key constraint
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, _):
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# one session per request
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# SQLAlchemy 2.0
class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a DB session and guarantees cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

