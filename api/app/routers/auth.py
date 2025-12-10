from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status

from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from pydantic import BaseModel, EmailStr

from ..core.database import get_db

from ..core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from ..core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

from ..models.user import User

from ..schemas.auth import UserCreate, UserOut, Token

router = APIRouter(prefix="/auth", tags=["auth"])

# This tells FastAPI where tokens come from (Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class LoginRequest(BaseModel):
    email: EmailStr

    password: str


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)

def signup(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user with a hashed password.
    """
    existing = db.query(User).filter(User.email == payload.email).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Email is already registered.",
        )

    hashed_pw = get_password_hash(payload.password)

    user = User(email=payload.email, password_hash=hashed_pw)

    db.add(user)

    db.commit()

    db.refresh(user)

    return user


@router.post("/login", response_model=Token)

def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Check email + password.
    If correct, return a JWT access token.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Incorrect email or password.",
        )

    # sub = subject of the token (we use user id)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    token = create_access_token(
        data={"sub": str(user.id)},

        expires_delta=access_token_expires,
    )

    return Token(access_token=token, token_type="bearer")


def get_current_user(
    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_db),
) -> User:
    """
    Dependency: get the currently logged-in user from the bearer token.
    For now we won't enforce this on workout routes yet.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,

        detail="Could not validate credentials.",

        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        sub = payload.get("sub")

        if sub is None:
            raise credentials_exception

        user_id = int(sub)

    except (JWTError, ValueError):
        raise credentials_exception

    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception

    return user
