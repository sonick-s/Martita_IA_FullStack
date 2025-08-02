# Despliegue con Docker

## Configuración de Producción

<video width="100%" controls>
  <source src="/videos/mi_video.mp4" type="video/mp4" />
  Tu navegador no soporta el elemento video.
</video>
### 1. Preparar el Entorno de Producción

Antes del despliegue, asegúrate de tener:

- **Servidor con Docker y Docker Compose** instalados
- **Dominio configurado** (opcional pero recomendado)
- **Certificados SSL** (recomendado para producción)
- **Backup de la base de datos** (si existe)
- **Puertos disponibles**: 80, 443, 8000, 3000, 3306

### 2. Configurar Variables de Entorno de Producción

#### Variables de Entorno Principales (`.env`)

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto para Flowise
PORT=3000

# Configuración adicional de Flowise (opcional)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin123

# Configuración de producción
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info
```

#### Variables de Entorno del Backend (`MARTITA_IA_API/.env`)

```env
# Configuración de Base de Datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=tu_usuario_produccion
DB_PASSWORD=tu_password_seguro_produccion
DB_NAME=martita_ia

# Configuración de JWT
SECRET_KEY=tu_clave_secreta_muy_segura_produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Variables de Entorno de MySQL (`mysql/.env`)

```env
# Configuración de MySQL
MYSQL_ROOT_PASSWORD=tu_password_root_seguro
MYSQL_DATABASE=martita_ia
MYSQL_USER=tu_usuario_produccion
MYSQL_PASSWORD=tu_password_seguro_produccion
```

### 3. Configuración de Volúmenes

Para producción, es recomendable usar volúmenes Docker en lugar de bind mounts:

```bash
# Crear volúmenes para persistencia de datos
docker volume create martita_mysql_data
docker volume create martita_flowise_data
docker volume create martita_embeddings_data
```

### 4. Archivo Docker Compose para Producción

El archivo `docker-compose.yml` ya está configurado para producción, pero puedes crear un archivo específico `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.3
    container_name: Martita_IA_MySQL_Prod
    ports:
      - "3306:3306"
    env_file:
      - ./mysql/.env
    volumes:
      - martita_mysql_data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u $${MYSQL_USER} -p$${MYSQL_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  backend:
    build:
      context: ./MARTITA_IA_API
      dockerfile: Dockerfile
    container_name: Martita_IA_Backend_Prod
    ports:
      - "8000:8000"
    env_file:
      - ./MARTITA_IA_API/.env
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped

  flowise:
    container_name: Martita_IA_Flowise_Prod
    image: flowiseai/flowise
    ports:
      - "${PORT}:${PORT}"
    env_file:
      - .env
    volumes:
      - martita_flowise_data:/root/.flowise
      - martita_embeddings_data:/app/data
    restart: unless-stopped
    depends_on:
      - backend

  frontend:
    build:
      context: ./MARTITA_IA_Frontend
      dockerfile: Dockerfile
    container_name: Martita_IA_Frontend_Prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  martita_mysql_data:
    driver: local
  martita_flowise_data:
    driver: local
  martita_embeddings_data:
    driver: local

networks:
  default:
    driver: bridge
```

## Proceso de Despliegue

### 1. Preparar el Servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Clonar el Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Martita_IA_1.0.git
cd Martita_IA_1.0

# Verificar que todos los archivos estén presentes
ls -la
```

### 3. Configurar Variables de Entorno

```bash
# Crear archivos de variables de entorno
cp .env.example .env  # si existe
cp MARTITA_IA_API/.env.example MARTITA_IA_API/.env  # si existe
cp mysql/.env.example mysql/.env  # si existe

# Editar las variables de entorno con valores de producción
nano .env
nano MARTITA_IA_API/.env
nano mysql/.env
```

### 4. Configurar SSL (Opcional pero Recomendado)

```bash
# Crear directorio para certificados
mkdir -p ssl

# Generar certificado autofirmado (solo para pruebas)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Para producción, usar certificados reales (Let's Encrypt, etc.)
```

### 5. Desplegar la Aplicación

```bash
# Construir e iniciar servicios
docker-compose -f docker-compose.yml up -d --build

# Verificar estado
docker-compose -f docker-compose.yml ps

# Ver logs
docker-compose -f docker-compose.yml logs -f
```

### 6. Verificar el Despliegue

```bash
# Verificar que todos los contenedores estén ejecutándose
docker-compose -f docker-compose.yml ps

# Verificar logs de cada servicio
docker-compose -f docker-compose.yml logs mysql
docker-compose -f docker-compose.yml logs backend
docker-compose -f docker-compose.yml logs flowise
docker-compose -f docker-compose.yml logs frontend

# Verificar conectividad
curl http://localhost:8000/health  # Backend
curl http://localhost:3000  # Flowise
curl http://localhost:80  # Frontend
```

## Configuración de Nginx (Opcional)

Para un despliegue más robusto, puedes agregar Nginx como proxy reverso:

### 1. Crear Configuración de Nginx

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream flowise {
        server flowise:3000;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name tu-dominio.com;

        # Redirigir HTTP a HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name tu-dominio.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # API endpoints
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Flowise endpoints
        location /flowise/ {
            proxy_pass http://flowise/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend
        location / {
            proxy_pass http://frontend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 2. Agregar Nginx al Docker Compose

```yaml
  nginx:
    image: nginx:alpine
    container_name: Martita_IA_Nginx_Prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
      - flowise
    restart: unless-stopped
```

## Monitoreo y Mantenimiento

### 1. Logs y Monitoreo

```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.yml logs backend

# Monitorear recursos
docker stats

# Verificar uso de disco
docker system df
```

### 2. Backup de Base de Datos

```bash
# Crear backup
docker-compose -f docker-compose.yml exec mysql \
  mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose -f docker-compose.yml exec -T mysql \
  mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backup_file.sql
```

### 3. Actualizaciones

```bash
# Actualizar código
git pull origin main

# Reconstruir y reiniciar servicios
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d --build

# O actualizar solo un servicio
docker-compose -f docker-compose.yml up -d --build backend
```

### 4. Limpieza del Sistema

```bash
# Limpiar contenedores no utilizados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune

# Limpieza completa
docker system prune -a
```

## Seguridad

### 1. Firewall

```bash
# Configurar firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Verificar estado
sudo ufw status
```

### 2. Variables de Entorno Seguras

- ✅ Usar contraseñas fuertes y únicas
- ✅ Rotar las claves regularmente
- ✅ No hacer commit de archivos `.env` al repositorio
- ✅ Usar secretos de Docker para información sensible
- ✅ Cambiar credenciales por defecto de Flowise

### 3. Monitoreo de Seguridad

```bash
# Verificar contenedores ejecutándose
docker ps

# Verificar logs de seguridad
docker-compose -f docker-compose.yml logs | grep -i error

# Escanear vulnerabilidades
docker scout cves
```

## Escalabilidad

### 1. Escalado Horizontal

```bash
# Escalar servicios (si es necesario)
docker-compose -f docker-compose.yml up -d --scale backend=3
```

### 2. Load Balancer

Para producción a gran escala, considera:
- **HAProxy** para balanceo de carga
- **Nginx** como proxy reverso
- **Docker Swarm** para orquestación
- **Kubernetes** para gestión avanzada

### 3. Base de Datos

Para producción a gran escala:
- **Base de datos gestionada** (AWS RDS, Google Cloud SQL)
- **Replicación de lectura**
- **Clustering de base de datos**
- **Backup automático**

## Troubleshooting

### Problemas Comunes

#### 1. Contenedor no inicia

```bash
# Verificar logs
docker-compose -f docker-compose.yml logs [servicio]

# Verificar configuración
docker-compose -f docker-compose.yml config

# Reconstruir contenedor
docker-compose -f docker-compose.yml up -d --build [servicio]
```

#### 2. Problemas de Red

```bash
# Verificar redes
docker network ls

# Verificar conectividad entre contenedores
docker-compose -f docker-compose.yml exec backend ping mysql
```

#### 3. Problemas de Memoria

```bash
# Verificar uso de recursos
docker stats

# Ajustar límites en docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

#### 4. Problemas de Base de Datos

```bash
# Verificar conexión a MySQL
docker-compose -f docker-compose.yml exec mysql mysql -u root -p

# Verificar logs de MySQL
docker-compose -f docker-compose.yml logs mysql

# Reiniciar MySQL
docker-compose -f docker-compose.yml restart mysql
```

### Comandos de Diagnóstico

```bash
# Verificar estado de contenedores
docker-compose -f docker-compose.yml ps

# Verificar logs
docker-compose -f docker-compose.yml logs

# Verificar redes
docker network ls

# Verificar volúmenes
docker volume ls

# Verificar imágenes
docker images
```

## Verificación Final

### Checklist de Despliegue

- [ ] **Docker y Docker Compose** instalados y funcionando
- [ ] **Variables de entorno** configuradas correctamente
- [ ] **Todos los contenedores** ejecutándose sin errores
- [ ] **Base de datos** inicializada y accesible
- [ ] **Backend API** respondiendo en puerto 8000
- [ ] **Flowise** accesible en puerto 3000
- [ ] **Frontend** accesible en puerto 80
- [ ] **SSL configurado** (si es necesario)
- [ ] **Firewall configurado** correctamente
- [ ] **Backup inicial** creado
- [ ] **Monitoreo** configurado

### URLs de Verificación

- **Frontend**: `http://tu-dominio.com` o `http://localhost:80`
- **Backend API**: `http://tu-dominio.com:8000` o `http://localhost:8000`
- **Flowise**: `http://tu-dominio.com:3000` o `http://localhost:3000`
- **Documentación API**: `http://tu-dominio.com:8000/docs`

### Próximos Pasos

1. **Configurar Flowise**:
   - Acceder a `http://localhost:3000`
   - Importar el flujo de chat desde `Flowise/flows/`
   - Configurar credenciales de IA

2. **Configurar Monitoreo**:
   - Implementar logs centralizados
   - Configurar alertas
   - Monitorear rendimiento

3. **Configurar Backup Automático**:
   - Programar backups de base de datos
   - Backup de volúmenes Docker
   - Verificar restauración

4. **Optimizar Rendimiento**:
   - Ajustar recursos de contenedores
   - Configurar caché
   - Optimizar consultas de base de datos 