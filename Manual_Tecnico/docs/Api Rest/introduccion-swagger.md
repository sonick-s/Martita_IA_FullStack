# Introducción a la API REST (Swagger)

## Descripción General

La API REST de Martita IA proporciona una interfaz programática para interactuar con el sistema de inteligencia artificial conversacional para trámites municipales del GADIP Cayambe. La API está construida con **FastAPI** y documentada completamente con Swagger/OpenAPI 3.0, permitiendo una fácil integración y testing.

## Estructura del Proyecto

```
MARTITA_IA_API/
├── app/
│   ├── main.py              # Punto de entrada de la aplicación
│   ├── config.py            # Configuración de variables de entorno
│   ├── database.py          # Configuración de base de datos
│   ├── security.py          # Autenticación y seguridad
│   ├── routers/             # Endpoints de la API
│   │   ├── direcciones.py
│   │   ├── tramites.py
│   │   ├── requisitos_tramite.py
│   │   ├── pasos_tramite.py
│   │   ├── formularios_tramite.py
│   │   ├── usuarios.py
│   │   ├── interacciones.py
│   │   ├── prompts_bot.py
│   │   ├── login.py
│   │   └── construir_tramite.py
│   ├── models/              # Modelos de SQLAlchemy
│   ├── schemas/             # Esquemas de Pydantic
│   └── controllers/         # Lógica de negocio
├── requirements.txt          # Dependencias de Python
└── Dockerfile              # Configuración de Docker
```


## Características Principales

### 1. **Arquitectura RESTful**
- Endpoints bien definidos siguiendo convenciones REST
- Códigos de estado HTTP estándar
- Respuestas JSON consistentes
- Autenticación mediante JWT

### 2. **Documentación Automática**
- Swagger UI integrado en `/docs`
- Especificación OpenAPI 3.0
- Ejemplos de requests y responses
- Testing interactivo desde el navegador

### 3. **Seguridad Robusta**
- Autenticación JWT con bcrypt
- Validación de entrada con Pydantic
- CORS configurado para desarrollo
- Middleware de seguridad

### 4. **Base de Datos Asíncrona**
- SQLAlchemy con MySQL
- Operaciones asíncronas
- Conexiones optimizadas
- Transacciones ACID

## Tecnologías Utilizadas

### Framework y Librerías
- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy**: ORM para base de datos
- **Pydantic**: Validación de datos y serialización
- **JWT**: Autenticación con tokens
- **bcrypt**: Encriptación de contraseñas
- **aiomysql**: Driver asíncrono para MySQL

### Versiones Principales
```txt
fastapi==0.115.12
sqlalchemy==2.0.41
pydantic==2.11.5
python-jose==3.5.0
passlib==1.7.4
aiomysql==0.2.0
```

## Acceso a la Documentación

### Swagger UI
```
http://localhost:8000/docs
```

### Especificación OpenAPI
```
http://localhost:8000/openapi.json
```

### ReDoc (Documentación Alternativa)
```
http://localhost:8000/redoc
```

## Estructura de la API

### Base URL
```
http://localhost:8000
```

### Endpoints Principales

#### Autenticación
- `POST /login` - Inicio de sesión y obtención de token JWT

#### Direcciones (GADIP Cayambe)
- `GET /direcciones/` - Listar todas las direcciones
- `GET /direcciones/{id_direccion}` - Obtener dirección específica
- `POST /direcciones/` - Crear nueva dirección
- `PUT /direcciones/{id_direccion}` - Actualizar dirección
- `DELETE /direcciones/{id_direccion}` - Eliminar dirección

#### Trámites
- `GET /tramites/` - Listar todos los trámites
- `GET /tramites/{id_tramite}` - Obtener trámite específico
- `POST /tramites/` - Crear nuevo trámite
- `PUT /tramites/{id_tramite}` - Actualizar trámite
- `DELETE /tramites/{id_tramite}` - Eliminar trámite

#### Requisitos de Trámites
- `GET /requisitos-tramite/` - Listar requisitos
- `GET /requisitos-tramite/{id_requisito}` - Obtener requisito específico
- `POST /requisitos-tramite/` - Crear nuevo requisito
- `PUT /requisitos-tramite/{id_requisito}` - Actualizar requisito
- `DELETE /requisitos-tramite/{id_requisito}` - Eliminar requisito

#### Pasos de Trámites
- `GET /pasos-tramite/` - Listar pasos
- `GET /pasos-tramite/{id_paso}` - Obtener paso específico
- `POST /pasos-tramite/` - Crear nuevo paso
- `PUT /pasos-tramite/{id_paso}` - Actualizar paso
- `DELETE /pasos-tramite/{id_paso}` - Eliminar paso

#### Formularios de Trámites
- `GET /formularios-tramite/` - Listar formularios
- `GET /formularios-tramite/{id_formulario}` - Obtener formulario específico
- `POST /formularios-tramite/` - Crear nuevo formulario
- `PUT /formularios-tramite/{id_formulario}` - Actualizar formulario
- `DELETE /formularios-tramite/{id_formulario}` - Eliminar formulario

#### Usuarios
- `GET /usuarios/` - Listar usuarios
- `GET /usuarios/{id_usuario}` - Obtener usuario específico
- `POST /usuarios/` - Crear nuevo usuario
- `PUT /usuarios/{id_usuario}` - Actualizar usuario
- `DELETE /usuarios/{id_usuario}` - Eliminar usuario

#### Interacciones (Chat)
- `GET /interacciones/` - Listar interacciones
- `GET /interacciones/{id_interaccion}` - Obtener interacción específica
- `POST /interacciones/` - Crear nueva interacción
- `PUT /interacciones/{id_interaccion}` - Actualizar interacción
- `DELETE /interacciones/{id_interaccion}` - Eliminar interacción

#### Prompts del Bot
- `GET /prompts-bot/` - Listar prompts
- `GET /prompts-bot/{id_prompt}` - Obtener prompt específico
- `POST /prompts-bot/` - Crear nuevo prompt
- `PUT /prompts-bot/{id_prompt}` - Actualizar prompt
- `DELETE /prompts-bot/{id_prompt}` - Eliminar prompt

#### Construir Trámite (Endpoints Especiales)
- `GET /construir-tramite/estructurado` - Obtener trámites estructurados
- `GET /construir-tramite/estructurado/{tramite_id}` - Obtener trámite estructurado específico

## Autenticación

### JWT Token

La API utiliza JWT (JSON Web Tokens) para autenticación:

```bash
# Login para obtener token
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

### Uso del Token

```bash
# Incluir token en headers
curl -X GET http://localhost:8000/direcciones/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Formatos de Respuesta

### Respuesta Exitosa

```json
{
  "id_direcciones": 1,
  "nombre": "Dirección de Planificación y Ordenamiento Territorial",
  "descripcion": "Formular, coordinar, articular y evaluar las políticas...",
  "responsable": "Juan Pérez",
  "correo_responsable": "juan.perez@cayambe.gob.ec",
  "telefono": "02-236-0001",
  "estado": 1,
  "fecha_actualizacion": "2025-01-15"
}
```

### Respuesta de Error

```json
{
  "detail": "Dirección no encontrada"
}
```

## Códigos de Estado HTTP

### 2xx - Éxito
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `204 No Content` - Operación exitosa sin contenido

### 4xx - Error del Cliente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Validación fallida

### 5xx - Error del Servidor
- `500 Internal Server Error` - Error interno

## Ejemplos de Uso

### Obtener Todas las Direcciones
```bash
curl -X GET http://localhost:8000/direcciones/ \
  -H "Authorization: Bearer tu_token_aqui"
```

### Crear un Nuevo Trámite
```bash
curl -X POST http://localhost:8000/tramites/ \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "id_direcciones": 3,
    "nombre": "REGULARIZACIÓN DE ÁREAS Y LINDEROS",
    "descripcion": "Regularizar y certificar la información sobre el área...",
    "contexto": "El trámite permite legalizar y certificar el tamaño...",
    "estado": 1
  }'
```

### Obtener Trámite Estructurado
```bash
curl -X GET http://localhost:8000/construir-tramite/estructurado/1 \
  -H "Authorization: Bearer tu_token_aqui"
```

## Configuración de Desarrollo

### Variables de Entorno
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=martita_ia_normal
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Ejecutar la API
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar en desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

### Testing con Swagger UI

1. Ve a `http://localhost:8000/docs`
2. Haz clic en "Authorize" para configurar tu token
3. Prueba los endpoints directamente desde la interfaz

### Testing con curl

```bash
# Test de salud de la API
curl -X GET http://localhost:8000/

# Test de autenticación
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "omigc4@gmail.com", "password": "password"}'
```

### Testing con Postman

1. Importa la colección desde Swagger
2. Configura variables de entorno
3. Ejecuta las pruebas automáticamente


## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Arquitectura** de la API
2. Explorar los **Endpoints** específicos
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de Swagger](https://swagger.io/docs/)
- [Especificación OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3)
- [Mejores prácticas de APIs REST](https://restfulapi.net/) 