from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.construir_tramite import TramiteEstructuradoRead
from app.controllers import get_tramites_estructurados, get_tramite_estructurado_by_id
from fastapi import Path

router = APIRouter(prefix="/construir-tramite", tags=["Construir Trámite"])

@router.get("/estructurado", response_model=List[TramiteEstructuradoRead])
async def read_tramites_estructurados(db: AsyncSession = Depends(get_db)):
    return await get_tramites_estructurados(db)

@router.get("/estructurado/{tramite_id}", response_model=TramiteEstructuradoRead)
async def read_tramite_estructurado_by_id(
    tramite_id: int = Path(..., description="ID del trámite estructurado"),
    db: AsyncSession = Depends(get_db)
):
    tramite = await get_tramite_estructurado_by_id(tramite_id, db)
    if not tramite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trámite con ID {tramite_id} no encontrado"
        )
    return tramite