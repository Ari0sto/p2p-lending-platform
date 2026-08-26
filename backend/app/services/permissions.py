from fastapi import HTTPException
from app.models.user import UserRole


def check_role(
    user,
    required_role: UserRole
):

    if user.role != required_role:

        raise HTTPException(
            status_code=403,
            detail="Недостатньо прав для виконання цієї дії"
        )

    return user