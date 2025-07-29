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
        // Leemos las variables de entorno que configuraste
        const apiUrl = import.meta.env.VITE_FLOWISE_API_URL;
        const apiKey = import.meta.env.VITE_FLOWISE_API_KEY;

        // Preparamos el cuerpo (payload) de la petición.
        // Flowise usualmente espera un objeto con una pregunta o un input.
        // DEBES AJUSTAR ESTO según cómo configuraste tu chatflow.
        const body = {
          question: "Por favor, actualiza tu memoria con la información más reciente de la base de datos.",
        };

        // Hacemos la llamada POST usando apiClient (axios)
        const response = await apiClient.post(apiUrl, body, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        // Guardamos la respuesta y la mostramos en consola
        this.responseMessage = response.data;
        console.log('Respuesta de Flowise:', this.responseMessage);

      } catch (err) {
        this.error = 'No se pudo conectar con la API de Flowise.';
        console.error('Error al llamar a Flowise:', err);
        throw err; // Lanza el error para que el componente lo pueda atrapar
      } finally {
        this.isLoading = false;
      }
    },
  },
});
