// src/stores/users.js

import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/usuarios/');
        this.users = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar los usuarios.';
        console.error('Error fetching users:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
