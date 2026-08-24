from pydantic import BaseModel
from enum import Enum

# 1. Локальные схемы (для API)
class LoanStatus(str, Enum):
    OPEN = "OPEN"
    FUNDED = "FUNDED"

class Loan(BaseModel):
    id: int
    amount: float
    funded_amount: float = 0.0
    interest_rate: float
    term_days: int
    status: LoanStatus = LoanStatus.OPEN

# 2. ФУНКЦИИ (Бизнес-логика)

def calculate_expected_return(amount: float, interest_rate: float, term_days: int) -> float:
    """Считает ожидаемую прибыль для инвестора"""
    profit = amount * (interest_rate / 100) * (term_days / 365)
    return round(profit, 2)

def process_investment(loan: Loan, investment_amount: float) -> Loan:
    """
    Проверяет инвестицию и обновляет статус кредита.
    Возвращает обновленный объект кредита.
    """
    # Проверки
    if investment_amount <= 0:
        raise ValueError("Сумма инвестиции должна быть больше нуля.")
        
    if loan.status != LoanStatus.OPEN:
        raise ValueError("В этот кредит больше нельзя инвестировать.")
        
    remaining_needed = loan.amount - loan.funded_amount
    if investment_amount > remaining_needed:
        raise ValueError(f"Слишком большая сумма. Осталось собрать только ${remaining_needed}")

    # Логика изменения состояния
    loan.funded_amount += investment_amount

    # Смена статуса, если собрали всё
    if loan.funded_amount == loan.amount:
        loan.status = LoanStatus.FUNDED

    return loan