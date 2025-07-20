from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.schemas.direcciones import DireccionCreate, DireccionUpdate, DireccionRead
from app.security import get_current_user
from app.controllers import (
    get_direcciones_id,
    get_direcciones,
    create_direcciones,
    update_direcciones,
    delete_direcciones,
)

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])

@router.get("/", response_model=List[DireccionRead])
async def read_direcciones(db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return await get_direcciones(db)

@router.get("/{id_direccion}", response_model=DireccionRead)
async def read_direcciones(id_direccion: int, db: AsyncSession = Depends(get_db)):
    direccion = await get_direcciones_id(db, id_direccion)
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return direccion

@router.post("/", response_model=DireccionRead, status_code=status.HTTP_201_CREATED)
async def create_nueva_direccion(direccion: DireccionCreate, db: AsyncSession = Depends(get_db)):
    return await create_direcciones(direccion, db)

@router.put("/{id_direccion}", response_model=DireccionRead)
async def actualizar_direccion(id_direccion: int, direccion: DireccionUpdate, db: AsyncSession = Depends(get_db)):
    direccion = await update_direcciones(id_direccion, direccion, db)
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return direccion

@router.delete("/{id_direccion}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_direccion(id_direccion: int, db: AsyncSession = Depends(get_db)):
    direccion = await delete_direcciones(id_direccion, db)
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return None
