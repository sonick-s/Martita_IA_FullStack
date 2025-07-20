<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ isEditing ? 'Editar Trámite' : 'Crear Nuevo Trámite' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </header>

      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <section class="form-section">
            <div class="form-group">
              <label for="direction">Dirección Responsable</label>
              <select id="direction" v-model="procedure.id_direcciones" required>
                <option disabled value="">Selecciona una dirección</option>
                <option v-for="dir in directions" :key="dir.id_direcciones" :value="dir.id_direcciones">
                  {{ dir.nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="name">Nombre del Trámite</label>
              <input id="name" v-model="procedure.nombre" type="text" required />
            </div>
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea id="description" v-model="procedure.descripcion" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="context">Contexto (para la IA)</label>
              <input id="context" v-model="procedure.contexto" type="text" />
            </div>
          </section>

          <section class="form-section dynamic-section">
            <label>Requisitos</label>
            <div v-for="(req, index) in procedure.requisitos" :key="index" class="dynamic-item">
              <input type="text" v-model="req.requisito" placeholder="Descripción del requisito">
              <button type="button" class="remove-button" @click="removeRequisito(index)">-</button>
            </div>
            <button type="button" class="add-button" @click="addRequisito">+ Agregar Requisito</button>
          </section>

          <section class="form-section dynamic-section">
            <label>Pasos</label>
            <div v-for="(paso, index) in procedure.pasos" :key="index" class="dynamic-item">
              <input type="text" v-model="paso.paso" placeholder="Descripción del paso">
              <button type="button" class="remove-button" @click="removePaso(index)">-</button>
            </div>
            <button type="button" class="add-button" @click="addPaso">+ Agregar Paso</button>
          </section>

          <footer class="modal-footer">
            <button type="button" class="button secondary" @click="$emit('close')">Cancelar</button>
            <button type="submit" class="button primary">Guardar Trámite</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  directions: { type: Array, required: true },
  procedureToEdit: { type: Object, default: null }
});

const emit = defineEmits(['close', 'submit']);

const procedure = ref({
  id_direcciones: '',
  nombre: '',
  descripcion: '',
  contexto: '',
  requisitos: [],
  pasos: [],
  formularios: [],
});

const isEditing = computed(() => !!props.procedureToEdit);

onMounted(() => {
  if (isEditing.value) {
    // Si estamos editando, llenamos el formulario con los datos existentes
    procedure.value = { ...props.procedureToEdit };
  }
});

const submitForm = () => {
  emit('submit', procedure.value);
};

// --- Lógica para listas dinámicas ---
const addRequisito = () => { procedure.value.requisitos.push({ requisito: '' }); };
const removeRequisito = (index) => { procedure.value.requisitos.splice(index, 1); };
const addPaso = () => { procedure.value.pasos.push({ paso: '' }); };
const removePaso = (index) => { procedure.value.pasos.splice(index, 1); };
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;

  /* --- CAMBIOS PRINCIPALES AQUÍ --- */
  /* 1. Limitamos la altura máxima del modal al 90% de la ventana */
  max-height: 90vh;
  /* 2. Ocultamos el scroll del contenedor principal */
  overflow: hidden;
}

.modal-header {
  flex-shrink: 0; /* Evita que el header se encoja */
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
}

/* 3. Hacemos que el cuerpo del modal sea la única parte que pueda tener scroll */
.modal-body {
  overflow-y: auto; /* Muestra el scroll vertical solo cuando es necesario */
  padding: 1.5rem 2rem;
}

.form-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}
.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

input, textarea, select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
}

.modal-footer {
  flex-shrink: 0; /* Evita que el footer se encoja */
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto; /* Empuja el footer hacia abajo */
  border-top: 1px solid #e9ecef;
  padding: 1.5rem 2rem;
  background-color: #f8f9fa;
}

.button {
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.button.primary { background-color: #42b983; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; }

/* Estilos para listas dinámicas */
.dynamic-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}
.dynamic-item input {
  flex-grow: 1;
}
.remove-button {
  background-color: #f8d7da;
  color: #dc3545;
  border: 1px solid #f5c6cb;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-weight: bold;
  cursor: pointer;
  flex-shrink: 0;
}
.add-button {
  background: #e9ecef;
  border: 1px solid #ced4da;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>
