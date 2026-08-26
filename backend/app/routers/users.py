from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, UserRole
from app.models.loan import Loan
from app.models.investment import Investment
from app.models.transaction import Transaction, TransactionType
from app.schemas.user import UserResponse, DepositRequest
from app.schemas.loan import LoanResponse
from app.schemas.investment import InvestmentResponse
from app.schemas.transaction import TransactionResponse
from app.services.dependencies import get_current_user
from app.services.permissions import check_role


router = APIRouter(
    prefix="/users",
    tags=["Користувачі"]
)


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/me/deposit", response_model=UserResponse)
async def deposit_balance(deposit_in: DepositRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Адміністратор не може поповнювати баланс"
        )
    amount = Decimal(str(deposit_in.amount))
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Сума поповнення повинна бути більшою за нуль"
        )
    current_user.balance = (
        Decimal(str(current_user.balance)) + amount
    )
    transaction = Transaction(
        user_id=current_user.id,
        type=TransactionType.DEPOSIT,
        amount=amount,
        description="Поповнення балансу"
    )
    db.add(transaction)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/me/loans", response_model=list[LoanResponse])
async def get_my_loans(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.BORROWER
    )
    result = await db.execute(
        select(Loan).where(
            Loan.borrower_id == current_user.id
        )
    )
    return result.scalars().all()


@router.get("/me/investments", response_model=list[InvestmentResponse])
async def get_my_investments(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.INVESTOR
    )
    result = await db.execute(
        select(Investment).where(
            Investment.investor_id == current_user.id
        )
    )
    return result.scalars().all()


@router.get("/me/transactions", response_model=list[TransactionResponse])
async def get_my_transactions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Transaction).where(
            Transaction.user_id == current_user.id
        )
    )
    return result.scalars().all()