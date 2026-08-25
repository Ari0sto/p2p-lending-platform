from pydantic import BaseModel
from datetime import datetime

class InvestmentCreate(BaseModel):
    loan_id: int
    amount: float

class InvestmentResponse(BaseModel):
    id: int
    loan_id: int
    investor_id: int
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True