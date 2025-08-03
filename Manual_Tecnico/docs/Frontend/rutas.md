# Rutas del Frontend

La navegación de la aplicación está gestionada por **Vue Router**. El archivo de configuración principal se encuentra en `src/router/index.js`. La estructura de rutas está diseñada para separar claramente las áreas públicas de las privadas y para utilizar layouts anidados.

## Estructura de Rutas

```javascript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Rutas Públicas
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },

    // 2. Rutas Protegidas (Dashboard)
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard/rules' },
        { path: 'rules', name: 'dashboard-rules', component: RulesView },
        { path: 'procedures', name: 'dashboard-procedures', component: ProceduresView },
        {
          path: 'procedures/edit/:id',
          name: 'procedure-editor',
          component: ProcedureEditorView
        },
        { path: 'history', name: 'dashboard-history', component: HistoryView },
        { path: 'users', name: 'dashboard-users', component: UsersView },
      ],
    },

    // 3. Redirección por Defecto
    { path: '/', redirect: '/dashboard' },
  ],
})
```

### 1. Rutas Públicas
- `/login`: Muestra el componente `LoginView.vue` para que los usuarios inicien sesión.
- `/register`: Muestra el componente `RegisterView.vue` para la creación de nuevas cuentas.
Estas rutas son accesibles para cualquier visitante.

### 2. Rutas Protegidas y Layout Anidado
- **`/dashboard`**: Esta es la ruta base para todas las vistas de administración.
    - **Layout**: Utiliza `DashboardLayout.vue` como componente principal. Este layout contiene la barra de navegación lateral y el pie de página, proporcionando una estructura consistente para todas las vistas internas.
    - **Rutas Hijas (`children`)**: Las vistas específicas de gestión (Reglas, Trámites, etc.) se renderizan dentro del `<RouterView />` del `DashboardLayout.vue`.
        - `/dashboard/rules`: Muestra la gestión de reglas del bot.
        - `/dashboard/procedures`: Muestra la gestión de trámites y direcciones.
        - `/dashboard/procedures/edit/:id`: Una ruta dinámica que muestra el editor para un trámite específico, identificado por su `id`.
        - `/dashboard/history`: Muestra el historial de conversaciones.
        - `/dashboard/users`: Muestra el perfil del usuario administrador.
    - **Protección de Ruta**: La propiedad `meta: { requiresAuth: true }` marca esta ruta y todas sus hijas como privadas.

### 3. Redirección por Defecto
- `/`: Si un usuario navega a la raíz del sitio, es automáticamente redirigido a `/dashboard`. El guardia de navegación se encargará de enviarlo a `/login` si no ha iniciado sesión.

## Guardia de Navegación (`Navigation Guard`)

El archivo `router/index.js` también implementa un guardia de navegación global utilizando `router.beforeEach`.

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está logueado...
    next({ name: 'login' }) // ...redirigir a la página de login.
  } else {
    // De lo contrario, permitir el acceso.
    next()
  }
})
```

Este mecanismo es fundamental para la seguridad de la aplicación, ya que previene que usuarios no autenticados accedan a las vistas de administración.