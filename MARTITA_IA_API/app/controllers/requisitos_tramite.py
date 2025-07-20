from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.requisitos_tramite import RequisitosTramite
from app.schemas.requisitos_tramite import RequisitoTramiteCreate, RequisitoTramiteUpdate

async def get_requisito(db: AsyncSession, requisito_id: int):
    result = await db.execute(select(RequisitosTramite).filter(RequisitosTramite.id_requisito == requisito_id))
    return result.scalar_one_or_none()

async def get_requisitos(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(RequisitosTramite).offset(skip).limit(limit))
    return result.scalars().all()

async def create_requisito(requisito: RequisitoTramiteCreate, db: AsyncSession):
    db_requisito = RequisitosTramite(**requisito.model_dump())
    db.add(db_requisito)
    await db.commit()
    await db.refresh(db_requisito)
    return db_requisito

async def update_requisito(requisito_id: int, requisito: RequisitoTramiteUpdate, db: AsyncSession):
    result = await db.execute(select(RequisitosTramite).filter(RequisitosTramite.id_requisito == requisito_id))
    db_requisito = result.scalar_one_or_none()
    if not db_requisito:
        return None
    for var, value in requisito.model_dump(exclude_unset=True).items():
        setattr(db_requisito, var, value)
    await db.commit()
    await db.refresh(db_requisito)
    return db_requisito

async def delete_requisito(requisito_id: int, db: AsyncSession):
    result = await db.execute(select(RequisitosTramite).filter(RequisitosTramite.id_requisito == requisito_id))
    db_requisito = result.scalar_one_or_none()
    if not db_requisito:
        return None
    await db.delete(db_requisito)
    await db.commit()
    return db_requisito
