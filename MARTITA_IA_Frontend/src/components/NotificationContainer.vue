<template>
  <div class="notification-container">
    <TransitionGroup name="list" tag="div">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :id="notification.id"
        :message="notification.message"
        :type="notification.type"
        @close="removeNotification"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import Notification from './Notification.vue';

const props = defineProps({
  notifications: { type: Array, required: true }
});
const emit = defineEmits(['remove']);

const removeNotification = (id) => {
  emit('remove', id);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

/* Animaciones para entrar y salir */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
