from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.interacciones import Interacciones
from app.schemas.interacciones import InteraccionCreate, InteraccionUpdate

async def get_interaccion(db: AsyncSession, interaccion_id: int):
    result = await db.execute(select(Interacciones).filter(Interacciones.id_interaccion == interaccion_id))
    return result.scalar_one_or_none()

async def get_interacciones(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Interacciones).offset(skip).limit(limit))
    return result.scalars().all()

async def create_interaccion(interaccion: InteraccionCreate, db: AsyncSession):
    db_interaccion = Interacciones(**interaccion.model_dump())
    db.add(db_interaccion)
    await db.commit()
    await db.refresh(db_interaccion)
    return db_interaccion

async def update_interaccion(interaccion_id: int, interaccion: InteraccionUpdate, db: AsyncSession):
    result = await db.execute(select(Interacciones).filter(Interacciones.id_interaccion == interaccion_id))
    db_interaccion = result.scalar_one_or_none()
    if not db_interaccion:
        return None
    for var, value in interaccion.model_dump(exclude_unset=True).items():
        setattr(db_interaccion, var, value)
    await db.commit()
    await db.refresh(db_interaccion)
    return db_interaccion

async def delete_interaccion(interaccion_id: int, db: AsyncSession):
    result = await db.execute(select(Interacciones).filter(Interacciones.id_interaccion == interaccion_id))
    db_interaccion = result.scalar_one_or_none()
    if not db_interaccion:
        return None
    await db.delete(db_interaccion)
    await db.commit()
    return db_interaccion
