from sqlalchemy import (
    Numeric,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)
from datetime import datetime
from app.database import Base



class Investment(Base):
    __tablename__ = "investments"


    id: Mapped[int] = mapped_column(
        primary_key=True
    )


    loan_id: Mapped[int] = mapped_column(
        ForeignKey("loans.id")
    )


    investor_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )


    amount: Mapped[float] = mapped_column(
        Numeric(10,2)
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    loan = relationship(
        "Loan",
        back_populates="investments"
    )


    investor = relationship(
        "User",
        back_populates="investments"
    )