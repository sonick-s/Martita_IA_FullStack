<template>
  <div class="procedures-view">
    <header class="main-header">
      <h1 class="main-title">Gestión de Trámites y Direcciones</h1>
      <div class="top-actions">
        <button class="action-btn" @click="openCreateProcedureModal">+ Crear Trámite</button>
        <button class="action-btn" @click="openCreateDirectionModal">+ Crear Dirección</button>
      </div>
    </header>

    <section class="section-container">
      <h2 class="section-title">Direcciones</h2>
      <div v-if="directionsStore.isLoading" class="loading-message">Cargando...</div>
      <div v-else-if="directionsStore.directions.length > 0" class="directions-grid">
        <div v-for="dir in directionsStore.directions" :key="dir.id_direcciones" class="direction-card">
          <div class="card-header">
            <h3>{{ dir.nombre }}</h3>
          </div>
          <div class="card-body">
            <p class="description">{{ dir.descripcion || 'Sin descripción.' }}</p>
            <div class="card-details">
              <p class="detail-item"><strong>👤 Responsable:</strong> {{ dir.responsable || 'N/A' }}</p>
              <p class="detail-item"><strong>✉️ Email:</strong> {{ dir.correo_responsable || 'N/A' }}</p>
              <p class="detail-item"><strong>📞 Teléfono:</strong> {{ dir.telefono || 'N/A' }}</p>
            </div>
          </div>
          <div class="card-footer">
            <button class="card-action-btn edit" @click="openEditDirectionModal(dir)">📝 Editar</button>
            <button class="card-action-btn delete" @click="openDeleteConfirm(dir.id_direcciones, 'direction')">🗑️
              Eliminar</button>
          </div>
        </div>
      </div>
      <div v-else class="empty-message">No hay direcciones. Crea una para empezar.</div>
    </section>

<section class="section-container">
  <h2 class="section-title">Trámites</h2>
  <div class="table-container">
    <div v-if="proceduresStore.isLoading" class="loading-message">Cargando...</div>
    <table v-else-if="proceduresStore.procedures.length > 0">
      <thead>
        <tr>
          <th>Trámite</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proc in proceduresStore.procedures" :key="proc.id_tramite" :class="{ 'is-inactive': proc.estado === -1 }">
          <td><strong>{{ proc.nombre }}</strong></td>
          <td class="description-cell">{{ proc.descripcion }}</td>
          <td>
            <span :class="['status-badge', proc.estado === 1 ? 'status-active' : 'status-inactive']">
              <template v-if="proc.estado === 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Activo
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                Inactivo
              </template>
            </span>
          </td>
          <td class="actions-cell">
            <template v-if="proc.estado === 1">
              <router-link :to="{ name: 'procedure-editor', params: { id: proc.id_tramite } }" class="table-action-btn edit">📝 Editar</router-link>
              <button class="table-action-btn delete" @click="openDeleteConfirm(proc.id_tramite, 'procedure')">🗑️ Desactivar</button>
            </template>
            <template v-else>
              <button class="table-action-btn activate" @click="proceduresStore.activateProcedure(proc.id_tramite)">🔄 Reactivar</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-message">No hay trámites para mostrar.</div>
  </div>
</section>

    <ProcedureWizardModal v-if="isWizardModalOpen" :directions="directionsStore.directions"
      @close="closeCreateProcedureModal" />
    <DirectionFormModal v-if="isDirectionModalOpen" :direction-to-edit="directionBeingEdited"
      @close="closeDirectionModal" @submit="handleDirectionFormSubmit" />
    <ConfirmationModal v-if="isConfirmModalOpen" title="Confirmar Acción" message="¿Estás seguro?"
      @cancel="closeConfirmModal" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProceduresStore } from '@/stores/procedures';
import { useDirectionsStore } from '@/stores/directions';
import DirectionFormModal from '@/components/DirectionFormModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import ProcedureWizardModal from '@/components/ProcedureWizardModal.vue';

const proceduresStore = useProceduresStore();
const directionsStore = useDirectionsStore();

// --- Estados para los modales ---
const isWizardModalOpen = ref(false);
const isDirectionModalOpen = ref(false);
const directionBeingEdited = ref(null);
const isConfirmModalOpen = ref(false);
const itemToDelete = ref({ id: null, type: null });

// --- Funciones para el Asistente de Trámites ---
const openCreateProcedureModal = () => {
  isWizardModalOpen.value = true;
};
const closeCreateProcedureModal = () => {
  isWizardModalOpen.value = false;
};

// --- Funciones para Direcciones ---
const openCreateDirectionModal = () => {
  directionBeingEdited.value = null;
  isDirectionModalOpen.value = true;
};
const openEditDirectionModal = (direction) => {
  directionBeingEdited.value = direction;
  isDirectionModalOpen.value = true;
};
const closeDirectionModal = () => {
  isDirectionModalOpen.value = false;
  directionBeingEdited.value = null;
};
const handleDirectionFormSubmit = async (data) => {
  try {
    if (directionBeingEdited.value) {
      await directionsStore.updateDirection(data);
    } else {
      await directionsStore.createDirection(data);
    }
    closeDirectionModal();
  } catch (error) {
    console.error('Error al guardar la dirección:', error);
    alert('Ocurrió un error al guardar la dirección.');
  }
};

// --- Funciones para Eliminar ---
const openDeleteConfirm = (id, type) => {
  itemToDelete.value = { id, type };
  isConfirmModalOpen.value = true;
};
const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  itemToDelete.value = { id: null, type: null };
};
const confirmDelete = async () => {
  if (!itemToDelete.value.id) return;
  try {
    if (itemToDelete.value.type === 'procedure') {
      // 👇 ¡ESTE ES EL ÚNICO CAMBIO NECESARIO!
      await proceduresStore.deactivateProcedure(itemToDelete.value.id);
    } else if (itemToDelete.value.type === 'direction') {
      await directionsStore.deleteDirection(itemToDelete.value.id);
    }
  } catch (error) {
    console.error('Error al procesar la acción:', error);
    alert('Error al procesar la acción.');
  } finally {
    closeConfirmModal();
  }
};

// --- Ciclo de vida ---
onMounted(() => {
  proceduresStore.fetchProcedures();
  directionsStore.fetchDirections();
});
</script>

<style scoped>
/* ESTILOS COMPLETOS Y ACTUALIZADOS PARA PROCEDURESVIEW.VUE */

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
  background-color: #e9ecef;
  color: #495057;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #ced4da;
}

.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

/* --- Estilos para las Tarjetas de Direcciones --- */
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
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e9ecef;
}

.direction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
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
  font-size: 0.9rem;
}

.card-details {
  font-size: 0.9rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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
  background: white;
  border: 1px solid #ced4da;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-action-btn.delete {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

/* --- Estilos para la Tabla de Trámites --- */
.table-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
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
}

td {
  color: #2c3e50;
}

th {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-cell {
  max-width: 400px;
  white-space: normal;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.table-action-btn {
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  text-decoration: none;
}

.table-action-btn.edit {
  color: #28a745;
}

.table-action-btn.delete {
  color: #dc3545;
}

.table-action-btn:hover {
  background-color: #f1f3f5;
}

/* 👇 --- ESTILOS AÑADIDOS PARA ESTADOS Y ACCIONES --- */

/* Estilo para la fila inactiva completa */
tr.is-inactive {
  background-color: #f8f9fa;
  color: #adb5bd;
}

tr.is-inactive strong {
  color: #adb5bd;
}

/* Contenedor del badge de estado */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: capitalize;
}

.status-badge svg {
  margin-bottom: -2px;
}

/* Badge para estado activo */
.status-active {
  background-color: #e7f5ec;
  color: #28a745;
}

.status-active svg {
  stroke: #28a745;
}

/* Badge para estado inactivo */
.status-inactive {
  background-color: #fff0f1;
  color: #dc3545;
}

.status-inactive svg {
  stroke: #dc3545;
}

/* Estilo para el nuevo botón de reactivar */
.table-action-btn.activate {
  color: #0d6efd;
}

/* Asegura que los botones en filas inactivas no se vean tan opacos */
tr.is-inactive .actions-cell button,
tr.is-inactive .actions-cell a {
  opacity: 1;
}

/* --- Fin de Estilos Añadidos --- */

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

</style>
