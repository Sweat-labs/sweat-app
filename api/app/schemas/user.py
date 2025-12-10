from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = {"from_attributes": True}

class UserProfileUpdate(BaseModel):
    weight_lbs: float | None = None
    height_in: float | None = None
    activity_level: str | None = None
    main_goal: str | None = None
    gender: str | None = None
    age: int | None = None

class UserProfileOut(BaseModel):
    id: int
    weight_lbs: float | None
    height_in: float | None
    activity_level: str | None
    main_goal: str | None
    gender: str | None
    age: int | None

    model_config = {"from_attributes": True}