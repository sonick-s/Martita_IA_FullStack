import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const usePasosStore = defineStore('pasos', {
  actions: {
    /**
     * Crea un único paso y lo asocia a un trámite existente.
     * @param {object} pasoData - Debe contener id_tramite, paso y contexto.
     * @returns {Promise<object>} El paso recién creado.
     */
    async createPaso(pasoData) {
      const response = await apiClient.post('/pasos-tramite/', pasoData);
      return response.data;
    },

    /**
     * Actualiza un paso existente.
     * @param {number} id - El ID del paso a actualizar.
     * @param {object} data - Los datos a actualizar.
     * @returns {Promise<object>} El paso actualizado.
     */
    async updatePaso(id, data) {
      const response = await apiClient.put(`/pasos-tramite/${id}`, data);
      return response.data;
    },

    /**
     * Elimina un paso por su ID.
     * @param {number} id - El ID del paso a eliminar.
     */
    async deletePaso(id) {
      await apiClient.delete(`/pasos-tramite/${id}`);
    },
  },
});
