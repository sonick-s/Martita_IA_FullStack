from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioCreate(BaseModel):
    nombre: Optional[str]
    email: Optional[EmailStr]
    password: str
    fecha_registro: Optional[datetime]

class UsuarioRead(BaseModel):
    id_usuario: int
    nombre: Optional[str]
    email: Optional[EmailStr]
    estado: Optional[int]
    fecha_registro: Optional[datetime]

    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    nombre: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    estado: Optional[int]
    fecha_registro: Optional[datetime]
