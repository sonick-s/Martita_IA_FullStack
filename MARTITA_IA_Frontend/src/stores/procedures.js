import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useProceduresStore = defineStore('procedures', {
  state: () => ({
    procedures: [],
    activeProcedure: null,
    isLoading: false,
    error: null,
  }),

  // 👇 YA NO NECESITAMOS EL GETTER, TRABAJAREMOS CON LA LISTA COMPLETA
  // getters: { ... },

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
     * Obtiene un solo trámite con TODOS sus detalles.
     */
    async fetchProcedureById(procedureId) {
      this.isLoading = true;
      this.activeProcedure = null;
      this.error = null;
      try {
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

    async updateProcedure(procedureToUpdate) {
      const { id_tramite, ...data } = procedureToUpdate;
      await apiClient.put(`/tramites/${id_tramite}`, data);
    },

    /**
     * Desactiva un trámite cambiando su estado a -1 (borrado lógico).
     */
    async deactivateProcedure(procedureId) {
      this.isLoading = true;
      try {
        await apiClient.put(`/tramites/${procedureId}`, { estado: -1 });
        await this.fetchProcedures();
      } catch (err) {
        this.error = 'No se pudo desactivar el trámite.';
        console.error('Error deactivating procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // 👇 NUEVA ACCIÓN PARA REACTIVAR
    /**
     * Activa un trámite cambiando su estado a 1.
     * @param {number} procedureId - El ID del trámite a activar.
     */
    async activateProcedure(procedureId) {
      this.isLoading = true;
      try {
        await apiClient.put(`/tramites/${procedureId}`, { estado: 1 });
        await this.fetchProcedures();
      } catch (err) {
        this.error = 'No se pudo activar el trámite.';
        console.error('Error activating procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
