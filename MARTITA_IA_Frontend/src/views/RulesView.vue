<template>
  <div class="rules-view">
    <header class="view-header">
      <h1>Gestión de Reglas del Bot IA</h1>
      <button class="create-button" @click="openCreateModal">Crear nueva regla</button>
    </header>

    <div class="table-container">
      <div v-if="rulesStore.isLoading" class="loading-message">Cargando reglas...</div>
      <div v-else-if="rulesStore.error" class="error-message">{{ rulesStore.error }}</div>

      <table v-else-if="rulesStore.rules.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Contenido</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in rulesStore.rules" :key="rule.id_prompt">
            <td>{{ rule.id_prompt }}</td>
            <td><strong>{{ rule.nombre }}</strong></td>
            <td>{{ rule.tipo || 'N/A' }}</td>
            <td class="content-cell">{{ rule.contenido }}</td>
            <td>
              <span :class="['status-badge', rule.estado === 1 ? 'active' : 'inactive']">
                {{ rule.estado === 1 ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ formatDate(rule.fecha_creacion) }}</td>
            <td class="actions-cell">
              <button class="action-button edit" @click="openEditModal(rule)">Editar</button>
              <button class="action-button delete" @click="openDeleteConfirm(rule.id_prompt)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-message">No hay reglas para mostrar.</div>
    </div>

    <RuleFormModal
      v-if="isFormModalOpen"
      :rule-to-edit="ruleBeingEdited"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />

    <ConfirmationModal
      v-if="isConfirmModalOpen"
      title="Confirmar Eliminación"
      message="¿Estás seguro de que quieres eliminar esta regla? Esta acción no se puede deshacer."
      @cancel="closeConfirmModal"
      @confirm="confirmDelete"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRulesStore } from '@/stores/rules';
import RuleFormModal from '@/components/RuleFormModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const rulesStore = useRulesStore();

// --- Estados para el Modal de Formulario (Crear/Editar) ---
const isFormModalOpen = ref(false);
const ruleBeingEdited = ref(null);

// --- Estados para el Modal de Confirmación (Eliminar) ---
const isConfirmModalOpen = ref(false);
const ruleIdToDelete = ref(null);

// --- Funciones para el Modal de Formulario ---
const openCreateModal = () => {
  ruleBeingEdited.value = null;
  isFormModalOpen.value = true;
};

const openEditModal = (rule) => {
  ruleBeingEdited.value = rule;
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
  ruleBeingEdited.value = null;
};

const handleFormSubmit = async (ruleData) => {
  try {
    if (ruleBeingEdited.value) {
      await rulesStore.updateRule(ruleData);
    } else {
      await rulesStore.createRule(ruleData);
    }
    closeFormModal();
  } catch (error) {
    console.error("Fallo al guardar la regla desde la vista:", error);
    alert('Ocurrió un error al guardar la regla.');
  }
};

// --- Funciones para el Modal de Confirmación ---
const openDeleteConfirm = (ruleId) => {
  ruleIdToDelete.value = ruleId;
  isConfirmModalOpen.value = true;
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  ruleIdToDelete.value = null;
};

const confirmDelete = async () => {
  if (!ruleIdToDelete.value) return;
  try {
    await rulesStore.deleteRule(ruleIdToDelete.value);
  } catch (error) {
    alert('Error al eliminar la regla.');
    console.error("Fallo al intentar eliminar la regla:", error);
  } finally {
    closeConfirmModal();
  }
};

// --- Hook de Ciclo de Vida ---
// Se ejecuta cuando el componente se carga
onMounted(() => {
  rulesStore.fetchRules();
});

// --- Función de Utilidad ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
</script>

<style scoped>
.rules-view {
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
.create-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.create-button:hover {
  background-color: #34966b;
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
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
}
.status-badge.active {
  background-color: #e7f5ec;
  color: #28a745;
}
.status-badge.inactive {
  background-color: #f8d7da;
  color: #dc3545;
}
.actions-cell {
  display: flex;
  gap: 0.5rem;
}
.action-button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.action-button.edit {
  background-color: #ffc107;
  color: #212529;
}
.action-button.delete {
  background-color: #dc3545;
  color: white;
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
