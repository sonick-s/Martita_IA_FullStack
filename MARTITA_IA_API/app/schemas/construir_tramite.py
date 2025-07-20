# app/schemas/tramites.py
# esto usa los schemas de los tramites para contruir un json con la informacion de los tramites
from typing import List, Optional
from app.schemas.tramites import TramiteRead
from app.schemas.requisitos_tramite import RequisitoTramiteRead
from app.schemas.formularios_tramite import FormularioTramiteRead
from app.schemas.direcciones import DireccionRead
from app.schemas.pasos_tramite import PasoTramiteRead
from datetime import datetime

class TramiteEstructuradoRead(TramiteRead):
    requisitos: Optional[List[RequisitoTramiteRead]] = None
    formularios: Optional[List[FormularioTramiteRead]] = None
    pasos: Optional[List[PasoTramiteRead]] = None
    direccion: Optional[DireccionRead] = None
    fecha_construccion: Optional[datetime] = None