import pytest
from finance_logic import (
    Loan, LoanStatus, 
    process_investment, calculate_expected_return
)

# Тесты для calculate_expected_return

def test_calculate_expected_return_normal():
    # Arrange (Подготовка)
    amount = 1000
    interest = 12.0
    term = 30
    
    # Act (Действие)
    result = calculate_expected_return(amount, interest, term)
    
    # Assert (Проверка) - (1000 * 0.12 * 30/365)
    assert result == 9.86 

def test_calculate_expected_return_zero_term():
    result = calculate_expected_return(1000, 12.0, 0)
    assert result == 0.0

# Тесты для process_investment

def test_successful_partial_investment():
    # Подготовка: нужен кредит на 10000
    loan = Loan(id=1, amount=10000, interest_rate=12.0, term_days=30)
    
    # Действие: инвестируем 3000
    updated_loan = process_investment(loan, 3000)
    
    # Проверка
    assert updated_loan.funded_amount == 3000
    assert updated_loan.status == LoanStatus.OPEN

def test_investment_closes_loan():
    # Подготовка: кредит на 10000, где уже собрано 7000
    loan = Loan(id=1, amount=10000, funded_amount=7000, interest_rate=12.0, term_days=30)
    
    # Действие: инвестируем последние 3000
    updated_loan = process_investment(loan, 3000)
    
    # Проверка
    assert updated_loan.funded_amount == 10000
    assert updated_loan.status == LoanStatus.FUNDED

def test_investment_negative_amount_raises_error():
    loan = Loan(id=1, amount=10000, interest_rate=12.0, term_days=30)
    
    # Проверка, что функция вызывает ошибку ValueError
    with pytest.raises(ValueError, match="Сумма инвестиции должна быть больше нуля"):
        process_investment(loan, -500)

def test_invest_in_closed_loan_raises_error():
    # Подготовка: уже профинансированный кредит
    loan = Loan(id=1, amount=10000, funded_amount=10000, interest_rate=12.0, term_days=30, status=LoanStatus.FUNDED)
    
    with pytest.raises(ValueError, match="В этот кредит больше нельзя инвестировать"):
        process_investment(loan, 1000)

def test_investment_exceeds_needed_amount_raises_error():
    loan = Loan(id=1, amount=10000, funded_amount=8000, interest_rate=12.0, term_days=30)
    
    # Нужно еще 2000, пытаемся дать 3000
    with pytest.raises(ValueError, match="Слишком большая сумма"):
        process_investment(loan, 3000)