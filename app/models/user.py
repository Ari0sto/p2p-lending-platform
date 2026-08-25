from sqlalchemy import String, Integer, Numeric, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from enum import Enum as PyEnum
from app.database import Base


class UserRole(str, PyEnum):
    ADMIN = "ADMIN"
    INVESTOR = "INVESTOR"
    BORROWER = "BORROWER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.BORROWER
    )

    balance: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0
    )

    credit_score: Mapped[int] = mapped_column(
        Integer,
        default=500
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    loans = relationship(
        "Loan",
        back_populates="borrower"
    )

    investments = relationship(
        "Investment",
        back_populates="investor"
    )

    transactions = relationship(
        "Transaction",
        back_populates="user"
    )