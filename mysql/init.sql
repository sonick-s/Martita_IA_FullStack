-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS martita_ia;

--
-- Database: `martita_ia`
--

-- --------------------------------------------------------

--
-- Table structure for table `direcciones`
--

CREATE TABLE IF NOT EXISTS `direcciones` (
  `id_direcciones` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `responsable` varchar(150) DEFAULT NULL,
  `correo_responsable` varchar(150) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_actualizacion` date DEFAULT NULL,
  PRIMARY KEY (`id_direcciones`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `direcciones`
--

INSERT INTO `direcciones` (`id_direcciones`, `nombre`, `descripcion`, `responsable`, `correo_responsable`, `telefono`, `estado`, `fecha_actualizacion`) VALUES
(1, 'Dirección de Planificación y Ordenamiento Territorial', 'Formular, coordinar, articular y evaluar las políticas, planes, programas y proyectos de desarrollo territorial en el marco de la planificación participativa y ordenamiento territorial, asegurando el uso eficiente del suelo.', NULL, NULL, NULL, 1, '2025-07-19'),
(2, 'Dirección de Obras Públicas', 'Planificar, coordinar, ejecutar y controlar la infraestructura física cantonal mediante obras públicas, garantizando condiciones adecuadas para la movilidad y desarrollo urbano y rural.', NULL, '', '', 1, '2025-07-19'),
(3, 'Dirección de Avalúos y Catastros', 'Gestionar y mantener actualizado el catastro predial urbano y rural, así como los avalúos de bienes inmuebles para fortalecer la base de datos y garantizar una gestión tributaria eficiente.', '', '', '', 1, '2025-07-19'),
(4, 'Dirección de Ambiente', 'Promover la protección, conservación y recuperación de los recursos naturales y del medio ambiente del cantón, a través de políticas ambientales, gestión de residuos, educación y participación ciudadana.', '', NULL, '', 1, '2025-07-19'),
(5, 'Dirección de Desarrollo Productivo y Emprendimientos', 'Fomentar el desarrollo económico local sustentable a través de la promoción de actividades productivas, el fortalecimiento de capacidades y la articulación entre actores económicos del territorio.', '', '', '', 1, '2025-07-19'),
(6, 'Dirección de Turismo, Cultura y Patrimonio', 'Promover el desarrollo turístico del cantón mediante la conservación del patrimonio cultural, la identidad local y la gestión de servicios e infraestructura turística sostenible.', '', '', '', 1, '2025-07-19'),
(7, 'Dirección de Participación Ciudadana y Comunitaria', 'Garantizar mecanismos de participación ciudadana y comunitaria para incidir en la toma de decisiones del gobierno autónomo, fortaleciendo el tejido social y la corresponsabilidad ciudadana.', '', '', '', 1, '2025-07-19'),
(8, 'Dirección de Seguridad Ciudadana', 'Implementar políticas y acciones que garanticen la seguridad y convivencia ciudadana en el cantón, en coordinación con entidades del Sistema de Seguridad Integral.', '', '', '', 1, '2025-07-19'),
(9, 'Unidad de Fiscalización', 'Controlar y verificar la correcta ejecución de obras, proyectos y servicios contratados por la institución, asegurando el cumplimiento técnico, legal y contractual de los mismos.', '', '', '', 1, '2025-07-19');

-- --------------------------------------------------------

--
-- Table structure for table `formularios_tramite`
--

CREATE TABLE IF NOT EXISTS `formularios_tramite` (
  `id_formulario` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `contexto` text,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_formulario`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interacciones`
--

CREATE TABLE IF NOT EXISTS `interacciones` (
  `id_interaccion` int NOT NULL AUTO_INCREMENT,
  `pregunta` text,
  `respuesta` text,
  `respuesta_util` text COMMENT 'like o dislike',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_interaccion`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pasos_tramite`
--

CREATE TABLE IF NOT EXISTS `pasos_tramite` (
  `id_paso` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `paso` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_paso`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pasos_tramite`
--

INSERT INTO `pasos_tramite` (`id_paso`, `id_tramite`, `contexto`, `paso`, `estado`) VALUES
(1, 1, 'PASOS PARA REALIZAR EL TRÁMITE', '1. Imprimir y llenar el Formulario de Trámites de Avalúos y Catastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el computador para luego imprimirse. 2. Pagar tasa municipal por certificación. 3. Ingresar requisitos en la Secretaría de la Dirección de Avalúos y Catastros.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `prompts_bot`
--

CREATE TABLE IF NOT EXISTS `prompts_bot` (
  `id_prompt` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `contenido` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_prompt`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prompts_bot`
--

INSERT INTO `prompts_bot` (`id_prompt`, `nombre`, `tipo`, `contenido`, `estado`, `fecha_creacion`) VALUES
(1, 'Mensaje Inicial', 'Mensaje Inicial', 'Hola, soy Martita y estoy para ayudarte con información sobre los trámites del municipio de Cayambe. ¿Cuentame como puedo ayudarte?', 1, '2025-07-19 12:53:33');

-- --------------------------------------------------------

--
-- Table structure for table `requisitos_tramite`
--

CREATE TABLE IF NOT EXISTS `requisitos_tramite` (
  `id_requisito` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `requisito` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_requisito`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `requisitos_tramite`
--

INSERT INTO `requisitos_tramite` (`id_requisito`, `id_tramite`, `contexto`, `requisito`, `estado`) VALUES
(2, 1, 'REQUISITOS', '1. Original de cédula de ciudadanía del propietario. 2. Copia de la escritura. 3. Pago del impuesto predial actualizado. 4. Certificado de gravámenes actualizado. 5. Formulario de Trámites de Avalúos y Catastros. 6. Pago de tasa municipal por certificación. 7. Cuatro planos firmados por un profesional con número con el registro del GADIP-MC de acuerdo a la Normativa Legal Vigente. 8. Archivo digital con extensión .DWG o .SHP (geo referenciado). 9. Copia de cédulas de los colindantes. (En caso no tener las copias de las cédulas de los colindantes, se debe presentar una declaración juramentada de que no existe afectación a los linderos de sus colindantes). 10. En el caso de que el predio se encuentre dentro de zonas de conservación arquitectónica o de protección arqueológica o de bienes patrimoniales, se requiere la autorización del Instituto de Patrimonio Cultural o de la instancia correspondiente.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tramites`
--

CREATE TABLE IF NOT EXISTS `tramites` (
  `id_tramite` int NOT NULL AUTO_INCREMENT,
  `id_direcciones` int DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `contexto` text,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tramite`),
  KEY `id_direcciones` (`id_direcciones`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tramites`
--

INSERT INTO `tramites` (`id_tramite`, `id_direcciones`, `nombre`, `descripcion`, `contexto`, `estado`, `fecha_registro`) VALUES
(1, 3, 'REGULARIZACIÓN DE ÁREAS Y LINDEROS', 'Regularizar y certificar la información sobre el área y la\ndimensión de los linderos, cuando estos datos no constan\nescrituras respectivas.', 'El trámite de Regularización de Áreas y Linderos permite legalizar y certificar el tamaño y los límites reales de un terreno cuando esta información no consta correctamente en las escrituras. Está dirigido a propietarios que necesitan actualizar estos datos para fines legales, catastrales o de propiedad. Requiere documentación como la cédula del propietario, la escritura, planos firmados por un profesional acreditado, y el archivo digital georreferenciado del terreno. Este proceso asegura que el inmueble esté debidamente registrado y libre de conflictos con propiedades vecinas o normativas patrimoniales.', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `estado`, `fecha_registro`) VALUES
(1, 'Omar Sani', 'omigc4@gmail.com', '$2b$12$uEx7g2mgh.Qld1DVRrHlR.AvmROzPVnu2.OiOQdCXgKIqYpUY20Hq', 1, NULL);
COMMIT;

