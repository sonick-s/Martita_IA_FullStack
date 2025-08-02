# Instalación Manual

A continuación, se presenta una guía detallada para la instalación y configuración manual de todos los componentes del proyecto "Martita IA", abarcando tanto el backend y frontend como la configuración inicial de Flowise y la carga de la base de conocimiento.

<video width="100%" controls>
  <source src="/videos/mi_video.mp4" type="video/mp4" />
  Tu navegador no soporta el elemento video.
</video>


## Instalacion de Frontend

:::tip 
### Requisitos Previos
Tener una versión de node.js similar o superior a la 22.12.0
:::


### Instrucciones de instalacion 

```sh
npm install

npm run dev # para iniciar el servidor de desarrollo

npm run build # para compilar la aplicacion
```


```sh
npm run lint # para corregir errores de codigo
```
### Docker

```sh
docker build --no-cache -t martita-frontend-nginx . # para construir la imagen
docker run -d -p 8080:80 --name martita-frontend-nginx martita-frontend-nginx # para iniciar el contenedor

```

## Instalacion del Backend

:::tip 
### Requisitos Previos
- Python 3.11 o superior
- pip (gestor de paquetes de Python)
- Base de datos MySQL configurada
:::

### Instrucciones de instalacion 

#### 1. Crear el entorno virtual

```sh
python -m venv venv # Crear entorno virtual
source venv/Scripts/activate # activar el entorno virtual En Windows
source venv/bin/activate # activar el entorno virtual En Unix/macOS
```

#### 2. Instalar dependencias

```sh
pip install -r requirements.txt # Instalar dependencias
```

#### 3. Configurar variables de entorno

Crear un archivo `.env` en el directorio `MARTITA_IA_API/` con las siguientes variables:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=martita_ia

# Configuración de JWT
SECRET_KEY=tu_clave_secreta_muy_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 4. Ejecutar la API

```sh
uvicorn app.main:app --reload # Lanzar la API en modo desarrollo
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload # Lanzar la API para flowise
```

Esto ejecutará la API en modo desarrollo en `http://127.0.0.1:8000`.

### Docker

```sh
# Construir la imagen
docker build --no-cache -t martita_ia_api .

# Ejecutar el contenedor
docker run -d -p 8000:8000 --env-file .env --name martita_api_container martita_ia_api
```

## Instalacion de Flowise

:::tip 
### Requisitos Previos
- Docker instalado y configurado
- Puerto disponible para Flowise (por defecto 3000)
:::

### Instalacion con Docker

Flowise se ejecuta como un contenedor Docker utilizando la imagen oficial:

```sh
# Ejecutar Flowise con Docker
docker run -d \
  --name Martita_IA_Flowise \
  -p 3000:3000 \
  -v /ruta/local/flowise:/root/.flowise \
  --env-file .env \
  flowiseai/flowise
```

### Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto para Flowise
PORT=3000

# Configuración adicional de Flowise (opcional)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin123
```

### Acceder a Flowise

Una vez ejecutado, Flowise estará disponible en:
- **URL**: `http://localhost:3000`
- **Usuario por defecto**: admin
- **Contraseña por defecto**: admin123

### Volúmenes de datos

Flowise almacena sus datos en el volumen `/root/.flowise` dentro del contenedor. Para persistencia de datos, se recomienda mapear este directorio a una carpeta local:

```sh
-v /ruta/local/flowise:/root/.flowise
```
carga el flujo de chat Usando el boton de importar chatflow y sube el archivo Martita_IA chatflowque se encuentra dentro de la carpeta Flowise/flows 

## Instalacion de Mysql

:::tip 
### Requisitos Previos
- Docker instalado y configurado
- Puerto 3306 disponible
:::

### Instalacion con Docker

MySQL se ejecuta como un contenedor Docker utilizando la imagen oficial:

```sh
# Ejecutar MySQL con Docker
docker run -d \
  --name Martita_IA_MySQL \
  -p 3306:3306 \
  -v /ruta/local/mysql:/var/lib/mysql \
  -v ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql \
  --env-file ./mysql/.env \
  mysql:8.3
```

### Configurar variables de entorno

Crear un archivo `.env` en el directorio `mysql/` con las siguientes variables:

```env
# Configuración de MySQL
MYSQL_ROOT_PASSWORD=tu_password_root
MYSQL_DATABASE=martita_ia
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
```

### Inicialización de la base de datos

El archivo `mysql/init.sql` contiene la estructura inicial de la base de datos con:
- Tablas para direcciones, trámites, formularios, pasos, requisitos
- Datos de ejemplo para direcciones municipales
- Configuración de usuarios y autenticación

### Conectar a MySQL

```sh
# Conectar desde línea de comandos
mysql -h localhost -P 3306 -u tu_usuario -p

# O usar un cliente gráfico como MySQL Workbench
# Host: localhost
# Puerto: 3306
# Usuario: tu_usuario
# Contraseña: tu_password
# Base de datos: martita_ia
```

### Verificar la instalación

Verificar que el contenedor esté ejecutándose

```sh

docker ps #verifica el contenedor

docker logs Martita_IA_MySQL # Ver logs del contenedor

docker exec -it Martita_IA_MySQL mysql -u tu_usuario -p # Verificar conexión a la base de datos
```

