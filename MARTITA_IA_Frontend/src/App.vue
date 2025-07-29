<template>
  <div id="app-wrapper">
    <RouterView />

    <NotificationContainer :notifications="notifications" @remove="removeNotification" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';
import NotificationContainer from '@/components/NotificationContainer.vue';

const notifications = ref([]);
let notificationId = 0;

const addNotification = (message, type = 'info', duration = 4000) => {
  const id = notificationId++;
  notifications.value.push({ id, message, type, duration });
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

// Hacemos la función 'addNotification' disponible para todos los componentes hijos
provide('addNotification', addNotification);
</script>

<style>
/* Estilos globales si son necesarios */
</style>
