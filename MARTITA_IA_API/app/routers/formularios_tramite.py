from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.schemas.formularios_tramite import FormularioTramiteCreate, FormularioTramiteUpdate, FormularioTramiteRead
from app.controllers import (
    get_formularios,
    get_formulario,
    create_formulario as create_formulario_controller,
    update_formulario as update_formulario_controller,
    delete_formulario as delete_formulario_controller,
)
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/formularios-tramite", tags=["Formularios Trámite"])

@router.get("/", response_model=List[FormularioTramiteRead])
async def read_formularios(db: AsyncSession = Depends(get_db)):
    return await get_formularios(db)

@router.get("/{id_formulario}", response_model=FormularioTramiteRead)
async def read_formulario(id_formulario: int, db: AsyncSession = Depends(get_db)):
    formulario = await get_formulario(db, id_formulario)
    if not formulario:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return formulario

@router.post("/", response_model=FormularioTramiteRead, status_code=status.HTTP_201_CREATED)
async def create_formulario(formulario: FormularioTramiteCreate, db: AsyncSession = Depends(get_db)):
    return await create_formulario_controller(db, formulario)

@router.put("/{id_formulario}", response_model=FormularioTramiteRead)
async def update_formulario(id_formulario: int, formulario: FormularioTramiteUpdate, db: AsyncSession = Depends(get_db)):
    formulario = await update_formulario_controller(db, id_formulario, formulario)
    if not formulario:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return formulario

@router.delete("/{id_formulario}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_formulario(id_formulario: int, db: AsyncSession = Depends(get_db)):
    formulario = await delete_formulario_controller(db, id_formulario)
    if not formulario:
        raise HTTPException(status_code=404, detail="Formulario no encontrado")
    return None
