def calculate_new_credit_score(current_score: int, is_repaid_on_time: bool) -> int:
    """
    Рассчитывает новый кредитный рейтинг пользователя после завершения кредита.
    """
    # Базовые константы (можно изменять)
    MAX_SCORE = 850
    MIN_SCORE = 300
    BONUS_FOR_SUCCESS = 50
    PENALTY_FOR_LATE = 100

    if is_repaid_on_time:
        new_score = current_score + BONUS_FOR_SUCCESS
    else:
        new_score = current_score - PENALTY_FOR_LATE

    # Ограниченный рейтинг от 300 до 850
    if new_score > MAX_SCORE:
        return MAX_SCORE
    if new_score < MIN_SCORE:
        return MIN_SCORE

    return new_score

def get_credit_rating_category(score: int) -> str:
    """Возвращает текстовую категорию рейтинга"""
    if score >= 750:
        return "Excellent"
    elif score >= 650:
        return "Good"
    else:
        return "Risky"