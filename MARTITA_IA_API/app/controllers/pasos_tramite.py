from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.pasos_tramite import PasosTramite
from app.schemas.pasos_tramite import PasoTramiteCreate, PasoTramiteUpdate

async def get_paso(db: AsyncSession, paso_id: int):
    result = await db.execute(select(PasosTramite).filter(PasosTramite.id_paso == paso_id))
    return result.scalar_one_or_none()

async def get_pasos(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(PasosTramite).offset(skip).limit(limit))
    return result.scalars().all()

async def create_paso(paso: PasoTramiteCreate, db: AsyncSession):
    db_paso = PasosTramite(**paso.model_dump())
    db.add(db_paso)
    await db.commit()
    await db.refresh(db_paso)
    return db_paso

async def update_paso(paso_id: int, paso: PasoTramiteUpdate, db: AsyncSession):
    result = await db.execute(select(PasosTramite).filter(PasosTramite.id_paso == paso_id))
    db_paso = result.scalar_one_or_none()
    if not db_paso:
        return None
    for var, value in paso.model_dump(exclude_unset=True).items():
        setattr(db_paso, var, value)
    await db.commit()
    await db.refresh(db_paso)
    return db_paso

async def delete_paso(paso_id: int, db: AsyncSession):
    result = await db.execute(select(PasosTramite).filter(PasosTramite.id_paso == paso_id))
    db_paso = result.scalar_one_or_none()
    if not db_paso:
        return None
    await db.delete(db_paso)
    await db.commit()
    return db_paso
