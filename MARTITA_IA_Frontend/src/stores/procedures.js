import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useProceduresStore = defineStore('procedures', {
  state: () => ({
    procedures: [],
    activeProcedure: null, // Para guardar el trámite que se está editando
    isLoading: false,
    error: null,
  }),

  actions: {
    /**
     * Obtiene la lista completa de trámites desde la API.
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
     * Obtiene un solo trámite por su ID y lo guarda en el estado.
     * @param {number} procedureId - El ID del trámite a obtener.
     */
    async fetchProcedureById(procedureId) {
      this.isLoading = true;
      this.activeProcedure = null;
      this.error = null;
      try {
        const response = await apiClient.get(`/tramites/${procedureId}`);
        this.activeProcedure = response.data;
      } catch (err) {
        this.error = 'No se pudo cargar el trámite seleccionado.';
        console.error('Error fetching procedure by id:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Envía los datos de un nuevo trámite a la API para su creación.
     * @param {object} newProcedure - El objeto con los datos del nuevo trámite.
     */
    async createProcedure(newProcedure) {
      this.isLoading = true;
      try {
        // La API devuelve el objeto creado, lo capturamos en la respuesta
        const response = await apiClient.post('/tramites/', newProcedure);

        // Actualizamos la lista de trámites en segundo plano
        this.fetchProcedures();

        // DEVOLVEMOS el nuevo trámite con su ID para que el modal pueda usarlo
        return response.data;
      } catch (err) {
        console.error('Error creating procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },


    /**
     * Envía los datos actualizados de un trámite a la API.
     * @param {object} procedureToUpdate - El objeto del trámite con los datos modificados.
     */
    async updateProcedure(procedureToUpdate) {
      this.isLoading = true;
      const { id_tramite, ...data } = procedureToUpdate;
      try {
        await apiClient.put(`/tramites/${id_tramite}`, data);
        await this.fetchProcedures(); // Recargamos la lista para ver los cambios
      } catch (err) {
        console.error('Error updating procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Envía una petición para eliminar un trámite por su ID.
     * @param {number} procedureId - El ID del trámite a eliminar.
     */
    async deleteProcedure(procedureId) {
      this.isLoading = true;
      try {
        await apiClient.delete(`/tramites/${procedureId}`);
        await this.fetchProcedures(); // Recargamos la lista
      } catch (err) {
        console.error('Error deleting procedure:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
