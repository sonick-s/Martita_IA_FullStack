// src/stores/formularios.js

import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useFormulariosStore = defineStore('formularios', {
  actions: {
    /**
     * Crea un único formulario y lo asocia a un trámite existente.
     * @param {object} formularioData - Debe contener id_tramite, url y contexto.
     */
    async createFormulario(formularioData) {
      try {
        const response = await apiClient.post('/formularios-tramite/', formularioData);
        return response.data; // Devuelve el formulario recién creado
      } catch (err) {
        console.error('Error creating formulario:', err);
        throw err;
      }
    },
    // Aquí irán luego las acciones de update y delete para formularios individuales
  },
});
