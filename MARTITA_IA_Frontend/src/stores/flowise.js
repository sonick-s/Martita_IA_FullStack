// src/stores/flowise.js

import { defineStore } from 'pinia';
import apiClient from '@/boot/axios'; // Reutilizamos tu instancia de axios

export const useFlowiseStore = defineStore('flowise', {
  state: () => ({
    isLoading: false,
    error: null,
    responseMessage: null, // Para guardar la respuesta de Flowise
  }),

  actions: {
    /**
     * Llama a la API de Flowise para actualizar la memoria.
     */
    async updateMemory() {
      this.isLoading = true;
      this.error = null;
      this.responseMessage = null;

      try {
        // 👇 CAMBIO: Construimos la URL dinámicamente
        const apiHost = import.meta.env.VITE_FLOWISE_API_HOST;
        const chatflowId = import.meta.env.VITE_FLOWISE_CHATFLOW_ID;
        const apiKey = import.meta.env.VITE_FLOWISE_API_KEY;

        const apiUrl = `${apiHost}/api/v1/prediction/${chatflowId}`;

        const body = {
          question: "Por favor, actualiza tu memoria con la información más reciente de la base de datos.",
        };

        const response = await apiClient.post(apiUrl, body, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        this.responseMessage = response.data;
        console.log('Respuesta de Flowise:', this.responseMessage);

      } catch (err) {
        this.error = 'No se pudo conectar con la API de Flowise.';
        console.error('Error al llamar a Flowise:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
