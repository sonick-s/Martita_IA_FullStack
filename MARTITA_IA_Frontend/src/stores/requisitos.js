// src/stores/requisitos.js
import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useRequisitosStore = defineStore('requisitos', {
  actions: {
    /**
     * Crea un único requisito y lo asocia a un trámite existente.
     * @param {object} requisitoData - Debe contener id_tramite, requisito y contexto.
     */
    async createRequisito(requisitoData) {
      try {
        const response = await apiClient.post('/requisitos-tramite/', requisitoData);
        return response.data; // Devuelve el requisito recién creado
      } catch (err) {
        console.error('Error creating requisito:', err);
        throw err;
      }
    },
    // Aquí irán luego las acciones de update y delete para requisitos individuales
  },
});
