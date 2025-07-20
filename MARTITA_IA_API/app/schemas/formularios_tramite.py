from pydantic import BaseModel
from typing import Optional

class FormularioTramiteCreate(BaseModel):
    id_tramite: Optional[int] = None
    nombre: Optional[str] = None
    url: Optional[str] = None
    contexto: Optional[str] = None
    estado: Optional[int] = None

class FormularioTramiteRead(FormularioTramiteCreate):
    id_formulario: int

    class Config:
        from_attributes = True

class FormularioTramiteUpdate(BaseModel):
    nombre: Optional[str] = None
    url: Optional[str] = None
    contexto: Optional[str] = None
    estado: Optional[int] = None
