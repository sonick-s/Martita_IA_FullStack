from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TramiteCreate(BaseModel):
    id_direcciones: Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    contexto: Optional[str] = None
    estado: Optional[int] = None
    fecha_registro: Optional[datetime] = None

class TramiteRead(TramiteCreate):
    id_tramite: int
    fecha_registro: Optional[datetime] = None

    class Config:
        from_attributes = True

class TramiteUpdate(BaseModel):
    id_direcciones: Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    contexto: Optional[str] = None
    estado: Optional[int] = None
    fecha_registro: Optional[datetime] = None
