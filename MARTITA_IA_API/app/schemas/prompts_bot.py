from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PromptBotCreate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    contenido: Optional[str] = None
    estado: Optional[int] = None
    fecha_creacion: Optional[datetime] = None

class PromptBotRead(PromptBotCreate):
    id_prompt: int
    fecha_creacion: Optional[datetime] = None

    class Config:
        from_attributes = True

class PromptBotUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    contenido: Optional[str] = None
    estado: Optional[int] = None
    fecha_creacion: Optional[datetime] = None
