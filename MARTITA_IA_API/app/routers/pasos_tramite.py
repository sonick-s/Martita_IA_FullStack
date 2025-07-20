from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.pasos_tramite import PasoTramiteCreate, PasoTramiteUpdate, PasoTramiteRead
from app.controllers import (
    get_pasos,
    get_paso,
    create_paso,
    update_paso,
    delete_paso,
)

router = APIRouter(prefix="/pasos-tramite", tags=["Pasos Trámite"])

@router.get("/", response_model=List[PasoTramiteRead])
async def read_pasos(db: AsyncSession = Depends(get_db)):
    return await get_pasos(db)

@router.get("/{id_paso}", response_model=PasoTramiteRead)
async def read_paso(id_paso: int, db: AsyncSession = Depends(get_db)):
    paso = await get_paso(db, id_paso)
    if not paso:
        raise HTTPException(status_code=404, detail="Paso no encontrado")
    return paso

@router.post("/", response_model=PasoTramiteRead, status_code=status.HTTP_201_CREATED)
async def create_nuevo_paso(paso: PasoTramiteCreate, db: AsyncSession = Depends(get_db)):
    return await create_paso(paso, db)

@router.put("/{id_paso}", response_model=PasoTramiteRead)
async def actualizar_paso(id_paso: int, paso: PasoTramiteUpdate, db: AsyncSession = Depends(get_db)):
    paso = await update_paso(id_paso, paso, db)
    if not paso:
        raise HTTPException(status_code=404, detail="Paso no encontrado")
    return paso

@router.delete("/{id_paso}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_paso(id_paso: int, db: AsyncSession = Depends(get_db)):
    paso = await delete_paso(id_paso, db)
    if not paso:
        raise HTTPException(status_code=404, detail="Paso no encontrado")
    return None
