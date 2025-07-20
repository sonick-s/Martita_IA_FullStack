from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.requisitos_tramite import RequisitoTramiteCreate, RequisitoTramiteUpdate, RequisitoTramiteRead
from app.controllers import (
    get_requisitos,
    get_requisito,
    create_requisito,
    update_requisito,
    delete_requisito,
)

router = APIRouter(prefix="/requisitos-tramite", tags=["Requisitos Trámite"])

@router.get("/", response_model=List[RequisitoTramiteRead])
async def read_requisitos(db: AsyncSession = Depends(get_db)):
    return await get_requisitos(db)

@router.get("/{id_requisito}", response_model=RequisitoTramiteRead)
async def read_requisito(id_requisito: int, db: AsyncSession = Depends(get_db)):
    requisito = await get_requisito(db, id_requisito)
    if not requisito:
        raise HTTPException(status_code=404, detail="Requisito no encontrado")
    return requisito

@router.post("/", response_model=RequisitoTramiteRead, status_code=status.HTTP_201_CREATED)
async def create_nuevo_requisito(requisito: RequisitoTramiteCreate, db: AsyncSession = Depends(get_db)):
    return await create_requisito(requisito, db)

@router.put("/{id_requisito}", response_model=RequisitoTramiteRead)
async def actualizar_requisito(id_requisito: int, requisito: RequisitoTramiteUpdate, db: AsyncSession = Depends(get_db)):
    requisito = await update_requisito(id_requisito, requisito, db)
    if not requisito:
        raise HTTPException(status_code=404, detail="Requisito no encontrado")
    return requisito

@router.delete("/{id_requisito}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_requisito(id_requisito: int, db: AsyncSession = Depends(get_db)):
    requisito = await delete_requisito(id_requisito, db)
    if not requisito:
        raise HTTPException(status_code=404, detail="Requisito no encontrado")
    return None
