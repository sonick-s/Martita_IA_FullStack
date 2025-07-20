import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useDirectionsStore = defineStore('directions', {
  state: () => ({
    directions: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    directionMap(state) {
      const map = {};
      for (const dir of state.directions) {
        map[dir.id_direcciones] = dir.nombre;
      }
      return map;
    },
  },
  actions: {
    async fetchDirections() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/direcciones/');
        this.directions = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar las direcciones.';
        console.error('Error fetching directions:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async createDirection(newDirection) {
      try {
        await apiClient.post('/direcciones/', newDirection);
        await this.fetchDirections();
      } catch (err) {
        console.error('Error creating direction:', err);
        throw err;
      }
    },
    async updateDirection(directionToUpdate) {
      this.isLoading = true;
      const { id_direcciones, ...data } = directionToUpdate;

      try {
        await apiClient.put(`/direcciones/${id_direcciones}`, data);
        await this.fetchDirections(); // Recargamos para ver los cambios
      } catch (err) {
        this.error = 'No se pudo actualizar la dirección.';
        console.error('Error updating direction:', err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteDirection(directionId) {
      this.isLoading = true;
      try {
        await apiClient.delete(`/direcciones/${directionId}`);
        // Después de eliminar, recargamos la lista para actualizar las tarjetas.
        await this.fetchDirections();
      } catch (err) {
        this.error = 'No se pudo eliminar la dirección.';
        console.error('Error deleting direction:', err);
        throw err; // Lanzamos el error para que la vista lo sepa.
      } finally {
        this.isLoading = false;
      }
    },
  },
});
