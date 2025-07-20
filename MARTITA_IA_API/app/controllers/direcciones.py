from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.direcciones import Direcciones
from app.schemas.direcciones import DireccionCreate, DireccionUpdate
from datetime import date

async def get_direcciones_id(db: AsyncSession, direccion_id: int):
    result = await db.execute(select(Direcciones).filter(Direcciones.id_direcciones == direccion_id))
    direccion = result.scalar_one_or_none()
    if direccion and hasattr(direccion, 'correo_responsable'):
        correo = getattr(direccion, 'correo_responsable', None)
        if not correo or '@' not in correo:
            setattr(direccion, 'correo_responsable', None)
    return direccion

async def get_direcciones(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Direcciones).offset(skip).limit(limit))
    direcciones = result.scalars().all()
    for direccion in direcciones:
        if direccion and hasattr(direccion, 'correo_responsable'):
            correo = getattr(direccion, 'correo_responsable', None)
            if not correo or '@' not in correo:
                setattr(direccion, 'correo_responsable', None)
    return direcciones

async def create_direcciones(direccion: DireccionCreate, db: AsyncSession):
    db_direccion_data = direccion.model_dump()
    db_direccion_data['fecha_actualizacion'] = date.today()
    db_direccion = Direcciones(**db_direccion_data)
    db.add(db_direccion)
    await db.commit()
    await db.refresh(db_direccion)
    return db_direccion

async def update_direcciones(direccion_id: int, direccion: DireccionUpdate, db: AsyncSession):
    result = await db.execute(select(Direcciones).filter(Direcciones.id_direcciones == direccion_id))
    db_direccion = result.scalar_one_or_none()
    if not db_direccion:
        return None
    for var, value in direccion.model_dump(exclude_unset=True).items():
        setattr(db_direccion, var, value)
    db_direccion.fecha_actualizacion = date.today()
    await db.commit()
    await db.refresh(db_direccion)
    return db_direccion

async def delete_direcciones(direccion_id: int, db: AsyncSession):
    result = await db.execute(select(Direcciones).filter(Direcciones.id_direcciones == direccion_id))
    db_direccion = result.scalar_one_or_none()
    if not db_direccion:
        return None
    await db.delete(db_direccion)
    await db.commit()
    return db_direccion