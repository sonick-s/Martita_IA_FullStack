<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Martita AI</h2>
      </div>

      <div class="logo-container">
        <img src="@/assets/feliz.png" alt="Logo Martita AI" class="logo" />
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
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  <span>Perfil</span>
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
  position: relative;
}

/* --- Barra Lateral --- */
.sidebar {
  width: 260px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

/* Título centrado */
.sidebar-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.sidebar-header h2 {
  font-size: 1.8rem;
  margin: 0;
  color: #2c3e50;
}

/* Contenedor para centrar el logo */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

/* Estilos del logo */
.logo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1),
              0 0 25px rgba(66, 185, 131, 0.7);
  background-color: black; /* <-- LÍNEA AÑADIDA */
}

/* Navegación */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex-grow: 1;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #34495e;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

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

/* === RESPONSIVE DESIGN === */

/* Tablets (768px - 1024px) */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
    padding: 1rem;
  }
  
  .sidebar-header h2 {
    font-size: 1.6rem;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
  
  .main-content {
    padding: 2rem;
  }
}

/* Mobile Landscape (768px and below) */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .sidebar-header {
    margin-bottom: 0;
  }
  
  .sidebar-header h2 {
    font-size: 1.4rem;
  }
  
  .logo-container {
    margin-bottom: 0;
    margin-right: 1rem;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
  
  .sidebar-nav {
    flex-direction: row;
    gap: 0.5rem;
    flex-grow: 0;
  }
  
  .sidebar-nav a {
    padding: 0.5rem;
    border-radius: 6px;
    min-width: 44px;
    justify-content: center;
  }
  
  .sidebar-nav a span {
    display: none;
  }
  
  .sidebar-nav a svg {
    width: 18px;
    height: 18px;
  }
  
  .sidebar-footer {
    margin-top: 0;
    margin-left: auto;
  }
  
  .logout-button {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 1.5rem;
    height: calc(100vh - 80px);
  }
}

/* Mobile Portrait (480px and below) */
@media (max-width: 480px) {
  .sidebar {
    padding: 0.8rem;
  }
  
  .sidebar-header h2 {
    font-size: 1.2rem;
  }
  
  .logo {
    width: 50px;
    height: 50px;
  }
  
  .sidebar-nav {
    gap: 0.3rem;
  }
  
  .sidebar-nav a {
    padding: 0.4rem;
    min-width: 40px;
  }
  
  .sidebar-nav a svg {
    width: 16px;
    height: 16px;
  }
  
  .logout-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .main-content {
    padding: 1rem;
    height: calc(100vh - 70px);
  }
}

/* Extra Small Mobile (320px and below) */
@media (max-width: 320px) {
  .sidebar {
    padding: 0.5rem;
  }
  
  .sidebar-header h2 {
    font-size: 1rem;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
  
  .sidebar-nav a {
    padding: 0.3rem;
    min-width: 36px;
  }
  
  .sidebar-nav a svg {
    width: 14px;
    height: 14px;
  }
  
  .logout-button {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
  
  .main-content {
    padding: 0.8rem;
  }
}
</style>
