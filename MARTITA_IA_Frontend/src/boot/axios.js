import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// 1. Creamos una instancia de Axios con la configuración base
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // La URL raíz de tu API
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

// 3. Exportamos la instancia configurada
export default apiClient;
