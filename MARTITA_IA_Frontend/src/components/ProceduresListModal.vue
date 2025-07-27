<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2>Trámites en: <span>{{ direction.nombre }}</span></h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>
      <div class="modal-body">
        <div v-if="procedures.length > 0" class="procedures-list">
          <router-link
            v-for="proc in procedures"
            :key="proc.id_tramite"
            :to="{ name: 'procedure-editor', params: { id: proc.id_tramite } }"
            class="procedure-item-link"
          >
            <div class="procedure-item" :class="{ 'is-inactive': proc.estado === 0 }">
              <div class="procedure-info">
                <strong>{{ proc.nombre }}</strong>
                <p>{{ proc.descripcion || 'Sin descripción.' }}</p>
              </div>
              <span :class="['status-badge', proc.estado === 1 ? 'status-active' : 'status-inactive']">
                {{ proc.estado === 1 ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </router-link>
        </div>
        <div v-else class="empty-message">
          <p>No hay trámites asignados a esta dirección.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  direction: { type: Object, required: true },
  procedures: { type: Array, required: true }
});
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.modal-content {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #333;
}
.modal-header h2 span {
  color: #0d6efd;
  font-weight: bold;
}
.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
}
.modal-body {
  overflow-y: auto;
}
.procedures-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.procedure-item-link {
  text-decoration: none; /* Quita el subrayado del enlace */
  color: inherit; /* Hereda el color del texto */
  display: block;
  border-radius: 8px;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.procedure-item-link:hover {
  background-color: #f8f9fa;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.procedure-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}
.procedure-item.is-inactive {
  border-left: 4px solid #dc3545;
}
.procedure-info strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
  color: #2c3e50; /* <-- COLOR DE TEXTO CORREGIDO */
}
.procedure-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d; /* <-- COLOR DE TEXTO CORREGIDO */
}
.empty-message { text-align: center; color: #6c757d; padding: 3rem 1rem; }
.status-badge {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
}
.status-active { background-color: #e7f5ec; color: #28a745; }
.status-inactive { background-color: #fbeae5; color: #dc3545; }
</style>
