<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <div>
          <h2 class="modal-title">{{ procedure.nombre }}</h2>
          <p class="modal-subtitle">{{ procedure.direccion?.nombre || 'Dirección no especificada' }}</p>
        </div>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>

      <div class="modal-body">
        <p class="main-description">{{ procedure.descripcion }}</p>

        <div v-if="procedure.requisitos && procedure.requisitos.length > 0" class="details-section">
          <h3 class="section-title">Requisitos</h3>
          <ul class="details-list">
            <li v-for="req in procedure.requisitos" :key="req.id_requisito" class="detail-item">
              <span class="detail-icon">✅</span>
              <span>{{ req.requisito }}</span>
            </li>
          </ul>
        </div>

        <div v-if="procedure.pasos && procedure.pasos.length > 0" class="details-section">
          <h3 class="section-title">Pasos a Seguir</h3>
          <ol class="details-list numbered">
            <li v-for="paso in procedure.pasos" :key="paso.id_paso" class="detail-item">
              <span>{{ paso.paso }}</span>
            </li>
          </ol>
        </div>

        <div v-if="procedure.formularios && procedure.formularios.length > 0" class="details-section">
          <h3 class="section-title">Formularios y Enlaces</h3>
          <ul class="details-list">
            <li v-for="form in procedure.formularios" :key="form.id_formulario" class="detail-item">
              <span class="detail-icon">🔗</span>
              <a :href="form.url" target="_blank" rel="noopener noreferrer">{{ form.url }}</a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Ahora el modal recibe el objeto completo del trámite
  procedure: { type: Object, required: true },
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
  z-index: 1002;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #f8f9fa; /* Fondo ligeramente gris para contraste */
  border-radius: 12px;
  width: 90%;
  max-width: 700px; /* Un poco más ancho */
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-title {
  margin: 0;
  font-size: 1.6rem;
  color: #2c3e50;
  font-weight: 700;
}

.modal-subtitle {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  color: #6c757d;
  font-weight: 400;
}

.close-button {
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  line-height: 1;
}

.modal-body {
  overflow-y: auto;
  padding: 2rem;
}

.main-description {
  margin-top: 0;
  line-height: 1.6;
  color: #495057;
  font-size: 1.1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
}

.details-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 1rem;
}

.details-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details-list.numbered {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #495057;
}

.detail-icon {
  font-size: 1.2rem;
  line-height: 1.5;
}

.detail-item a {
  color: #0d6efd;
  text-decoration: none;
  word-break: break-all;
}

.detail-item a:hover {
  text-decoration: underline;
}
</style>
