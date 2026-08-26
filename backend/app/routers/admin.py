from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, UserRole
from app.models.loan import Loan
from app.models.investment import Investment
from app.models.transaction import Transaction
from app.schemas.user import UserResponse
from app.schemas.loan import AdminLoanResponse
from app.schemas.investment import AdminInvestmentResponse
from app.schemas.transaction import AdminTransactionResponse
from app.services.dependencies import get_current_user
from app.services.permissions import check_role


router = APIRouter(
    prefix="/admin",
    tags=["Адміністратор"]
)



@router.get("/users", response_model=list[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.ADMIN
    )
    result = await db.execute(
        select(User).where(
            User.role != UserRole.ADMIN
        )
    )
    return result.scalars().all()


@router.get("/loans", response_model=list[AdminLoanResponse])
async def get_all_loans(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.ADMIN
    )
    result = await db.execute(
        select(
            Loan,
            User.email
        )
        .join(
            User,
            Loan.borrower_id == User.id
        )
        .where(
            User.role != UserRole.ADMIN
        )
    )
    loans = result.all()
    return [
        {
            "id": loan.id,
            "borrower_email": email,
            "amount": loan.amount,
            "interest_rate": loan.interest_rate,
            "term_days": loan.term_days,
            "description": loan.description,
            "funded_amount": loan.funded_amount,
            "status": loan.status,
            "created_at": loan.created_at
        }
        for loan, email in loans
    ]


@router.get("/investments", response_model=list[AdminInvestmentResponse])
async def get_all_investments(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.ADMIN
    )
    result = await db.execute(
        select(
            Investment,
            User.email
        )
        .join(
            User,
            Investment.investor_id == User.id
        )
        .where(
            User.role != UserRole.ADMIN
        )
    )
    investments = result.all()
    return [
        {
            "id": investment.id,
            "loan_id": investment.loan_id,
            "investor_email": email,
            "amount": investment.amount,
            "created_at": investment.created_at
        }
        for investment, email in investments
    ]


@router.get("/transactions", response_model=list[AdminTransactionResponse])
async def get_all_transactions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.ADMIN
    )
    result = await db.execute(
        select(
            Transaction,
            User.email
        )
        .join(
            User,
            Transaction.user_id == User.id
        )
        .where(
            User.role != UserRole.ADMIN
        )
    )
    transactions = result.all()
    return [
        {
            "id": transaction.id,
            "user_email": email,
            "type": transaction.type,
            "amount": transaction.amount,
            "description": transaction.description,
            "created_at": transaction.created_at
        }
        for transaction, email in transactions
    ]