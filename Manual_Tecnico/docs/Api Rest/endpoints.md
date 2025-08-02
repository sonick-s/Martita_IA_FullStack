# Endpoints de la API REST

## Descripción General

La API REST de Martita IA proporciona **10 grupos de endpoints** organizados por dominio de negocio, cada uno manejando un aspecto específico del sistema de trámites municipales del GADIP Cayambe. Todos los endpoints siguen las convenciones REST y están documentados automáticamente con Swagger.

## Base URL

```
http://localhost:8000
```

## Autenticación

### Login
**Endpoint:** `POST /login`

**Descripción:** Autenticación de usuarios y obtención de token JWT.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1
}
```

**Response (401):**
```json
{
  "detail": "Email o contraseña incorrectos"
}
```

## Direcciones del GADIP

### Listar Direcciones
**Endpoint:** `GET /direcciones/`

**Descripción:** Obtiene todas las direcciones activas del GADIP Cayambe.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
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
]
```

### Obtener Dirección Específica
**Endpoint:** `GET /direcciones/{id_direccion}`

**Descripción:** Obtiene una dirección específica por su ID.

**Parameters:**
- `id_direccion` (integer): ID de la dirección

**Response (200):**
```json
{
  "id_direcciones": 3,
  "nombre": "Dirección de Avalúos y Catastros",
  "descripcion": "Gestionar y mantener actualizado el catastro predial...",
  "responsable": "María González",
  "correo_responsable": "maria.gonzalez@cayambe.gob.ec",
  "telefono": "02-236-0003",
  "estado": 1,
  "fecha_actualizacion": "2025-01-15"
}
```

### Crear Dirección
**Endpoint:** `POST /direcciones/`

**Descripción:** Crea una nueva dirección en el GADIP.

**Request Body:**
```json
{
  "nombre": "Nueva Dirección",
  "descripcion": "Descripción de la nueva dirección",
  "responsable": "Responsable Nombre",
  "correo_responsable": "responsable@cayambe.gob.ec",
  "telefono": "02-236-0000",
  "estado": 1,
  "fecha_actualizacion": "2025-01-15"
}
```

### Actualizar Dirección
**Endpoint:** `PUT /direcciones/{id_direccion}`

**Descripción:** Actualiza una dirección existente.

**Request Body:**
```json
{
  "nombre": "Dirección Actualizada",
  "descripcion": "Descripción actualizada",
  "responsable": "Nuevo Responsable",
  "correo_responsable": "nuevo@cayambe.gob.ec",
  "telefono": "02-236-0001"
}
```

### Eliminar Dirección
**Endpoint:** `DELETE /direcciones/{id_direccion}`

**Descripción:** Elimina una dirección (cambio de estado a inactivo).

**Response (204):** Sin contenido

## Trámites Municipales

### Listar Trámites
**Endpoint:** `GET /tramites/`

**Descripción:** Obtiene todos los trámites disponibles.

**Response (200):**
```json
[
  {
    "id_tramite": 1,
    "id_direcciones": 3,
    "nombre": "REGULARIZACIÓN DE ÁREAS Y LINDEROS",
    "descripcion": "Regularizar y certificar la información sobre el área...",
    "contexto": "El trámite permite legalizar y certificar el tamaño...",
    "estado": 1,
    "fecha_registro": "2025-01-15T10:30:00"
  }
]
```

### Obtener Trámite Específico
**Endpoint:** `GET /tramites/{id_tramite}`

**Descripción:** Obtiene un trámite específico por su ID.

### Crear Trámite
**Endpoint:** `POST /tramites/`

**Descripción:** Crea un nuevo trámite.

**Request Body:**
```json
{
  "id_direcciones": 3,
  "nombre": "NUEVO TRÁMITE",
  "descripcion": "Descripción del nuevo trámite",
  "contexto": "Contexto adicional del trámite",
  "estado": 1
}
```

### Actualizar Trámite
**Endpoint:** `PUT /tramites/{id_tramite}`

**Descripción:** Actualiza un trámite existente.

### Eliminar Trámite
**Endpoint:** `DELETE /tramites/{id_tramite}`

**Descripción:** Elimina un trámite (cambio de estado a inactivo).

## Requisitos de Trámites

### Listar Requisitos
**Endpoint:** `GET /requisitos-tramite/`

**Descripción:** Obtiene todos los requisitos de trámites.

**Response (200):**
```json
[
  {
    "id_requisito": 2,
    "id_tramite": 1,
    "contexto": "REQUISITOS",
    "requisito": "1. Original de cédula de ciudadanía del propietario. 2. Copia de la escritura...",
    "estado": 1
  }
]
```

### Obtener Requisito Específico
**Endpoint:** `GET /requisitos-tramite/{id_requisito}`

**Descripción:** Obtiene un requisito específico por su ID.

### Crear Requisito
**Endpoint:** `POST /requisitos-tramite/`

**Descripción:** Crea un nuevo requisito para un trámite.

**Request Body:**
```json
{
  "id_tramite": 1,
  "contexto": "REQUISITOS ADICIONALES",
  "requisito": "1. Documento adicional. 2. Certificado especial...",
  "estado": 1
}
```

### Actualizar Requisito
**Endpoint:** `PUT /requisitos-tramite/{id_requisito}`

**Descripción:** Actualiza un requisito existente.

### Eliminar Requisito
**Endpoint:** `DELETE /requisitos-tramite/{id_requisito}`

**Descripción:** Elimina un requisito.

## Pasos de Trámites

### Listar Pasos
**Endpoint:** `GET /pasos-tramite/`

**Descripción:** Obtiene todos los pasos de trámites.

**Response (200):**
```json
[
  {
    "id_paso": 1,
    "id_tramite": 1,
    "contexto": "PASOS PARA REALIZAR EL TRÁMITE",
    "paso": "1. Imprimir y llenar el Formulario de Trámites...",
    "estado": 1
  }
]
```

### Obtener Paso Específico
**Endpoint:** `GET /pasos-tramite/{id_paso}`

**Descripción:** Obtiene un paso específico por su ID.

### Crear Paso
**Endpoint:** `POST /pasos-tramite/`

**Descripción:** Crea un nuevo paso para un trámite.

**Request Body:**
```json
{
  "id_tramite": 1,
  "contexto": "PASOS ADICIONALES",
  "paso": "1. Paso adicional. 2. Otro paso...",
  "estado": 1
}
```

### Actualizar Paso
**Endpoint:** `PUT /pasos-tramite/{id_paso}`

**Descripción:** Actualiza un paso existente.

### Eliminar Paso
**Endpoint:** `DELETE /pasos-tramite/{id_paso}`

**Descripción:** Elimina un paso.

## Formularios de Trámites

### Listar Formularios
**Endpoint:** `GET /formularios-tramite/`

**Descripción:** Obtiene todos los formularios de trámites.

**Response (200):**
```json
[
  {
    "id_formulario": 1,
    "id_tramite": 1,
    "nombre": "Formulario de Avalúos",
    "url": "https://cayambe.gob.ec/formularios/avaluos.pdf",
    "contexto": "Formulario oficial para trámites de avalúos",
    "estado": 1
  }
]
```

### Obtener Formulario Específico
**Endpoint:** `GET /formularios-tramite/{id_formulario}`

**Descripción:** Obtiene un formulario específico por su ID.

### Crear Formulario
**Endpoint:** `POST /formularios-tramite/`

**Descripción:** Crea un nuevo formulario para un trámite.

**Request Body:**
```json
{
  "id_tramite": 1,
  "nombre": "Nuevo Formulario",
  "url": "https://cayambe.gob.ec/formularios/nuevo.pdf",
  "contexto": "Formulario para nuevo trámite",
  "estado": 1
}
```

### Actualizar Formulario
**Endpoint:** `PUT /formularios-tramite/{id_formulario}`

**Descripción:** Actualiza un formulario existente.

### Eliminar Formulario
**Endpoint:** `DELETE /formularios-tramite/{id_formulario}`

**Descripción:** Elimina un formulario.

## Usuarios

### Listar Usuarios
**Endpoint:** `GET /usuarios/`

**Descripción:** Obtiene todos los usuarios del sistema.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_usuario": 1,
    "nombre": "Omar Sani",
    "email": "omigc4@gmail.com",
    "password": "$2b$12$uEx7g2mgh.Qld1DVRrHlR.AvmROzPVnu2.OiOQdCXgKIqYpUY20Hq",
    "estado": 1,
    "fecha_registro": "2025-01-15T10:30:00"
  }
]
```

### Obtener Usuario Específico
**Endpoint:** `GET /usuarios/{id_usuario}`

**Descripción:** Obtiene un usuario específico por su ID.

### Crear Usuario
**Endpoint:** `POST /usuarios/`

**Descripción:** Crea un nuevo usuario.

**Request Body:**
```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "contraseña_segura",
  "estado": 1
}
```

### Actualizar Usuario
**Endpoint:** `PUT /usuarios/{id_usuario}`

**Descripción:** Actualiza un usuario existente.

### Eliminar Usuario
**Endpoint:** `DELETE /usuarios/{id_usuario}`

**Descripción:** Elimina un usuario.

## Interacciones (Chat)

### Listar Interacciones
**Endpoint:** `GET /interacciones/`

**Descripción:** Obtiene todas las interacciones del chat.

**Response (200):**
```json
[
  {
    "id_interaccion": 1,
    "pregunta": "¿Cómo puedo regularizar mi propiedad?",
    "respuesta": "Para regularizar tu propiedad necesitas...",
    "respuesta_util": "like",
    "fecha": "2025-01-15T10:30:00"
  }
]
```

### Obtener Interacción Específica
**Endpoint:** `GET /interacciones/{id_interaccion}`

**Descripción:** Obtiene una interacción específica por su ID.

### Crear Interacción
**Endpoint:** `POST /interacciones/`

**Descripción:** Crea una nueva interacción de chat.

**Request Body:**
```json
{
  "pregunta": "¿Cuáles son los requisitos para un trámite?",
  "respuesta": "Los requisitos son...",
  "respuesta_util": "like",
  "fecha": "2025-01-15T10:30:00"
}
```

### Actualizar Interacción
**Endpoint:** `PUT /interacciones/{id_interaccion}`

**Descripción:** Actualiza una interacción existente.

### Eliminar Interacción
**Endpoint:** `DELETE /interacciones/{id_interaccion}`

**Descripción:** Elimina una interacción.

## Prompts del Bot

### Listar Prompts
**Endpoint:** `GET /prompts-bot/`

**Descripción:** Obtiene todos los prompts de configuración del bot.

**Response (200):**
```json
[
  {
    "id_prompt": 1,
    "nombre": "Mensaje Inicial",
    "tipo": "Mensaje Inicial",
    "contenido": "Hola, soy Martita y estoy para ayudarte...",
    "estado": 1,
    "fecha_creacion": "2025-01-15T12:53:33"
  }
]
```

### Obtener Prompt Específico
**Endpoint:** `GET /prompts-bot/{id_prompt}`

**Descripción:** Obtiene un prompt específico por su ID.

### Crear Prompt
**Endpoint:** `POST /prompts-bot/`

**Descripción:** Crea un nuevo prompt para el bot.

**Request Body:**
```json
{
  "nombre": "Nuevo Prompt",
  "tipo": "Regla",
  "contenido": "Nueva regla para el bot...",
  "estado": 1
}
```

### Actualizar Prompt
**Endpoint:** `PUT /prompts-bot/{id_prompt}`

**Descripción:** Actualiza un prompt existente.

### Eliminar Prompt
**Endpoint:** `DELETE /prompts-bot/{id_prompt}`

**Descripción:** Elimina un prompt.

## Construir Trámite (Endpoints Especiales)

### Listar Trámites Estructurados
**Endpoint:** `GET /construir-tramite/estructurado`

**Descripción:** Obtiene trámites con toda su información estructurada (dirección, requisitos, pasos, formularios).

**Response (200):**
```json
[
  {
    "id_tramite": 1,
    "nombre": "REGULARIZACIÓN DE ÁREAS Y LINDEROS",
    "descripcion": "Regularizar y certificar la información...",
    "contexto": "El trámite permite legalizar...",
    "direccion": {
      "id_direcciones": 3,
      "nombre": "Dirección de Avalúos y Catastros"
    },
    "requisitos": [
      {
        "id_requisito": 2,
        "contexto": "REQUISITOS",
        "requisito": "1. Original de cédula de ciudadanía..."
      }
    ],
    "pasos": [
      {
        "id_paso": 1,
        "contexto": "PASOS PARA REALIZAR EL TRÁMITE",
        "paso": "1. Imprimir y llenar el Formulario..."
      }
    ],
    "formularios": [
      {
        "id_formulario": 1,
        "nombre": "Formulario de Avalúos",
        "url": "https://cayambe.gob.ec/formularios/avaluos.pdf"
      }
    ]
  }
]
```

### Obtener Trámite Estructurado Específico
**Endpoint:** `GET /construir-tramite/estructurado/{tramite_id}`

**Descripción:** Obtiene un trámite específico con toda su información estructurada.

**Parameters:**
- `tramite_id` (integer): ID del trámite estructurado

## Códigos de Estado HTTP

### Respuestas Exitosas
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Operación exitosa sin contenido

### Errores del Cliente
- `400 Bad Request` - Datos inválidos en la solicitud
- `401 Unauthorized` - No autenticado o token inválido
- `403 Forbidden` - No autorizado para acceder al recurso
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Error de validación de datos

### Errores del Servidor
- `500 Internal Server Error` - Error interno del servidor

## Ejemplos de Uso

### Autenticación y Obtención de Token
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "omigc4@gmail.com",
    "password": "password"
  }'
```

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
    "nombre": "NUEVO TRÁMITE MUNICIPAL",
    "descripcion": "Descripción del nuevo trámite",
    "contexto": "Contexto adicional del trámite",
    "estado": 1
  }'
```

### Obtener Trámite Estructurado
```bash
curl -X GET http://localhost:8000/construir-tramite/estructurado/1 \
  -H "Authorization: Bearer tu_token_aqui"
```

## Testing con Swagger UI

1. Accede a `http://localhost:8000/docs`
2. Haz clic en "Authorize" e ingresa tu token
3. Explora y prueba todos los endpoints interactivamente
4. Revisa los esquemas de datos y ejemplos

## Próximos Pasos

Después de familiarizarte con los endpoints:

1. Revisar la **Arquitectura** de la API
2. Explorar la **Seguridad** implementada
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo** 