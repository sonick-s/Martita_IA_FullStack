from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class DireccionCreate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    responsable: Optional[str] = None
    correo_responsable: Optional[EmailStr] = None
    telefono: Optional[str] = None
    estado: Optional[int] = None
    fecha_actualizacion: Optional[date] = None

class DireccionUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    responsable: Optional[str] = None
    correo_responsable: Optional[EmailStr] = None
    telefono: Optional[str] = None
    estado: Optional[int] = None
    fecha_actualizacion: Optional[date] = None

class DireccionRead(BaseModel):
    id_direcciones: int
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    responsable: Optional[str] = None
    correo_responsable: Optional[EmailStr] = None
    telefono: Optional[str] = None
    estado: Optional[int] = None
    fecha_actualizacion: Optional[date] = None

    class Config:
        from_attributes = True