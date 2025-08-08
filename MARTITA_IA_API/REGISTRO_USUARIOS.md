# Sistema de Validación de Registro de Usuarios

## Descripción
Se ha implementado un sistema de validación para el registro de usuarios similar al de Flowise, que utiliza variables de entorno para controlar el proceso de registro.

## Variables de Entorno

Las siguientes variables se han agregado al archivo `.env`:

```env
# Variables de entorno para validación de registro de usuarios
REGISTRO_USUARIOS_HABILITADO=true
REGISTRO_REQUIERE_VALIDACION=true
REGISTRO_ADMIN_USERNAME=admin
REGISTRO_ADMIN_PASSWORD=admin123
REGISTRO_DOMINIO_PERMITIDO=@gadip-mc.gob.ec
REGISTRO_MAX_USUARIOS=100
REGISTRO_REQUIERE_APROBACION=false
```

### Descripción de Variables

- **`REGISTRO_USUARIOS_HABILITADO`**: Controla si el registro está habilitado globalmente
- **`REGISTRO_REQUIERE_VALIDACION`**: Si requiere credenciales de administrador para registrar usuarios
- **`REGISTRO_ADMIN_USERNAME`**: Usuario administrador para validar registros
- **`REGISTRO_ADMIN_PASSWORD`**: Contraseña del administrador
- **`REGISTRO_DOMINIO_PERMITIDO`**: Dominio de email permitido (ej: @gadip-mc.gob.ec)
- **`REGISTRO_MAX_USUARIOS`**: Límite máximo de usuarios en el sistema
- **`REGISTRO_REQUIERE_APROBACION`**: Si los usuarios requieren aprobación manual (estado=0)

## Endpoints Disponibles

### 1. Registro Principal (Endpoint Modificado) ⭐
```
POST /usuarios/
```
**Cuerpo de la petición:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@gadip-mc.gob.ec",
  "password": "mi_password",
  "admin_username": "admin",
  "admin_password": "admin123"
}
```
**Descripción:** Endpoint principal para registro con validación completa basada en variables de entorno.

### 2. Registro con Validación (Compatibilidad)
```
POST /usuarios/register
```
**Cuerpo de la petición:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@gadip-mc.gob.ec",
  "password": "mi_password",
  "admin_username": "admin",
  "admin_password": "admin123"
}
```
**Descripción:** Endpoint duplicado para compatibilidad, funciona igual que el principal.

### 3. Registro Simple (Solo Desarrollo) ⚠️
```
POST /usuarios/simple
```
**Cuerpo de la petición:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "mi_password"
}
```
**Descripción:** Endpoint sin validaciones para casos especiales o desarrollo. **No recomendado para producción.**

## Validaciones Implementadas

### 1. Registro Habilitado
- Verifica que `REGISTRO_USUARIOS_HABILITADO=true`
- Error 403 si está deshabilitado

### 2. Validación de Administrador
- Si `REGISTRO_REQUIERE_VALIDACION=true`, valida credenciales admin
- Error 401 si las credenciales son incorrectas

### 3. Dominio de Email
- Si `REGISTRO_DOMINIO_PERMITIDO` está configurado, valida el dominio
- Error 400 si el email no coincide con el dominio

### 4. Límite de Usuarios
- Verifica que no se supere `REGISTRO_MAX_USUARIOS`
- Error 400 si se alcanza el límite

### 5. Email Único
- Verifica que el email no esté ya registrado
- Error 400 si el email ya existe

### 6. Estado del Usuario
- Si `REGISTRO_REQUIERE_APROBACION=true`, el usuario se crea con estado=0 (pendiente)
- Si `REGISTRO_REQUIERE_APROBACION=false`, el usuario se crea con estado=1 (activo)

## Respuestas de Error

### Error 403 - Registro Deshabilitado
```json
{
  "detail": "El registro de usuarios está deshabilitado"
}
```

### Error 401 - Credenciales Incorrectas
```json
{
  "detail": "Credenciales de administrador incorrectas"
}
```

### Error 400 - Dominio No Permitido
```json
{
  "detail": "Solo se permiten emails del dominio @gadip-mc.gob.ec"
}
```

### Error 400 - Límite Alcanzado
```json
{
  "detail": "Se ha alcanzado el límite máximo de 100 usuarios"
}
```

### Error 400 - Email Existente
```json
{
  "detail": "Ya existe un usuario con este email"
}
```

## Configuración Recomendada

### Para Desarrollo
```env
REGISTRO_USUARIOS_HABILITADO=true
REGISTRO_REQUIERE_VALIDACION=false
REGISTRO_DOMINIO_PERMITIDO=
REGISTRO_MAX_USUARIOS=1000
REGISTRO_REQUIERE_APROBACION=false
```

### Para Producción
```env
REGISTRO_USUARIOS_HABILITADO=true
REGISTRO_REQUIERE_VALIDACION=true
REGISTRO_ADMIN_USERNAME=admin_seguro
REGISTRO_ADMIN_PASSWORD=contraseña_muy_segura
REGISTRO_DOMINIO_PERMITIDO=@gadip-mc.gob.ec
REGISTRO_MAX_USUARIOS=100
REGISTRO_REQUIERE_APROBACION=true
```

## Archivos Modificados

1. **`.env`** - Agregadas variables de entorno
2. **`app/config.py`** - Configuración de variables
3. **`app/schemas/usuarios.py`** - Nuevo esquema `UsuarioCreateWithValidation`
4. **`app/controllers/usuarios.py`** - Funciones de validación y creación
5. **`app/routers/usuarios.py`** - Nuevo endpoint `/register`
6. **`app/schemas/__init__.py`** - Exportación del nuevo esquema

## Uso en Frontend

Para usar el nuevo sistema desde el frontend, debes enviar las credenciales de administrador junto con los datos del usuario:

```javascript
const registrarUsuario = async (userData) => {
  const response = await fetch('/usuarios/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password,
      admin_username: 'admin',
      admin_password: 'admin123'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  
  return await response.json();
};
```
