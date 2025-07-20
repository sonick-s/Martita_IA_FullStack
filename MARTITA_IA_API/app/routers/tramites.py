from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.tramites import TramiteCreate, TramiteUpdate, TramiteRead
from app.controllers import (
    get_tramites,
    get_tramite,
    create_tramite,
    update_tramite,
    delete_tramite,
)

router = APIRouter(prefix="/tramites", tags=["Trámites"])

@router.get("/", response_model=List[TramiteRead])
async def read_tramites(db: AsyncSession = Depends(get_db)):
    return await get_tramites(db)

@router.get("/{id_tramite}", response_model=TramiteRead)
async def read_tramite(id_tramite: int, db: AsyncSession = Depends(get_db)):
    tramite = await get_tramite(db, id_tramite)
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")
    return tramite

@router.post("/", response_model=TramiteRead, status_code=status.HTTP_201_CREATED)
async def create_nuevo_tramite(tramite: TramiteCreate, db: AsyncSession = Depends(get_db)):
    return await create_tramite(tramite, db)

@router.put("/{id_tramite}", response_model=TramiteRead)
async def actualizar_tramite(id_tramite: int, tramite: TramiteUpdate, db: AsyncSession = Depends(get_db)):
    tramite = await update_tramite(id_tramite, tramite, db)
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")
    return tramite

@router.delete("/{id_tramite}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_tramite(id_tramite: int, db: AsyncSession = Depends(get_db)):
    tramite = await delete_tramite(id_tramite, db)
    if not tramite:
        raise HTTPException(status_code=404, detail="Trámite no encontrado")
    return None
