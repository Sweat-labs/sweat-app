from datetime import datetime, timedelta

from typing import Optional

from jose import jwt

from passlib.context import CryptContext

from .config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Used to hash and verify passwords
# Now using pbkdf2_sha256 to avoid bcrypt backend issues
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")



def get_password_hash(password: str) -> str:
    """Return a secure hash for the given plain-text password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Check that a plain-text password matches the stored hash."""
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT token containing the data (e.g., {"sub": user_id}).
    """
    to_encode = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt
