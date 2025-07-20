import { defineStore } from 'pinia';
import apiClient from '@/boot/axios';

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [],
    isLoading: false,
    error: null,
  }),
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
        await apiClient.post('/prompts-bot/', newRule);
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
    async deleteRule(ruleId) {
      try {
        await apiClient.delete(`/prompts-bot/${ruleId}`);
        await this.fetchRules();
      } catch (err) {
        console.error('Error deleting rule:', err);
        throw err;
      }
    },
  },
});
