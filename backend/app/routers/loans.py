from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.loan import Loan
from app.schemas.loan import LoanCreate, LoanResponse
from app.services.finance_logic import validate_loan_creation

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("/", response_model=LoanResponse)
async def create_loan(loan_in: LoanCreate, db: AsyncSession = Depends(get_db)):
    try:
        # ВЫЗОВ ЛОГИКИ ДЛЯ ПРОВЕРКИ
        validate_loan_creation(loan_in.amount, loan_in.interest_rate, loan_in.term_days)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    new_loan = Loan(
        borrower_id=1,  # Временная заглушка
        amount=loan_in.amount,
        interest_rate=loan_in.interest_rate,
        term_days=loan_in.term_days,
        description=loan_in.description
    )
    db.add(new_loan)
    await db.commit()
    await db.refresh(new_loan)
    return new_loan

@router.get("/", response_model=list[LoanResponse])
async def get_all_loans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Loan))
    return result.scalars().all()