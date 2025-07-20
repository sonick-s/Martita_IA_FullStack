
import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
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
        const userId = response.data.user_id;


        this.token = token;
        this.userId = userId;
        sessionStorage.setItem('token', token);
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
      this.userEmail = null;
      this.userId = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    },

    async register(name, email, password) {
      try {
        await apiClient.post('/usuarios/', { nombre: name, email, password });
        await this.login(email, password);
      } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
      }
    },
  },
});
