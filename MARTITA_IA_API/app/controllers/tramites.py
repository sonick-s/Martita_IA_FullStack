from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.tramites import Tramites
from app.schemas.tramites import TramiteCreate, TramiteUpdate

async def get_tramite(db: AsyncSession, tramite_id: int):
    result = await db.execute(select(Tramites).filter(Tramites.id_tramite == tramite_id))
    return result.scalar_one_or_none()

async def get_tramites(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Tramites).offset(skip).limit(limit))
    return result.scalars().all()

async def create_tramite(tramite: TramiteCreate, db: AsyncSession):
    db_tramite = Tramites(**tramite.model_dump())
    db.add(db_tramite)
    await db.commit()
    await db.refresh(db_tramite)
    return db_tramite

async def update_tramite(tramite_id: int, tramite: TramiteUpdate, db: AsyncSession):
    result = await db.execute(select(Tramites).filter(Tramites.id_tramite == tramite_id))
    db_tramite = result.scalar_one_or_none()
    if not db_tramite:
        return None
    for var, value in tramite.model_dump(exclude_unset=True).items():
        setattr(db_tramite, var, value)
    await db.commit()
    await db.refresh(db_tramite)
    return db_tramite

async def delete_tramite(tramite_id: int, db: AsyncSession):
    result = await db.execute(select(Tramites).filter(Tramites.id_tramite == tramite_id))
    db_tramite = result.scalar_one_or_none()
    if not db_tramite:
        return None
    await db.delete(db_tramite)
    await db.commit()
    return db_tramite
