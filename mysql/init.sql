-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: martita_ia
-- ------------------------------------------------------
-- Server version	8.3.0

--
-- Table structure for table `direcciones`
--

CREATE TABLE `direcciones` (
  `id_direcciones` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `responsable` varchar(150) DEFAULT NULL,
  `correo_responsable` varchar(150) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_actualizacion` date DEFAULT NULL,
  PRIMARY KEY (`id_direcciones`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `direcciones`
--

INSERT INTO `direcciones` VALUES (1,'Dirección De Planificacion y Ordenamiento Territorial','Encargada de la planificación urbana, rural y territorial del cantón, elaboración de planes de desarrollo y ordenamiento territorial, regulación del uso del suelo y coordinación de proyectos de desarrollo territorial sostenible','Arq. María Elena Vásquez Morales','maria.vasquez@gadip-mc.gob.ec','0962850145',1,'2025-08-08'),(2,'Dirección de Obras Públicas','Responsable de la construcción, mantenimiento y rehabilitación de infraestructura vial, puentes, obras de saneamiento, edificaciones públicas y proyectos de infraestructura básica del cantón.','Ing. Civil Carlos Roberto Mendoza Silva','carlos.mendoza@gadip-mc.gob.ec','0962850146',1,'2025-08-08'),(3,'Dirección de Avalúos y Catastros','Encargada del levantamiento catastral, valoración de predios urbanos y rurales, actualización de la base catastral, emisión de certificados de avalúos y mantenimiento del sistema de información territorial','Ing. Topógrafo Luis Fernando Herrera Campos','luis.herrera@gadip-mc.gob.ec','0962850147',1,'2025-08-08'),(4,'Dirección de Ambiente','Responsable de la gestión ambiental cantonal, control de la contaminación, manejo de desechos sólidos, conservación de recursos naturales y promoción de políticas ambientales sostenibles.','Ing. Ambiental Ana Patricia Guerrero López','ana.guerrero@gadip-mc.gob.ec','0962850148',1,'2025-08-08'),(5,'Dirección de Desarrollo Productivo y Competitividad','Fomenta el desarrollo económico local, apoyo a emprendimientos, promoción del turismo, fortalecimiento de cadenas productivas y generación de oportunidades de empleo en el cantón.','Econ. Jorge Andrés Salinas Vargas','jorge.salinas@gadip-mc.gob.ec','0962850149',1,'2025-08-08'),(6,'Dirección de Turismo y Patrimonio','Promoción y desarrollo del turismo cantonal, preservación del patrimonio cultural y natural, gestión de sitios turísticos y coordinación de eventos culturales y festividades locales.','Lic. Turismo Sandra Milena Rosero Castillo','sandra.rosero@gadip-mc.gob.ec','0962850150',1,'2025-08-08'),(7,'Dirección de Participación Ciudadana','Facilita la participación ciudadana en la gestión pública, organización de asambleas ciudadanas, promoción de la transparencia, rendición de cuentas y fortalecimiento organizacional comunitario.','Soc. Roberto Carlos Morales Jiménez','roberto.morales@gadip-mc.gob.ec','0962850151',1,'2025-08-08'),(8,'Dirección de Seguridad Ciudadana','Coordinación de la seguridad ciudadana, prevención de la violencia, gestión de riesgos, atención de emergencias y articulación con organismos de seguridad nacional y provincial.','Mayor Diego Alejandro Paredes Núñez','diego.paredes@gadip-mc.gob.ec','0962850152',1,'2025-08-08'),(9,'Unidad de Fiscalización','Control y supervisión del cumplimiento de ordenanzas municipales, verificación de permisos de construcción, fiscalización de actividades comerciales y aplicación de sanciones por incumplimientos normativos.','Ab. Patricia Alejandra Villacrés Moreno','patricia.villacres@gadip-mc.gob.ec','0962850153',1,'2025-08-08');

--
-- Table structure for table `formularios_tramite`
--

CREATE TABLE `formularios_tramite` (
  `id_formulario` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `contexto` text,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_formulario`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `formularios_tramite`
--

INSERT INTO `formularios_tramite` VALUES (1,1,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(2,2,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(3,3,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(4,4,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FIARR.pdf','FORMULARIO DE INSCRIPCIÓN DE ARRENDAMIENTO',1),(5,5,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(6,6,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(7,7,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(8,8,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FAC.pdf','FORMULARIO DE TRÁMITES DE AVALÚOS Y CATASTROS',1),(9,9,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FTAT.pdf','FORMULARIO DE TRÁMITES DE ADMINISTRACIÓN TERRITORIAL',1),(10,10,NULL,'https://municipiocayambe.gob.ec/images/gtramites/FTAT.pdf','FORMULARIO DE TRÁMITES DE ADMINISTRACIÓN TERRITORIAL',1);

--
-- Table structure for table `interacciones`
--

CREATE TABLE `interacciones` (
  `id_interaccion` int NOT NULL AUTO_INCREMENT,
  `pregunta` text,
  `respuesta` text,
  `respuesta_util` text COMMENT 'like o dislike',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_interaccion`)
) ENGINE=MyISAM AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `pasos_tramite`
--

CREATE TABLE `pasos_tramite` (
  `id_paso` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `paso` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_paso`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pasos_tramite`
--

INSERT INTO `pasos_tramite` VALUES (1,1,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros.',1),(2,2,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Adquirir certificado de plusvalía en caja del GADIP-MC.\n3. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros.',1),(3,3,'PASOS PARA REALIZAR EL TRÁMITE','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIP-MC.\nEl formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Realizar el pago de la tasa municipal según el trámite.\n3. Ingresar requisitos en la Secretaría de la Dirección de Avalúos\ny Catastros.',1),(4,4,'Cualquier persona','1. Imprimir y llenar el Formulario de Inscripción de\nArrendamiento que está disponible en la página web del\nGADIP-MC. El formulario también puede ser completado\ndesde el computador para luego imprimirse.\n2. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros',1),(5,5,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros.',1),(6,6,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros',1),(7,7,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Pagar tasa municipal por certificación.\n3. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros.',1),(8,8,'Cualquier persona','1. Imprimir y llenar el Formulario de Trámites de Avalúos y\nCatastros que está disponible en la página web del GADIPMC. El formulario también puede ser completado desde el\ncomputador para luego imprimirse.\n2. Realizar el pago de la impresión de la ficha predial.\n3. Ingresar requisitos en la Secretaría de la Dirección de\nAvalúos y Catastros.',1),(9,9,'Cualquier persona','1. Imprimir, llenar el Formulario de Trámites de Administración\nTerritorial que está disponible en la página web del GADIP-MC. El\nformulario también puede ser completado desde el computador para\nluego imprimirse.\n2. Pagar certificado de no adeudar al Municipio y derecho de\ninspección en caja o ventanilla del GADIP-MC.\n3. Una vez que los requisitos se hayan completado en su totalidad se\npodrá ingresar el trámite en la Secretaría de la Jefatura de\nAdministración y Control Territorial.\n4. Agendar la fecha de visita para la inspección de la línea de fábrica.\n5. Asistir a la Jefatura de Administración y Control Territorial, en el día y\nhorario programado para la inspección. ',1),(10,10,'Cualquier persona','1.Imprimir y llenar el formulario de Trámites de Administración Territorial que está disponible en la página web del GADIP-MC. El formulario también puede ser completado desde el computador para luego imprimirse. 2. Una vez que los requisitos se hayan completado en su totalidad se podrá ingresar el trámite en la Secretaría de la Jefatura de Administración y Control Territorial. 3. Aprobado el trámite realizar el pago en caja o ventanilla del GADIPMC las tasas administrativas correspondientes por fraccionamiento',1);

--
-- Table structure for table `prompts_bot`
--

CREATE TABLE `prompts_bot` (
  `id_prompt` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `contenido` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_prompt`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prompts_bot`
--

INSERT INTO `prompts_bot` VALUES (1,'Mensaje de Bienvenida','Saludo','¡Hola! Soy Martita AI, tu asistente virtual del GAD de Cayambe. Estoy aquí para ayudarte con información sobre trámites municipales, servicios y consultas generales. ¿En qué puedo asistirte hoy?',1,'2025-08-08 20:01:53'),(2,'Información GAD Cayambe','Información General','El GAD de Cayambe es el Gobierno Autónomo Descentralizado que administra el cantón Cayambe. Ofrecemos servicios municipales como: licencias de construcción, impuestos prediales, servicios de agua potable, gestión ambiental, desarrollo urbano y rural, y más. Nuestro horario de atención es de lunes a viernes de 8:00 AM a 5:00 PM.',1,'2025-08-08 20:02:14'),(3,'Horarios de Atención','Horarios','Nuestros horarios de atención son: Lunes a Viernes de 8:00 AM a 5:00 PM. Los sábados de 8:00 AM a 12:00 PM. Los domingos y feriados no hay atención presencial. Para emergencias fuera de horario, puedes contactar al número de emergencias: 02-2362-999.',1,'2025-08-08 20:02:41'),(4,'Licencia de Construcción','Trámite','Para obtener una licencia de construcción necesitas: 1) Planos arquitectónicos aprobados, 2) Certificado de propiedad, 3) Certificado de no adeudo de impuestos, 4) Estudio de suelos, 5) Cédula de identidad. El trámite toma aproximadamente 15 días hábiles. Costo: $XXX. Contacto: Dirección de Desarrollo Urbano, teléfono: 02-2362-111.',1,'2025-08-08 20:03:03'),(5,'Impuesto Predial','Impuestos','El impuesto predial se paga anualmente. Puedes pagarlo: 1) En nuestras oficinas de lunes a viernes, 2) En línea en nuestra página web, 3) En bancos autorizados. El descuento por pago anticipado es del 10% hasta el 31 de marzo. Para consultas sobre tu avalúo, contacta: Dirección de Finanzas, teléfono: 02-2362-333.',1,'2025-08-08 20:03:29'),(6,'Servicios de Agua','Servicios Públicos','Para solicitar conexión de agua potable: 1) Solicitud escrita, 2) Certificado de propiedad, 3) Cédula de identidad, 4) Pago de derechos de conexión. Para reportar problemas con el servicio: EMAPAC, teléfono: 02-2362-444. Horario de atención: lunes a viernes 8:00 AM a 5:00 PM.',1,'2025-08-08 20:03:52'),(7,'Gestión Ambiental','Medio Ambiente','Nuestros servicios ambientales incluyen: 1) Licencias ambientales, 2) Gestión de residuos sólidos, 3) Control de contaminación, 4) Educación ambiental. Para solicitudes ambientales: Dirección de Gestión Ambiental, teléfono: 02-2362-5438. También puedes reportar problemas ambientales al mismo número.',1,'2025-08-08 20:04:17'),(8,'Desarrollo Rural','Desarrollo','El GAD de Cayambe promueve el desarrollo rural a través de: 1) Programas de agricultura sostenible, 2) Mejoras de infraestructura rural, 3) Capacitación técnica, 4) Apoyo a emprendimientos rurales. Para más información: Dirección de Desarrollo Rural, teléfono: 02-2362-777.',1,'2025-08-08 20:04:40'),(9,'Transparencia','Información Pública','Toda la información pública del GAD de Cayambe está disponible en nuestro portal de transparencia. Puedes acceder a: contrataciones, presupuestos, informes de gestión, y más. Para solicitudes de información: Dirección de Transparencia, teléfono: 02-2362-667, email: transparencia@gadcayambe.gob.ec',1,'2025-08-08 20:05:03'),(10,'Emergencias','Seguridad','Para emergencias en el cantón Cayambe: Bomberos: 102, Policía: 101, Emergencias Médicas: 911. Para reportar problemas de seguridad ciudadana: Dirección de Seguridad Ciudadana, teléfono: 02-2362-9642. También puedes usar nuestra línea de emergencias municipal: 02-2362-649.',1,'2025-08-08 20:05:45'),(11,'Turismo','Turismo','Cayambe ofrece atractivos turísticos como: 1) Volcán Cayambe, 2) Laguna de San Marcos, 3) Centro histórico, 4) Fiestas tradicionales. Para información turística: Dirección de Turismo, teléfono: 02-2362-162. También puedes visitar nuestro centro de información turística en el centro de la ciudad.',1,'2025-08-08 20:06:20'),(12,'Transferencia a Encargado','Escalamiento','Si no puedo resolver tu consulta o necesitas atención personalizada, puedo transferirte con el encargado de la dirección correspondiente. ¿Te gustaría que te comunique con el responsable del área? Solo necesito tu confirmación para proporcionarte el número de contacto directo.',1,'2025-08-08 20:06:44'),(13,'Manejo de Frustración','Atención al Cliente','Entiendo tu frustración. Permíteme ayudarte de la mejor manera posible. Si no puedo resolver tu consulta, puedo transferirte directamente con el encargado de la dirección correspondiente. ¿Te gustaría que te proporcione el contacto directo del responsable?',1,'2025-08-08 20:07:08'),(14,'Preguntas Repetidas','Escalamiento','Veo que has hecho esta pregunta varias veces. Para asegurarme de darte la mejor atención posible, ¿te gustaría que te comunique directamente con el encargado de esta área? Ellos podrán ayudarte de manera más específica y personalizada.',1,'2025-08-08 20:07:28');

--
-- Table structure for table `requisitos_tramite`
--

CREATE TABLE `requisitos_tramite` (
  `id_requisito` int NOT NULL AUTO_INCREMENT,
  `id_tramite` int DEFAULT NULL,
  `contexto` text,
  `requisito` text NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  PRIMARY KEY (`id_requisito`),
  KEY `id_tramite` (`id_tramite`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `requisitos_tramite`
--

INSERT INTO `requisitos_tramite` VALUES (1,1,'Cualquier persona','1. Original de cédula de ciudadanía del propietario.\n2. Copia de la escritura.\n3. Pago del impuesto predial actualizado.\n4. Certificado de gravámenes actualizado.\n5. Formulario de Trámites de Avalúos y Catastros.',1),(2,2,'Cualquier persona','1. Original de cédula de ciudadanía de vendedor y\ncomprador.\n2. Copia de la escritura.\n3. Pago del impuesto predial actualizado.\n4. Certificado de gravámenes actualizado.\n5. Formulario de Trámites de Avalúos y Catastros.\n6. Certificado de plusvalía (sólo urbano).',1),(3,3,'REQUISITOS PARA PLOTEO DE PLANOS','1.Original de cédula de ciudadanía del propietario.\n2. Formulario de Trámites de Avalúos y Catastros.\n3.Pago de la tasa municipal por ploteo de planos según el\nformato (A0, A1 o A2).',1),(4,3,'REQUISITOS PARA FICHA CATASTRAL','1. Original de cédula de ciudadanía del propietario.\n2. Formulario de Trámites de Avalúos y Catastros.\n3. Pago de la tasa municipal por ficha catastral.\n(La ficha catastral resumida no tiene costo).',1),(5,3,'REQUISITOS PARA FOTOGRAFÍAS AÉREAS GEORREFERENCIADAS','1. Original de cédula de ciudadanía del propietario.\n2. Formulario de Trámites de Avalúos y Catastros.\n3. Pago de la tasa municipal por fotografía aérea\ngeorreferenciada según el formato (A3 o A4).',1),(6,3,'REQUISITOS PARA CERTIFICACIÓN DE BIENES RAÍCES','1.Original de cédula de ciudadanía.\n2. Pago del impuesto predial actualizado (en caso de poseer\nbienes).\n3. Formulario de Bienes y Raíces comprado en ventanilla del\nGADIP-MC.\n4. Formulario de Trámites de Avalúos y Catastros.\n5. Pago de la tasa municipal por certificación.',1),(7,3,'REQUISITOS PARA ARCHIVO DIGITAL DE MAPAS DE CAYAMBE','1.Original de cédula de ciudadanía.\n2. Formulario de Trámites de Avalúos y Catastros.\n3. Pago de la tasa municipal por archivo digital de mapa según\nla zona (urbano o rural).\nSi el pedido es realizado por una comunidad se debe presentar:\n4. Copia de cédula del representante legal.',1),(8,4,'Cualquier persona','1. Original de cédula de ciudadanía.\n2. Formulario de Inscripción de Arrendamiento',1),(9,5,'Cualquier persona','1. Original de cédula de ciudadanía del propietario.\n2. Copia de la escritura.\n3. Pago del impuesto predial actualizado.\n4. Certificado de gravámenes actualizado.\n5. Formulario de Trámites de Avalúos y Catastros.',1),(10,6,'Cualquier persona','1. Original de cédula de ciudadanía del comprador.\n2. Copia de la escritura de la propiedad a transferir.\n3. Pago del impuesto predial actualizado.\n4. Certificado de gravámenes actualizado.\n5. Pago de certificado de plusvalía.\n5. Fraccionamiento debidamente protocolizado y registrado.\n(Si se trata de transferencia de un predio).\n6. Formulario de Trámites de Avalúos y Catastros',1),(11,7,'Cualquier persona','1. Original de cédula de ciudadanía del propietario.\n2. Copia de la escritura.\n3. Pago del impuesto predial actualizado.\n4. Certificado de gravámenes actualizado.\n5. Formulario de Trámites de Avalúos y Catastros.\n6. Pago de tasa municipal por certificación.\n7. Cuatro planos firmados por un profesional con número con\nel registro del GADIP-MC de acuerdo a la Normativa Legal\nVigente.\n8. Archivo digital con extensión .DWG o .SHP (geo\nreferenciado).\n9. Copia de cédulas de los colindantes.\n(En caso no tener las copias de las cédulas de los colindantes,\nse debe presentar una declaración juramentada de que no\nexiste afectación a los linderos de sus colindantes).\n10. En el caso de que el predio se encuentre dentro de zonas\nde conservación arquitectónica o de protección arqueológica o\nde bienes patrimoniales, se requiere la autorización del\nInstituto de Patrimonio Cultural o de la instancia\ncorrespondiente.',1),(12,8,'Cualquier persona','1. Pago del impuesto predial actualizado.\n2. Formulario de Trámites Avalúos y Catastros.\n3. Pago de la tasa municipal por ficha catastral.\n4. Plano impreso del predio, en formato MAG –\nSubsecretaría de Tierras.\n5. Archivo digital con extensión .DWG o .SHP\n(georreferenciado).\n6. Certificado de historial de dominio (emitido por el Registro\nde la Propiedad).\n7. Declaración juramentada de posesión',1),(13,9,'Cualquier persona','1. Copia de cédula del propietario.\n2. Copia de la escritura.\n3. Copia del impuesto predial actualizado.\n4. Formulario de Trámites de Administración Territorial.\n5. Derecho de inspección.\n6. Certificado de no adeudar al Municipio',1),(14,10,'Cualquier persona','1. Copia de cédula del propietario (en caso de herederos presentar las copias de cédula y copia de posesión efectiva). 2. Copia de la escritura. 3. Copia del impuesto predial actualizado. 4. Copia de certificado de gravámenes emitido por el Registro de la Propiedad actualizado. 5. Formulario de Trámites de Administración Territorial firmado por los propietarios que consten en el certificado de gravámenes. 6. Informe de línea de fábrica. 7. Cuatro planos georreferenciados del fraccionamiento firmados por un Arquitecto o Ingeniero Civil con el registro del GADIP-MC, de acuerdo a la Normativa Legal Vigente, y por el propietario o propietarios que consten en el Certificado de Gravámenes. 8. Archivo digital georreferenciado en formato .DWG o .SHP. 9. De encontrarse el predio dentro de zonas de conservación arquitectónica, de protección arqueológica o de bienes patrimoniales, se requiere autorización del Instituto de Patrimonio Cultural o la instancia correspondiente. 10. Certificados y factibilidad de infraestructura de agua, luz y alcantarillado y vías de acceso, conforme al ',1);

--
-- Table structure for table `tramites`
--

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
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tramites`
--

INSERT INTO `tramites` VALUES (1,3,'EMISIÓN DE AVALÚO PARA HIPOTECA','Emitir el avalúo de los predios urbanos o rurales para\nhipotecas.','Emitir el avalúo de los predios urbanos o rurales para hipotecas.',1,NULL),(2,3,'EMISIÓN DE AVALÚO PARA TRANSFERENCIA DE DOMINIO TOTAL','Determinar y emitir el avalúo para la transferencia total de\ndominio de los predios.','Determinar y emitir el avalúo para la transferencia total de dominio de los predios.',1,NULL),(3,3,'SERVICIOS VARIOS','Entregar al usuario documentos oficiales tales como:\ncertificación de bienes raíces, ficha catastral completa, ficha\ncatastral resumida, fotografías aéreas georreferenciadas tamaño\nA3, fotografías aéreas georreferenciadas tamaño A4, archivo\ndigital de mapas de Cayambe, ploteo de planos tamaño A0,\nploteo de planos tamaño A1 y ploteo de planos tamaño A2.','Entregar al usuario documentos oficiales tales como: certificación de bienes raíces, ficha catastral completa, ficha catastral resumida, fotografías aéreas georreferenciadas tamaño A3, fotografías aéreas georreferenciadas tamaño A4, archivo digital de mapas de Cayambe, ploteo de planos tamaño A0, ploteo de planos tamaño A1 y ploteo de planos tamaño A2.',1,NULL),(4,3,'INSCRIPCIÓN DE ARRENDAMIENTO','Inscribir y verificar que los valores de arrendamiento cumplan con la Ley del Inquilinato.','Inscribir y verificar que los valores de arrendamiento cumplan con la Ley del Inquilinato.',1,NULL),(5,3,'ACTUALIZACIÓN DE DATOS CATASTRALES','Actualizar los datos catastrales, de predios urbanos o\nrurales, tales como: cambio de propietario, rectificación de\ncaracterísticas de construcción, rectificación de datos\npersonales, propiedad horizontal, rectificación de área de\nterreno, rectificación alícuota, rectificación de área\nconstrucción, unificación de predios, reavalúo / impugnación\nal avalúo, nueva clave catastral, ingreso de construcción, u\notro dato que requiera actualización.','Actualizar los datos catastrales, de predios urbanos o rurales, tales como: cambio de propietario, rectificación de características de construcción, rectificación de datos personales, propiedad horizontal, rectificación de área de terreno, rectificación alícuota, rectificación de área construcción, unificación de predios, reavalúo / impugnación al avalúo, nueva clave catastral, ingreso de construcción, u otro dato que requiera actualización.',1,NULL),(6,3,'EMISIÓN DE CERTIFICADO DE PLUSVALÍA','El Certificado de Plusvalía, es el beneficio obtenido como\nresultado de una diferencia positiva entre el precio al que se\ncompró un bien y el precio de su venta en una operación o\ntransacción económica','El Certificado de Plusvalía, es el beneficio obtenido como resultado de una diferencia positiva entre el precio al que se compró un bien y el precio de su venta en una operación o transacción económica',1,NULL),(7,3,'REGULARIZACIÓN DE ÁREAS Y LINDEROS','Regularizar y certificar la información sobre el área y la\ndimensión de los linderos, cuando estos datos no constan\nescrituras respectivas.','Regularizar y certificar la información sobre el área y la dimensión de los linderos, cuando estos datos no constan escrituras respectivas.',1,NULL),(8,3,'ESTADO DE PREDIOS','Determinar y entregar al usuario la información actualizada\nsobre el estado de los predios','Determinar y entregar al usuario la información actualizada sobre el estado de los predios',1,NULL),(9,1,'LÍNEA DE FÁBRICA','La línea de fábrica es el documento que se utiliza cuando se va a\nrealizar sobre un plano urbano o rural los siguientes trámites:\nfraccionamientos de predios, propiedad horizontal, certificaciones de\náreas y linderos, aprobación de planos para edificación y\nurbanizaciones','La línea de fábrica es el documento que se utiliza cuando se va a realizar sobre un plano urbano o rural los siguientes trámites: fraccionamientos de predios, propiedad horizontal, certificaciones de áreas y linderos, aprobación de planos para edificación y urbanizaciones',1,NULL),(10,1,'FRACCIONAMIENTO RURAL','Autorización del GADIP-MC para que un predio rural se subdivida\nhasta en diez (10) lotes.','Autorización del GADIP-MC para que un predio rural se subdivida\nhasta en diez (10) lotes.',1,NULL);

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `estado` int DEFAULT '1' COMMENT '1 = activo, 0 = inactivo, 2 = eliminado',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` VALUES (1,'JeanD','jean@gadipmc.gob.ec','$2b$12$AfidgZoMyhiZ./C2WVFEDupMt09Iy/sWSysK/0Sc0mrYDwxRxiXTS',1,NULL), (2, 'Omar Sani', 'omigc4@gadipmc.gob.ec', '$2b$12$uEx7g2mgh.Qld1DVRrHlR.AvmROzPVnu2.OiOQdCXgKIqYpUY20Hq', 1, NULL);
COMMIT;

