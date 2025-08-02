# GUÍA TÉCNICA - MARTITA IA
## Sistema de Asistente Virtual para Gestión Municipal

---

## 📋 ÍNDICE

1. [Descripción General del Proyecto](#descripción-general-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Base de Datos](#base-de-datos)
5. [API Backend](#api-backend)
6. [Frontend](#frontend)
7. [Flowise - Motor de IA](#flowise---motor-de-ia)
8. [Docker y Contenedores](#docker-y-contenedores)
9. [Configuración y Despliegue](#configuración-y-despliegue)
10. [Seguridad](#seguridad)
11. [Mantenimiento y Monitoreo](#mantenimiento-y-monitoreo)

---

## 🎯 DESCRIPCIÓN GENERAL DEL PROYECTO

**Martita IA** es un sistema integral de asistente virtual inteligente diseñado para la gestión municipal. El proyecto proporciona una plataforma completa que permite a los ciudadanos obtener información sobre trámites, direcciones municipales y servicios gubernamentales a través de un chatbot inteligente.

### Objetivos Principales:
- Facilitar el acceso a información municipal
- Automatizar respuestas a consultas frecuentes
- Gestionar trámites y direcciones municipales
- Proporcionar una interfaz intuitiva para administradores
- Integrar inteligencia artificial para respuestas contextuales

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Arquitectura General
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Base de       │
│   (Vue.js)      │◄──►│   (FastAPI)     │◄──►│   Datos MySQL   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Flowise       │    │   Docker        │    │   Documentación │
│   (IA Engine)   │    │   Containers    │    │   (Docusaurus)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tecnologías Utilizadas:
- **Frontend**: Vue.js 3 + Vite + Pinia
- **Backend**: FastAPI + Python
- **Base de Datos**: MySQL 8.3
- **IA**: Flowise (Motor de Chatbot)
- **Contenedores**: Docker + Docker Compose
- **Documentación**: Docusaurus

---

## 🔧 COMPONENTES DEL SISTEMA

### 1. **MARTITA_IA_API** (Backend)
- **Lenguaje**: Python 3.x
- **Framework**: FastAPI
- **Base de Datos**: MySQL con SQLAlchemy
- **Autenticación**: JWT
- **Puerto**: 8000

### 2. **MARTITA_IA_Frontend** (Frontend)
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Puerto**: 5173 (desarrollo)

### 3. **MySQL** (Base de Datos)
- **Versión**: 8.3
- **Puerto**: 3306
- **Persistencia**: Volúmenes Docker

### 4. **Flowise** (Motor de IA)
- **Imagen**: flowiseai/flowise
- **Configuración**: Variables de entorno
- **Persistencia**: Volúmenes para embeddings

---

## 🗄️ BASE DE DATOS

### Esquema de Base de Datos

#### Tablas Principales:

1. **`usuarios`**
   - Gestión de usuarios administradores
   - Autenticación y autorización

2. **`direcciones`**
   - Información de direcciones municipales
   - Responsables y datos de contacto

3. **`tramites`**
   - Catálogo de trámites disponibles
   - Información detallada de cada trámite

4. **`requisitos_tramite`**
   - Requisitos específicos por trámite
   - Documentación necesaria

5. **`pasos_tramite`**
   - Pasos a seguir para cada trámite
   - Guías paso a paso

6. **`formularios_tramite`**
   - Formularios asociados a trámites
   - URLs y contextos

7. **`prompts_bot`**
   - Configuración de respuestas del bot
   - Reglas de comportamiento

8. **`interacciones`**
   - Historial de conversaciones
   - Feedback de usuarios

### Características de la Base de Datos:
- **Motor**: MySQL 8.3
- **Charset**: utf8mb4
- **Collation**: utf8mb4_0900_ai_ci
- **Estado de registros**: Soft delete (estado = -1)
- **Inicialización**: Script automático (init.sql)

---

## 🔌 API BACKEND

### Estructura del Proyecto:
```
MARTITA_IA_API/
├── app/
│   ├── main.py              # Punto de entrada
│   ├── config.py            # Configuración
│   ├── database.py          # Conexión BD
│   ├── security.py          # Autenticación JWT
│   ├── models/              # Modelos SQLAlchemy
│   ├── schemas/             # Esquemas Pydantic
│   ├── controllers/         # Lógica de negocio
│   └── routers/             # Endpoints API
├── requirements.txt         # Dependencias Python
└── Dockerfile              # Configuración Docker
```

### Endpoints Principales:

#### Autenticación:
- `POST /login` - Autenticación de usuarios
- `POST /register` - Registro de usuarios

#### Direcciones:
- `GET /direcciones` - Listar direcciones
- `POST /direcciones` - Crear dirección
- `PUT /direcciones/{id}` - Actualizar dirección
- `DELETE /direcciones/{id}` - Eliminar dirección

#### Trámites:
- `GET /tramites` - Listar trámites
- `POST /tramites` - Crear trámite
- `PUT /tramites/{id}` - Actualizar trámite
- `DELETE /tramites/{id}` - Eliminar trámite

#### Requisitos:
- `GET /requisitos-tramite` - Listar requisitos
- `POST /requisitos-tramite` - Crear requisito

#### Pasos:
- `GET /pasos-tramite` - Listar pasos
- `POST /pasos-tramite` - Crear paso

#### Formularios:
- `GET /formularios-tramite` - Listar formularios
- `POST /formularios-tramite` - Crear formulario

#### Interacciones:
- `GET /interacciones` - Historial de conversaciones
- `POST /interacciones` - Guardar interacción

#### Prompts del Bot:
- `GET /prompts-bot` - Configuración del bot
- `POST /prompts-bot` - Actualizar configuración

### Características Técnicas:
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **Validación**: Pydantic
- **Autenticación**: JWT
- **CORS**: Configurado para desarrollo
- **Async/Await**: Operaciones asíncronas

---

## 🎨 FRONTEND

### Estructura del Proyecto:
```
MARTITA_IA_Frontend/
├── src/
│   ├── main.js              # Punto de entrada
│   ├── App.vue              # Componente raíz
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes Vue
│   ├── views/               # Páginas/Vistas
│   ├── router/              # Configuración de rutas
│   ├── stores/              # Estado global (Pinia)
│   ├── services/            # Servicios API
│   ├── layouts/             # Layouts de página
│   └── boot/                # Configuración inicial
├── public/                  # Archivos públicos
├── package.json             # Dependencias
└── vite.config.js           # Configuración Vite
```

### Tecnologías Frontend:
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Linting**: ESLint + Prettier

### Características de la Interfaz:
- **Responsive Design**: Adaptable a diferentes dispositivos
- **Componentes Modulares**: Reutilizables y mantenibles
- **Validación de Formularios**: Cliente y servidor
- **Navegación Intuitiva**: Sistema de rutas organizado
- **Gestión de Estado**: Centralizada con Pinia

### Módulos Principales:
1. **Autenticación**: Login y registro
2. **Dashboard**: Panel principal
3. **Direcciones**: Gestión de direcciones municipales
4. **Trámites**: Administración de trámites
5. **Usuarios**: Gestión de usuarios
6. **Configuración**: Ajustes del sistema

---

## 🤖 FLOWISE - MOTOR DE IA

### Descripción:
Flowise es el motor de inteligencia artificial que proporciona capacidades de chatbot inteligente al sistema Martita IA.

### Características:
- **Motor de Chatbot**: Procesamiento de lenguaje natural
- **Integración**: Conectado con la API backend
- **Persistencia**: Almacenamiento de embeddings
- **Configuración**: Variables de entorno
- **Volúmenes**: Datos persistentes

### Configuración:
```yaml
flowise:
  image: flowiseai/flowise
  ports:
    - "${PORT}:${PORT}"
  volumes:
    - /c/MARTITA_IA/datos_docker/flowise:/root/.flowise
    - /c/MARTITA_IA/datos_docker/embeddings:/app/data
```

### Funcionalidades:
- **Procesamiento de Consultas**: Análisis de preguntas de usuarios
- **Respuestas Contextuales**: Basadas en información municipal
- **Aprendizaje Continuo**: Mejora de respuestas
- **Integración con Base de Datos**: Acceso a información actualizada

---

## 🐳 DOCKER Y CONTENEDORES

### Configuración de Entornos:

#### 1. **Desarrollo** (`docker-compose.dev.yml`)
```yaml
services:
  mysql:      # Base de datos
  backend:    # API FastAPI
  flowise:    # Motor de IA
  frontend:   # Vue.js (modo desarrollo)
```

#### 2. **Pruebas** (`docker-compose.test.yml`)
- Configuración optimizada para testing
- Documentación técnica incluida

#### 3. **Producción** (`docker-compose.yml`)
- Configuración optimizada para producción
- Solo documentación de usuario

### Comandos de Despliegue:
```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Pruebas
docker-compose -f docker-compose.test.yml up --build

# Producción
docker-compose -f docker-compose.yml up --build
```

### Características de Contenedores:
- **Persistencia**: Volúmenes Docker para datos
- **Health Checks**: Monitoreo de servicios
- **Networking**: Red bridge interna
- **Variables de Entorno**: Configuración flexible
- **Hot Reload**: Desarrollo en tiempo real

---

## ⚙️ CONFIGURACIÓN Y DESPLIEGUE

### Requisitos del Sistema:
- **Docker**: Versión 20.10+
- **Docker Compose**: Versión 2.0+
- **Memoria RAM**: Mínimo 4GB
- **Espacio en Disco**: 10GB disponibles

### Variables de Entorno:

#### Backend (.env):
```env
DATABASE_URL=mysql+aiomysql://user:password@mysql:3306/martita_ia
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### MySQL (.env):
```env
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=martita_ia
MYSQL_USER=user
MYSQL_PASSWORD=password
```

#### Flowise (.env):
```env
PORT=3000
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin
```

### Pasos de Instalación:

1. **Clonar el Repositorio**:
```bash
git clone <repository-url>
cd MARTITA_IA_1.0
```

2. **Configurar Variables de Entorno**:
```bash
# Crear archivos .env en cada directorio
cp .env.example .env
```

3. **Ejecutar en Desarrollo**:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

4. **Acceder a los Servicios**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Flowise: http://localhost:3000
- MySQL: localhost:3306

---

## 🔒 SEGURIDAD

### Medidas de Seguridad Implementadas:

#### 1. **Autenticación JWT**:
- Tokens de acceso con expiración
- Refresh tokens para renovación
- Algoritmo HS256 para firma

#### 2. **Validación de Datos**:
- Pydantic schemas para validación
- Sanitización de inputs
- Prevención de inyección SQL

#### 3. **CORS Configurado**:
- Orígenes permitidos configurados
- Headers de seguridad
- Métodos HTTP restringidos

#### 4. **Base de Datos**:
- Contraseñas hasheadas con bcrypt
- Conexiones seguras
- Usuarios con permisos limitados

#### 5. **Docker**:
- Contenedores aislados
- Redes internas
- Volúmenes seguros

### Recomendaciones de Seguridad:
- Cambiar contraseñas por defecto
- Configurar firewall
- Mantener actualizaciones
- Monitorear logs
- Backup regular de datos

---

## 🔧 MANTENIMIENTO Y MONITOREO

### Tareas de Mantenimiento:

#### 1. **Base de Datos**:
- Backup diario de datos
- Optimización de consultas
- Limpieza de logs antiguos
- Monitoreo de espacio en disco

#### 2. **Aplicación**:
- Actualización de dependencias
- Revisión de logs de errores
- Monitoreo de rendimiento
- Testing de funcionalidades

#### 3. **Contenedores**:
- Actualización de imágenes Docker
- Limpieza de contenedores no utilizados
- Monitoreo de recursos
- Verificación de health checks

### Monitoreo Recomendado:

#### 1. **Métricas de Sistema**:
- Uso de CPU y memoria
- Espacio en disco
- Latencia de red
- Tiempo de respuesta

#### 2. **Métricas de Aplicación**:
- Tasa de errores
- Tiempo de respuesta de API
- Número de usuarios activos
- Interacciones del chatbot

#### 3. **Logs a Monitorear**:
- Logs de aplicación
- Logs de base de datos
- Logs de contenedores
- Logs de autenticación

### Herramientas de Monitoreo:
- **Docker Stats**: Monitoreo de contenedores
- **MySQL Workbench**: Gestión de base de datos
- **Postman**: Testing de API
- **Browser DevTools**: Debugging frontend

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Archivos de Documentación:
- `README.md`: Documentación general del proyecto
- `Manual_Tecnico/`: Documentación técnica detallada
- `docs/`: Documentación de usuario (Docusaurus)

### Recursos Útiles:
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Vue.js Documentation**: https://vuejs.org/
- **Flowise Documentation**: https://docs.flowiseai.com/
- **Docker Documentation**: https://docs.docker.com/

### Contacto y Soporte:
- **Equipo de Desarrollo**: [Información del equipo]
- **Repositorio**: [URL del repositorio]
- **Issues**: [Sistema de tickets]

---

## 🚀 ROADMAP Y MEJORAS FUTURAS

### Funcionalidades Planificadas:
- [ ] Integración con más servicios municipales
- [ ] Análisis de sentimientos en interacciones
- [ ] Dashboard de analytics
- [ ] Notificaciones push
- [ ] Integración con redes sociales
- [ ] Sistema de tickets automático
- [ ] Multiidioma
- [ ] Accesibilidad mejorada

### Optimizaciones Técnicas:
- [ ] Cache distribuido (Redis)
- [ ] Load balancing
- [ ] CDN para assets estáticos
- [ ] Microservicios
- [ ] CI/CD pipeline
- [ ] Testing automatizado
- [ ] Monitoreo avanzado (Prometheus/Grafana)

---

*Esta guía técnica debe mantenerse actualizada con cada nueva versión del sistema Martita IA.* 