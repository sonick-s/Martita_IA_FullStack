import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useHistoryStore = defineStore('history', {
  /**
   * State: Almacena el historial de interacciones guardado en la base de datos.
   */
  state: () => ({
    interactions: [],
    isLoading: false,
    error: null,
  }),

  /**
   * Getters: Proporcionan datos computados derivados del estado.
   */
  getters: {
    /**
     * Devuelve las interacciones ordenadas de la más reciente a la más antigua.
     */
    sortedInteractions: (state) => {
      // Usamos slice() para crear una copia y no modificar el estado original
      return state.interactions.slice().sort((a, b) => {
        // Asumiendo que tu backend devuelve un ID o una fecha que se puede ordenar
        return b.id_interaccion - a.id_interaccion;
      });
    },
    /**
     * Devuelve el número total de interacciones guardadas.
     */
    totalInteractions: (state) => {
      return state.interactions.length;
    }
  },

  /**
   * Actions: Contiene las funciones para interactuar con la API del historial.
   */
  actions: {
    /**
     * Carga todo el historial de interacciones desde el backend.
     */
    async fetchHistory() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/interacciones/');
        this.interactions = response.data;
      } catch (err) {
        this.error = 'No se pudo cargar el historial de mensajes.';
        console.error('Error fetching history:', err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Elimina una interacción específica de la base de datos por su ID.
     * @param {number} interactionId - El ID de la interacción a eliminar.
     */
    async deleteInteraction(interactionId) {
      try {
        await apiClient.delete(`/interacciones/${interactionId}`);
        // Refresca la lista local eliminando la interacción para una respuesta visual instantánea
        this.interactions = this.interactions.filter(
          interaction => interaction.id_interaccion !== interactionId
        );
      } catch (err) {
        console.error('Error deleting interaction:', err);
        throw err; // Lanza el error para que el componente pueda manejarlo
      }
    },

    /**
     * Elimina TODO el historial de la base de datos.
     * Útil para funciones de administrador.
     */
    async deleteAllInteractions() {
        try {
            console.log(`🗑️ Iniciando eliminación de ${this.interactions.length} interacciones...`);
            
            // Verificar si hay un endpoint para eliminar todas las interacciones
            try {
                // Intentar eliminar todas de una vez si el backend lo soporta
                await apiClient.delete('/interacciones/all');
                console.log('✅ Todas las interacciones eliminadas con endpoint bulk');
            } catch (bulkError) {
                console.log('⚠️ Endpoint bulk no disponible, eliminando una por una...');
                // Fallback: eliminar todas las interacciones una por una
                const deletePromises = this.interactions.map(interaction => 
                    apiClient.delete(`/interacciones/${interaction.id_interaccion}`)
                );
                await Promise.all(deletePromises);
                console.log('✅ Todas las interacciones eliminadas individualmente');
            }
            
            // Limpiar el estado local
            this.interactions = [];
            console.log('🧹 Estado local limpiado');
            
        } catch(err) {
            console.error('❌ Error deleting all interactions:', err);
            throw err;
        }
    },

    /**
     * Limpia el historial local sin hacer llamadas al backend.
     * Útil para limpiar datos previos antes de cargar nuevos.
     */
    clearHistory() {
        this.interactions = [];
        this.error = null;
    },

    /**
     * Inicia actualización automática del historial cada cierto tiempo
     * @param {number} intervalMs - Intervalo en milisegundos (por defecto 30 segundos)
     */
    startAutoRefresh(intervalMs = 30000) {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        console.log(`🔄 Iniciando actualización automática del historial cada ${intervalMs/1000} segundos`);
        this.autoRefreshInterval = setInterval(() => {
            if (!this.isLoading) {
                console.log('🔄 Actualización automática del historial...');
                this.fetchHistory();
            }
        }, intervalMs);
    },

    /**
     * Detiene la actualización automática del historial
     */
    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
            console.log('⏹️ Actualización automática del historial detenida');
        }
    },

    /**
     * (Opcional) Elimina TODO el historial de la base de datos usando un endpoint específico.
     * Útil para funciones de administrador si el backend tiene un endpoint dedicado.
     */
    async clearAllHistory() {
        try {
            // Aquí llamarías a un endpoint de tu API diseñado para borrar todo
            // await apiClient.delete('/interacciones/clear-all');
            this.interactions = [];
        } catch(err) {
            console.error('Error clearing all history:', err);
            throw err;
        }
    }
  },
});
