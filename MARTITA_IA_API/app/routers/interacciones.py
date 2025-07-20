from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.interacciones import InteraccionCreate, InteraccionUpdate, InteraccionRead
from app.controllers import (
    get_interacciones,
    get_interaccion,
    create_interaccion,
    update_interaccion,
    delete_interaccion,
)

router = APIRouter(prefix="/interacciones", tags=["Interacciones"])

@router.get("/", response_model=List[InteraccionRead])
async def read_interacciones(db: AsyncSession = Depends(get_db)):
    return await get_interacciones(db)

@router.get("/{id_interaccion}", response_model=InteraccionRead)
async def read_interaccion(id_interaccion: int, db: AsyncSession = Depends(get_db)):
    interaccion = await get_interaccion(db, id_interaccion)
    if not interaccion:
        raise HTTPException(status_code=404, detail="Interacción no encontrada")
    return interaccion

@router.post("/", response_model=InteraccionRead, status_code=status.HTTP_201_CREATED)
async def create_nueva_interaccion(interaccion: InteraccionCreate, db: AsyncSession = Depends(get_db)):
    return await create_interaccion(interaccion, db)

@router.put("/{id_interaccion}", response_model=InteraccionRead)
async def actualizar_interaccion(id_interaccion: int, interaccion: InteraccionUpdate, db: AsyncSession = Depends(get_db)):
    interaccion = await update_interaccion(id_interaccion, interaccion, db)
    if not interaccion:
        raise HTTPException(status_code=404, detail="Interacción no encontrada")
    return interaccion

@router.delete("/{id_interaccion}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_interaccion(id_interaccion: int, db: AsyncSession = Depends(get_db)):
    interaccion = await delete_interaccion(id_interaccion, db)
    if not interaccion:
        raise HTTPException(status_code=404, detail="Interacción no encontrada")
    return None
