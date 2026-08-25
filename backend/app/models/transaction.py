from sqlalchemy import (
    Numeric,
    String,
    DateTime,
    Enum,
    ForeignKey
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)
from datetime import datetime
from enum import Enum as PyEnum
from app.database import Base



class TransactionType(str, PyEnum):
    DEPOSIT = "DEPOSIT"
    INVESTMENT = "INVESTMENT"
    LOAN_RECEIVED = "LOAN_RECEIVED"
    REPAYMENT = "REPAYMENT"
    PROFIT = "PROFIT"



class Transaction(Base):
    __tablename__ = "transactions"


    id: Mapped[int] = mapped_column(
        primary_key=True
    )


    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )


    type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType)
    )


    amount: Mapped[float] = mapped_column(
        Numeric(10,2)
    )


    description: Mapped[str] = mapped_column(
        String
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="transactions"
    )