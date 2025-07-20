from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.usuarios import Usuarios
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate
from passlib.context import CryptContext

# 1. Se crea un contexto para el hasheo de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_usuario_id(db: AsyncSession, usuario_id: int):
    result = await db.execute(select(Usuarios).filter(Usuarios.id_usuario == usuario_id))
    return result.scalar_one_or_none()

async def get_usuarios(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Usuarios).offset(skip).limit(limit))
    return result.scalars().all()

async def create_usuario(usuario: UsuarioCreate, db: AsyncSession):
    # 2. Se hashea la contraseña antes de guardarla en la base de datos
    hashed_password = pwd_context.hash(usuario.password)
    db_usuario = Usuarios(
        nombre=usuario.nombre, 
        email=usuario.email, 
        password=hashed_password  # Se guarda la contraseña hasheada
    )
    db.add(db_usuario)
    await db.commit()
    await db.refresh(db_usuario)
    return db_usuario

async def update_usuario(usuario_id: int, usuario: UsuarioUpdate, db: AsyncSession):
    result= await db.execute(select(Usuarios).filter(Usuarios.id_usuario == usuario_id))
    db_usuario = result.scalar_one_or_none()
    if not db_usuario:
        return None
    
    update_data = usuario.model_dump(exclude_unset=True)
    # Si se está actualizando la contraseña, también la hasheamos
    if "password" in update_data:
        update_data["password"] = pwd_context.hash(update_data["password"])

    for var, value in update_data.items():
        setattr(db_usuario, var, value)
        
    await db.commit()
    await db.refresh(db_usuario)
    return db_usuario

async def delete_usuario(usuario_id: int, db: AsyncSession):
    result= await db.execute(select(Usuarios).filter(Usuarios.id_usuario == usuario_id))
    db_usuario = result.scalar_one_or_none()
    if not db_usuario:
        return None
    await db.delete(db_usuario)
    await db.commit()
    return db_usuario