import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useRequisitosStore = defineStore('requisitos', {
  actions: {
    /**
     * Crea un único requisito y lo asocia a un trámite existente.
     * @param {object} requisitoData - Debe contener id_tramite, requisito y contexto.
     * @returns {Promise<object>} El requisito recién creado.
     */
    async createRequisito(requisitoData) {
      const response = await apiClient.post('/requisitos-tramite/', requisitoData);
      return response.data;
    },

    /**
     * Actualiza un requisito existente.
     * @param {number} id - El ID del requisito a actualizar.
     * @param {object} data - Los datos a actualizar.
     * @returns {Promise<object>} El requisito actualizado.
     */
    async updateRequisito(id, data) {
      const response = await apiClient.put(`/requisitos-tramite/${id}`, data);
      return response.data;
    },

    /**
     * Elimina un requisito por su ID.
     * @param {number} id - El ID del requisito a eliminar.
     */
    async deleteRequisito(id) {
      await apiClient.delete(`/requisitos-tramite/${id}`);
    },
  },
});
