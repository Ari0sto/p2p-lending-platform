from app.models.loan import Loan, LoanStatus

def validate_loan_creation(amount: float, interest_rate: float, term_days: int):
    """
    ТЗ: Система должна запрещать создавать некорректные заявки.
    """
    if amount <= 0:
        raise ValueError("Сума кредиту має бути більшою за нуль.")
    if interest_rate <= 0 or interest_rate > 100:
        raise ValueError("Процентна ставка має бути від 0,01 до 100.")
    if term_days <= 0:
        raise ValueError("Термін кредиту повинен бути більшим за нуль.")

def calculate_expected_return(amount: float, interest_rate: float, term_days: int) -> float:
    """
    ТЗ: Расчёт процентов / видеть ожидаемую прибыль.
    """
    # Формула: Сумма * (Процент / 100) * (Дни / 365)
    profit = float(amount) * (float(interest_rate) / 100) * (term_days / 365)
    return round(profit, 2)

def process_investment(loan: Loan, investment_amount: float) -> Loan:
    """
    ТЗ: investment logic, статусы кредитов, ограничения на инвестиции.
    """
    inv_amount = float(investment_amount)
    
    # Система должна запрещать инвестировать отрицательную сумму
    if inv_amount <= 0:
        raise ValueError("Сума інвестиції має бути більшою за нуль.")
        
    # Система должна запрещать инвестировать в закрытый кредит
    if loan.status != LoanStatus.OPEN:
        raise ValueError(f"Не можна інвестувати. Поточний статус кредиту: {loan.status.value}")
        
    # Система должна запрещать инвестировать больше необходимой суммы
    remaining_needed = float(loan.amount) - float(loan.funded_amount)
    if inv_amount > remaining_needed:
        raise ValueError(f"Сума перевищує потребу. Залишилось зібрати: {remaining_needed}")
        
    # Увеличиваем собранную сумму
    loan.funded_amount = float(loan.funded_amount) + inv_amount
    
    # Система должна запрещать инвестировать больше необходимой суммы
    if loan.funded_amount == float(loan.amount):
        loan.status = LoanStatus.FUNDED
        
    return loan