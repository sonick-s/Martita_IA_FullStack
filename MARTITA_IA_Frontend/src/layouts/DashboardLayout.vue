<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Martita AI</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard/rules">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span>Reglas de Bot</span>
        </router-link>
        <router-link to="/dashboard/procedures">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          <span>Trámites</span>
        </router-link>
        <router-link to="/dashboard/history">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/><path d="m12 18 3.5-3-3.5-3"/><path d="m19 6-3.5 3 3.5 3"/></svg>
          <span>Historial</span>
        </router-link>
        <router-link to="/dashboard/users">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Usuarios</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-button">Cerrar Sesión</button>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
}

/* --- Barra Lateral --- */
.sidebar {
  width: 260px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding-left: 0.5rem;
}

.logo {
  height: 50px; /* Ajusta según el tamaño de tu GIF */
  width: 50px;
  object-fit: cover;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #2c3e50;
}

/* Navegación */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex-grow: 1;
}

/* CAMBIO: Estilos para los enlaces con iconos */
.sidebar-nav a {
  display: flex; /* Para alinear icono y texto */
  align-items: center;
  gap: 1rem; /* Espacio entre icono y texto */
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #34495e;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

/* CAMBIO: Estilos para los iconos SVG */
.sidebar-nav a svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  transition: stroke 0.2s;
}

.sidebar-nav a:hover {
  background-color: #f0f4f8;
}

.sidebar-nav a.router-link-exact-active {
  background-color: #42b983;
  color: white;
  font-weight: 600;
}

/* CAMBIO: El icono también cambia de color cuando el enlace está activo */
.sidebar-nav a.router-link-exact-active svg {
  stroke: white;
}

/* Pie de la barra lateral */
.sidebar-footer {
  margin-top: auto;
}

.logout-button {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background-color: #e74c3c;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c0392b;
}

/* --- Contenido Principal --- */
.main-content {
  flex-grow: 1;
  padding: 2.5rem;
  overflow-y: auto;
}
</style>
