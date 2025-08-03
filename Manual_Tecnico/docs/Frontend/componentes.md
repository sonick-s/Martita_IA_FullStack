# Componentes del Frontend

La carpeta `src/components/` contiene todos los componentes de Vue que son reutilizables a lo largo de la aplicación. Estos componentes encapsulan lógica y estilos específicos, promoviendo un desarrollo más limpio y mantenible.

A continuación se describen los componentes más importantes:

### `ConfirmationModal.vue`
- **Propósito**: Muestra un diálogo de confirmación genérico para acciones destructivas o importantes (como eliminar o desactivar un elemento).
- **Props**:
    - `title` (String): El título del modal.
    - `message` (String): El mensaje o pregunta de confirmación.
- **Eventos**:
    - `@confirm`: Se emite cuando el usuario hace clic en el botón de confirmación.
    - `@cancel`: Se emite cuando el usuario hace clic en el botón de cancelar o cierra el modal.

### `DirectionFormModal.vue`
- **Propósito**: Proporciona un formulario dentro de un modal para crear o editar una Dirección.
- **Props**:
    - `directionToEdit` (Object): Un objeto con los datos de una dirección. Si es `null`, el modal opera en modo "Crear". Si se proporciona, opera en modo "Editar".
- **Eventos**:
    - `@submit`: Se emite cuando se envía el formulario, pasando los datos de la dirección como argumento.
    - `@close`: Se emite cuando se cierra el modal.

### `ProcedureWizardModal.vue`
- **Propósito**: Un asistente (wizard) de dos pasos para guiar al usuario en la creación de un nuevo trámite.
    - **Paso 1**: Recopila los datos principales del trámite (nombre, descripción, dirección responsable).
    - **Paso 2**: Una vez creado el trámite principal, permite añadir dinámicamente Requisitos, Pasos y Formularios asociados.
- **Props**:
    - `directions` (Array): Una lista de las direcciones activas para ser seleccionadas en el primer paso.
- **Eventos**:
    - `@close`: Se emite cuando el usuario finaliza o cancela el proceso.

### `ProceduresListModal.vue`
- **Propósito**: Muestra una lista de los trámites que pertenecen a una dirección específica. Los elementos de la lista son enlaces que llevan al editor de trámites.
- **Props**:
    - `direction` (Object): La dirección cuyos trámites se van a mostrar.
    - `procedures` (Array): La lista de trámites a mostrar.
- **Eventos**:
    - `@close`: Se emite cuando se cierra el modal.

### `RuleFormModal.vue`
- **Propósito**: Un formulario en un modal para crear o editar una Regla del Bot.
- **Props**:
    - `ruleToEdit` (Object): Un objeto con los datos de una regla. Si es `null`, el modal opera en modo "Crear". Si se proporciona, opera en modo "Editar".
- **Eventos**:
    - `@submit`: Se emite al enviar el formulario, pasando los datos de la regla como argumento.
    - `@close`: Se emite cuando se cierra el modal.

### `Notification.vue` y `NotificationContainer.vue`
- **Propósito**: Juntos, implementan un sistema de notificaciones (toasts) global.
    - `NotificationContainer.vue`: Es el contenedor que se posiciona en la esquina de la pantalla y gestiona la lista de notificaciones activas con animaciones.
    - `Notification.vue`: Es la notificación individual, que muestra el mensaje y el tipo (éxito, error, info).
- **Uso**: Se utiliza un sistema de `provide`/`inject` en `App.vue` para que cualquier componente hijo pueda llamar a la función `addNotification` y mostrar un mensaje global sin necesidad de pasar props a través de toda la jerarquía de componentes.