
import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    refreshToken: sessionStorage.getItem('refreshToken') || null,
    userId: sessionStorage.getItem('userId') || null,
    userEmail: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const loginData = { email, password };
      try {
        const response = await apiClient.post('/login', loginData);

        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        const userId = response.data.user_id;

        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('userId', userId);

        await this.fetchUser();
      } catch (error) {
        console.error('❌ Fallo en la acción de login o al obtener el usuario:', error);
        this.logout();
        throw new Error('Error de autenticación o al cargar datos del usuario.');
      }
    },

    async fetchUser() {
      if (!this.token || !this.userId) return;

      try {
        const response = await apiClient.get(`/usuarios/${this.userId}`);
        this.userEmail = response.data.email;
      } catch (error) {
        console.error('No se pudieron obtener los datos del usuario:', error);
        this.logout();
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.userEmail = null;
      this.userId = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userId');
    },

    setToken(token) {
      this.token = token;
      sessionStorage.setItem('token', token);
    },

    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
      sessionStorage.setItem('refreshToken', refreshToken);
    },

    async register(name, email, password, adminUsername = 'admin', adminPassword = 'admin123') {
      try {
        const registerData = {
          nombre: name,
          email: email,
          password: password,
          admin_username: adminUsername,
          admin_password: adminPassword,
          fecha_registro: new Date().toISOString()
        };
        
        await apiClient.post('/usuarios/', registerData);
        await this.login(email, password);
      } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
      }
    },
  },
});
