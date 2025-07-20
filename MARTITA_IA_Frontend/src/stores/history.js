// src/stores/history.js

import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    interactions: [], // Aquí guardaremos la lista de interacciones
    isLoading: false,
    error: null,
  }),

  actions: {
    // Acción para obtener todo el historial de interacciones
    async fetchHistory() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/interacciones/');
        this.interactions = response.data;
      } catch (err) {
        this.error = 'No se pudo cargar el historial de mensajes.';
        console.error('Error fetching history:', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
