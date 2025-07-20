from pydantic import BaseModel
from typing import Optional

class RequisitoTramiteCreate(BaseModel):
    id_tramite: Optional[int] = None
    contexto: Optional[str] = None
    requisito: Optional[str] = None
    estado: Optional[int] = None

class RequisitoTramiteRead(RequisitoTramiteCreate):
    id_requisito: int

    class Config:
        from_attributes = True

class RequisitoTramiteUpdate(BaseModel):
    contexto: Optional[str] = None
    requisito: Optional[str] = None
    estado: Optional[int] = None
