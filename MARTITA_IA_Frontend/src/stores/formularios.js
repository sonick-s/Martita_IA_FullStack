import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useFormulariosStore = defineStore('formularios', {
  actions: {
    /**
     * Crea un único formulario y lo asocia a un trámite existente.
     * @param {object} formularioData - Debe contener id_tramite, url y contexto.
     * @returns {Promise<object>} El formulario recién creado.
     */
    async createFormulario(formularioData) {
      const response = await apiClient.post('/formularios-tramite/', formularioData);
      return response.data;
    },

    /**
     * Actualiza un formulario existente.
     * @param {number} id - El ID del formulario a actualizar.
     * @param {object} data - Los datos a actualizar.
     * @returns {Promise<object>} El formulario actualizado.
     */
  async updateFormulario(formData) {
  const { id_formulario, ...data } = formData;
  const response = await apiClient.put(`/formularios-tramite/${id_formulario}`, data);
  return response.data;
},

    /**
     * Elimina un formulario por su ID.
     * @param {number} id - El ID del formulario a eliminar.
     */
    async deleteFormulario(id) {
      await apiClient.delete(`/formularios-tramite/${id}`);
    },
  },
});
