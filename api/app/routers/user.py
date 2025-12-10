from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User
from ..schemas.user import UserProfileUpdate, UserProfileOut

router = APIRouter(prefix="/user", tags=["user"])

TEMP_USER_ID = 1

@router.get("/profile", response_model=UserProfileOut)
def get_profile(user_id: int = TEMP_USER_ID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile", response_model=UserProfileOut)
def update_profile(
    profile: UserProfileUpdate,
    user_id: int = TEMP_USER_ID,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    data = profile.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user