import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useDirectionsStore = defineStore('directions', {
  state: () => ({
    directions: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    // Getter para obtener solo las direcciones activas
    activeDirections: (state) => {
      return state.directions.filter(dir => dir.estado === 1);
    },
    // Getter para mapear IDs a nombres, útil para la tabla de trámites
    directionMap: (state) => {
      return state.directions.reduce((map, dir) => {
        map[dir.id_direcciones] = dir.nombre;
        return map;
      }, {});
    }
  },

  actions: {
    async fetchDirections() {
      this.isLoading = true;
      try {
        const response = await apiClient.get('/direcciones/');
        this.directions = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar las direcciones.';
      } finally {
        this.isLoading = false;
      }
    },

    async createDirection(data) {
      // Aseguramos que el estado por defecto sea 1
      await apiClient.post('/direcciones/', data);
      await this.fetchDirections();
    },

    async updateDirection(data) {
      const { id_direcciones, ...updateData } = data;
      await apiClient.put(`/direcciones/${id_direcciones}`, updateData);
      await this.fetchDirections();
    },

    // CAMBIO: 'delete' ahora es 'deactivate'
    async deactivateDirection(id) {
      await apiClient.put(`/direcciones/${id}`, { estado: 0 });
      await this.fetchDirections();
    },

    // NUEVA ACCIÓN: Para reactivar
    async activateDirection(id) {
      await apiClient.put(`/direcciones/${id}`, { estado: 1 });
      await this.fetchDirections();
    },
  },
});
