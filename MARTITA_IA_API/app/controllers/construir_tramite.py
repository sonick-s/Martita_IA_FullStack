from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.tramites import Tramites
from app.models.requisitos_tramite import RequisitosTramite
from app.models.formularios_tramite import FormulariosTramite
from app.models.direcciones import Direcciones
from app.models.pasos_tramite import PasosTramite

async def get_tramites_estructurados(db: AsyncSession):
    result = await db.execute(
        select(Tramites)
        .options(
            selectinload(Tramites.requisitos),
            selectinload(Tramites.formularios),
            selectinload(Tramites.pasos),
            selectinload(Tramites.direccion)
        )
    )
    tramites = result.scalars().all()
    for tramite in tramites:
        if tramite.direccion and hasattr(tramite.direccion, 'correo_responsable'):
            if getattr(tramite.direccion, 'correo_responsable', None) == '':
                setattr(tramite.direccion, 'correo_responsable', None)
    return tramites

async def get_tramite_estructurado_by_id(tramite_id: int, db: AsyncSession):
    result = await db.execute(
        select(Tramites)
        .where(Tramites.id_tramite == tramite_id)
        .options(
            selectinload(Tramites.requisitos),
            selectinload(Tramites.formularios),
            selectinload(Tramites.pasos),
            selectinload(Tramites.direccion)
        )
    )
    tramite = result.scalar_one_or_none()
    if tramite and tramite.direccion and hasattr(tramite.direccion, 'correo_responsable'):
        if getattr(tramite.direccion, 'correo_responsable', None) == '':
            setattr(tramite.direccion, 'correo_responsable', None)
    return tramite