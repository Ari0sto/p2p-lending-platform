from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.loan import Loan
from app.models.investment import Investment
from app.schemas.investment import InvestmentCreate, InvestmentResponse
from app.services.finance_logic import process_investment

router = APIRouter(prefix="/investments", tags=["Investments"])

@router.post("/", response_model=InvestmentResponse)
async def make_investment(inv_in: InvestmentCreate, db: AsyncSession = Depends(get_db)):
    # 1. поиск кредита в базе
    result = await db.execute(select(Loan).where(Loan.id == inv_in.loan_id))
    loan = result.scalars().first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Кредит не найден")
    
    try:
        # 2. Вызов логики (проверки + смена статуса + пересчет сумм)
        loan = process_investment(loan, inv_in.amount)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 3. Сохр. новую инвестицию
    new_inv = Investment(
        loan_id=loan.id,
        investor_id=1, # Временная заглушка
        amount=inv_in.amount
    )
    db.add(new_inv)
    db.add(loan) # Сохр. измененный кредит
    await db.commit()
    await db.refresh(new_inv)
    
    return new_inv