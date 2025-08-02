# Arquitectura de la API REST

## Descripción General

La API REST de Martita IA sigue una arquitectura **modular y escalable** basada en FastAPI, implementando patrones de diseño modernos para garantizar mantenibilidad, rendimiento y seguridad. La arquitectura está diseñada para manejar trámites municipales del GADIP Cayambe con un sistema de inteligencia artificial conversacional.

## Patrón de Arquitectura

### 1. **Arquitectura en Capas**

```
┌─────────────────────────────────────┐
│           FastAPI App               │ ← Capa de Presentación
├─────────────────────────────────────┤
│           Routers                   │ ← Capa de Enrutamiento
├─────────────────────────────────────┤
│         Controllers                 │ ← Capa de Lógica de Negocio
├─────────────────────────────────────┤
│           Schemas                   │ ← Capa de Validación
├─────────────────────────────────────┤
│           Models                    │ ← Capa de Acceso a Datos
├─────────────────────────────────────┤
│         Database                    │ ← Capa de Persistencia
└─────────────────────────────────────┘
```

### 2. **Flujo de Datos**

```
Request → Router → Controller → Schema → Model → Database
Response ← Router ← Controller ← Schema ← Model ← Database
```

## Componentes Principales

### 1. **FastAPI Application (`main.py`)**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import direcciones, tramites, usuarios, login

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers
app.include_router(direcciones.router)
app.include_router(tramites.router)
app.include_router(usuarios.router)
app.include_router(login.router)
```

**Características:**
- Configuración centralizada de la aplicación
- Middleware de CORS para desarrollo
- Inclusión modular de routers
- Eventos de startup/shutdown

### 2. **Routers (Capa de Enrutamiento)**

Cada router maneja un dominio específico del negocio:

#### Estructura de Router
```python
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import DireccionCreate, DireccionRead
from app.controllers import get_direcciones, create_direcciones

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])

@router.get("/", response_model=List[DireccionRead])
async def read_direcciones(db: AsyncSession = Depends(get_db)):
    return await get_direcciones(db)

@router.post("/", response_model=DireccionRead)
async def create_direccion(direccion: DireccionCreate, db: AsyncSession = Depends(get_db)):
    return await create_direcciones(direccion, db)
```

**Routers Disponibles:**
- `direcciones.py` - Gestión de direcciones del GADIP
- `tramites.py` - Gestión de trámites municipales
- `requisitos_tramite.py` - Requisitos de trámites
- `pasos_tramite.py` - Pasos de trámites
- `formularios_tramite.py` - Formularios de trámites
- `usuarios.py` - Gestión de usuarios
- `interacciones.py` - Historial de chat
- `prompts_bot.py` - Configuración del bot
- `login.py` - Autenticación
- `construir_tramite.py` - Endpoints especiales

### 3. **Controllers (Capa de Lógica de Negocio)**

Los controllers contienen la lógica de negocio específica:

```python
# app/controllers/direcciones.py
async def get_direcciones(db: AsyncSession):
    result = await db.execute(select(Direcciones).filter(Direcciones.estado == 1))
    return result.scalars().all()

async def create_direcciones(direccion: DireccionCreate, db: AsyncSession):
    db_direccion = Direcciones(**direccion.dict())
    db.add(db_direccion)
    await db.commit()
    await db.refresh(db_direccion)
    return db_direccion
```

**Funciones Principales:**
- Operaciones CRUD básicas
- Validaciones de negocio
- Transformación de datos
- Manejo de errores específicos

### 4. **Schemas (Capa de Validación)**

Los schemas definen la estructura de datos y validaciones:

```python
# app/schemas/direcciones.py
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
```

**Tipos de Schemas:**
- `Create` - Para crear nuevos registros
- `Update` - Para actualizar registros existentes
- `Read` - Para respuestas de la API

### 5. **Models (Capa de Acceso a Datos)**

Los models definen la estructura de la base de datos:

```python
# app/models/direcciones.py
from sqlalchemy import Column, Integer, String, Text, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Direcciones(Base):
    __tablename__ = "direcciones"

    id_direcciones = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    responsable = Column(String(150))
    correo_responsable = Column(String(150))
    telefono = Column(String(100))
    estado = Column(Integer, default=1)
    fecha_actualizacion = Column(Date)
```

### 6. **Database (Capa de Persistencia)**

Configuración de la base de datos asíncrona:

```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = (
    f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with SessionLocal() as session:
        yield session
```

## Patrones de Diseño Implementados

### 1. **Dependency Injection**

```python
# Inyección de dependencias para base de datos
async def read_direcciones(db: AsyncSession = Depends(get_db)):
    return await get_direcciones(db)
```

### 2. **Repository Pattern**

Los controllers actúan como repositories, encapsulando la lógica de acceso a datos.

### 3. **Service Layer Pattern**

Los controllers implementan la capa de servicios con lógica de negocio.

### 4. **DTO Pattern**

Los schemas actúan como DTOs (Data Transfer Objects) para transferencia de datos.


## Optimizaciones de Rendimiento

### 1. **Conexiones Asíncronas**

```python
# Uso de async/await para operaciones de base de datos
async def get_direcciones(db: AsyncSession):
    result = await db.execute(select(Direcciones))
    return result.scalars().all()
```

### 2. **Lazy Loading**

```python
# Carga diferida de relaciones
from sqlalchemy.orm import selectinload

result = await db.execute(
    select(Tramites).options(selectinload(Tramites.direccion))
)
```

### 3. **Índices de Base de Datos**

```sql
-- Índices para optimizar consultas
CREATE INDEX idx_tramites_direccion ON tramites(id_direcciones);
CREATE INDEX idx_requisitos_tramite ON requisitos_tramite(id_tramite);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

## Estructura de Archivos

```
app/
├── main.py                 # Aplicación principal
├── config.py              # Configuración
├── database.py            # Configuración de BD
├── security.py            # Autenticación
├── routers/               # Endpoints
│   ├── direcciones.py
│   ├── tramites.py
│   ├── usuarios.py
│   └── login.py
├── controllers/           # Lógica de negocio
│   ├── direcciones.py
│   ├── tramites.py
│   └── usuarios.py
├── models/               # Modelos de BD
│   ├── direcciones.py
│   ├── tramites.py
│   └── usuarios.py
└── schemas/              # Validación de datos
    ├── direcciones.py
    ├── tramites.py
    └── usuarios.py
```

## Ventajas de la Arquitectura

### 1. **Separación de Responsabilidades**
- Cada capa tiene una responsabilidad específica
- Fácil mantenimiento y testing
- Bajo acoplamiento entre componentes

### 2. **Escalabilidad**
- Arquitectura modular permite escalar componentes independientemente
- Fácil agregar nuevos endpoints y funcionalidades
- Soporte para múltiples instancias

### 3. **Mantenibilidad**
- Código organizado y bien estructurado
- Fácil debugging y testing
- Documentación automática con Swagger

### 4. **Seguridad**
- Autenticación JWT robusta
- Validación de datos con Pydantic
- Encriptación de contraseñas con bcrypt

### 5. **Rendimiento**
- Operaciones asíncronas
- Conexiones optimizadas a base de datos
- Respuestas rápidas y eficientes

## Próximos Pasos

Después de entender la arquitectura:

1. Revisar los **Endpoints** específicos
2. Explorar la **Seguridad** implementada
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo** 