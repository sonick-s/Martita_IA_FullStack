// src/stores/pasos.js
import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const usePasosStore = defineStore('pasos', {
  actions: {
    /**
     * Crea un único paso y lo asocia a un trámite existente.
     * @param {object} pasoData - Debe contener id_tramite, paso y contexto.
     */
    async createPaso(pasoData) {
      try {
        const response = await apiClient.post('/pasos-tramite/', pasoData);
        return response.data; // Devuelve el paso recién creado
      } catch (err) {
        console.error('Error creating paso:', err);
        throw err;
      }
    },
    // Aquí irán luego las acciones de update y delete para pasos individuales
  },
});
