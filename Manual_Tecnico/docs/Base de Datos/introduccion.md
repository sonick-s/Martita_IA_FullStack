# Introducción a la Base de Datos

## Descripción General

La base de datos de Martita IA es el núcleo central del sistema, diseñada para almacenar y gestionar toda la información relacionada con la inteligencia artificial conversacional. Utilizamos PostgreSQL como sistema de gestión de bases de datos relacionales por su robustez, escalabilidad y soporte para características avanzadas.

## Características Principales

### 1. **Arquitectura Relacional**
- Diseño normalizado para evitar redundancia de datos
- Integridad referencial para mantener consistencia
- Transacciones ACID para garantizar confiabilidad

### 2. **Escalabilidad**
- Soporte para grandes volúmenes de datos
- Índices optimizados para consultas rápidas
- Particionamiento para mejor rendimiento

### 3. **Seguridad**
- Autenticación y autorización robustas
- Encriptación de datos sensibles
- Auditoría de cambios y accesos

### 4. **Integración con IA**
- Almacenamiento de modelos de lenguaje
- Historial de conversaciones
- Métricas de rendimiento de IA

## Estructura de la Base de Datos

### Esquemas Principales

1. **`public`**: Esquema principal con tablas del sistema
2. **`ai_models`**: Gestión de modelos de inteligencia artificial
3. **`conversations`**: Historial y análisis de conversaciones
4. **`analytics`**: Métricas y estadísticas del sistema

### Tablas Principales

#### Usuarios y Autenticación
- `users`: Información de usuarios del sistema
- `user_sessions`: Sesiones activas de usuarios
- `user_permissions`: Permisos y roles

#### Conversaciones
- `conversations`: Metadatos de conversaciones
- `messages`: Mensajes individuales en conversaciones
- `conversation_analytics`: Análisis de conversaciones

#### Modelos de IA
- `ai_models`: Configuración de modelos de IA
- `model_versions`: Versiones de modelos
- `model_performance`: Métricas de rendimiento

#### Configuración del Sistema
- `system_config`: Configuración general del sistema
- `api_keys`: Claves de API para servicios externos
- `webhooks`: Configuración de webhooks

## Tecnologías Utilizadas

### PostgreSQL 15+
- **Versión**: 15 o superior
- **Características**: ACID, JSON, Full-text search
- **Extensiones**: PostGIS, pg_trgm, uuid-ossp

### Herramientas de Gestión
- **pgAdmin**: Interfaz gráfica para administración
- **DBeaver**: Cliente universal de base de datos
- **psql**: Cliente de línea de comandos

### Migraciones y Versionado
- **Herramienta**: Prisma ORM
- **Archivos**: `prisma/schema.prisma`
- **Comandos**: `npx prisma migrate dev`

## Configuración Inicial

### Variables de Entorno

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=martita_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_segura
DATABASE_URL="postgresql://postgres:tu_contraseña_segura@localhost:5432/martita_db"
```

### Conexión de Desarrollo

```bash
# Conectar con psql
psql -h localhost -p 5432 -U postgres -d martita_db

# Conectar con DBeaver
# Host: localhost
# Port: 5432
# Database: martita_db
# Username: postgres
# Password: tu_contraseña_segura
```

## Backup y Recuperación

### Backup Automático

```bash
# Backup completo
pg_dump -h localhost -U postgres martita_db > backup_$(date +%Y%m%d).sql

# Backup con formato personalizado
pg_dump -h localhost -U postgres -Fc martita_db > backup_$(date +%Y%m%d).dump
```

### Restauración

```bash
# Restaurar desde SQL
psql -h localhost -U postgres martita_db < backup_file.sql

# Restaurar desde dump personalizado
pg_restore -h localhost -U postgres -d martita_db backup_file.dump
```

## Monitoreo y Mantenimiento

### Consultas de Monitoreo

```sql
-- Verificar conexiones activas
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Verificar tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('martita_db'));

-- Verificar tablas más grandes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Mantenimiento Regular

```sql
-- Actualizar estadísticas
ANALYZE;

-- Vacuum para liberar espacio
VACUUM ANALYZE;

-- Reindexar tablas importantes
REINDEX TABLE conversations;
REINDEX TABLE messages;
```

## Seguridad

### Buenas Prácticas

1. **Contraseñas Fuertes**: Usar contraseñas complejas
2. **Acceso Limitado**: Restringir acceso solo a usuarios necesarios
3. **Backup Regular**: Realizar backups diarios
4. **Monitoreo**: Revisar logs de acceso regularmente
5. **Actualizaciones**: Mantener PostgreSQL actualizado

### Configuración de Seguridad

```sql
-- Crear usuario específico para la aplicación
CREATE USER martita_app WITH PASSWORD 'contraseña_segura';

-- Otorgar permisos específicos
GRANT CONNECT ON DATABASE martita_db TO martita_app;
GRANT USAGE ON SCHEMA public TO martita_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO martita_app;
```

## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Arquitectura** de la base de datos
2. Explorar los **Componentes** específicos
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [Guía de Prisma ORM](https://www.prisma.io/docs/)
- [Mejores prácticas de PostgreSQL](https://www.postgresql.org/docs/current/admin.html) 