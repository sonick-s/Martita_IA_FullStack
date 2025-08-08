<template>
  <div class="history-view">
    <header class="view-header">
      <h1>Historial de Mensajes</h1>
      <div class="header-actions">
        <button class="action-btn" @click="refreshData">🔄 Actualizar</button>
        <button class="action-btn danger" @click="openConfirmDeleteAllModal" :disabled="sortedHistory.length === 0">
          🗑️ Eliminar Todos
        </button>
      </div>
    </header>

    <section class="history-section">
      <h2>Historial Completo ({{ historyStore.totalInteractions }} interacciones)</h2>
      <div class="table-container">
        <div v-if="historyStore.isLoading" class="loading-message">Cargando...</div>
        <table v-else-if="sortedHistory.length > 0" class="desktop-table">
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
        <!-- Mobile Cards View -->
        <div v-else-if="sortedHistory.length > 0" class="mobile-cards">
          <div v-for="item in sortedHistory" :key="item.id_interaccion" class="interaction-card">
            <div class="card-header">
              <span class="card-id">ID: {{ item.id_interaccion }}</span>
              <span class="card-date">{{ formatDate(item.fecha) }}</span>
            </div>
            <div class="card-content">
              <div class="card-question">
                <div class="card-label">Pregunta:</div>
                <div class="card-text">{{ item.pregunta }}</div>
              </div>
              <div class="card-answer">
                <div class="card-label">Respuesta:</div>
                <div class="card-text">{{ item.respuesta }}</div>
              </div>
            </div>
            <div class="card-actions">
              <button class="table-action-btn delete" @click="openConfirmDeleteModal(item)">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-message">No hay interacciones en el historial.</div>
      </div>
    </section>

    <ConfirmationModal
      v-if="isConfirmModalOpen"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
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
const isDeleteAll = ref(false);

const confirmModalData = computed(() => {
  if (isDeleteAll.value) {
    return {
      title: 'Confirmar Eliminación Masiva',
      message: `¿Estás seguro de que quieres eliminar TODAS las ${sortedHistory.value.length} interacciones del historial? Esta acción no se puede deshacer.`
    };
  }
  return {
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de que quieres eliminar la interacción #${itemToDelete.value?.id_interaccion}?`
  };
});

const openConfirmDeleteModal = (interaction) => {
  itemToDelete.value = interaction;
  isDeleteAll.value = false;
  isConfirmModalOpen.value = true;
};

const openConfirmDeleteAllModal = () => {
  isDeleteAll.value = true;
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  itemToDelete.value = null;
  isDeleteAll.value = false;
};

const handleConfirmDelete = async () => {
  try {
    if (isDeleteAll.value) {
      // Eliminar todas las interacciones
      await historyStore.deleteAllInteractions();
    } else if (itemToDelete.value) {
      // Eliminar una interacción específica
      await historyStore.deleteInteraction(itemToDelete.value.id_interaccion);
    }
    closeConfirmModal();
    // Refrescar datos después de eliminar
    await refreshData();
  } catch (error) {
    console.error('Error al eliminar:', error);
    // Aquí podrías mostrar una notificación de error
  }
};

// --- Funciones de Datos ---
const refreshData = () => {
  historyStore.fetchHistory();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida recibida:', dateString);
      return 'Fecha inválida';
    }
    
    // Formatear la fecha en español con fecha y hora
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error, dateString);
    return 'Error en fecha';
  }
};

// Función para actualizar el historial desde el chatbot
const updateHistoryFromChatbot = async () => {
  console.log("🔄 Actualizando historial desde chatbot...");
  await historyStore.fetchHistory();
};

// Carga el historial inicial y limpia datos previos
onMounted(async () => {
  // Limpiar datos previos antes de cargar nuevos
  historyStore.clearHistory();
  await historyStore.fetchHistory();
  
  // Registrar función global para que el chatbot pueda actualizar el historial
  if (typeof window !== 'undefined') {
    window.updateHistoryStore = updateHistoryFromChatbot;
    console.log("📊 Función de actualización de historial registrada globalmente");
  }
  
  // Iniciar actualización automática cada 15 segundos
  historyStore.startAutoRefresh(15000);
  console.log("🔄 Actualización automática del historial activada");
});

// Limpiar intervalos al desmontar el componente
import { onUnmounted } from 'vue';
onUnmounted(() => {
  historyStore.stopAutoRefresh();
  console.log("🛑 Componente desmontado - actualización automática detenida");
});

// Observa si el número total de interacciones cambia para refrescar la lista
watch(() => historyStore.totalInteractions, () => {
  console.log("📈 Cambio detectado en total de interacciones:", historyStore.totalInteractions);
});
</script>

<style scoped>
.history-view {
  font-family: sans-serif;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
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

.header-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
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
  white-space: nowrap;
}

.action-btn:hover {
  background-color: #3aa873;
}

.action-btn.danger {
  background-color: #e74c3c;
}

.action-btn.danger:hover {
  background-color: #c0392b;
}

.action-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.action-btn:disabled:hover {
  background-color: #bdc3c7;
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
  overflow-x: auto;
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

.table-action-btn {
  background-color: transparent;
  border: 1px solid #dee2e6;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.table-action-btn.delete {
  color: #e74c3c;
  border-color: #e74c3c;
}

.table-action-btn.delete:hover {
  background-color: #e74c3c;
  color: white;
}

/* === RESPONSIVE DESIGN === */

/* Tablets */
@media (max-width: 1024px) {
  .table-container {
    padding: 1.5rem;
  }
  
  th, td {
    padding: 0.8rem;
  }
  
  .content-cell {
    max-width: 250px;
  }
}

/* Mobile Landscape */
@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-header h1 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .table-container {
    padding: 1rem;
  }
  
  /* Convertir tabla a cards en móvil */
  table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
  
  .interaction-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 4px solid #42b983;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
  }
  
  .card-id {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .card-date {
    font-size: 0.8rem;
    color: #6c757d;
  }
  
  .card-content {
    margin-bottom: 0.8rem;
  }
  
  .card-question, .card-answer {
    margin-bottom: 0.5rem;
  }
  
  .card-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }
  
  .card-text {
    margin-top: 0.3rem;
    line-height: 1.4;
  }
  
  .card-actions {
    text-align: right;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .view-header h1 {
    font-size: 1.3rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .table-container {
    padding: 0.8rem;
  }
  
  .interaction-card {
    padding: 0.8rem;
  }
  
  .card-label {
    font-size: 0.8rem;
  }
  
  .card-text {
    font-size: 0.9rem;
  }
}

/* Show mobile cards only on mobile */
.mobile-cards {
  display: none;
}

@media (max-width: 768px) {
  .mobile-cards {
    display: block;
  }
}
</style>
