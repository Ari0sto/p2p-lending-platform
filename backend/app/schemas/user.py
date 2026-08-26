from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
from enum import Enum


class RegisterRole(str, Enum):
    INVESTOR = "INVESTOR"
    BORROWER = "BORROWER"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: RegisterRole


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class DepositRequest(BaseModel):
    amount: float


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    balance: float
    credit_score: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str