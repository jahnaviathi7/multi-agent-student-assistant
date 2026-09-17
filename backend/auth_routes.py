from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from .auth import (
    authenticate_user,
    create_access_token,
    create_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REQUEST MODELS
# ==========================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
def register(
    request: RegisterRequest
):
    if len(request.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    user = create_user(
        request.name.strip(),
        request.email,
        request.password,
    )

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered."
        )

    token = create_access_token(
        user["id"],
        user["email"],
    )

    return {
        "success": True,
        "message": "Registration successful.",
        "token": token,
        "user": user,
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    request: LoginRequest
):
    user = authenticate_user(
        request.email,
        request.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        user["id"],
        user["email"],
    )

    return {
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        },
    }