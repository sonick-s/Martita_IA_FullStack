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
     * Sincroniza los datos de la base de datos con Flowise usando vector/upsert.
     */
    async updateMemory() {
      this.isLoading = true;
      this.error = null;
      this.responseMessage = null;

      try {
        // 👇 CAMBIO: Construimos la URL dinámicamente usando las variables del .env raíz
        const apiHost = import.meta.env.VITE_FLOWISE_API_HOST;
        const chatflowId = import.meta.env.VITE_FLOWISE_CHATFLOW_ID;
        const apiKey = import.meta.env.VITE_FLOWISE_API_KEY;

        // Validar que las variables de entorno estén definidas
        if (!apiHost || !chatflowId || !apiKey) {
          throw new Error('Variables de entorno de Flowise no configuradas correctamente');
        }

        // Primero, obtener todos los datos de la base de datos
        const proceduresData = await this.fetchProceduresData();
        const directionsData = await this.fetchDirectionsData();

        // Crear el contenido para sincronizar
        const syncContent = this.createSyncContent(proceduresData, directionsData);

        // Crear FormData para enviar a Flowise
        const formData = new FormData();
        const blob = new Blob([syncContent], { type: 'text/plain' });
        formData.append("files", blob, "database_sync.txt");
        formData.append("method", "upsert");
        formData.append("url", `${apiHost}/api/v1/vector/upsert/${chatflowId}`);

        // Llamar a la API de vector/upsert de Flowise
        const vectorUrl = `${apiHost}/api/v1/vector/upsert/${chatflowId}`;

        const response = await fetch(vectorUrl, {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error en la sincronización: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        this.responseMessage = result;
        console.log('Sincronización completada:', this.responseMessage);

      } catch (err) {
        this.error = 'No se pudo sincronizar con la base de datos de Flowise.';
        console.error('Error al sincronizar con Flowise:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtiene los datos de trámites desde la API
     */
    async fetchProceduresData() {
      try {
        const response = await apiClient.get('/tramites/');
        return response.data;
      } catch (error) {
        console.error('Error al obtener trámites:', error);
        return [];
      }
    },

    /**
     * Obtiene los datos de direcciones desde la API
     */
    async fetchDirectionsData() {
      try {
        const response = await apiClient.get('/direcciones/');
        return response.data;
      } catch (error) {
        console.error('Error al obtener direcciones:', error);
        return [];
      }
    },

    /**
     * Crea el contenido de sincronización con formato estructurado
     */
    createSyncContent(procedures, directions) {
      let content = "INFORMACIÓN ACTUALIZADA DEL GAD DE CAYAMBE\n";
      content += "=============================================\n\n";

      // Información de direcciones
      content += "DIRECCIONES:\n";
      content += "------------\n";
      directions.forEach(dir => {
        if (dir.estado === 1) {
          content += `• ${dir.nombre}\n`;
          content += `  Descripción: ${dir.descripcion || 'Sin descripción'}\n`;
          content += `  Responsable: ${dir.responsable || 'N/A'}\n`;
          content += `  Email: ${dir.correo_responsable || 'N/A'}\n`;
          content += `  Teléfono: ${dir.telefono || 'N/A'}\n\n`;
        }
      });

      // Información de trámites
      content += "TRÁMITES:\n";
      content += "---------\n";
      procedures.forEach(proc => {
        if (proc.estado === 1) {
          const direction = directions.find(d => d.id_direcciones === proc.id_direcciones);
          const directionName = direction ? direction.nombre : 'N/A';

          content += `• ${proc.nombre}\n`;
          content += `  Dirección: ${directionName}\n`;
          content += `  Descripción: ${proc.descripcion || 'Sin descripción'}\n`;
          content += `  Requisitos: ${proc.requisitos || 'No especificados'}\n`;
          content += `  Pasos: ${proc.pasos || 'No especificados'}\n\n`;
        }
      });

      return content;
    },

    /**
     * Prueba la conectividad con Flowise
     */
    async testFlowiseConnection() {
      try {
        const apiHost = import.meta.env.VITE_FLOWISE_API_HOST;
        const chatflowId = import.meta.env.VITE_FLOWISE_CHATFLOW_ID;
        const apiKey = import.meta.env.VITE_FLOWISE_API_KEY;

        console.log('=== DEBUG FLOWISE CONNECTION ===');
        console.log('API Host:', apiHost);
        console.log('Chatflow ID:', chatflowId);
        console.log('API Key:', apiKey ? 'Configurado' : 'No configurado');

        if (!apiHost || !chatflowId || !apiKey) {
          throw new Error('Variables de entorno no configuradas');
        }

        // Probar conectividad básica
        const testUrl = `${apiHost}/api/v1/chatflows`;
        console.log('Probando URL:', testUrl);

        const response = await fetch(testUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        console.log('Respuesta:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Error de conectividad: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error('Error de conectividad con Flowise:', error);
        return false;
      }
    },

    /**
     * Función de debug para mostrar información del estado
     */
    debugEnvironment() {
      console.log('=== DEBUG ENVIRONMENT ===');
      console.log('Variables de entorno:');
      console.log('- VITE_FLOWISE_API_HOST:', import.meta.env.VITE_FLOWISE_API_HOST);
      console.log('- VITE_FLOWISE_CHATFLOW_ID:', import.meta.env.VITE_FLOWISE_CHATFLOW_ID);
      console.log('- VITE_FLOWISE_API_KEY:', import.meta.env.VITE_FLOWISE_API_KEY ? 'Configurado' : 'No configurado');
      console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('Estado del store:');
      console.log('- isLoading:', this.isLoading);
      console.log('- error:', this.error);
      console.log('- responseMessage:', this.responseMessage);
      console.log('=======================');
    },
  },
});
