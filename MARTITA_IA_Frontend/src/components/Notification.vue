<template>
  <div :class="['toast', type]">
    <span class="message">{{ message }}</span>
    <button @click="close" class="close-btn">&times;</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  id: { type: Number, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'info', 'success', 'error'
  duration: { type: Number, default: 4000 }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close', props.id);
};

// Cierra la notificación automáticamente después de la duración especificada
onMounted(() => {
  setTimeout(() => {
    close();
  }, props.duration);
});
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: white;
  margin-bottom: 1rem;
  width: 350px;
  opacity: 0.95;
}
.toast.info { background-color: #0d6efd; }
.toast.success { background-color: #198754; }
.toast.error { background-color: #dc3545; }
.message { font-weight: 500; }
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.7;
  cursor: pointer;
  margin-left: 1rem;
}
.close-btn:hover { opacity: 1; }
</style>
