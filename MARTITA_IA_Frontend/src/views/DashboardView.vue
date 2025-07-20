<template>
  <div class="dashboard-container">
    <h1>¡Bienvenido al Dashboard!</h1>

    <div v-if="isLoading" class="loading">Cargando información del usuario...</div>

    <p v-else-if="authStore.userEmail">
      Sesión iniciada como: <strong>{{ authStore.userEmail }}</strong>
    </p>

    <p v-else class="error">No se pudo cargar la información del usuario.</p>

    <button @click="handleLogout">Cerrar Sesión</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Importamos onMounted
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)

// onMounted es un "hook" del ciclo de vida que se ejecuta
// cuando el componente se ha montado en la página.
onMounted(async () => {
  // Si no tenemos el email del usuario, intentamos obtenerlo.
  if (!authStore.userEmail) {
    await authStore.fetchUser()
  }
  isLoading.value = false
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Los estilos se mantienen, pero puedes añadir uno para el estado de carga */
.dashboard-container {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.loading, .error {
  color: #6c757d;
  font-style: italic;
}
.error {
  color: #e74c3c;
}
button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
