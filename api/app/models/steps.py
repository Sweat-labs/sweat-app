from datetime import date
from sqlalchemy import Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base

class DailySteps(Base):
    __tablename__ = "daily_steps"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    steps: Mapped[int] = mapped_column(Integer, default=0)
    day: Mapped[date] = mapped_column(Date, nullable=False)

