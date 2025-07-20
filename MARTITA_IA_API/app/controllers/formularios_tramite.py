from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.formularios_tramite import FormulariosTramite
from app.schemas.formularios_tramite import FormularioTramiteCreate, FormularioTramiteUpdate

async def get_formulario(db: AsyncSession, formulario_id: int):
    result = await db.execute(select(FormulariosTramite).filter(FormulariosTramite.id_formulario == formulario_id))
    return result.scalar_one_or_none()

async def get_formularios(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(FormulariosTramite).offset(skip).limit(limit))
    return result.scalars().all()

async def create_formulario(db: AsyncSession, formulario: FormularioTramiteCreate):
    db_formulario = FormulariosTramite(**formulario.model_dump())
    db.add(db_formulario)
    await db.commit()
    await db.refresh(db_formulario)
    return db_formulario

async def update_formulario(db: AsyncSession, formulario_id: int, formulario: FormularioTramiteUpdate):
    result = await db.execute(select(FormulariosTramite).filter(FormulariosTramite.id_formulario == formulario_id))
    db_formulario = result.scalar_one_or_none()
    if not db_formulario:
        return None
    for var, value in formulario.model_dump(exclude_unset=True).items():
        setattr(db_formulario, var, value)
    await db.commit()
    await db.refresh(db_formulario)
    return db_formulario

async def delete_formulario(db: AsyncSession, formulario_id: int):
    result = await db.execute(select(FormulariosTramite).filter(FormulariosTramite.id_formulario == formulario_id))
    db_formulario = result.scalar_one_or_none()
    if not db_formulario:
        return None
    await db.delete(db_formulario)
    await db.commit() 
    return db_formulario
