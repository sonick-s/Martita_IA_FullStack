<template>
  <div id="app-wrapper">
    <RouterView />

    <NotificationContainer :notifications="notifications" @remove="removeNotification" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NotificationContainer from '@/components/NotificationContainer.vue';
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

// 👇 Llama a la función del chatbot de forma más limpia y robusta
onMounted(async () => {
  // 'await' espera a que initChatbot termine y nos da el resultado (true o false)
  const success = await initChatbot();

  // Si la inicialización falló (retornó false), muestra una notificación de error
  if (!success) {
    addNotification('Error al cargar el chatbot. Verifica la configuración.', 'error');
  }
});
</script>

<style>
/* Estilos globales si son necesarios */
</style>
