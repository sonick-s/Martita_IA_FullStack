use martita_ia_normal;
-- Tabla de unidades organizacionales (departamentos, direcciones, etc.)
CREATE TABLE direcciones (
  id_direcciones INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  responsable VARCHAR(150),
  correo_responsable VARCHAR(150),
  telefono VARCHAR(100),
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  fecha_actualizacion DATE
);

-- Tabla principal de trámites
CREATE TABLE tramites (
  id_tramite INT PRIMARY KEY AUTO_INCREMENT,
  id_direcciones INT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  contexto TEXT,
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_direcciones) REFERENCES direcciones(id_direcciones)
);

CREATE TABLE requisitos_tramite (
  id_requisito INT PRIMARY KEY AUTO_INCREMENT,
  id_tramite INT,
  contexto TEXT,
  requisito TEXT NOT NULL,
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
);

CREATE TABLE pasos_tramite (
  id_paso INT PRIMARY KEY AUTO_INCREMENT,
  id_tramite INT,
  contexto TEXT,
  paso TEXT NOT NULL,
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
);

CREATE TABLE formularios_tramite (
  id_formulario INT PRIMARY KEY AUTO_INCREMENT,
  id_tramite INT,
  nombre VARCHAR(255),
  url TEXT NOT NULL,
  contexto TEXT,
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
);

-- Tabla de usuarios que interactúan con el bot
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  email VARCHAR(150) ,
  password VARCHAR(255) NOT NULL, 
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Historial de consultas de usuarios
CREATE TABLE interacciones (
  id_interaccion INT PRIMARY KEY AUTO_INCREMENT,
  pregunta TEXT,
  respuesta TEXT,
  respuesta_util TEXT DEFAULT NULL  COMMENT 'like o dislike',
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prompts_bot (
  id_prompt INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,               -- Nombre o propósito del prompt
  tipo VARCHAR(50),                           -- system, user, assistant, regla, contexto
  contenido TEXT NOT NULL,                    -- El texto del prompt/instrucción
  estado INT DEFAULT 1  COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

