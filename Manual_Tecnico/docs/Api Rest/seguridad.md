# Seguridad de la API REST


## Endpoints de Autenticación

### Login
**Endpoint:** `POST /login`

**Descripción:** Autenticación de usuarios y generación de token JWT.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

**Proceso de Autenticación:**
1. Validación de credenciales en base de datos
2. Verificación de contraseña con bcrypt
3. Generación de token JWT con expiración
4. Retorno de token para uso en endpoints protegidos



## Descripción General

La seguridad de la API REST de Martita IA está implementada con múltiples capas de protección para garantizar la integridad, confidencialidad y disponibilidad del sistema de trámites municipales del GADIP Cayambe.

## Estrategias de Seguridad Implementadas

### 1. **Autenticación JWT (JSON Web Tokens)**

#### Configuración de JWT
```python
# app/security.py
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

#### Validación de Tokens
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="No se pudo validar el token")
```

### 2. **Encriptación de Contraseñas con bcrypt**

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### 3. **Validación de Datos con Pydantic**

```python
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        return v
```

## Protección de Endpoints

### 1. **Endpoints Públicos (Sin Autenticación)**

```python
@router.get("/public-info")
async def get_public_info():
    return {"message": "Información pública disponible"}
```

### 2. **Endpoints Protegidos (Con Autenticación)**

```python
@router.get("/direcciones/", response_model=List[DireccionRead])
async def read_direcciones(
    db: AsyncSession = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return await get_direcciones(db)
```

**Comandos de protección disponibles:**

1. **`Depends(get_current_user)`** - Requiere token JWT válido
2. **`Depends(get_db)`** - Inyección de dependencia de base de datos
3. **Combinación de ambos** - Para endpoints que requieren autenticación y base de datos



## Configuración de Variables de Entorno

### Variables de Seguridad Requeridas

```env
# Configuración de JWT
SECRET_KEY=tu_clave_secreta_muy_larga_y_compleja_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña_segura
DB_NAME=martita_ia_normal
```

### Generación de Clave Secreta Segura

```bash
# Generar clave secreta segura
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Manejo de Errores de Seguridad

### 1. **Errores de Autenticación**

```python
# Token inválido o expirado
{
  "detail": "No se pudo validar el token"
}

# Credenciales incorrectas
{
  "detail": "Email o contraseña incorrectos"
}

# Token faltante
{
  "detail": "Not authenticated"
}
```

### 2. **Errores de Autorización**

```python
# Acceso denegado
{
  "detail": "Acceso denegado"
}

# Recurso no encontrado
{
  "detail": "Dirección no encontrada"
}
```

## Configuración de CORS

### Configuración para Desarrollo

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configurar específicamente en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Configuración para Producción

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cayambe.gob.ec",
        "https://admin.cayambe.gob.ec"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## Validación de Entrada

### 1. **Validación con Pydantic**

```python
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class DireccionCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    responsable: Optional[str] = None
    correo_responsable: Optional[EmailStr] = None
    telefono: Optional[str] = None
    
    @validator('nombre')
    def validate_nombre(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('El nombre debe tener al menos 3 caracteres')
        return v.strip()
    
    @validator('telefono')
    def validate_telefono(cls, v):
        if v and not v.replace('-', '').replace(' ', '').isdigit():
            raise ValueError('El teléfono debe contener solo números')
        return v
```

### 2. **Sanitización de Datos**

```python
import html

def sanitize_input(text: str) -> str:
    """Sanitiza entrada de texto para prevenir XSS"""
    return html.escape(text.strip())

@router.post("/direcciones/")
async def create_direccion(
    direccion: DireccionCreate, 
    db: AsyncSession = Depends(get_db)
):
    # Sanitizar datos antes de guardar
    direccion.nombre = sanitize_input(direccion.nombre)
    direccion.descripcion = sanitize_input(direccion.descripcion) if direccion.descripcion else None
    return await create_direcciones(direccion, db)
```

## Logging de Seguridad

### Configuración de Logs

```python
import logging
from datetime import datetime

# Configurar logger de seguridad
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)

def log_security_event(event_type: str, user_email: str, details: str):
    security_logger.info(f"{datetime.now()} - {event_type} - User: {user_email} - {details}")

# En el endpoint de login
@router.post("/login")
async def login_for_access_token(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # ... lógica de autenticación ...
    
    if not user or not verify_password(login_data.password, user.password):
        log_security_event("LOGIN_FAILED", login_data.email, "Credenciales incorrectas")
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    
    log_security_event("LOGIN_SUCCESS", user.email, "Login exitoso")
    return {"access_token": access_token, "token_type": "bearer"}
```

## Headers de Seguridad

### Configuración de Headers HTTP

```python
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# Agregar headers de seguridad
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

## Rate Limiting

### Implementación Básica de Rate Limiting

```python
from fastapi import HTTPException
from collections import defaultdict
import time

# Diccionario para almacenar intentos de login
login_attempts = defaultdict(list)

def check_rate_limit(email: str, max_attempts: int = 5, window_minutes: int = 15):
    now = time.time()
    window_start = now - (window_minutes * 60)
    
    # Limpiar intentos antiguos
    login_attempts[email] = [attempt for attempt in login_attempts[email] if attempt > window_start]
    
    if len(login_attempts[email]) >= max_attempts:
        raise HTTPException(
            status_code=429, 
            detail=f"Demasiados intentos de login. Intente nuevamente en {window_minutes} minutos"
        )
    
    login_attempts[email].append(now)

@router.post("/login")
async def login_for_access_token(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Verificar rate limiting
    check_rate_limit(login_data.email)
    
    # ... resto de la lógica de login ...
```

## Mejores Prácticas de Seguridad

### 1. **Gestión de Contraseñas**

- Usar bcrypt para encriptación
- Requerir contraseñas complejas
- Implementar política de expiración
- No almacenar contraseñas en texto plano

### 2. **Gestión de Tokens**

- Usar tokens JWT con expiración corta
- Implementar refresh tokens
- Validar tokens en cada request
- Revocar tokens cuando sea necesario

### 3. **Validación de Entrada**

- Validar todos los datos de entrada
- Sanitizar datos antes de procesar
- Usar tipos de datos específicos
- Implementar validaciones de negocio

### 4. **Logging y Monitoreo**

- Registrar eventos de seguridad
- Monitorear intentos de acceso fallidos
- Implementar alertas de seguridad
- Mantener logs de auditoría

### 5. **Configuración de Producción**

- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Implementar rate limiting
- Usar variables de entorno seguras

## Próximos Pasos

Después de entender la seguridad:

1. Revisar la **Arquitectura** de la API
2. Explorar los **Endpoints** específicos
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación de FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Mejores prácticas de JWT](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Guía de seguridad OWASP](https://owasp.org/www-project-api-security/)
- [Documentación de bcrypt](https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html) 