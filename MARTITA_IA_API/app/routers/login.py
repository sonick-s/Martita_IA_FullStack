# app/routers/login.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.database import get_db
from app.models import Usuarios
from app.security import create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas import LoginRequest, TokenResponse

router = APIRouter(tags=["Login"])

@router.post("/login", response_model=TokenResponse)
async def login_for_access_token(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Usuarios).filter(Usuarios.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id_usuario}
