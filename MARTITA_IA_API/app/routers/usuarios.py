
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Usuarios
from app.schemas.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioRead, UsuarioCreateWithValidation
from app.controllers import (
    get_usuarios,
    get_usuario_id,
    create_usuario,
    create_usuario_with_validation,
    update_usuario,
    delete_usuario,
)
from app.security import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/", response_model=List[UsuarioRead])
async def read_usuarios(db: AsyncSession = Depends(get_db), current_user: Usuarios = Depends(get_current_user)):
    return await get_usuarios(db)


@router.get("/{id_usuario}", response_model=UsuarioRead)
async def read_usuario(id_usuario: int, db: AsyncSession = Depends(get_db), current_user: Usuarios = Depends(get_current_user)):
    usuario = await get_usuario_id(db, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.post("/", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
async def create_nuevo_usuario(usuario: UsuarioCreateWithValidation, db: AsyncSession = Depends(get_db)):
    return await create_usuario_with_validation(usuario, db)


@router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
async def register_usuario_with_validation(usuario: UsuarioCreateWithValidation, db: AsyncSession = Depends(get_db)):
    return await create_usuario_with_validation(usuario, db)


@router.post("/simple", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
async def create_usuario_simple(usuario: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    return await create_usuario(usuario, db)


@router.put("/{id_usuario}", response_model=UsuarioRead)
async def actualizar_usuario(id_usuario: int, usuario: UsuarioUpdate, db: AsyncSession = Depends(get_db), current_user: Usuarios = Depends(get_current_user)):
    usuario_actualizado = await update_usuario(id_usuario, usuario, db)
    if not usuario_actualizado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario_actualizado


@router.delete("/{id_usuario}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_usuario(id_usuario: int, db: AsyncSession = Depends(get_db), current_user: Usuarios = Depends(get_current_user)):
    usuario_eliminado = await delete_usuario(id_usuario, db)
    if not usuario_eliminado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return None