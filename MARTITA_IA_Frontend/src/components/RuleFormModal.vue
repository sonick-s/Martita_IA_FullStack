<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ isEditing ? 'Editar Regla' : 'Crear Nueva Regla' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>

      <div v-if="isEditing" class="info-group">
        <label>Fecha de Creación</label>
        <p>{{ formatDate(rule.fecha_creacion) }}</p>
      </div>

      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-group">
          <label for="name">Nombre de la Regla</label>
          <input id="name" v-model="rule.nombre" type="text" required />
        </div>
        <div class="form-group">
          <label for="type">Tipo</label>
          <input id="type" v-model="rule.tipo" type="text" placeholder="Ej: system, user, regla..." />
        </div>
        <div class="form-group">
          <label for="status">Estado</label>
          <select id="status" v-model="rule.estado">
            <option :value="1">Activo</option>
            <option :value="0">Inactivo</option>
          </select>
        </div>
        <div class="form-group">
          <label for="content">Contenido</label>
          <textarea id="content" v-model="rule.contenido" rows="5" required></textarea>
        </div>
        <footer class="modal-footer">
          <button type="button" class="button secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="button primary">Guardar Regla</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// El componente ahora puede recibir una regla existente para editarla
const props = defineProps({
  ruleToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const rule = ref({
  nombre: '',
  tipo: '',
  contenido: '',
  estado: 1, // Por defecto, una nueva regla estará "Activo"
});

// Propiedad que nos dice si estamos en modo "Crear" o "Editar"
const isEditing = computed(() => !!props.ruleToEdit);

onMounted(() => {
  if (isEditing.value) {
    // Si estamos editando, llenamos el formulario con los datos de la regla
    rule.value = { ...props.ruleToEdit };
  }
});

const submitForm = () => {
  emit('submit', rule.value);
};

// Función para formatear la fecha que se mostrará al editar
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  return new Date(dateString).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
};
</script>

<style scoped>
/* Estilos del modal corregidos y mejorados */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; padding: 2rem; border-radius: 12px;
  width: 100%; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1.5rem;
}
.modal-header h2 { margin: 0; font-size: 1.5rem; color: #2c3e50; }
.close-button {
  background: none; border: none; font-size: 2rem; cursor: pointer; color: #6c757d;
}

/* SOLUCIÓN AL PROBLEMA VISUAL */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057; /* <-- Color de texto oscuro para las etiquetas */
}

input, textarea, select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #fff;
  color: #212529; /* Color de texto para los campos de entrada */
  font-size: 1rem;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 1rem;
  margin-top: 2rem; border-top: 1px solid #e9ecef; padding-top: 1rem;
}
.button {
  padding: 0.7rem 1.2rem; border-radius: 8px; border: none;
  font-weight: 600; cursor: pointer;
}
.button.primary { background-color: #42b983; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; }
.info-group { margin-bottom: 1rem; }
.info-group p {
  margin: 0; padding: 0.8rem; background-color: #f8f9fa; border-radius: 8px;
}
</style>
