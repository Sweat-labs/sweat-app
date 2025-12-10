from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Data sent by the client when creating a new user."""
    email: EmailStr

    password: str = Field(min_length=6)


class UserOut(BaseModel):
    """Data we return for a user (no password!)."""
    id: int

    email: EmailStr

    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response from /auth/login."""
    access_token: str

    token_type: str = "bearer"
