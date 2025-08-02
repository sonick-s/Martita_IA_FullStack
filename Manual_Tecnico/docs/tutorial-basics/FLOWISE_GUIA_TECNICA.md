# FLOWISE - GUÍA TÉCNICA
## Motor de Inteligencia Artificial para Martita IA

---

## 🎯 DESCRIPCIÓN GENERAL

**Flowise** es el motor de inteligencia artificial que proporciona capacidades de chatbot inteligente al sistema Martita IA. Es una plataforma de código abierto que permite crear flujos de trabajo de IA visuales sin necesidad de programación.

### Propósito en Martita IA
- Procesar consultas de usuarios en lenguaje natural
- Proporcionar respuestas contextuales basadas en información municipal
- Aprender de las interacciones para mejorar respuestas
- Integrar con la base de datos del sistema

---

## 🏗️ ARQUITECTURA DE FLOWISE

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    FLOWISE ENGINE                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Input     │  │  Processing │  │   Output    │     │
│  │  Nodes      │  │   Nodes     │  │   Nodes     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Language   │  │   Memory    │  │  Database   │     │
│  │   Models    │  │  Management │  │ Integration │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Integración con Martita IA
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Flowise   │    │   Backend   │
│   (Vue.js)  │◄──►│   (IA)      │◄──►│   (FastAPI) │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   MySQL     │
                   │   Database  │
                   └─────────────┘
```

---

## 🔧 CONFIGURACIÓN TÉCNICA

### Configuración en Docker Compose

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
    - /c/MARTITA_IA/datos_docker/embeddings:/app/data
  restart: unless-stopped
  depends_on:
    - backend
```

### Variables de Entorno

```env
# Configuración básica
PORT=3000
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin

# Configuración de base de datos
DATABASE_TYPE=mysql
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=martita_ia
DATABASE_USER=user
DATABASE_PASSWORD=password

# Configuración de IA
OPENAI_API_KEY=your-openai-api-key
EMBEDDINGS_MODEL=text-embedding-ada-002
CHAT_MODEL=gpt-3.5-turbo
```

### Volúmenes Persistentes

#### 1. **Flowise Data** (`/root/.flowise`)
- Configuraciones de flujos
- Historial de conversaciones
- Configuraciones de nodos
- Datos de sesión

#### 2. **Embeddings Data** (`/app/data`)
- Vectores de embeddings
- Modelos de lenguaje
- Cache de respuestas
- Datos de entrenamiento

---

## 🔄 FLUJOS DE TRABAJO

### Flujo Principal de Martita IA

#### 1. **Recepción de Consulta**
```
Usuario → Frontend → API → Flowise
```

#### 2. **Procesamiento de Lenguaje Natural**
- Análisis de intención del usuario
- Extracción de entidades relevantes
- Clasificación de tipo de consulta

#### 3. **Búsqueda de Información**
- Consulta a base de datos
- Búsqueda en embeddings
- Recuperación de contexto relevante

#### 4. **Generación de Respuesta**
- Construcción de respuesta contextual
- Formateo de información
- Inclusión de pasos o requisitos

#### 5. **Registro de Interacción**
- Guardado en base de datos
- Análisis de utilidad
- Mejora de respuestas futuras

### Tipos de Consultas Soportadas

#### 1. **Consultas sobre Trámites**
- "¿Qué necesito para obtener un certificado de avalúo?"
- "¿Cuáles son los pasos para un trámite de catastro?"
- "¿Qué documentos requiero para...?"

#### 2. **Consultas sobre Direcciones**
- "¿Cuál es la dirección de Planificación?"
- "¿Quién es el responsable de Obras Públicas?"
- "¿Cuál es el teléfono de...?"

#### 3. **Consultas Generales**
- "¿Qué trámites ofrece el municipio?"
- "¿Cuáles son los horarios de atención?"
- "¿Cómo puedo contactar al municipio?"

---

## 🧠 COMPONENTES DE IA

### Modelos de Lenguaje Utilizados

#### 1. **Modelo de Chat**
- **Proveedor**: OpenAI GPT-3.5-turbo
- **Función**: Generación de respuestas conversacionales
- **Configuración**: Temperatura 0.7, Max tokens 1000

#### 2. **Modelo de Embeddings**
- **Proveedor**: OpenAI text-embedding-ada-002
- **Función**: Conversión de texto a vectores
- **Uso**: Búsqueda semántica de información

#### 3. **Modelo de Clasificación**
- **Función**: Clasificación de intenciones
- **Categorías**: Trámites, Direcciones, General, Ayuda

### Nodos de Procesamiento

#### 1. **Input Nodes**
- **Chat Input**: Recepción de mensajes del usuario
- **Text Input**: Entrada de texto directa
- **File Input**: Carga de documentos

#### 2. **Processing Nodes**
- **LLM Chain**: Cadena de procesamiento de lenguaje
- **Memory**: Gestión de contexto de conversación
- **Vector Store**: Almacenamiento y búsqueda de embeddings
- **Function**: Llamadas a APIs externas

#### 3. **Output Nodes**
- **Chat Output**: Respuesta al usuario
- **Text Output**: Salida de texto
- **API Output**: Respuesta a APIs

---

## 🔗 INTEGRACIÓN CON BACKEND

### Endpoints de Integración

#### 1. **Actualización de Memoria**
```http
POST /api/flowise/update-memory
Content-Type: application/json

{
  "action": "update_memory",
  "data": {
    "tramites": [...],
    "direcciones": [...],
    "requisitos": [...]
  }
}
```

#### 2. **Consulta de Información**
```http
GET /api/flowise/query
Content-Type: application/json

{
  "question": "¿Qué necesito para un trámite de avalúo?",
  "context": "user_session_id"
}
```

#### 3. **Registro de Interacción**
```http
POST /api/flowise/interaction
Content-Type: application/json

{
  "question": "Pregunta del usuario",
  "answer": "Respuesta del bot",
  "useful": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Sincronización de Datos

#### 1. **Actualización Automática**
- Sincronización periódica con base de datos
- Actualización de embeddings cuando cambian los datos
- Invalidación de cache cuando es necesario

#### 2. **Trigger Manual**
- Botón "Actualizar Memoria" en interfaz administrativa
- Actualización inmediata de información
- Regeneración de embeddings

---

## 📊 MONITOREO Y ANÁLISIS

### Métricas de Rendimiento

#### 1. **Métricas de Respuesta**
- Tiempo de respuesta promedio
- Tasa de éxito de consultas
- Número de consultas por hora/día

#### 2. **Métricas de Calidad**
- Calificación de utilidad por usuarios
- Tasa de resolución de consultas
- Análisis de sentimientos

#### 3. **Métricas Técnicas**
- Uso de memoria y CPU
- Latencia de modelos de IA
- Errores y excepciones

### Logs y Debugging

#### 1. **Logs de Aplicación**
```bash
# Ver logs del contenedor
docker logs Martita_IA_Flowise

# Logs en tiempo real
docker logs -f Martita_IA_Flowise
```

#### 2. **Logs de Flujos**
- Registro de cada paso en el flujo
- Tiempo de procesamiento por nodo
- Errores y advertencias

#### 3. **Análisis de Conversaciones**
- Historial completo de interacciones
- Patrones de uso
- Mejoras sugeridas

---

## 🔧 MANTENIMIENTO Y OPTIMIZACIÓN

### Tareas de Mantenimiento

#### 1. **Actualización de Modelos**
- Actualización periódica de modelos de IA
- Evaluación de nuevos modelos disponibles
- Optimización de parámetros

#### 2. **Limpieza de Datos**
- Eliminación de embeddings obsoletos
- Limpieza de logs antiguos
- Optimización de base de datos

#### 3. **Backup y Recuperación**
- Backup de configuraciones de flujos
- Backup de embeddings
- Plan de recuperación ante fallos

### Optimizaciones Recomendadas

#### 1. **Optimización de Rendimiento**
- Cache de respuestas frecuentes
- Compresión de embeddings
- Balanceo de carga

#### 2. **Optimización de Costos**
- Uso eficiente de tokens de IA
- Cache inteligente
- Modelos más económicos cuando sea posible

#### 3. **Optimización de Calidad**
- Entrenamiento con datos reales
- Ajuste de parámetros de modelos
- Feedback loop con usuarios

---

## 🚀 CONFIGURACIÓN AVANZADA

### Personalización de Flujos

#### 1. **Flujo de Bienvenida**
```
Usuario llega → Saludo personalizado → 
Opciones disponibles → Guía inicial
```

#### 2. **Flujo de Trámites**
```
Consulta trámite → Identificar trámite → 
Mostrar requisitos → Mostrar pasos → 
Proporcionar formularios
```

#### 3. **Flujo de Direcciones**
```
Consulta dirección → Identificar dirección → 
Mostrar información → Proporcionar contacto → 
Opciones adicionales
```

### Configuración de Memoria

#### 1. **Memoria de Conversación**
- Mantener contexto de conversación
- Recordar preferencias del usuario
- Historial de consultas previas

#### 2. **Memoria de Conocimiento**
- Base de conocimiento municipal
- Embeddings de documentos
- Información actualizada

---

## 🔒 SEGURIDAD

### Medidas de Seguridad

#### 1. **Autenticación**
- Login requerido para administración
- Tokens de sesión seguros
- Control de acceso por roles

#### 2. **Protección de Datos**
- Encriptación de datos sensibles
- Anonimización de conversaciones
- Cumplimiento de GDPR/LOPD

#### 3. **Seguridad de API**
- Rate limiting
- Validación de inputs
- Sanitización de datos

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial
- [Flowise Documentation](https://docs.flowiseai.com/)
- [Flowise GitHub](https://github.com/FlowiseAI/Flowise)
- [Flowise Discord](https://discord.gg/jbaHfsRq9u)

### Tutoriales y Ejemplos
- [Getting Started Guide](https://docs.flowiseai.com/getting-started)
- [Node Types](https://docs.flowiseai.com/nodes)
- [API Reference](https://docs.flowiseai.com/api)

### Comunidad
- Foros de discusión
- Ejemplos de la comunidad
- Plugins y extensiones

---

## 🎯 CONCLUSIONES

Flowise es un componente fundamental de Martita IA que proporciona:

1. **Capacidades de IA Avanzadas**: Procesamiento de lenguaje natural y generación de respuestas inteligentes
2. **Integración Seamless**: Conexión perfecta con el backend y base de datos
3. **Escalabilidad**: Capacidad de manejar múltiples usuarios simultáneos
4. **Flexibilidad**: Configuración visual sin necesidad de programación
5. **Mantenibilidad**: Fácil actualización y optimización

El motor de IA de Martita IA está diseñado para crecer y mejorar continuamente, proporcionando un servicio de asistencia municipal cada vez más inteligente y útil para los ciudadanos. 