# Instalación con Docker

## Requisitos Previos

Para la instalación con Docker, necesitas tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git**

## Estructura del Proyecto

El proyecto Martita IA utiliza Docker Compose para orquestar los siguientes servicios:

- **MySQL**: Base de datos principal
- **Backend**: API REST (FastAPI)
- **Flowise**: Motor de IA conversacional
- **Frontend**: Aplicación web (Vue.js)

<video width="100%" controls>
  <source src="/videos/mi_video.mp4" type="video/mp4" />
  Tu navegador no soporta el elemento video.
</video>


## Configuración de Variables de Entorno

### 1. Variables de Entorno Principales

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto para Flowise
PORT=3000

# Configuración adicional de Flowise (opcional)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin123
```

### 2. Variables de Entorno del Backend

Crear un archivo `.env` en el directorio `MARTITA_IA_API/`:

```env
# Configuración de Base de Datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=martita_ia

# Configuración de JWT
SECRET_KEY=tu_clave_secreta_muy_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Variables de Entorno de MySQL

Crear un archivo `.env` en el directorio `mysql/`:

```env
# Configuración de MySQL
MYSQL_ROOT_PASSWORD=tu_password_root
MYSQL_DATABASE=martita_ia
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
```

## Entornos de Despliegue

### Desarrollo (`docker-compose.dev.yml`)

Configuración optimizada para desarrollo con hot-reload:

```bash
# Ejecutar entorno de desarrollo
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

**Características del entorno de desarrollo:**
- Volúmenes montados para hot-reload
- Puerto 5173 para el frontend (Vite dev server)
- Puerto 8000 para el backend
- Puerto 3000 para Flowise
- Puerto 3306 para MySQL

### Pruebas (`docker-compose.test.yml`)

Configuración para pruebas automatizadas:

```bash
# Ejecutar entorno de pruebas
docker-compose -f docker-compose.test.yml up --build
```

**Características del entorno de pruebas:**
- Puerto 5174 para el frontend (evita conflictos)
- Configuración optimizada para testing
- Volúmenes persistentes para datos de prueba

### Producción (`docker-compose.yml`)

Configuración optimizada para producción:

```bash
# Ejecutar entorno de producción
docker-compose -f docker-compose.yml up --build
```

**Características del entorno de producción:**
- Puerto 80 para el frontend (nginx)
- Puerto 8000 para el backend
- Puerto 3000 para Flowise
- Puerto 3306 para MySQL
- Configuración optimizada para rendimiento

## Servicios Detallados

### MySQL

```yaml
mysql:
  image: mysql:8.3
  container_name: Martita_IA_MySQL
  ports:
    - "3306:3306"
  env_file:
    - ./mysql/.env
  volumes:
    - /c/MARTITA_IA/datos_docker/mysql:/var/lib/mysql
    - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
  healthcheck:
    test: ["CMD-SHELL", "mysqladmin ping -h localhost -u $${MYSQL_USER} -p$${MYSQL_PASSWORD}"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Backend (API REST)

```yaml
backend:
  build:
    context: ./MARTITA_IA_API
    dockerfile: Dockerfile
  container_name: Martita_IA_Backend
  ports:
    - "8000:8000"
  env_file:
    - ./MARTITA_IA_API/.env
  depends_on:
    - mysql
```

### Flowise

```yaml
flowise:
  container_name: Martita_IA_Flowise
  image: flowiseai/flowise
  ports:
    - "${PORT}:${PORT}"
  env_file:
    - .env
  volumes:
    - /c/MARTITA_IA/datos_docker/flowise:/root/.flowise
  restart: unless-stopped
```

### Frontend

**Desarrollo:**
```yaml
frontend:
  build:
    context: ./MARTITA_IA_Frontend
    dockerfile: Dockerfile.dev
  container_name: Martita_IA_Frontend
  ports:
    - "5173:5173"
  volumes:
    - ./MARTITA_IA_Frontend:/app
    - /app/node_modules
  environment:
    - CHOKIDAR_USEPOLLING=true
```

**Producción:**
```yaml
frontend:
  build:
    context: ./MARTITA_IA_Frontend
    dockerfile: Dockerfile
  container_name: Martita_IA_Frontend
  ports:
    - "80:80"
```

## Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up -d

# Detener todos los servicios
docker-compose -f docker-compose.dev.yml down

# Reiniciar servicios
docker-compose -f docker-compose.dev.yml restart

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs backend

# Ejecutar comandos dentro de un contenedor
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### Gestión de Volúmenes

```bash
# Ver volúmenes
docker volume ls

# Eliminar volúmenes (cuidado: esto elimina datos)
docker-compose -f docker-compose.dev.yml down -v

# Crear volúmenes manualmente
docker volume create martita_mysql_data
docker volume create martita_flowise_data
```

### Gestión de Imágenes

```bash
# Reconstruir imágenes sin cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar todas las imágenes no utilizadas
docker image prune -a
```

### Limpieza del Sistema

```bash
# Detener y eliminar contenedores
docker-compose -f docker-compose.dev.yml down

# Eliminar volúmenes
docker-compose -f docker-compose.dev.yml down -v

# Eliminar redes
docker-compose -f docker-compose.dev.yml down --remove-orphans

# Limpieza completa
docker system prune -a
```

## Verificación de la Instalación

### 1. Verificar Estado de Contenedores

```bash
# Ver todos los contenedores
docker-compose -f docker-compose.dev.yml ps

# Ver logs de todos los servicios
docker-compose -f docker-compose.dev.yml logs
```

### 2. Verificar Acceso a Servicios

Una vez que todos los contenedores estén ejecutándose:

- **Frontend**: `http://localhost:5173` (desarrollo) o `http://localhost:80` (producción)
- **Backend API**: `http://localhost:8000`
- **Flowise**: `http://localhost:3000`
- **MySQL**: `localhost:3306`

### 3. Verificar Base de Datos

```bash
# Conectar a MySQL desde el contenedor
docker-compose -f docker-compose.dev.yml exec mysql mysql -u tu_usuario -p

# Verificar tablas creadas
SHOW DATABASES;
USE martita_ia;
SHOW TABLES;
```

### 4. Verificar API

```bash
# Probar endpoint de salud
curl http://localhost:8000/health

# Ver documentación de la API
curl http://localhost:8000/docs
```

## Solución de Problemas

### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose -f docker-compose.dev.yml logs [nombre_servicio]

# Reconstruir el contenedor
docker-compose -f docker-compose.dev.yml up -d --build [nombre_servicio]

# Verificar configuración
docker-compose -f docker-compose.dev.yml config
```

### Problemas de Red

```bash
# Verificar redes de Docker
docker network ls

# Verificar conectividad entre contenedores
docker-compose -f docker-compose.dev.yml exec backend ping mysql
```

### Problemas de Permisos

```bash
# En sistemas Linux, ajustar permisos
sudo chown -R $USER:$USER .

# En Windows, verificar permisos de Docker Desktop
```

### Problemas de Memoria

```bash
# Verificar uso de recursos
docker stats

# Ajustar límites de memoria en Docker Desktop
```

## Configuración Avanzada

### Variables de Entorno por Entorno

**Desarrollo (.env.dev):**
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

**Producción (.env.prod):**
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info
```

### Configuración de Redes

```yaml
networks:
  default:
    driver: bridge
  martita_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Configuración de Volúmenes

```yaml
volumes:
  mysql_data:
    driver: local
  flowise_data:
    driver: local
  embeddings_data:
    driver: local
```

## Próximos Pasos

Después de la instalación con Docker:

1. **Configurar Flowise**:
   - Acceder a `http://localhost:3000`
   - Importar el flujo de chat desde `Flowise/flows/`
   - Configurar credenciales de IA

2. **Configurar Frontend**:
   - Verificar variables de entorno en `.env`
   - Configurar URLs de servicios

3. **Configurar Backend**:
   - Verificar conexión a base de datos
   - Configurar JWT y autenticación

4. **Monitoreo y Logging**:
   - Configurar logs centralizados
   - Implementar monitoreo de servicios

5. **Seguridad**:
   - Cambiar contraseñas por defecto
   - Configurar SSL/TLS en producción
   - Implementar firewall y acceso restringido 