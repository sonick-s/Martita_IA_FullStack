# Introducción a la Base de Datos

## Descripción General

La base de datos de Martita IA es el núcleo central del sistema, diseñada para almacenar y gestionar toda la información relacionada con la inteligencia artificial conversacional. Utilizamos **MySQL** como sistema de gestión de bases de datos relacionales por su robustez, escalabilidad y soporte para características avanzadas.

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

### Tablas Libres

1. **`usuarios`**: Registra información de los usuarios para el panel de control (Frontend)
2. **`interacciones`**: Guarda las preguntas y respuestas del bot Martita_IA 
3. **`prompts_bot`**: Configuraciones de comportamiento para el bot Martita_IA

### Tablas Relacionadas

1. **`direcciones`**: Registra los departamentos y direcciones del GADIP Cayambe
2. **`tramites`**: Contiene la información básica del trámite y a qué dirección pertenece
3. **`requisitos_tramite`**: Contiene todos los requisitos del trámite que se desea especificar (Importante si se necesita especificar diferentes requisitos para diferentes tipos de casos para un mismo trámite)
4. **`pasos_tramite`**: Son los pasos que debe realizar para llevar a cabo de forma exitosa su trámite
5. **`formularios_tramite`**: Contiene los formularios que debe llenar para realizar el trámite

![Arquitectura de Base de Datos](/img/BaseDatos.png)

## Tecnologías Utilizadas

### MySQL
- **Versión**: 8.3
- **Características**: 
  - Soporte completo para transacciones ACID
  - Replicación y clustering
  - Particionamiento de tablas
- **Extensiones**: 
  - InnoDB como motor de almacenamiento principal
  - Soporte para JSON nativo

### Herramientas de Gestión
- **phpMyAdmin**: Interfaz gráfica para administración
- **MySQL Workbench**: Cliente universal de base de datos
- **MySQL CLI**: Cliente de línea de comandos

## Configuración Inicial

### Variables de Entorno

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=martita_ia_normal
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña_segura
DATABASE_URL="mysql+aiomysql://tu_usuario:tu_contraseña_segura@localhost:3306/martita_ia_normal"
```

### Conexión de Desarrollo

```bash
# Conectar con MySQL
mysql -h localhost -P 3306 -u tu_usuario -p martita_ia_normal

# Conectar con MySQL
# Host: localhost
# Port: 3306
# Database: martita_ia_normal
# Username: tu_usuario
# Password: tu_contraseña_segura
```

## Backup y Recuperación

### Backup Automático

```bash
# Backup completo
mysqldump -h localhost -u tu_usuario -p martita_ia_normal > backup_$(date +%Y%m%d).sql

# Backup con formato personalizado
mysqldump -h localhost -u tu_usuario -p --single-transaction --routines --triggers martita_ia_normal > backup_$(date +%Y%m%d).sql
```

### Restauración

```bash
# Restaurar desde SQL
mysql -h localhost -u tu_usuario -p martita_ia_normal < backup_file.sql

# Restaurar desde dump personalizado
mysql -h localhost -u tu_usuario -p martita_ia_normal < backup_file.sql
```

## Monitoreo y Mantenimiento

### Consultas de Monitoreo

```sql
-- Verificar conexiones activas
SHOW PROCESSLIST;

-- Verificar tamaño de la base de datos
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB'
FROM information_schema.tables 
WHERE table_schema = 'martita_ia_normal';

-- Verificar tablas más grandes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size in MB'
FROM information_schema.tables 
WHERE table_schema = 'martita_ia_normal'
ORDER BY (data_length + index_length) DESC;
```

### Mantenimiento Regular

```sql
-- Actualizar estadísticas
ANALYZE TABLE usuarios, interacciones, tramites;

-- Optimizar tablas
OPTIMIZE TABLE usuarios, interacciones, tramites;

-- Reindexar tablas importantes
REPAIR TABLE usuarios, interacciones, tramites;
```

## Seguridad

### Buenas Prácticas

1. **Contraseñas Fuertes**: Usar contraseñas complejas
2. **Acceso Limitado**: Restringir acceso solo a usuarios necesarios
3. **Backup Regular**: Realizar backups diarios
4. **Monitoreo**: Revisar logs de acceso regularmente
5. **Actualizaciones**: Mantener MySQL actualizado

### Configuración de Seguridad

```sql
-- Crear usuario específico para la aplicación
CREATE USER 'martita_app'@'localhost' IDENTIFIED BY 'contraseña_segura';

-- Otorgar permisos específicos
GRANT SELECT, INSERT, UPDATE, DELETE ON martita_ia_normal.* TO 'martita_app'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Arquitectura** de la base de datos
2. Explorar los **Componentes** específicos
3. Entender las **Funcionalidades** disponibles
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación oficial de MySQL](https://dev.mysql.com/doc/)
- [Guía de SQLAlchemy](https://docs.sqlalchemy.org/)
- [Mejores prácticas de MySQL](https://dev.mysql.com/doc/refman/8.0/en/optimization.html) 