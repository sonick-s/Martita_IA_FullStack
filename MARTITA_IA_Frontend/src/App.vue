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
/* === ESTILOS GLOBALES RESPONSIVOS === */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #f8f9fa;
}

/* Contenedor principal */
#app {
  min-height: 100vh;
  width: 100%;
}

/* Tipografía responsiva */
h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  line-height: 1.2;
}

h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

h2 {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
}

h3 {
  font-size: clamp(1.3rem, 3vw, 1.75rem);
}

h4 {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
}

/* Botones responsivos */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-height: 44px; /* Accesibilidad táctil */
}

button:focus {
  outline: 2px solid #42b983;
  outline-offset: 2px;
}

/* Inputs responsivos */
input, select, textarea {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  width: 100%;
  min-height: 44px;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

/* Contenedores flexibles */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

/* Espaciado responsivo */
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* Padding responsivo */
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

/* Margin responsivo */
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }

/* Utilidades de texto */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-bold { font-weight: 600; }
.font-semibold { font-weight: 500; }

/* Colores */
.text-primary { color: #42b983; }
.text-secondary { color: #6c757d; }
.text-danger { color: #e74c3c; }
.text-success { color: #28a745; }

.bg-primary { background-color: #42b983; }
.bg-secondary { background-color: #6c757d; }
.bg-white { background-color: white; }
.bg-light { background-color: #f8f9fa; }

/* Sombras */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Border radius */
.rounded { border-radius: 6px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 50%; }

/* Ancho responsivo */
.w-full { width: 100%; }
.w-auto { width: auto; }
.max-w-sm { max-width: 24rem; }
.max-w-md { max-width: 28rem; }
.max-w-lg { max-width: 32rem; }
.max-w-xl { max-width: 36rem; }

/* Altura */
.h-full { height: 100%; }
.min-h-screen { min-height: 100vh; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-x-auto { overflow-x: auto; }

/* === BREAKPOINTS RESPONSIVOS === */

/* Tablets */
@media (max-width: 1024px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-lg-tablet {
    font-size: 1.1rem;
  }
}

/* Mobile Landscape */
@media (max-width: 768px) {
  .hidden-mobile {
    display: none !important;
  }
  
  .flex-col-mobile {
    flex-direction: column;
  }
  
  .text-center-mobile {
    text-align: center;
  }
  
  .w-full-mobile {
    width: 100%;
  }
  
  .p-2-mobile {
    padding: 0.5rem;
  }
  
  .p-4-mobile {
    padding: 1rem;
  }
  
  .gap-2-mobile {
    gap: 0.5rem;
  }
  
  .gap-4-mobile {
    gap: 1rem;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .text-sm-mobile {
    font-size: 0.9rem;
  }
  
  .p-1-mobile {
    padding: 0.25rem;
  }
  
  .p-3-mobile {
    padding: 0.75rem;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible para mejor accesibilidad */
.focus-visible {
  outline: 2px solid #42b983;
  outline-offset: 2px;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Mejoras para el chatbot en móvil */
@media (max-width: 768px) {
  /* Asegurar que el chatbot sea responsive */
  .flowise-chatbot {
    width: 100% !important;
    height: 100vh !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 9999 !important;
  }
  
  .flowise-chatbot iframe {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
