import pytest
from app.models.loan import Loan, LoanStatus
from app.services.finance_logic import (
    calculate_expected_return,
    validate_loan_creation,
    process_investment
)

def test_calculate_expected_return():
    # 10000 * 12% * (30 дней / 365) = 98.63
    profit = calculate_expected_return(10000, 12, 30)
    assert profit == 98.63

def test_validate_loan_creation_invalid_amount():
    with pytest.raises(ValueError, match="Сумма кредита должна быть больше нуля."):
        validate_loan_creation(0, 10, 30)

def test_process_investment_success():
    # Создание тестового кредита (нужно собрать 10000, уже есть 2000)
    loan = Loan(amount=10000, funded_amount=2000, status=LoanStatus.OPEN)
    
    # Инвестируем 3000
    updated_loan = process_investment(loan, 3000)
    
    assert updated_loan.funded_amount == 5000
    assert updated_loan.status == LoanStatus.OPEN

def test_process_investment_completes_loan():
    # Осталось собрать ровно 3000
    loan = Loan(amount=10000, funded_amount=7000, status=LoanStatus.OPEN)
    updated_loan = process_investment(loan, 3000)
    
    assert updated_loan.funded_amount == 10000
    assert updated_loan.status == LoanStatus.FUNDED # Статус должен смениться

def test_process_investment_too_much():
    loan = Loan(amount=10000, funded_amount=8000, status=LoanStatus.OPEN)
    with pytest.raises(ValueError, match="Сумма превышает потребность."):
        process_investment(loan, 3000)