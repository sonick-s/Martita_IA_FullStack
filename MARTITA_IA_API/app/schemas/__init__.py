# schemas/__init__.py

from .direcciones import DireccionCreate, DireccionRead, DireccionUpdate
from .tramites import TramiteCreate, TramiteRead, TramiteUpdate
from .requisitos_tramite import RequisitoTramiteCreate, RequisitoTramiteRead, RequisitoTramiteUpdate
from .pasos_tramite import PasoTramiteCreate, PasoTramiteRead, PasoTramiteUpdate
from .formularios_tramite import FormularioTramiteCreate, FormularioTramiteRead, FormularioTramiteUpdate
from .usuarios import UsuarioCreate, UsuarioRead, UsuarioUpdate
from .interacciones import InteraccionCreate, InteraccionRead, InteraccionUpdate
from .prompts_bot import PromptBotCreate, PromptBotRead, PromptBotUpdate
from .login import LoginRequest, TokenResponse