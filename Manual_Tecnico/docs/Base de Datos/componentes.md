# Componentes de la Base de Datos

## Descripción General

La base de datos de Martita IA está estructurada en **8 tablas principales** que gestionan toda la información del sistema de inteligencia artificial conversacional para trámites municipales. Cada tabla tiene un propósito específico y mantiene relaciones bien definidas.

## Esquema de Direcciones

### Tabla: `direcciones`

```sql
CREATE TABLE `direcciones` (
  `id_direcciones` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `responsable` varchar(150) DEFAULT NULL,
  `correo_responsable` varchar(150) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, -1 = eliminado',
  `fecha_actualizacion` date DEFAULT NULL,
  PRIMARY KEY (`id_direcciones`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_direcciones`: Identificador único de la dirección
- `nombre`: Nombre de la dirección/departamento
- `descripcion`: Descripción detallada de las funciones
- `responsable`: Nombre del responsable de la dirección
- `correo_responsable`: Email del responsable
- `telefono`: Número de contacto
- `estado`: Estado de la dirección (1=activo, 0=inactivo, 2=eliminado)
- `fecha_actualizacion`: Fecha de última actualización

**Datos de ejemplo:**
- Dirección de Planificación y Ordenamiento Territorial
- Dirección de Obras Públicas
- Dirección de Avalúos y Catastros
- Dirección de Ambiente
- Dirección de Desarrollo Productivo y Emprendimientos
- Dirección de Turismo, Cultura y Patrimonio
- Dirección de Participación Ciudadana y Comunitaria
- Dirección de Seguridad Ciudadana
- Unidad de Fiscalización

## Esquema de Trámites

### Tabla: `tramites`

```sql
CREATE TABLE `tramites` (
  `id_tramite` int NOT NULL AUTO_INCREMENT,
  `id_direcciones` int DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `contexto` text,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tramite`),
  KEY `id_direcciones` (`id_direcciones`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_tramite`: Identificador único del trámite
- `id_direcciones`: Referencia a la dirección responsable
- `nombre`: Nombre del trámite
- `descripcion`: Descripción detallada del trámite
- `contexto`: Contexto adicional del trámite
- `estado`: Estado del trámite (1=activo, 0=inactivo, 2=eliminado)
- `fecha_registro`: Fecha de registro del trámite

**Relación:** Cada trámite pertenece a una dirección específica del GADIP Cayambe.

## Esquema de Requisitos

### Tabla: `requisitos_tramite`

```sql
CREATE TABLE `requisitos_tramite` (
  `id_requisito` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `requisito` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_requisito`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_requisito`: Identificador único del requisito
- `id_tramite`: Referencia al trámite al que pertenece
- `contexto`: Contexto específico del requisito
- `requisito`: Descripción completa del requisito
- `estado`: Estado del requisito

**Características:**
- Un trámite puede tener múltiples requisitos
- Los requisitos se almacenan como texto completo para flexibilidad
- Permite especificar diferentes requisitos para diferentes casos del mismo trámite

## Esquema de Pasos

### Tabla: `pasos_tramite`

```sql
CREATE TABLE `pasos_tramite` (
  `id_paso` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `paso` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_paso`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_paso`: Identificador único del paso
- `id_tramite`: Referencia al trámite al que pertenece
- `contexto`: Contexto específico del paso
- `paso`: Descripción completa del paso a seguir
- `estado`: Estado del paso

**Características:**
- Los pasos se almacenan en orden secuencial
- Cada paso contiene instrucciones detalladas
- Permite personalizar pasos según el contexto específico

## Esquema de Formularios

### Tabla: `formularios_tramite`

```sql
CREATE TABLE `formularios_tramite` (
  `id_formulario` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `contexto` text,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_formulario`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_formulario`: Identificador único del formulario
- `id_tramite`: Referencia al trámite al que pertenece
- `nombre`: Nombre del formulario
- `url`: URL o enlace al formulario
- `contexto`: Contexto específico del formulario
- `estado`: Estado del formulario

## Esquema de Usuarios

### Tabla: `usuarios`

```sql
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_usuario`: Identificador único del usuario
- `nombre`: Nombre completo del usuario
- `email`: Correo electrónico del usuario
- `password`: Contraseña encriptada (bcrypt)
- `estado`: Estado del usuario (1=activo, 0=inactivo, 2=eliminado)
- `fecha_registro`: Fecha de registro del usuario

## Esquema de Interacciones

### Tabla: `interacciones`

```sql
CREATE TABLE `interacciones` (
  `id_interaccion` int NOT NULL AUTO_INCREMENT,
  `pregunta` text,
  `respuesta` text,
  `respuesta_util` text COMMENT 'like o dislike',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_interaccion`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_interaccion`: Identificador único de la interacción
- `pregunta`: Pregunta realizada por el usuario
- `respuesta`: Respuesta generada por Martita IA
- `respuesta_util`: Evaluación de la respuesta (like/dislike)
- `fecha`: Fecha y hora de la interacción

**Propósito:**
- Almacena el historial completo de conversaciones
- Permite análisis de calidad de respuestas
- Facilita el entrenamiento y mejora del bot

## Esquema de Prompts del Bot

### Tabla: `prompts_bot`

```sql
CREATE TABLE `prompts_bot` (
  `id_prompt` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `contenido` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_prompt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

**Campos principales:**
- `id_prompt`: Identificador único del prompt
- `nombre`: Nombre o propósito del prompt
- `tipo`: Tipo de prompt (system, user, assistant, regla, contexto)
- `contenido`: El texto del prompt/instrucción
- `estado`: Estado del prompt (1=activo, 0=inactivo, 2=eliminado)
- `fecha_creacion`: Fecha de creación del prompt

**Tipos de prompts:**
- **Mensaje Inicial**: Saludo y presentación del bot
- **Reglas**: Instrucciones de comportamiento
- **Contexto**: Información contextual para respuestas
- **Sistema**: Configuraciones del comportamiento del bot

## Relaciones entre Tablas

### Diagrama de Relaciones

![Arquitectura de Base de Datos](/img/BaseDatos.png)

### Claves Foráneas

```sql
-- Relación tramites → direcciones
FOREIGN KEY (id_direcciones) REFERENCES direcciones(id_direcciones)

-- Relación requisitos_tramite → tramites
FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE

-- Relación pasos_tramite → tramites
FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE

-- Relación formularios_tramite → tramites
FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
```

## Índices Optimizados

### Índices de Rendimiento

```sql
-- Índices para búsquedas rápidas
CREATE INDEX idx_tramites_direccion ON tramites(id_direcciones);
CREATE INDEX idx_requisitos_tramite ON requisitos_tramite(id_tramite);
CREATE INDEX idx_pasos_tramite ON pasos_tramite(id_tramite);
CREATE INDEX idx_formularios_tramite ON formularios_tramite(id_tramite);
CREATE INDEX idx_interacciones_fecha ON interacciones(fecha);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

### Índices de Texto Completo

```sql
-- Búsqueda en contenido de interacciones
CREATE FULLTEXT INDEX idx_interacciones_contenido ON interacciones(pregunta, respuesta);

-- Búsqueda en prompts del bot
CREATE FULLTEXT INDEX idx_prompts_contenido ON prompts_bot(contenido);
```

## Vistas Útiles

### Vista de Trámites Completos

```sql
CREATE VIEW tramites_completos AS
SELECT 
    t.id_tramite,
    t.nombre as nombre_tramite,
    t.descripcion,
    d.nombre as nombre_direccion,
    d.responsable,
    d.telefono,
    COUNT(DISTINCT r.id_requisito) as total_requisitos,
    COUNT(DISTINCT p.id_paso) as total_pasos,
    COUNT(DISTINCT f.id_formulario) as total_formularios
FROM tramites t
LEFT JOIN direcciones d ON t.id_direcciones = d.id_direcciones
LEFT JOIN requisitos_tramite r ON t.id_tramite = r.id_tramite AND r.estado = 1
LEFT JOIN pasos_tramite p ON t.id_tramite = p.id_tramite AND p.estado = 1
LEFT JOIN formularios_tramite f ON t.id_tramite = f.id_tramite AND f.estado = 1
WHERE t.estado = 1
GROUP BY t.id_tramite, t.nombre, t.descripcion, d.nombre, d.responsable, d.telefono;
```

### Vista de Estadísticas de Interacciones

```sql
CREATE VIEW estadisticas_interacciones AS
SELECT 
    DATE(fecha) as fecha_interaccion,
    COUNT(*) as total_interacciones,
    COUNT(CASE WHEN respuesta_util = 'like' THEN 1 END) as respuestas_positivas,
    COUNT(CASE WHEN respuesta_util = 'dislike' THEN 1 END) as respuestas_negativas,
    ROUND(AVG(LENGTH(pregunta)), 2) as longitud_promedio_pregunta,
    ROUND(AVG(LENGTH(respuesta)), 2) as longitud_promedio_respuesta
FROM interacciones
WHERE fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(fecha)
ORDER BY fecha_interaccion DESC;
```

## Triggers y Funciones

### Trigger de Auditoría de Cambios

```sql
DELIMITER //
CREATE TRIGGER audit_tramites_changes
AFTER UPDATE ON tramites
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO log_cambios (tabla, id_registro, campo, valor_anterior, valor_nuevo, fecha)
        VALUES ('tramites', NEW.id_tramite, 'estado', OLD.estado, NEW.estado, NOW());
    END IF;
END//
DELIMITER ;
```

### Función de Validación de Email

```sql
DELIMITER //
CREATE FUNCTION validar_email(email VARCHAR(150))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE resultado BOOLEAN DEFAULT FALSE;
    
    IF email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        SET resultado = TRUE;
    END IF;
    
    RETURN resultado;
END//
DELIMITER ;
```

## Configuración de Seguridad

### Usuarios y Permisos

```sql
-- Crear usuario específico para la aplicación
CREATE USER 'martita_app'@'localhost' IDENTIFIED BY 'contraseña_segura';

-- Otorgar permisos específicos
GRANT SELECT, INSERT, UPDATE, DELETE ON martita_ia.* TO 'martita_app'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

### Encriptación de Datos Sensibles

```sql
-- Función para encriptar contraseñas
DELIMITER //
CREATE FUNCTION encriptar_password(password VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    -- Aquí se implementaría la lógica de encriptación bcrypt
    RETURN password;
END//
DELIMITER ;
``` 