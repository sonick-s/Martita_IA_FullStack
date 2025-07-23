<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ isEditing ? 'Editar Dirección' : 'Crear Nueva Dirección' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>

      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-group">
          <label for="name">Nombre de la Dirección</label>
          <input id="name" v-model="direction.nombre" type="text" required />
        </div>
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" v-model="direction.descripcion" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label for="responsable">Responsable</label>
          <input id="responsable" v-model="direction.responsable" type="text" required />
        </div>
        <div class="form-group">
          <label for="email">Correo del Responsable</label>
          <input id="email" v-model="direction.correo_responsable" type="email" required />
        </div>
        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input
            id="phone"
            v-model="direction.telefono"
            type="tel"
            required
            pattern="[0-9]{10}"
            title="El número de teléfono debe contener exactamente 10 dígitos."
          />
        </div>

        <div class="form-group">
          <label>Estado</label>
          <div class="status-toggle">
            <label :class="{ active: direction.estado === 1 }">
              <input type="radio" v-model="direction.estado" :value="1" name="status"> Activo
            </label>
            <label :class="{ active: direction.estado === 0 }">
              <input type="radio" v-model="direction.estado" :value="0" name="status"> Inactivo
            </label>
          </div>
        </div>

        <footer class="modal-footer">
          <button type="button" class="button secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="button primary">Guardar Dirección</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  directionToEdit: { type: Object, default: null }
});
const emit = defineEmits(['close', 'submit']);

const direction = ref({
  nombre: '',
  descripcion: '',
  responsable: '',
  correo_responsable: '',
  telefono: '',
  estado: 1,
});

const isEditing = computed(() => !!props.directionToEdit);

onMounted(() => {
  if (isEditing.value) {
    direction.value = { ...props.directionToEdit };
  }
});

const submitForm = () => {
  emit('submit', direction.value);
};
</script>

<style scoped>
/* Estilos del modal con el ajuste para los botones de estado */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; border-radius: 12px;
  width: 100%; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex; flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}
.modal-header {
  flex-shrink: 0; padding: 1.5rem 2rem;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #e9ecef;
}
.modal-header h2 { margin: 0; font-size: 1.5rem; color: #2c3e50; }
.close-button {
  background: none; border: none; font-size: 2rem; cursor: pointer; color: #6c757d;
}
.modal-body {
  overflow-y: auto;
  padding: 1.5rem 2rem;
}
.form-group { margin-bottom: 1rem; }
label {
  display: block; margin-bottom: 0.5rem; font-weight: 600; color: #495057;
}
input[type="text"], input[type="email"], input[type="tel"], textarea {
  width: 100%; padding: 0.8rem; border: 1px solid #ced4da;
  border-radius: 8px; box-sizing: border-box; font-size: 1rem;
}
.modal-footer {
  flex-shrink: 0;
  display: flex; justify-content: flex-end; gap: 1rem;
  margin-top: auto; border-top: 1px solid #e9ecef;
  padding: 1.5rem 2rem; background-color: #f8f9fa;
}
.button {
  padding: 0.7rem 1.2rem; border-radius: 8px; border: none;
  font-weight: 600; cursor: pointer;
}
.button.primary { background-color: #42b983; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; }

/* --- ESTILOS AJUSTADOS PARA EL CAMPO "ESTADO" --- */
.status-toggle {
  display: flex;
  border: 1px solid #ced4da;
  border-radius: 8px;
  overflow: hidden;
}
.status-toggle label {
  flex: 1;
  text-align: center;
  /* CAMBIO: Se reduce el padding vertical */
  padding: 0.6rem;
  margin: 0;
  cursor: pointer;
  background-color: #f8f9fa;
  color: #6c757d;
  transition: background-color 0.2s, color 0.2s;
  /* CAMBIO: Se ajusta el tamaño de la fuente */
  font-size: 0.9rem;
}
.status-toggle input[type="radio"] {
  display: none;
}
.status-toggle label.active {
  background-color: #42b983;
  color: white;
  font-weight: 700;
}
</style>
