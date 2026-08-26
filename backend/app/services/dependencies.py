from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.database import get_db
from app.models.user import User


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Недійсний токен"
    )

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[
                settings.JWT_ALGORITHM
            ]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception


    result = await db.execute(
        select(User).where(
            User.id == int(user_id)
        )
    )

    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Користувача не знайдено"
        )

    return user