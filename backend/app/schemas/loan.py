from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.loan import LoanStatus # импорт статуса из файла В.

class LoanBase(BaseModel):
    amount: float
    interest_rate: float
    term_days: int
    description: str

class LoanCreate(LoanBase):
    pass # Это то, что отправляет фронтенд при создании

class LoanResponse(LoanBase):
    id: int
    borrower_id: int
    funded_amount: float
    status: LoanStatus
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLoanResponse(LoanBase):
    id: int
    borrower_email: str
    funded_amount: float
    status: LoanStatus
    created_at: datetime

    class Config:
        from_attributes = True