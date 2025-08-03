# Funcionalidades del Frontend

El frontend de Martita IA proporciona una interfaz de administración completa para gestionar todos los aspectos del asistente virtual. Las funcionalidades se dividen en las siguientes vistas principales:

### 1. Autenticación de Usuarios (`/login`, `/register`)
- **Inicio de Sesión**: Los administradores pueden acceder al sistema utilizando su correo electrónico y contraseña. La sesión se mantiene utilizando un token JWT que se almacena de forma segura.
- **Registro**: Permite la creación de nuevas cuentas de administrador.

### 2. Gestión de Reglas del Bot (`/dashboard/rules`)
- **Vista Principal**: `RulesView.vue`
- **Funcionalidad**: Esta sección permite a los administradores controlar el comportamiento base del chatbot.
    - **Listar Reglas**: Muestra una tabla con todas las reglas existentes, su tipo, contenido, estado (activo/inactivo) y fecha de creación.
    - **Crear y Editar Reglas**: A través del modal `RuleFormModal.vue`, los administradores pueden definir nuevas reglas o modificar las existentes. Una regla consiste en un nombre, un tipo (ej. `system`), el contenido (el prompt en sí) y un estado.
    - **Eliminar Reglas**: Se pueden eliminar reglas que ya no son necesarias.

### 3. Gestión de Trámites y Direcciones (`/dashboard/procedures`)
- **Vista Principal**: `ProceduresView.vue`
- **Funcionalidad**: Es el núcleo de la gestión de la información que el bot utilizará para responder preguntas sobre trámites.
    - **Gestión de Direcciones**:
        - Permite crear, editar y desactivar (borrado lógico) las diferentes direcciones o departamentos del municipio.
        - Las direcciones inactivas se muestran visualmente diferenciadas y no se pueden seleccionar al crear nuevos trámites, pero conservan su información.
    - **Gestión de Trámites**:
        - Muestra una tabla con todos los trámites, indicando a qué dirección pertenecen y su estado.
        - Permite la creación de nuevos trámites a través de un asistente (`ProcedureWizardModal.vue`).
        - Permite la desactivación (borrado lógico) y reactivación de trámites.
    - **Navegación**: Al hacer clic en una tarjeta de dirección, se abre un modal (`ProceduresListModal.vue`) que lista los trámites asociados a ella.

### 4. Editor Avanzado de Trámites (`/dashboard/procedures/edit/:id`)
- **Vista Principal**: `ProcedureEditorView.vue`
- **Funcionalidad**: Esta vista proporciona una interfaz completa para editar un trámite existente y todos sus componentes relacionados en un solo lugar.
    - **Edición de Datos Principales**: Permite modificar el nombre, la descripción y el contexto para la IA del trámite.
    - **Gestión Dinámica de Requisitos, Pasos y Formularios**: El administrador puede añadir, modificar y eliminar dinámicamente los requisitos, pasos y enlaces a formularios asociados al trámite.
    - **Guardado Automático**: Los cambios se guardan de forma asíncrona y con un pequeño retardo (debounce) para ofrecer una experiencia de edición fluida sin necesidad de un botón "Guardar" explícito para cada cambio.

### 5. Historial de Conversaciones (`/dashboard/history`)
- **Vista Principal**: `HistoryView.vue`
- **Funcionalidad**: Ofrece una auditoría completa de las interacciones de los usuarios con el chatbot.
    - Muestra una tabla con el ID de la interacción, la pregunta del usuario, la respuesta proporcionada por el bot y la fecha.
    - Incluye la calificación (Like/Dislike) que el usuario haya podido dar a la respuesta, permitiendo analizar la efectividad del bot.

### 6. Perfil de Administrador (`/dashboard/users`)
- **Vista Principal**: `UsersView.vue`
- **Funcionalidad**: Permite al administrador gestionar su propia información.
    - **Actualizar Datos**: Puede cambiar su nombre. El correo electrónico se muestra pero no es editable.
    - **Cambiar Contraseña**: Proporciona campos para establecer una nueva contraseña.

### 7. Sincronización con Flowise (`/dashboard/procedures`)
- **Funcionalidad**: En la vista de "Trámites y Direcciones", existe un botón "🧠 Actualizar Memoria".
    - Al hacer clic, se realiza una llamada a la API de Flowise.
    - Esta acción le indica al chatbot que debe recargar y re-indexar la información de su base de conocimientos, asegurando que los cambios realizados en los trámites y reglas se reflejen inmediatamente en sus respuestas.