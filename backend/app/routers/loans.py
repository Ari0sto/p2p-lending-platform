from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.loan import Loan, LoanStatus
from app.models.investment import Investment
from app.models.transaction import Transaction, TransactionType
from app.schemas.loan import LoanCreate, LoanResponse
from app.services.finance_logic import validate_loan_creation, calculate_expected_return

from app.services.permissions import check_role
from app.models.user import User, UserRole
from app.services.dependencies import get_current_user
from app.services.scoring_logic import update_credit_score


router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("/", response_model=LoanResponse)
async def create_loan(loan_in: LoanCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    # Проверка роли пользователя
    check_role(
        current_user,
        UserRole.BORROWER
    )


    try:
        # ВЫЗОВ ЛОГИКИ ДЛЯ ПРОВЕРКИ
        validate_loan_creation(
            loan_in.amount,
            loan_in.interest_rate,
            loan_in.term_days
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    new_loan = Loan(
        borrower_id=current_user.id,  # пользователь из JWT
        amount=loan_in.amount,
        interest_rate=loan_in.interest_rate,
        term_days=loan_in.term_days,
        description=loan_in.description
    )
    db.add(new_loan)
    await db.commit()
    await db.refresh(new_loan)
    return new_loan


# Погашення кредиту
@router.post("/{loan_id}/repay", response_model=LoanResponse)
async def repay_loan(loan_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Погашати кредит може тільки BORROWER
    check_role(
        current_user,
        UserRole.BORROWER
    )
    # Шукаємо кредит
    result = await db.execute(
        select(Loan).where(
            Loan.id == loan_id
        )
    )
    loan = result.scalar_one_or_none()
    if loan is None:
        raise HTTPException(
            status_code=404,
            detail="Кредит не знайдено"
        )
    # Borrower може погашати тільки свій кредит
    if loan.borrower_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Ви не можете погашати чужий кредит"
        )
    # Погашати можна тільки виданий активний кредит
    if loan.status != LoanStatus.ACTIVE:
        raise HTTPException(
            status_code=400,
            detail="Погашати можна тільки активний кредит"
        )
    # Отримуємо всі інвестиції цього кредиту
    result = await db.execute(
        select(
            Investment,
            User
        )
        .join(
            User,
            Investment.investor_id == User.id
        )
        .where(
            Investment.loan_id == loan.id
        )
    )
    investment_rows = result.all()
    if not investment_rows:
        raise HTTPException(
            status_code=400,
            detail="Для цього кредиту не знайдено інвестицій"
        )
    total_profit = Decimal("0.00")
    investor_payments = []
    # Розраховуємо прибуток кожного інвестора
    for investment, investor in investment_rows:
        investment_amount = Decimal(
            str(investment.amount)
        )
        profit = Decimal(
            str(
                calculate_expected_return(
                    investment.amount,
                    loan.interest_rate,
                    loan.term_days
                )
            )
        ).quantize(
            Decimal("0.01")
        )
        total_profit += profit
        investor_payments.append(
            (
                investor,
                investment_amount,
                profit
            )
        )
    loan_amount = Decimal(
        str(loan.amount)
    )
    # Загальна сума, яку повинен повернути borrower
    total_repayment = (
        loan_amount
        + total_profit
    )
    borrower_balance = Decimal(
        str(current_user.balance)
    )
    # Перевіряємо баланс borrower
    if borrower_balance < total_repayment:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Недостатньо коштів для погашення кредиту. "
                f"Необхідно: {total_repayment}"
            )
        )
    # Списуємо гроші з borrower
    current_user.balance = (
        borrower_balance
        - total_repayment
    )
    # Запис про погашення кредиту
    repayment_transaction = Transaction(
        user_id=current_user.id,
        type=TransactionType.REPAYMENT,
        amount=total_repayment,
        description=f"Погашення кредиту №{loan.id}"
    )
    db.add(repayment_transaction)
    # Повертаємо гроші інвесторам
    for investor, investment_amount, profit in investor_payments:
        investor.balance = (
            Decimal(str(investor.balance))
            + investment_amount
            + profit
        )
        # У транзакції PROFIT зберігаємо саме прибуток
        profit_transaction = Transaction(
            user_id=investor.id,
            type=TransactionType.PROFIT,
            amount=profit,
            description=(
                f"Прибуток за кредитом №{loan.id}. "
                f"Повернено інвестицію: {investment_amount}"
            )
        )
        db.add(profit_transaction)
    # Кредит повністю погашений
    current_user.credit_score = update_credit_score(
        current_user.credit_score,
        True
    )
    loan.status = LoanStatus.PAID
    await db.commit()
    await db.refresh(loan)
    return loan


# Доступні кредити для інвестора
@router.get("/available", response_model=list[LoanResponse])
async def get_available_loans(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.INVESTOR
    )
    result = await db.execute(
        select(Loan).where(
            Loan.status == LoanStatus.OPEN
        )
    )
    return result.scalars().all()


# Деталі конкретного доступного кредиту
@router.get("/{loan_id}", response_model=LoanResponse)
async def get_loan_details(loan_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_role(
        current_user,
        UserRole.INVESTOR
    )
    result = await db.execute(
        select(Loan).where(
            Loan.id == loan_id,
            Loan.status == LoanStatus.OPEN
        )
    )
    loan = result.scalar_one_or_none()
    if loan is None:
        raise HTTPException(
            status_code=404,
            detail="Доступний кредит не знайдено"
        )
    return loan