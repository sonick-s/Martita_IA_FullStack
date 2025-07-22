import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';
import { useAuthStore } from './auth'; // Importamos la tienda de auth

export const useUsersStore = defineStore('users', {
  state: () => ({
    profile: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchProfile() {
      const authStore = useAuthStore();
      const userId = authStore.userId; // Obtenemos el ID del usuario logueado

      if (!userId) {
        this.error = "No se encontró el ID del usuario para cargar el perfil.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        // Usamos el endpoint que tú indicaste, con el ID del usuario
        const response = await apiClient.get(`/usuarios/${userId}`);
        this.profile = response.data;
      } catch (err) {
        this.error = 'No se pudo cargar el perfil del usuario.';
        console.error('Error fetching profile:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async updateProfile(profileData) {
      if (!this.profile) return;
      this.isLoading = true;
      try {
        const response = await apiClient.put(`/usuarios/${this.profile.id_usuario}`, profileData);
        this.profile = response.data;
      } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
