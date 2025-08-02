# Componentes de la Base de Datos

## Esquema de Usuarios

### Tabla: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos principales:**
- `id`: Identificador único del usuario
- `email`: Correo electrónico único
- `username`: Nombre de usuario único
- `password_hash`: Hash de la contraseña (bcrypt)
- `is_active`: Estado activo/inactivo del usuario
- `is_admin`: Indica si es administrador

### Tabla: `user_sessions`

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `user_permissions`

```sql
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Esquema de Conversaciones

### Tabla: `conversations`

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    model_used VARCHAR(100),
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos principales:**
- `id`: Identificador único de la conversación
- `user_id`: Usuario propietario de la conversación
- `title`: Título de la conversación (generado automáticamente)
- `status`: Estado (active, archived, deleted)
- `model_used`: Modelo de IA utilizado
- `total_tokens`: Total de tokens consumidos

### Tabla: `messages`

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos principales:**
- `id`: Identificador único del mensaje
- `conversation_id`: Conversación a la que pertenece
- `role`: Rol del mensaje (user, assistant, system)
- `content`: Contenido del mensaje
- `tokens_used`: Tokens consumidos por este mensaje

### Tabla: `conversation_analytics`

```sql
CREATE TABLE conversation_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sentiment_score DECIMAL(3,2),
    topic_classification VARCHAR(100),
    response_time_ms INTEGER,
    user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Esquema de Modelos de IA

### Tabla: `ai_models`

```sql
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    max_tokens INTEGER,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos principales:**
- `id`: Identificador único del modelo
- `name`: Nombre del modelo (ej: gpt-4, claude-3)
- `provider`: Proveedor (OpenAI, Anthropic, etc.)
- `model_type`: Tipo de modelo (chat, completion, embedding)
- `version`: Versión específica del modelo
- `max_tokens`: Límite máximo de tokens
- `temperature`: Temperatura para generación

### Tabla: `model_versions`

```sql
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    release_notes TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `model_performance`

```sql
CREATE TABLE model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    sample_size INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Esquema de Configuración

### Tabla: `system_config`

```sql
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Configuraciones comunes:**
- `default_model`: Modelo de IA por defecto
- `max_conversation_length`: Longitud máxima de conversaciones
- `rate_limit_per_hour`: Límite de requests por hora
- `maintenance_mode`: Modo de mantenimiento

### Tabla: `api_keys`

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions JSONB,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `webhooks`

```sql
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    events JSONB NOT NULL,
    secret_key VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Esquema de Analytics

### Tabla: `usage_metrics`

```sql
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `error_logs`

```sql
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    request_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Índices Optimizados

### Índices de Rendimiento

```sql
-- Índices para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Índices para análisis
CREATE INDEX idx_conversation_analytics_conversation_id ON conversation_analytics(conversation_id);
CREATE INDEX idx_usage_metrics_user_date ON usage_metrics(user_id, date);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);
```

### Índices de Texto Completo

```sql
-- Búsqueda de texto en mensajes
CREATE INDEX idx_messages_content_fts ON messages USING gin(to_tsvector('english', content));

-- Búsqueda en títulos de conversaciones
CREATE INDEX idx_conversations_title_fts ON conversations USING gin(to_tsvector('english', title));
```

## Triggers y Funciones

### Trigger de Actualización de Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Función de Conteo de Tokens

```sql
CREATE OR REPLACE FUNCTION update_conversation_tokens()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET total_tokens = (
        SELECT COALESCE(SUM(tokens_used), 0) 
        FROM messages 
        WHERE conversation_id = NEW.conversation_id
    )
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_tokens_trigger 
    AFTER INSERT OR UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_tokens();
```

## Vistas Útiles

### Vista de Estadísticas de Usuario

```sql
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(m.id) as total_messages,
    COALESCE(SUM(c.total_tokens), 0) as total_tokens,
    MAX(c.created_at) as last_conversation
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY u.id, u.username, u.email;
```

### Vista de Rendimiento de Modelos

```sql
CREATE VIEW model_performance_summary AS
SELECT 
    am.name,
    am.provider,
    COUNT(c.id) as total_conversations,
    AVG(c.total_tokens) as avg_tokens_per_conversation,
    SUM(c.total_tokens) as total_tokens_used
FROM ai_models am
LEFT JOIN conversations c ON am.name = c.model_used
WHERE am.is_active = true
GROUP BY am.id, am.name, am.provider;
``` 