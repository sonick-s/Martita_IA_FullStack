from pydantic import BaseModel
from typing import Optional

class PasoTramiteCreate(BaseModel):
    id_tramite: Optional[int] = None
    contexto: Optional[str] = None
    paso: Optional[str] = None
    estado: Optional[int] = None

class PasoTramiteRead(PasoTramiteCreate):
    id_paso: int

    class Config:
        from_attributes = True

class PasoTramiteUpdate(BaseModel):
    contexto: Optional[str] = None
    paso: Optional[str] = None
    estado: Optional[int] = None
