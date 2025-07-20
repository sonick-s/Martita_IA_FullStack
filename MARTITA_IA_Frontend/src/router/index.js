import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importamos el nuevo Layout y las nuevas Vistas
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RulesView from '../views/RulesView.vue'
import ProceduresView from '../views/ProceduresView.vue'
import HistoryView from '../views/HistoryView.vue'
import UsersView from '../views/UsersView.vue'
import ProcedureEditorView from '../views/ProcedureEditorView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },

    // Rutas protegidas que usarán el DashboardLayout
    {
  path: '/dashboard',
  component: DashboardLayout,
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: '/dashboard/rules' },
    { path: 'rules', name: 'dashboard-rules', component: RulesView },
    { path: 'procedures', name: 'dashboard-procedures', component: ProceduresView },

    // --- RUTA NUEVA AÑADIDA AQUÍ ---
    // El ":id" indica que esta parte de la URL es un parámetro dinámico.
    {
      path: 'procedures/edit/:id',
      name: 'procedure-editor',
      component: ProcedureEditorView
    },

    { path: 'history', name: 'dashboard-history', component: HistoryView },
    { path: 'users', name: 'dashboard-users', component: UsersView },
  ],
},

    // Redirección por defecto si el usuario va a la raíz
    { path: '/', redirect: '/dashboard' },
  ],
})

// El guardia de navegación no necesita cambios
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
