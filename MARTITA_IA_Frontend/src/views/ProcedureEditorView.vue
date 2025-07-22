<template>
  <div class="editor-view">
    <div v-if="isLoading" class="loading-container">
      <p>Cargando información del trámite...</p>
    </div>

    <div v-else-if="!procedureData" class="error-container">
      <p>No se pudo cargar la información del trámite. Es posible que no exista.</p>
      <router-link to="/dashboard/procedures" class="back-link">&larr; Volver a la lista</router-link>
    </div>

    <div v-else class="editor-container">
      <header class="editor-header">
        <h1>Editor de Trámite: {{ procedureData.nombre }}</h1>
        <div class="header-actions">
          <span class="save-status">{{ saveStatus }}</span>
          <router-link to="/dashboard/procedures" class="back-link">&larr; Volver a la lista</router-link>
        </div>
      </header>

      <section class="form-section">
        <h2>Información Principal</h2>
        <div class="form-group">
          <label for="name">Nombre Trámite</label>
          <input id="name" type="text" v-model="procedureData.nombre">
        </div>
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" rows="3" v-model="procedureData.descripcion"></textarea>
        </div>
        <div class="form-group">
          <label for="context">Contexto para la IA</label>
          <textarea id="context" rows="3" v-model="procedureData.contexto" placeholder="Añadir contexto en lenguaje natural..."></textarea>
        </div>
      </section>

      <section class="form-section">
        <h2>Requisitos</h2>
        <p class="section-subtitle">Añade todos los requisitos que el usuario debe cumplir.</p>
        <div v-for="(req, index) in procedureData.requisitos" :key="req.id_requisito || `new-${index}`" class="dynamic-item">
          <input type="text" v-model="req.requisito" class="main-input" placeholder="Descripción del requisito">
          <input type="text" v-model="req.contexto" placeholder="Contexto (opcional)">
          <button class="remove-button" @click="removeRequisito(index)">-</button>
        </div>
        <button class="add-button" @click="addRequisito">+ Agregar Requisito</button>
      </section>

      <section class="form-section">
        <h2>Pasos</h2>
        <p class="section-subtitle">Detalla los pasos que el usuario debe seguir.</p>
        <div v-for="(paso, index) in procedureData.pasos" :key="paso.id_paso || `new-paso-${index}`" class="dynamic-item">
          <input type="text" v-model="paso.paso" class="main-input" placeholder="Descripción del paso">
          <input type="text" v-model="paso.contexto" placeholder="Contexto (opcional)">
          <button class="remove-button" @click="removePaso(index)">-</button>
        </div>
        <button class="add-button" @click="addPaso">+ Agregar Paso</button>
      </section>

      <section class="form-section">
        <h2>Formularios</h2>
        <p class="section-subtitle">Añade los enlaces a los formularios necesarios.</p>
        <div v-for="(form, index) in procedureData.formularios" :key="form.id_formulario || `new-form-${index}`" class="dynamic-item">
          <input type="url" v-model="form.url" class="main-input" placeholder="URL del formulario">
          <input type="text" v-model="form.contexto" placeholder="Contexto (opcional)">
          <button class="remove-button" @click="removeFormulario(index)">-</button>
        </div>
        <button class="add-button" @click="addFormulario">+ Agregar Formulario</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProceduresStore } from '@/stores/procedures';

const route = useRoute();
const proceduresStore = useProceduresStore();

const procedureData = ref(null);
const isLoading = ref(true);
const saveStatus = ref('Todos los cambios guardados'); // Estado para el feedback
let debounceTimer = null;

// --- Carga de datos inicial ---
onMounted(async () => {
  isLoading.value = true;
  const procedureId = route.params.id;
  if (procedureId) {
    await proceduresStore.fetchProcedureById(procedureId);
    if (proceduresStore.activeProcedure) {
      procedureData.value = JSON.parse(JSON.stringify(proceduresStore.activeProcedure));
    }
  }
  isLoading.value = false;
});

// --- Lógica de Guardado Automático (Autosave) ---
watch(procedureData, async (newData, oldData) => {
  if (!newData || !oldData) return;

  saveStatus.value = 'Guardando...';
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    try {
      // Creamos una copia sin las listas para actualizar solo los datos principales
      const { requisitos, pasos, formularios, ...mainData } = newData;
      await proceduresStore.updateProcedure(mainData);
      saveStatus.value = '✅ Guardado';
    } catch (error) {
      saveStatus.value = '❌ Error al guardar';
      console.error("Error en autoguardado:", error);
    }
  }, 1500); // Espera 1.5 segundos
}, { deep: true });


// --- Lógica para las listas dinámicas ---
const addRequisito = () => {
  if (!procedureData.value) return;
  if (!procedureData.value.requisitos) procedureData.value.requisitos = [];
  procedureData.value.requisitos.push({ id_requisito: -Date.now(), requisito: '', contexto: '' });
};
const removeRequisito = (index) => {
  if (!procedureData.value?.requisitos) return;
  procedureData.value.requisitos.splice(index, 1);
};

const addPaso = () => {
  if (!procedureData.value) return;
  if (!procedureData.value.pasos) procedureData.value.pasos = [];
  procedureData.value.pasos.push({ id_paso: -Date.now(), paso: '', contexto: '' });
};
const removePaso = (index) => {
  if (!procedureData.value?.pasos) return;
  procedureData.value.pasos.splice(index, 1);
};

const addFormulario = () => {
  if (!procedureData.value) return;
  if (!procedureData.value.formularios) procedureData.value.formularios = [];
  procedureData.value.formularios.push({ id_formulario: -Date.now(), url: '', contexto: '' });
};
const removeFormulario = (index) => {
  if (!procedureData.value?.formularios) return;
  procedureData.value.formularios.splice(index, 1);
};
</script>

<style scoped>
.editor-view {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.editor-container {
  max-width: 900px;
  margin: 0 auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.editor-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.save-status {
  font-style: italic;
  color: #6c757d;
  transition: color 0.3s;
}

.back-link {
  text-decoration: none;
  font-weight: 600;
  color: #42b983;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #f0f4f8;
}

.form-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-section h2 {
  margin-top: 0;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.section-subtitle {
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
}

.dynamic-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.dynamic-item .main-input {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button {
  background: #e9ecef;
  border: 1px solid #ced4da;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem;
}
</style>
