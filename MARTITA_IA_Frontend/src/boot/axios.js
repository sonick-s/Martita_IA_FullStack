import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// 1. Creamos una instancia de Axios con la configuración base
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // La URL raíz de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Usamos un "Interceptor" de peticiones para añadir el token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de respuesta para manejar tokens expirados
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Si el error es 401 (no autorizado), cerrar sesión
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      console.warn('Token expirado o inválido. Cerrando sesión...');
      authStore.logout();

      // Solo redirigir si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// 4. Exportamos la instancia configurada
export default apiClient;
