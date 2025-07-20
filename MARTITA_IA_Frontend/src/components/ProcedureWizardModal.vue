<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ currentStep === 1 ? 'Paso 1: Datos Principales' : `Paso 2: Detalles del Trámite (ID: ${tramiteId})` }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </header>

      <div class="modal-body">
        <form v-if="currentStep === 1" @submit.prevent="goToNextStep">
          <div class="form-group">
            <label for="direction">Dirección Responsable</label>
            <select id="direction" v-model="procedureData.id_direcciones" required>
              <option disabled value="">Selecciona una dirección</option>
              <option v-for="dir in props.directions" :key="dir.id_direcciones" :value="dir.id_direcciones">{{ dir.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="name">Nombre del Trámite</label>
            <input id="name" v-model="procedureData.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" v-model="procedureData.descripcion" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="context">Contexto (para la IA)</label>
            <input id="context" v-model="procedureData.contexto" type="text" />
          </div>
          <footer class="modal-footer">
            <button type="button" class="button secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="button primary" :disabled="isLoading">
              {{ isLoading ? 'Creando...' : 'Siguiente →' }}
            </button>
          </footer>
        </form>

        <div v-if="currentStep === 2">
          <section class="dynamic-section">
            <label>Requisitos</label>
            <div v-for="(req, index) in requisitos" :key="req.id_requisito || index" class="dynamic-item">
              <input type="text" v-model="req.requisito" placeholder="Ej: Copia de la cédula" class="main-input">
              <input type="text" v-model="req.contexto" placeholder="Contexto (opcional)">
              <button class="save-item-btn" @click="handleSaveRequisito(index)" :disabled="isItemSaved(req)">
                {{ isItemSaved(req) ? 'Guardado' : 'Guardar' }}
              </button>
            </div>
            <button type="button" class="add-button" @click="addRequisito">+ Agregar Requisito</button>
          </section>
          <hr>
          <section class="dynamic-section">
            <label>Pasos</label>
             <div v-for="(paso, index) in pasos" :key="paso.id_paso || index" class="dynamic-item">
              <input type="text" v-model="paso.paso" placeholder="Ej: Pagar tasa en ventanilla" class="main-input">
              <input type="text" v-model="paso.contexto" placeholder="Contexto (opcional)">
              <button class="save-item-btn" @click="handleSavePaso(index)" :disabled="isItemSaved(paso)">
                {{ isItemSaved(paso) ? 'Guardado' : 'Guardar' }}
              </button>
            </div>
            <button type="button" class="add-button" @click="addPaso">+ Agregar Paso</button>
          </section>
          <hr>
          <section class="dynamic-section">
            <label>Formularios</label>
             <div v-for="(form, index) in formularios" :key="form.id_formulario || index" class="dynamic-item">
              <input type="url" v-model="form.url" placeholder="URL del formulario" class="main-input">
              <input type="text" v-model="form.contexto" placeholder="Contexto (opcional)">
              <button class="save-item-btn" @click="handleSaveFormulario(index)" :disabled="isItemSaved(form)">
                {{ isItemSaved(form) ? 'Guardado' : 'Guardar' }}
              </button>
            </div>
            <button type="button" class="add-button" @click="addFormulario">+ Agregar Formulario</button>
          </section>
          <footer class="modal-footer">
            <button type="button" class="button primary" @click="closeModal">Finalizar</button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProceduresStore } from '@/stores/procedures';
import { useRequisitosStore } from '@/stores/requisitos';
import { usePasosStore } from '@/stores/pasos';
import { useFormulariosStore } from '@/stores/formularios';

const props = defineProps({
  directions: { type: Array, required: true }
});
const emit = defineEmits(['close']);

const proceduresStore = useProceduresStore();
const requisitosStore = useRequisitosStore();
const pasosStore = usePasosStore();
const formulariosStore = useFormulariosStore();

const currentStep = ref(1);
const tramiteId = ref(null);
const isLoading = ref(false);

const procedureData = ref({
  id_direcciones: '',
  nombre: '',
  descripcion: '',
  contexto: '',
});

const requisitos = ref([]);
const pasos = ref([]);
const formularios = ref([]);

const addRequisito = () => { requisitos.value.push({ requisito: '', contexto: '' }); };
const addPaso = () => { pasos.value.push({ paso: '', contexto: '' }); };
const addFormulario = () => { formularios.value.push({ url: '', contexto: '' }); };

const isItemSaved = (item) => {
  return (item.id_requisito && item.id_requisito > 0) ||
         (item.id_paso && item.id_paso > 0) ||
         (item.id_formulario && item.id_formulario > 0);
};

const closeModal = () => {
  emit('close');
};

const goToNextStep = async () => {
  isLoading.value = true;
  try {
    const nuevoTramite = await proceduresStore.createProcedure(procedureData.value);
    if (nuevoTramite && nuevoTramite.id_tramite) {
      tramiteId.value = nuevoTramite.id_tramite;
      currentStep.value = 2;
    } else {
      alert('Error: No se pudo obtener el ID del nuevo trámite.');
    }
  } catch (error) {
    console.error("Error al crear el trámite principal:", error);
    alert('Ocurrió un error al crear el trámite principal.');
  } finally {
    isLoading.value = false;
  }
};

// --- Lógica de Guardado Instantáneo ---
const handleSaveRequisito = async (index) => {
  const requisito = requisitos.value[index];
  if (isItemSaved(requisito) || !requisito.requisito) return;
  try {
    const dataToSave = { id_tramite: tramiteId.value, requisito: requisito.requisito, contexto: requisito.contexto };
    const savedRequisito = await requisitosStore.createRequisito(dataToSave);
    requisitos.value[index] = savedRequisito;
  } catch (error) {
    console.error("Error al guardar requisito:", error);
    alert('No se pudo guardar el requisito.');
  }
};

const handleSavePaso = async (index) => {
  const paso = pasos.value[index];
  if (isItemSaved(paso) || !paso.paso) return;
  try {
    const dataToSave = { id_tramite: tramiteId.value, paso: paso.paso, contexto: paso.contexto };
    const savedPaso = await pasosStore.createPaso(dataToSave);
    pasos.value[index] = savedPaso;
  } catch (error) {
    console.error("Error al guardar paso:", error);
    alert('No se pudo guardar el paso.');
  }
};

const handleSaveFormulario = async (index) => {
  const form = formularios.value[index];
  if (isItemSaved(form) || !form.url) return;
  try {
    const dataToSave = { id_tramite: tramiteId.value, url: form.url, contexto: form.contexto };
    const savedForm = await formulariosStore.createFormulario(dataToSave);
    formularios.value[index] = savedForm;
  } catch (error) {
    console.error("Error al guardar formulario:", error);
    alert('No se pudo guardar el formulario.');
  }
};
</script>

<style scoped>
/* Los estilos se mantienen igual */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; width: 100%; max-width: 700px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; }
.modal-header { flex-shrink: 0; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e9ecef; }
.modal-header h2 { margin: 0; font-size: 1.5rem; color: #2c3e50; }
.close-button { background: none; border: none; font-size: 2rem; cursor: pointer; color: #6c757d; }
.modal-body { overflow-y: auto; padding: 1.5rem 2rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #495057; }
input, textarea, select { width: 100%; padding: 0.8rem; border: 1px solid #ced4da; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
.modal-footer { flex-shrink: 0; display: flex; justify-content: flex-end; gap: 1rem; margin-top: auto; border-top: 1px solid #e9ecef; padding: 1.5rem 2rem; background-color: #f8f9fa; }
.button { padding: 0.7rem 1.2rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
.button.primary { background-color: #42b983; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; }
hr { border: none; border-top: 1px solid #e9ecef; margin: 2rem 0; }
.dynamic-section { margin-bottom: 1.5rem; }
.dynamic-item { display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem; align-items: center; }
.dynamic-item .main-input { flex-grow: 1; }
.save-item-btn { padding: 0.6rem; background-color: #e7f5ec; color: #28a745; border: 1px solid #a3d9b1; border-radius: 8px; cursor: pointer; }
.save-item-btn:disabled { background-color: #e9ecef; color: #6c757d; border-color: #ced4da; cursor: not-allowed; }
.add-button { background: #e9ecef; border: 1px solid #ced4da; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
</style>
