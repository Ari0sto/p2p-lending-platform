from sqlalchemy import (
    Integer,
    Numeric,
    Text,
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


class LoanStatus(str, PyEnum):
    OPEN = "OPEN"
    FUNDED = "FUNDED"
    ACTIVE = "ACTIVE"
    PAID = "PAID"
    DEFAULTED = "DEFAULTED"


class Loan(Base):
    __tablename__ = "loans"


    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    borrower_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )


    amount: Mapped[float] = mapped_column(
        Numeric(10,2)
    )

    # NEW
    funded_amount: Mapped[float] = mapped_column(
        Numeric(10,2),
        default=0.0
    )


    interest_rate: Mapped[float] = mapped_column(
        Numeric(5,2)
    )


    term_days: Mapped[int] = mapped_column(
        Integer
    )


    description: Mapped[str] = mapped_column(
        Text
    )


    status: Mapped[LoanStatus] = mapped_column(
        Enum(LoanStatus),
        default=LoanStatus.OPEN
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    borrower = relationship(
        "User",
        back_populates="loans"
    )


    investments = relationship(
        "Investment",
        back_populates="loan"
    )