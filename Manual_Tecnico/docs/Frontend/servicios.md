# Servicios del Frontend

La capa de servicios en el frontend de Martita IA es responsable de toda la lógica de negocio y la comunicación con sistemas externos, como la API del backend y la API de Flowise. Esta capa está principalmente implementada a través de los **stores de Pinia** y un **cliente Axios centralizado**.

## 1. Cliente HTTP (Axios)

Toda la comunicación con la API REST del backend se gestiona a través de una instancia de Axios configurada en `src/boot/axios.js`.

### Características Principales:
- **Instancia Centralizada**: Se crea una única instancia de Axios, lo que permite establecer configuraciones globales en un solo lugar.
- **`baseURL`**: La URL base de la API (`http://127.0.0.1:8000`) está preconfigurada, por lo que las llamadas en los stores solo necesitan especificar el endpoint (ej. `/direcciones/`).
- **Interceptor de Peticiones**: Se utiliza un interceptor (`apiClient.interceptors.request`) que se ejecuta antes de cada petición. Su función es:
    1. Obtener el estado del `authStore`.
    2. Si existe un token de autenticación, lo añade automáticamente a las cabeceras de la petición como `Authorization: Bearer <token>`.
    
Esto desacopla completamente la lógica de autenticación de las llamadas a la API, haciendo que los stores no necesiten preocuparse por la gestión del token.

## 2. Gestión de Estado y Lógica de Negocio (Pinia Stores)

Los stores de Pinia, ubicados en `src/stores/`, son el corazón de la capa de servicios. Cada store encapsula el estado y las acciones para un dominio de negocio específico.

- **`auth.js`**:
    - **Acciones**: `login`, `register`, `logout`, `fetchUser`.
    - **Responsabilidad**: Maneja el flujo de autenticación, almacena el token en `sessionStorage` y en el estado, y obtiene los datos del usuario logueado.

- **`directions.js`, `procedures.js`, `rules.js`, `history.js`**:
    - **Acciones**: Implementan las operaciones CRUD (`fetch`, `create`, `update`, `delete`/`deactivate`) para sus respectivas entidades.
    - **Responsabilidad**: Son los únicos que pueden realizar llamadas a la API a través del cliente Axios para obtener o modificar datos. Gestionan el estado de carga (`isLoading`) y los errores.

- **`requisitos.js`, `pasos.js`, `formularios.js`**:
    - **Acciones**: `create`, `update`, `delete` para las sub-entidades de un trámite.
    - **Responsabilidad**: Permiten una gestión más granular y eficiente desde el `ProcedureEditorView.vue`, guardando o eliminando ítems individuales sin tener que recargar todo el trámite.

- **`flowise.js`**:
    - **Acciones**: `updateMemory`.
    - **Responsabilidad**: Contiene la lógica para realizar la llamada a la API de Flowise y disparar la actualización de su base de conocimientos.

## 3. Integración con Chatbot (Flowise)

El servicio de integración con el chatbot se encuentra en `src/services/martita-chatbot.js`.

- **`initChatbot()`**: Esta función es la responsable de inicializar el widget del chatbot de Flowise en la aplicación.
    - **Configuración Dinámica**: Lee las credenciales (`chatflowid`, `apiHost`) desde las variables de entorno de Vite (`import.meta.env`).
    - **Personalización de la UI**: Define el tema visual del chatbot, incluyendo colores, mensajes de bienvenida, avatares y preguntas de inicio rápido, para que se integre visualmente con el resto de la aplicación.
    - **Captura de Historial**: Utiliza la propiedad `observersConfig` para interceptar los mensajes enviados por el usuario y las respuestas del bot. Cuando se detecta una nueva conversación, los datos se envían al backend a través del `apiClient` para ser guardados en la tabla de interacciones.