<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="$emit('cancel')">&times;</button>
      </header>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <footer class="modal-footer">
        <button class="button secondary" @click="$emit('cancel')">Cancelar</button>
        <button class="button danger" @click="$emit('confirm')">Confirmar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
// El componente recibe un título y un mensaje como propiedades (props)
defineProps({
  title: {
    type: String,
    default: 'Confirmar Acción'
  },
  message: {
    type: String,
    default: '¿Estás seguro de que quieres realizar esta acción?'
  }
});

// Define los eventos que puede emitir: 'confirm' y 'cancel'
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
/* Usamos estilos similares a nuestro otro modal para mantener la consistencia */
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
  z-index: 1001; /* Un z-index más alto por si se abre sobre otro modal */
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body p {
  margin: 0;
  color: #495057;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.button.danger {
  background-color: #dc3545;
  color: white;
}
.button.secondary {
  background-color: #e9ecef;
  color: #495057;
}
</style>
