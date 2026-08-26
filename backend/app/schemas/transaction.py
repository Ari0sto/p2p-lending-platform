from pydantic import BaseModel
from datetime import datetime
from app.models.transaction import TransactionType


class TransactionResponse(BaseModel):
    id: int
    type: TransactionType
    amount: float
    description: str
    created_at: datetime


    class Config:
        from_attributes = True


class AdminTransactionResponse(BaseModel):
    id: int
    user_email: str
    type: TransactionType
    amount: float
    description: str
    created_at: datetime

    class Config:
        from_attributes = True