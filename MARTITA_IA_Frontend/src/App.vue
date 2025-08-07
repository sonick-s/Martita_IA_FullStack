<template>
  <div id="app-wrapper">
    <RouterView />

    <NotificationContainer :notifications="notifications" @remove="removeNotification" />
  </div>
</template>

<script setup>
// 👇 1. AÑADE 'onMounted' A LA IMPORTACIÓN DE VUE
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NotificationContainer from '@/components/NotificationContainer.vue';
// 👇 2. IMPORTA TU NUEVA FUNCIÓN DEL CHATBOT
import { initChatbot } from '@/services/martita-chatbot.js';

const notifications = ref([]);
let notificationId = 0;

const addNotification = (message, type = 'info', duration = 4000) => {
  const id = notificationId++;
  notifications.value.push({ id, message, type, duration });
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

provide('addNotification', addNotification);

// 👇 3. LLAMA A LA FUNCIÓN DEL CHATBOT CUANDO LA APP SE CARGA
onMounted(async () => {
  // Esperar un poco para asegurar que las variables de entorno estén cargadas
  setTimeout(() => {
    const success = initChatbot();
    if (!success) {
      console.warn('El chatbot no se pudo inicializar. Verifica las variables de entorno.');
      addNotification('Error al cargar el chatbot. Verifica la configuración.', 'error');
    } else {
      console.log('Chatbot cargado exitosamente');
    }
  }, 1000);
});
</script>

<style>
/* Estilos globales si son necesarios */
</style>
