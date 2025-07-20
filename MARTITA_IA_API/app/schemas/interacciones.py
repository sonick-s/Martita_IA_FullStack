from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InteraccionCreate(BaseModel):
    pregunta: Optional[str] = None
    respuesta: Optional[str] = None
    respuesta_util: Optional[str] = None
    fecha: Optional[datetime] = None

class InteraccionRead(InteraccionCreate):
    id_interaccion: int
    fecha: Optional[datetime] = None

    class Config:
        from_attributes = True

class InteraccionUpdate(BaseModel):
    pregunta: Optional[str] = None
    respuesta: Optional[str] = None
    respuesta_util: Optional[str] = None
    fecha: Optional[datetime] = None
