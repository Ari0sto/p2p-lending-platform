from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.loan import Loan, LoanStatus
from app.models.investment import Investment
from app.models.user import User, UserRole
from app.models.transaction import Transaction, TransactionType
from app.schemas.investment import InvestmentCreate, InvestmentResponse
from app.services.finance_logic import process_investment

from app.services.permissions import check_role
from app.services.dependencies import get_current_user


router = APIRouter(prefix="/investments", tags=["Investments"])

@router.post("/", response_model=InvestmentResponse)
async def make_investment(inv_in: InvestmentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    # Проверка роли инвестора
    check_role(
        current_user,
        UserRole.INVESTOR
    )


    # 1. поиск кредита в базе
    result = await db.execute(select(Loan).where(Loan.id == inv_in.loan_id))
    loan = result.scalars().first()

    if not loan:
        raise HTTPException(status_code=404, detail="Кредит не знайдено")

    investment_amount = Decimal(
        str(inv_in.amount)
    )

    # Проверяем баланс инвестора
    if Decimal(str(current_user.balance)) < investment_amount:
        raise HTTPException(
            status_code=400,
            detail="Недостатньо коштів на балансі"
        )

    try:
        # 2. Вызов логики (проверки + смена статуса + пересчет сумм)
        loan = process_investment(loan, inv_in.amount)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

        # Списываем деньги с баланса инвестора
    current_user.balance = (
            Decimal(str(current_user.balance))
            - investment_amount
    )

    # 3. Сохр. новую инвестицию
    new_inv = Investment(
        loan_id=loan.id,
        investor_id=current_user.id,  # пользователь из JWT
        amount=investment_amount
    )

    # Создаем транзакцию инвестора
    investment_transaction = Transaction(
        user_id=current_user.id,
        type=TransactionType.INVESTMENT,
        amount=investment_amount,
        description=f"Інвестиція в кредит №{loan.id}"
    )

    db.add(new_inv)
    db.add(loan)
    db.add(investment_transaction)

    # Если кредит полностью собран
    if loan.status == LoanStatus.FUNDED:

        result = await db.execute(
            select(User).where(
                User.id == loan.borrower_id
            )
        )

        borrower = result.scalar_one_or_none()

        if borrower is None:
            raise HTTPException(
                status_code=404,
                detail="Позичальника не знайдено"
            )

        loan_amount = Decimal(
            str(loan.amount)
        )

        # Перечисляем всю сумму кредита заемщику
        borrower.balance = (
                Decimal(str(borrower.balance))
                + loan_amount
        )

        # Кредит выдан и становится активным
        loan.status = LoanStatus.ACTIVE

        # Транзакция получения кредита
        loan_transaction = Transaction(
            user_id=borrower.id,
            type=TransactionType.LOAN_RECEIVED,
            amount=loan_amount,
            description=f"Отримання кредиту №{loan.id}"
        )
        db.add(borrower)
        db.add(loan_transaction)

    await db.commit()
    await db.refresh(new_inv)

    return new_inv