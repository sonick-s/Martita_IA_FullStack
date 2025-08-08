from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.usuarios import Usuarios
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioCreateWithValidation
from app.config import settings
from passlib.context import CryptContext
from fastapi import HTTPException, status

# 1. Se crea un contexto para el hasheo de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_usuario_id(db: AsyncSession, usuario_id: int):
    result = await db.execute(select(Usuarios).filter(Usuarios.id_usuario == usuario_id))
    return result.scalar_one_or_none()

async def get_usuarios(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Usuarios).offset(skip).limit(limit))
    return result.scalars().all()

async def validate_user_registration(usuario_data: UsuarioCreateWithValidation, db: AsyncSession):
    """
    Valida el registro de usuarios basado en las variables de entorno
    """
    # 1. Verificar si el registro está habilitado
    if not settings.REGISTRO_USUARIOS_HABILITADO:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El registro de usuarios está deshabilitado"
        )
    
    # 2. Validar credenciales de administrador si es requerido
    if settings.REGISTRO_REQUIERE_VALIDACION:
        if (usuario_data.admin_username != settings.REGISTRO_ADMIN_USERNAME or 
            usuario_data.admin_password != settings.REGISTRO_ADMIN_PASSWORD):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales de administrador incorrectas"
            )
    
    # 3. Validar dominio de email si está configurado
    if settings.REGISTRO_DOMINIO_PERMITIDO and usuario_data.email:
        if not usuario_data.email.endswith(settings.REGISTRO_DOMINIO_PERMITIDO):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Solo se permiten emails del dominio {settings.REGISTRO_DOMINIO_PERMITIDO}"
            )
    
    # 4. Verificar límite máximo de usuarios
    result = await db.execute(select(func.count(Usuarios.id_usuario)))
    total_usuarios = result.scalar()
    if total_usuarios >= settings.REGISTRO_MAX_USUARIOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Se ha alcanzado el límite máximo de {settings.REGISTRO_MAX_USUARIOS} usuarios"
        )
    
    # 5. Verificar si el email ya existe
    if usuario_data.email:
        result = await db.execute(select(Usuarios).filter(Usuarios.email == usuario_data.email))
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un usuario con este email"
            )
    
    return True

async def create_usuario_with_validation(usuario: UsuarioCreateWithValidation, db: AsyncSession):
    """
    Crea un usuario con validación completa basada en variables de entorno
    """
    # Validar el registro
    await validate_user_registration(usuario, db)
    
    # Crear el usuario
    hashed_password = pwd_context.hash(usuario.password)
    db_usuario = Usuarios(
        nombre=usuario.nombre, 
        email=usuario.email, 
        password=hashed_password,
        estado=1 if not settings.REGISTRO_REQUIERE_APROBACION else 0  # 0 = pendiente de aprobación
    )
    db.add(db_usuario)
    await db.commit()
    await db.refresh(db_usuario)
    return db_usuario

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