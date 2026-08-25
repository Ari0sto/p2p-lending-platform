def get_initial_credit_score() -> int:
    """Базовый скоринг для новых пользователей"""
    return 700

def update_credit_score(current_score: int, is_repaid_on_time: bool) -> int:
    """
    ТЗ: Credit Score должен зависеть от истории предыдущих кредитов.
    """
    if is_repaid_on_time:
        new_score = current_score + 50
    else:
        new_score = current_score - 100
        
    # Ограничения рейтинга (от 300 до 850)
    if new_score > 850:
        return 850
    if new_score < 300:
        return 300
        
    return new_score

def get_credit_category(score: int) -> str:
    """
    ТЗ: 850 — Excellent, 700 — Good, 500 — Risky
    """
    if score >= 750:
        return "Excellent"
    elif score >= 650:
        return "Good"
    else:
        return "Risky"