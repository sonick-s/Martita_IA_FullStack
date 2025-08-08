<template>
  <div class="history-view">
    <header class="view-header">
      <h1>Historial de Mensajes</h1>
      <button class="action-btn" @click="refreshData">🔄 Actualizar Historial</button>
    </header>

    <section class="history-section">
      <h2>Historial Completo ({{ historyStore.totalInteractions }} interacciones)</h2>
      <div class="table-container">
        <div v-if="historyStore.isLoading" class="loading-message">Cargando...</div>
        <table v-else-if="sortedHistory.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pregunta del Usuario</th>
              <th>Respuesta del Bot</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedHistory" :key="item.id_interaccion">
              <td>{{ item.id_interaccion }}</td>
              <td class="content-cell">{{ item.pregunta }}</td>
              <td class="content-cell">{{ item.respuesta }}</td>
              <td>{{ formatDate(item.fecha) }}</td>
              <td class="actions-cell">
                <button class="table-action-btn delete" @click="openConfirmDeleteModal(item)">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-message">No hay interacciones en el historial.</div>
      </div>
    </section>

    <ConfirmationModal
      v-if="isConfirmModalOpen"
      title="Confirmar Eliminación"
      :message="`¿Estás seguro de que quieres eliminar la interacción #${itemToDelete?.id_interaccion}?`"
      @cancel="closeConfirmModal"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useHistoryStore } from '@/stores/history';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const historyStore = useHistoryStore();

const sortedHistory = computed(() => historyStore.sortedInteractions);

// --- Lógica para el Modal de Confirmación ---
const isConfirmModalOpen = ref(false);
const itemToDelete = ref(null);

const openConfirmDeleteModal = (interaction) => {
  itemToDelete.value = interaction;
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  itemToDelete.value = null;
};

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return;
  await historyStore.deleteInteraction(itemToDelete.value.id_interaccion);
  closeConfirmModal();
};

// --- Funciones de Datos ---
const refreshData = () => {
  historyStore.fetchHistory();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('es-ES');
};

// Carga el historial inicial
onMounted(() => {
  historyStore.fetchHistory();
});

// Observa si el número total de interacciones cambia para refrescar la lista
watch(() => historyStore.totalInteractions, () => {
  refreshData();
});
</script>

<style scoped>
.history-view {
  font-family: sans-serif;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3aa873;
}

.history-section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.table-container {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

td {
  color: #2c3e50;
}

th {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.content-cell {
  max-width: 350px;
  white-space: normal; /* Permite que el texto se ajuste si es muy largo */
}

.like-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.like-badge.like {
  background-color: #e7f5ec;
  color: #28a745;
}

.like-badge.dislike {
  background-color: #f8d7da;
  color: #dc3545;
}

.like-badge.n-a {
  background-color: #e9ecef;
  color: #6c757d;
}

.loading-message, .error-message, .empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
}
</style>
