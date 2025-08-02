# Introducción a Flowise

## Descripción General

Flowise es una plataforma de código abierto para construir flujos de trabajo de inteligencia artificial visuales y personalizables. En Martita IA, utilizamos Flowise como el motor central para orquestar y gestionar las conversaciones con modelos de lenguaje, permitiendo crear experiencias de IA conversacional avanzadas y flexibles.

## Características Principales

### 1. **Interfaz Visual de Flujos**
- Editor de flujos drag-and-drop
- Nodos predefinidos para diferentes funcionalidades
- Conexiones visuales entre componentes
- Preview en tiempo real de los flujos

### 2. **Integración con Modelos de IA**
- Soporte para múltiples proveedores de IA
- Configuración flexible de parámetros
- Gestión de contextos y memoria
- Optimización automática de prompts

### 3. **Funcionalidades Avanzadas**
- Gestión de conversaciones
- Análisis de sentimientos
- Clasificación de intenciones
- Respuestas personalizadas
- Integración con APIs externas

### 4. **Escalabilidad y Rendimiento**
- Arquitectura modular
- Caché inteligente
- Rate limiting configurable
- Monitoreo de métricas

## Arquitectura de Flowise

### Componentes Principales

#### 1. **Editor de Flujos**
- Interfaz web para crear flujos
- Biblioteca de nodos disponibles
- Sistema de versionado de flujos
- Exportación/importación de configuraciones

#### 2. **Motor de Ejecución**
- Intérprete de flujos
- Gestión de estados
- Manejo de errores
- Logging detallado

#### 3. **API REST**
- Endpoints para ejecutar flujos
- Gestión de sesiones
- Autenticación y autorización
- Documentación automática

#### 4. **Base de Datos**
- Almacenamiento de flujos
- Historial de ejecuciones
- Configuraciones de usuarios
- Métricas de rendimiento

## Tipos de Nodos Disponibles

### Nodos de Entrada
- **Chat Input**: Captura mensajes del usuario
- **HTTP Request**: Recibe requests HTTP
- **Webhook**: Endpoint para integraciones
- **Scheduled Trigger**: Ejecución programada

### Nodos de Procesamiento
- **LLM Chain**: Cadena de modelos de lenguaje
- **Prompt Template**: Plantillas de prompts
- **Memory**: Gestión de memoria conversacional
- **Function**: Lógica personalizada

### Nodos de IA
- **Chat Models**: Modelos conversacionales
- **Embeddings**: Generación de embeddings
- **Vector Store**: Almacenamiento vectorial
- **Document Loader**: Carga de documentos

### Nodos de Salida
- **Chat Output**: Respuesta al usuario
- **HTTP Response**: Respuesta HTTP
- **Email**: Envío de correos
- **Database**: Almacenamiento en BD

### Nodos de Utilidades
- **Condition**: Lógica condicional
- **Loop**: Bucles y iteraciones
- **Merge**: Combinación de flujos
- **Split**: División de flujos

## Configuración Inicial

### Instalación con Docker

```bash
# Clonar repositorio
git clone https://github.com/FlowiseAI/Flowise.git
cd Flowise

# Ejecutar con Docker Compose
docker-compose up -d
```

### Variables de Entorno

```env
# Configuración básica
FLOWISE_PORT=3000
FLOWISE_HOST=0.0.0.0
DATABASE_TYPE=sqlite
DATABASE_PATH=./database.sqlite

# Configuración de seguridad
SECRETKEY=tu_clave_secreta_aqui
LOG_LEVEL=info
LOG_PATH=./logs

# Configuración de IA
OPENAI_API_KEY=tu_api_key_de_openai
ANTHROPIC_API_KEY=tu_api_key_de_anthropic
```

### Acceso a la Interfaz

```
http://localhost:3000
```

## Creación de Flujos

### 1. **Flujo Básico de Chat**

```json
{
  "nodes": [
    {
      "id": "chat-input",
      "type": "chatInput",
      "data": {
        "label": "Entrada de Chat"
      }
    },
    {
      "id": "llm-chain",
      "type": "llmChain",
      "data": {
        "model": "gpt-4",
        "temperature": 0.7,
        "maxTokens": 1000
      }
    },
    {
      "id": "chat-output",
      "type": "chatOutput",
      "data": {
        "label": "Respuesta"
      }
    }
  ],
  "edges": [
    {
      "source": "chat-input",
      "target": "llm-chain"
    },
    {
      "source": "llm-chain",
      "target": "chat-output"
    }
  ]
}
```

### 2. **Flujo con Memoria**

```json
{
  "nodes": [
    {
      "id": "chat-input",
      "type": "chatInput"
    },
    {
      "id": "memory",
      "type": "memory",
      "data": {
        "memoryType": "conversationBuffer",
        "maxTokens": 2000
      }
    },
    {
      "id": "llm-chain",
      "type": "llmChain",
      "data": {
        "model": "gpt-4",
        "includeMemory": true
      }
    },
    {
      "id": "chat-output",
      "type": "chatOutput"
    }
  ]
}
```

### 3. **Flujo con Análisis de Sentimientos**

```json
{
  "nodes": [
    {
      "id": "chat-input",
      "type": "chatInput"
    },
    {
      "id": "sentiment-analysis",
      "type": "function",
      "data": {
        "function": "analyzeSentiment",
        "parameters": {
          "text": "{{$input}}"
        }
      }
    },
    {
      "id": "conditional-response",
      "type": "condition",
      "data": {
        "conditions": [
          {
            "field": "sentiment",
            "operator": "equals",
            "value": "positive"
          }
        ]
      }
    },
    {
      "id": "positive-response",
      "type": "llmChain",
      "data": {
        "prompt": "Responde de manera positiva y alentadora"
      }
    },
    {
      "id": "negative-response",
      "type": "llmChain",
      "data": {
        "prompt": "Responde con empatía y apoyo"
      }
    },
    {
      "id": "chat-output",
      "type": "chatOutput"
    }
  ]
}
```

## Integración con Martita IA

### Configuración de API

```javascript
// Configuración de cliente Flowise
const flowiseConfig = {
  baseURL: 'http://localhost:3000',
  apiKey: 'tu_api_key',
  flowId: 'tu_flow_id'
};

// Cliente para interactuar con Flowise
class FlowiseClient {
  constructor(config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async chat(message, sessionId = null) {
    const response = await this.client.post(`/api/v1/chat/${this.config.flowId}`, {
      message,
      sessionId
    });
    return response.data;
  }
}
```

### Ejemplo de Uso

```javascript
// Inicializar cliente
const flowise = new FlowiseClient(flowiseConfig);

// Enviar mensaje
const response = await flowise.chat('Hola, ¿cómo estás?');
console.log(response.reply);

// Conversación con sesión
const sessionId = 'user-123';
const response1 = await flowise.chat('¿Cuál es mi nombre?', sessionId);
const response2 = await flowise.chat('¿Te acuerdas de mi nombre?', sessionId);
```

## Configuración de Modelos

### OpenAI GPT Models

```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 1000,
  "topP": 1,
  "frequencyPenalty": 0,
  "presencePenalty": 0,
  "stopSequences": []
}
```

### Anthropic Claude Models

```json
{
  "model": "claude-3-sonnet-20240229",
  "temperature": 0.7,
  "maxTokens": 1000,
  "topP": 1,
  "topK": 40
}
```

### Configuración de Embeddings

```json
{
  "model": "text-embedding-ada-002",
  "dimensions": 1536,
  "encodingFormat": "float"
}
```

## Gestión de Prompts

### Prompt Templates

```handlebars
{{#system}}
Eres un asistente virtual llamado Martita. Eres amigable, útil y siempre intentas ayudar.
{{/system}}

{{#user}}
{{message}}
{{/user}}

{{#assistant}}
{{response}}
{{/assistant}}
```

### Variables Dinámicas

```handlebars
{{#system}}
Eres un asistente especializado en {{topic}}.
Tu nombre es {{assistant_name}}.
{{/system}}
```

### Contexto de Conversación

```handlebars
{{#system}}
Información del usuario:
- Nombre: {{user.name}}
- Preferencias: {{user.preferences}}
- Historial: {{conversation_history}}
{{/system}}
```

## Monitoreo y Analytics

### Métricas Disponibles

- **Tiempo de respuesta**: Promedio y percentiles
- **Tokens utilizados**: Por conversación y modelo
- **Tasa de éxito**: Porcentaje de respuestas exitosas
- **Errores**: Tipos y frecuencia de errores
- **Uso de memoria**: Consumo de recursos

### Logs Estructurados

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "flowId": "flow-123",
  "sessionId": "session-456",
  "message": "Flow execution completed",
  "metrics": {
    "executionTime": 1250,
    "tokensUsed": 150,
    "memoryUsage": "2.5MB"
  }
}
```

## Seguridad

### Autenticación

```javascript
// Middleware de autenticación
const authenticateFlow = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Rate Limiting

```javascript
// Configuración de rate limiting
const rateLimit = require('express-rate-limit');

const flowLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiados requests, intenta más tarde'
});
```

## Deployment

### Docker Compose

```yaml
version: '3.8'
services:
  flowise:
    image: flowiseai/flowise:latest
    ports:
      - "3000:3000"
    environment:
      - FLOWISE_PORT=3000
      - DATABASE_TYPE=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=flowise
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=password
    volumes:
      - flowise_data:/usr/src/app
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=flowise
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Variables de Entorno de Producción

```env
# Configuración de producción
NODE_ENV=production
FLOWISE_PORT=3000
FLOWISE_HOST=0.0.0.0

# Base de datos
DATABASE_TYPE=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=flowise_prod
DATABASE_USER=flowise_user
DATABASE_PASSWORD=contraseña_segura

# Seguridad
SECRETKEY=clave_secreta_muy_larga_y_compleja
JWT_SECRET=jwt_secret_muy_seguro

# APIs de IA
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Troubleshooting

### Problemas Comunes

1. **Flujo no responde**
   - Verificar conexiones entre nodos
   - Revisar logs de errores
   - Validar configuración de modelos

2. **Errores de autenticación**
   - Verificar API keys
   - Comprobar permisos de usuario
   - Revisar configuración de JWT

3. **Problemas de rendimiento**
   - Monitorear uso de memoria
   - Optimizar prompts
   - Configurar caché

### Comandos de Diagnóstico

```bash
# Verificar estado del servicio
curl -X GET http://localhost:3000/api/v1/health

# Ver logs en tiempo real
docker-compose logs -f flowise

# Verificar conectividad de base de datos
docker-compose exec flowise node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
});
pool.query('SELECT NOW()', (err, res) => {
  console.log(err || res.rows[0]);
  process.exit(0);
});
"
```

## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Configuración** detallada
2. Explorar las **Credenciales** y seguridad
3. Entender los **Flujos** específicos
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación oficial de Flowise](https://docs.flowiseai.com/)
- [Repositorio de GitHub](https://github.com/FlowiseAI/Flowise)
- [Comunidad de Discord](https://discord.gg/flowise)
- [Ejemplos de flujos](https://github.com/FlowiseAI/Flowise/tree/main/examples) 