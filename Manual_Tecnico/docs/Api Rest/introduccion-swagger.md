# Introducción a la API REST (Swagger)

## Descripción General

La API REST de Martita IA proporciona una interfaz programática para interactuar con el sistema de inteligencia artificial conversacional. La API está documentada completamente con Swagger/OpenAPI 3.0, permitiendo una fácil integración y testing.

## Características Principales

### 1. **Arquitectura RESTful**
- Endpoints bien definidos siguiendo convenciones REST
- Códigos de estado HTTP estándar
- Respuestas JSON consistentes
- Autenticación mediante JWT

### 2. **Documentación Automática**
- Swagger UI integrado en `/api/docs`
- Especificación OpenAPI 3.0
- Ejemplos de requests y responses
- Testing interactivo desde el navegador

### 3. **Seguridad Robusta**
- Autenticación JWT
- Rate limiting por IP y usuario
- Validación de entrada
- CORS configurado

### 4. **Escalabilidad**
- Diseño modular
- Caché con Redis
- Logging estructurado
- Monitoreo de métricas

## Acceso a la Documentación

### Swagger UI
```
http://localhost:3000/api/docs
```

### Especificación OpenAPI
```
http://localhost:3000/api/docs/swagger.json
```

### Especificación YAML
```
http://localhost:3000/api/docs/swagger.yaml
```

## Estructura de la API

### Base URL
```
https://api.martita-ia.com/v1
```

### Versiones
- **v1**: Versión actual (estable)
- **v2**: En desarrollo (beta)

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión

#### Conversaciones
- `GET /conversations` - Listar conversaciones
- `POST /conversations` - Crear conversación
- `GET /conversations/{id}` - Obtener conversación
- `PUT /conversations/{id}` - Actualizar conversación
- `DELETE /conversations/{id}` - Eliminar conversación

#### Mensajes
- `GET /conversations/{id}/messages` - Listar mensajes
- `POST /conversations/{id}/messages` - Enviar mensaje
- `GET /messages/{id}` - Obtener mensaje específico

#### Modelos de IA
- `GET /models` - Listar modelos disponibles
- `GET /models/{id}` - Obtener información del modelo
- `POST /models/{id}/chat` - Chat con modelo específico

#### Usuarios
- `GET /users/profile` - Perfil del usuario
- `PUT /users/profile` - Actualizar perfil
- `GET /users/statistics` - Estadísticas del usuario

#### Analytics
- `GET /analytics/conversations` - Métricas de conversaciones
- `GET /analytics/models` - Rendimiento de modelos
- `GET /analytics/usage` - Uso del sistema

## Autenticación

### JWT Token

La API utiliza JWT (JSON Web Tokens) para autenticación:

```bash
# Login para obtener token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### Uso del Token

```bash
# Incluir token en headers
curl -X GET http://localhost:3000/api/v1/conversations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Formatos de Respuesta

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Conversación sobre IA",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Conversación creada exitosamente"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados son inválidos",
    "details": [
      {
        "field": "email",
        "message": "El email es requerido"
      }
    ]
  }
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
- `502 Bad Gateway` - Error de servicio externo
- `503 Service Unavailable` - Servicio no disponible

## Rate Limiting

### Límites por Defecto
- **Usuarios autenticados**: 1000 requests/hora
- **Usuarios anónimos**: 100 requests/hora
- **Endpoints de IA**: 50 requests/hora

### Headers de Rate Limiting

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Paginación

### Parámetros de Paginación
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20, max: 100)

### Respuesta Paginada

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Conversación 1"
    },
    {
      "id": "uuid-2", 
      "title": "Conversación 2"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtros y Búsqueda

### Parámetros de Filtrado
- `search`: Búsqueda de texto
- `status`: Filtrar por estado
- `model`: Filtrar por modelo de IA
- `date_from`: Fecha de inicio
- `date_to`: Fecha de fin

### Ejemplo de Filtrado

```bash
GET /api/v1/conversations?search=IA&status=active&date_from=2024-01-01
```

## Ordenamiento

### Parámetros de Orden
- `sort_by`: Campo para ordenar
- `sort_order`: `asc` o `desc`

### Ejemplo de Ordenamiento

```bash
GET /api/v1/conversations?sort_by=created_at&sort_order=desc
```

## Webhooks

### Configuración de Webhook

```json
{
  "url": "https://tu-servidor.com/webhook",
  "events": ["conversation.created", "message.sent"],
  "secret": "tu_secreto_aqui"
}
```

### Eventos Disponibles
- `conversation.created` - Nueva conversación
- `conversation.updated` - Conversación actualizada
- `message.sent` - Mensaje enviado
- `user.registered` - Usuario registrado

## SDKs y Clientes

### JavaScript/Node.js

```bash
npm install @martita-ia/sdk
```

```javascript
import { MartitaAPI } from '@martita-ia/sdk';

const api = new MartitaAPI({
  baseURL: 'https://api.martita-ia.com/v1',
  token: 'tu_token_aqui'
});

// Crear conversación
const conversation = await api.conversations.create({
  title: 'Mi conversación'
});

// Enviar mensaje
const message = await api.messages.send(conversation.id, {
  content: 'Hola, ¿cómo estás?'
});
```

### Python

```bash
pip install martita-ia-sdk
```

```python
from martita_ia import MartitaAPI

api = MartitaAPI(
    base_url="https://api.martita-ia.com/v1",
    token="tu_token_aqui"
)

# Crear conversación
conversation = api.conversations.create(
    title="Mi conversación"
)

# Enviar mensaje
message = api.messages.send(
    conversation_id=conversation.id,
    content="Hola, ¿cómo estás?"
)
```

## Testing

### Testing con Swagger UI

1. Ve a `http://localhost:3000/api/docs`
2. Haz clic en "Authorize" para configurar tu token
3. Prueba los endpoints directamente desde la interfaz

### Testing con curl

```bash
# Test de salud de la API
curl -X GET http://localhost:3000/api/v1/health

# Test de autenticación
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### Testing con Postman

1. Importa la colección desde Swagger
2. Configura variables de entorno
3. Ejecuta las pruebas automáticamente

## Monitoreo y Logs

### Endpoints de Monitoreo
- `GET /health` - Estado del servicio
- `GET /metrics` - Métricas del sistema
- `GET /logs` - Logs recientes (solo admin)

### Métricas Disponibles
- Requests por minuto
- Tiempo de respuesta promedio
- Tasa de errores
- Uso de memoria y CPU

## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Arquitectura** de la API
2. Explorar los **Endpoints** específicos
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación de Swagger](https://swagger.io/docs/)
- [Especificación OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3)
- [Mejores prácticas de APIs REST](https://restfulapi.net/) 