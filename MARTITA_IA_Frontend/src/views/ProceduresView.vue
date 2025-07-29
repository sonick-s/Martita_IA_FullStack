<template>
  <div class="procedures-view">
    <header class="main-header">
      <h1 class="main-title">Gestión de Trámites y Direcciones</h1>
      <div class="top-actions">
        <button class="action-btn memory-btn" @click="handleUpdateMemory" :disabled="flowiseStore.isLoading">
          {{ flowiseStore.isLoading ? 'Actualizando...' : '🧠 Actualizar Memoria' }}
        </button>
        <button class="action-btn" @click="openCreateProcedureModal">+ Crear Trámite</button>
        <button class="action-btn" @click="openCreateDirectionModal">+ Crear Dirección</button>
      </div>
    </header>

    <section class="section-container">
      <h2 class="section-title">Direcciones</h2>
      <div v-if="directionsStore.isLoading" class="loading-message">Cargando...</div>
      <div v-else-if="allDirections.length > 0" class="directions-grid">
        <div v-for="dir in allDirections" :key="dir.id_direcciones" class="direction-card"
          :class="{ 'is-inactive': dir.estado === 0, 'is-clickable': dir.estado === 1 }"
          @click="dir.estado === 1 ? openProceduresModal(dir) : null">
          <div class="card-header">
            <h3>{{ dir.nombre }}</h3>
          </div>
          <template v-if="dir.estado === 1">
            <div class="card-body">
              <p class="description">{{ dir.descripcion || 'Sin descripción.' }}</p>
              <div class="card-details">
                <p class="detail-item"><strong>👤 Responsable:</strong> {{ dir.responsable || 'N/A' }}</p>
                <p class="detail-item"><strong>✉️ Email:</strong> {{ dir.correo_responsable || 'N/A' }}</p>
                <p class="detail-item"><strong>📞 Teléfono:</strong> {{ dir.telefono || 'N/A' }}</p>
              </div>
            </div>
            <div class="card-footer">
              <button class="card-action-btn edit" @click.stop="openEditDirectionModal(dir)">📝 Editar</button>
              <button class="card-action-btn delete"
                @click.stop="openDeleteConfirm(dir.id_direcciones, 'direction', dir.nombre)">🗑️ Desactivar</button>
            </div>
          </template>
          <template v-else>
            <div class="inactive-overlay">
              <button class="card-action-btn activate-center"
                @click.stop="directionsStore.activateDirection(dir.id_direcciones)">
                🔄 Reactivar Dirección
              </button>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="empty-message">No hay direcciones. Crea una para empezar.</div>
    </section>

    <section class="section-container">
      <div class="section-header">
        <h2 class="section-title">Trámites</h2>
        <button v-if="filteredDirectionId" @click="filteredDirectionId = null" class="clear-filter-btn">Mostrar
          Todos</button>
      </div>
      <div class="table-container">
        <div v-if="proceduresStore.isLoading" class="loading-message">Cargando...</div>
        <table v-else-if="displayedProcedures.length > 0" ref="proceduresTable">
          <thead>
            <tr>
              <th>Dirección</th>
              <th>Trámite</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proc in displayedProcedures" :key="proc.id_tramite"
              :class="{ 'is-inactive': proc.estado === 0 }">
              <td>{{ directionsStore.directionMap[proc.id_direcciones] || 'N/A' }}</td>
              <td><strong>{{ proc.nombre }}</strong></td>
              <td class="description-cell">{{ proc.descripcion }}</td>
              <td>
                <span :class="['status-badge', proc.estado === 1 ? 'status-active' : 'status-inactive']">
                  {{ proc.estado === 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="actions-cell">
                <template v-if="proc.estado === 1">
                  <router-link :to="{ name: 'procedure-editor', params: { id: proc.id_tramite } }"
                    class="table-action-btn edit">📝 Editar</router-link>
                  <button class="table-action-btn delete"
                    @click="openDeleteConfirm(proc.id_tramite, 'procedure', proc.nombre)">🗑️ Desactivar</button>
                </template>
                <template v-else>
                  <button class="table-action-btn activate"
                    @click="proceduresStore.activateProcedure(proc.id_tramite)">🔄 Reactivar</button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-message">No hay trámites para mostrar.</div>
      </div>
    </section>

    <ProcedureWizardModal v-if="isWizardModalOpen" :directions="directionsStore.activeDirections"
      @close="closeCreateProcedureModal" />
    <DirectionFormModal v-if="isDirectionModalOpen" :direction-to-edit="directionBeingEdited"
      @close="closeDirectionModal" @submit="handleDirectionFormSubmit" />
    <ConfirmationModal v-if="isConfirmModalOpen" :title="confirmModalTitle" :message="confirmModalMessage"
      @cancel="closeConfirmModal" @confirm="confirmDelete" />
    <ProceduresListModal v-if="isProceduresModalOpen" :direction="selectedDirection" :procedures="displayedProcedures"
      @close="isProceduresModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, inject } from 'vue';
import { useProceduresStore } from '@/stores/procedures';
import { useDirectionsStore } from '@/stores/directions';
import { useFlowiseStore } from '@/stores/flowise';
import DirectionFormModal from '@/components/DirectionFormModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import ProcedureWizardModal from '@/components/ProcedureWizardModal.vue';
import ProceduresListModal from '@/components/ProceduresListModal.vue';

// --- Inicialización de Stores y Servicios ---
const proceduresStore = useProceduresStore();
const directionsStore = useDirectionsStore();
const flowiseStore = useFlowiseStore();
const addNotification = inject('addNotification'); // Obtiene la función global de notificaciones

// --- Lógica del Botón "Actualizar Memoria" ---
const handleUpdateMemory = async () => {
  addNotification('Iniciando la actualización de la memoria...', 'info');
  try {
    await flowiseStore.updateMemory();
    addNotification('¡Memoria actualizada correctamente!', 'success');
  } catch (error) {
    addNotification('Ocurrió un error al actualizar la memoria.', 'error');
  }
};

// --- Referencias y Estados ---
const itemToDelete = ref({ id: null, type: null, name: '' });
const proceduresTable = ref(null);
const isWizardModalOpen = ref(false);
const isDirectionModalOpen = ref(false);
const directionBeingEdited = ref(null);
const isConfirmModalOpen = ref(false);
const selectedDirection = ref(null);
const isProceduresModalOpen = ref(false);
const filteredDirectionId = ref(null);

// --- Lógica de Filtro y Visualización (Propiedades Computadas) ---
const allDirections = computed(() => directionsStore.directions);
const displayedProcedures = computed(() => {
  if (!filteredDirectionId.value) return proceduresStore.procedures;
  return proceduresStore.procedures.filter(p => p.id_direcciones === filteredDirectionId.value);
});
const confirmModalTitle = computed(() => `Confirmar Desactivación`);
const confirmModalMessage = computed(() => `¿Estás seguro de que quieres desactivar "${itemToDelete.value.name}"?`);

// --- Manejadores de Eventos y Modales ---
const openDeleteConfirm = (id, type, name) => {
  itemToDelete.value = { id, type, name };
  isConfirmModalOpen.value = true;
};
const closeConfirmModal = () => { isConfirmModalOpen.value = false; };
const confirmDelete = async () => {
  if (!itemToDelete.value.id) return;
  try {
    if (itemToDelete.value.type === 'procedure') {
      await proceduresStore.deactivateProcedure(itemToDelete.value.id);
    } else if (itemToDelete.value.type === 'direction') {
      await directionsStore.deactivateDirection(itemToDelete.value.id);
    }
    addNotification(`"${itemToDelete.value.name}" ha sido desactivado.`, 'success');
    await nextTick();
    proceduresTable.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    addNotification('Error al desactivar el elemento.', 'error');
    console.error('Error al desactivar:', error);
  } finally {
    closeConfirmModal();
  }
};
const openCreateProcedureModal = () => { isWizardModalOpen.value = true; };
const closeCreateProcedureModal = () => { isWizardModalOpen.value = false; };
const openCreateDirectionModal = () => { directionBeingEdited.value = null; isDirectionModalOpen.value = true; };
const openEditDirectionModal = (direction) => { directionBeingEdited.value = direction; isDirectionModalOpen.value = true; };
const closeDirectionModal = () => { isDirectionModalOpen.value = false; };
const openProceduresModal = (direction) => { selectedDirection.value = direction; isProceduresModalOpen.value = true; };
const handleDirectionFormSubmit = async (data) => {
  try {
    const action = directionBeingEdited.value ? 'actualizada' : 'creada';
    if (directionBeingEdited.value) {
      await directionsStore.updateDirection(data);
    } else {
      await directionsStore.createDirection(data);
    }
    addNotification(`Dirección ${action} correctamente.`, 'success');
    closeDirectionModal();
  } catch (error) {
    addNotification('Error al guardar la dirección.', 'error');
    console.error('Error al guardar la dirección:', error);
  }
};

// --- Ciclo de Vida ---
onMounted(() => {
  proceduresStore.fetchProcedures();
  directionsStore.fetchDirections();
});
</script>

<style scoped>
.procedures-view {
  width: 100%;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.main-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.top-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:nth-child(2),
.action-btn:nth-child(3) {
  background-color: #42b983;
  color: white;
}

.action-btn:nth-child(2):hover,
.action-btn:nth-child(3):hover {
  background-color: #3aa873;
}

.action-btn.memory-btn {
  background-color: #d946ef;
  color: white;
}

.action-btn.memory-btn:hover {
  background-color: #c026d3;
}

.action-btn:disabled {
  background-color: #ced4da;
  cursor: not-allowed;
  opacity: 0.7;
}

.section-container {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0;
}

.clear-filter-btn {
  background-color: #e9ecef;
  color: #495057;
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.directions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.direction-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  border: 1px solid #e9ecef;
  position: relative;
  min-height: 250px;
}

.direction-card.is-clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-color: #42b983;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
  color: #6c757d;
}

.card-body .description {
  font-style: italic;
  margin-bottom: 1rem;
}

.card-details p {
  margin: 0.5rem 0;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: #f8f9fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.card-action-btn {
  background: none;
  border: 1px solid #ced4da;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.direction-card.is-inactive {
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.85), rgba(13, 110, 253, 0.75));
  color: #fff;
}

.direction-card.is-inactive .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.direction-card.is-inactive .card-header h3 {
  opacity: 0.5;
  color: #fff;
}

.inactive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.activate-center {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.table-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

thead tr {
  background-color: #f8f9fa;
}

th {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.8rem;
  text-transform: uppercase;
}

tbody tr:nth-child(even) {
  background-color: #fdfdfd;
}

tbody tr:hover {
  background-color: #f1f3f5;
}

td {
  color: #2c3e50;
}

.description-cell {
  max-width: 400px;
}

.actions-cell {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.table-action-btn {
  background: none;
  border: 1px solid transparent;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.table-action-btn.edit {
  color: #28a745;
  background-color: #e7f5ec;
}

.table-action-btn.delete {
  color: #dc3545;
  background-color: #fbeae5;
}

.table-action-btn.activate {
  color: #0d6efd;
  background-color: #e7f1ff;
}

tr.is-inactive {
  background-color: #f8f9fa;
  color: #adb5bd;
}

tr.is-inactive strong {
  color: #adb5bd;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
}

.status-active {
  background-color: #e7f5ec;
  color: #28a745;
}

.status-inactive {
  background-color: #fbeae5;
  color: #dc3545;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
</style>
