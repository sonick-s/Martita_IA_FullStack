# Introducción al Frontend

## Descripción General

El frontend de Martita IA es una Single Page Application (SPA) moderna y reactiva, construida con **Vue.js 3 (Composition API)**. Su propósito es ofrecer una interfaz de usuario intuitiva y eficiente para que los administradores gestionen las reglas del bot, los trámites, las direcciones y visualicen el historial de interacciones.

La aplicación está diseñada para ser robusta, mantenible y fácil de escalar, utilizando herramientas modernas del ecosistema de Vue.

![Panel de control Martita](/img/Rag_Arquitectura.jpg)

## Tecnologías Utilizadas

### Framework Principal
- **Vue.js 3**: Utilizando la **Composition API** para una lógica de componentes más organizada y reutilizable.
- **Vite**: Herramienta de desarrollo y empaquetado de última generación que proporciona un arranque en frío instantáneo y HMR (Hot Module Replacement) ultrarrápido.
- **Vue Router**: Para la gestión de rutas y navegación del lado del cliente.

### Gestión de Estado
- **Pinia**: La solución de gestión de estado oficial para Vue.js. Se utiliza para manejar de forma centralizada el estado de la autenticación, reglas, trámites, etc.

### Estilos y UI
- **CSS Scoped**: Los estilos se definen por componente para evitar colisiones y mantener un diseño encapsulado.
- **CSS Variables**: Se utiliza un sistema de variables CSS (definidas en `src/assets/base.css`) para una paleta de colores consistente.

### Peticiones HTTP
- **Axios**: Cliente HTTP basado en promesas para comunicarse con la API REST del backend. Se ha configurado un interceptor para inyectar automáticamente el token de autenticación en las peticiones.

### Herramientas de Desarrollo
- **ESLint**: Para el análisis estático de código, asegurando la calidad y previniendo errores.
- **Prettier**: Para el formateo automático del código, manteniendo un estilo consistente en todo el proyecto.
- **Vite Plugin Vue Devtools**: Extensión para facilitar la depuración de aplicaciones Vue en el navegador.

## Estructura del Proyecto

La estructura del proyecto está organizada de manera lógica para separar responsabilidades y facilitar el mantenimiento.

```
src/
├── assets/             # Archivos estáticos como CSS, fuentes e imágenes.
├── boot/               # Scripts de inicialización (ej. configuración de Axios).
├── components/         # Componentes de UI reutilizables (modales, notificaciones, etc.).
├── layouts/            # Componentes de layout principal (ej. DashboardLayout).
├── router/             # Configuración de las rutas de la aplicación con Vue Router.
├── services/           # Lógica de negocio desacoplada (ej. inicialización del chatbot).
├── stores/             # Módulos de estado de Pinia (auth, rules, procedures, etc.).
├── views/              # Componentes de página completos (Login, Rules, Procedures, etc.).
├── App.vue             # Componente raíz de la aplicación.
└── main.js             # Punto de entrada principal de la aplicación.
```

## Componentes y Vistas Clave

### 1. **Layout Principal (`DashboardLayout.vue`)**
Es el contenedor principal para todas las vistas autenticadas. Incluye la barra lateral de navegación y el área de contenido principal donde se renderizan las demás vistas.

### 2. **Vistas de Gestión**
- **`RulesView.vue`**: Permite al administrador realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las reglas del bot.
- **`ProceduresView.vue`**: Interfaz para la gestión de Direcciones y Trámites, permitiendo su creación, edición y desactivación (borrado lógico).
- **`HistoryView.vue`**: Muestra un historial de todas las interacciones que los usuarios han tenido con el chatbot.
- **`UsersView.vue`**: Permite al usuario administrador ver y actualizar su propia información de perfil.

### 3. **Componentes Reutilizables**
- **`RuleFormModal.vue`**: Modal para crear o editar reglas.
- **`DirectionFormModal.vue`**: Modal para crear o editar direcciones.
- **`ProcedureWizardModal.vue`**: Asistente de varios pasos para la creación de un nuevo trámite.
- **`ConfirmationModal.vue`**: Un modal genérico para confirmar acciones críticas como la eliminación o desactivación de un elemento.

## Flujo de Autenticación

1.  El usuario ingresa sus credenciales en `LoginView.vue`.
2.  Se llama a la acción `login` en el store de Pinia (`src/stores/auth.js`).
3.  El store realiza una petición POST a la API con Axios.
4.  Si la autenticación es exitosa, el token JWT y el ID de usuario se guardan en `sessionStorage` y en el estado de Pinia.
5.  El "Navigation Guard" de Vue Router (`src/router/index.js`) protege las rutas que requieren autenticación, redirigiendo al login si el usuario no está autenticado.
6.  El interceptor de Axios (`src/boot/axios.js`) añade el token a las cabeceras de todas las peticiones subsiguientes.

## Despliegue

El frontend está preparado para ser desplegado usando Docker. El `Dockerfile` define un proceso de build en dos etapas:
1.  **Etapa `builder`**: Usa una imagen de `node` para instalar las dependencias (`npm install`) y compilar la aplicación para producción (`npm run build`).
2.  **Etapa final**: Usa una imagen ligera de `nginx`. Los archivos estáticos generados en el paso anterior se copian al directorio de Nginx, que se encarga de servirlos.

El archivo `nginx.conf` está configurado para servir la SPA correctamente, redirigiendo todas las peticiones a `index.html` para que Vue Router pueda manejar las rutas.
