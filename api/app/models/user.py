from sqlalchemy import Column, Integer, String, DateTime

from datetime import datetime

from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)

    password_hash = Column(String, nullable=False)

    # Use UTC "now" at creation time, like other models
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
