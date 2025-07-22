import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useProceduresStore = defineStore('procedures', {
  state: () => ({
    procedures: [],
    activeProcedure: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    /**
     * Obtiene la lista simple de todos los trámites.
     */
    async fetchProcedures() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/tramites/');
        this.procedures = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar los trámites.';
        console.error('Error fetching procedures:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtiene un solo trámite con TODOS sus detalles usando el nuevo endpoint.
     * @param {number} procedureId - El ID del trámite a obtener.
     */
    async fetchProcedureById(procedureId) {
      this.isLoading = true;
      this.activeProcedure = null;
      this.error = null;
      try {
        // --- CAMBIO CLAVE AQUÍ ---
        // Apuntamos al nuevo endpoint para obtener la estructura completa.
        const response = await apiClient.get(`/construir-tramite/estructurado/${procedureId}`);
        this.activeProcedure = response.data;
      } catch (err) {
        this.error = 'No se pudo cargar el trámite seleccionado.';
        console.error('Error fetching procedure by id:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Crea solo el trámite principal.
     */
    async createProcedure(newProcedureData) {
      this.isLoading = true;
      try {
        const response = await apiClient.post('/tramites/', newProcedureData);
        await this.fetchProcedures();
        return response.data;
      } catch (err) {
        console.error('Error creating procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Las funciones de update y delete se mantienen igual por ahora.
    async updateProcedure(procedureToUpdate) {
      const { id_tramite, ...data } = procedureToUpdate;
      await apiClient.put(`/tramites/${id_tramite}`, data);
    },

    async deleteProcedure(procedureId) {
      await apiClient.delete(`/tramites/${procedureId}`);
      await this.fetchProcedures();
    },
  },
});
