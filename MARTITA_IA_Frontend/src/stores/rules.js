import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [],
    isLoading: false,
    error: null,
  }),

  // 👇 AÑADIMOS GETTERS PARA FILTRAR LAS REGLAS
  getters: {
    /**
     * Devuelve solo las reglas que están activas (estado = 1).
     * @param {object} state - El estado actual de la store.
     */
    activeRules: (state) => {
      return state.rules.filter(rule => rule.estado === 1);
    }
  },

  actions: {
    async fetchRules() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/prompts-bot/');
        this.rules = response.data;
      } catch (err) {
        this.error = 'No se pudieron cargar las reglas.';
        console.error('Error fetching rules:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async createRule(newRule) {
      try {
        // Aseguramos que las nuevas reglas se creen como activas por defecto
        await apiClient.post('/prompts-bot/', { ...newRule, estado: 1 });
        await this.fetchRules();
      } catch (err) {
        console.error('Error creating rule:', err);
        throw err;
      }
    },
    async updateRule(ruleToUpdate) {
      const { id_prompt, ...data } = ruleToUpdate;
      try {
        await apiClient.put(`/prompts-bot/${id_prompt}`, data);
        await this.fetchRules();
      } catch (err) {
        console.error('Error updating rule:', err);
        throw err;
      }
    },

    // 👇 CAMBIO: Reemplazamos deleteRule por deactivateRule
    /**
     * Desactiva una regla cambiando su estado a 0.
     * @param {number} ruleId - El ID de la regla a desactivar.
     */
    async deactivateRule(ruleId) {
      try {
        await apiClient.put(`/prompts-bot/${ruleId}`, { estado: 0 });
        await this.fetchRules();
      } catch (err) {
        console.error('Error deactivating rule:', err);
        throw err;
      }
    },

    // 👇 NUEVA ACCIÓN: Para poder reactivar una regla
    /**
     * Activa una regla cambiando su estado a 1.
     * @param {number} ruleId - El ID de la regla a activar.
     */
    async activateRule(ruleId) {
      try {
        await apiClient.put(`/prompts-bot/${ruleId}`, { estado: 1 });
        await this.fetchRules();
      } catch (err) {
        console.error('Error activating rule:', err);
        throw err;
      }
    },
  },
});
