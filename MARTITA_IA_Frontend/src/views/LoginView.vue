<template>
  <div class="split-screen-container">
    <div class="left-pane">
      <img src="@/assets/saludoMano.gif" alt="Logo de Martita AI" class="vue-logo" />
    </div>

    <div class="right-pane">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Bienvenido a Martita AI</p>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" required placeholder="tu@email.com" />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" required placeholder="••••••••" />
          </div>
          <button type="submit" :disabled="isLoading" class="btn btn-primary">
            <span v-if="isLoading">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </form>

        <router-link to="/register" class="btn btn-secondary">
          Crear Nueva Cuenta
        </router-link>

        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = 'Email o contraseña incorrectos. Inténtalo de nuevo.';
    console.error("Error capturado en el componente de login:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.split-screen-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

/* Infinite border animation */
@keyframes borderAnimation {
  0% {
    background-position: 0 0, 0 100%, 0 0, 100% 0;
  }
  100% {
    background-position: 100% 0, 0 100%, 0 0, 100% 100%;
  }
}

.split-screen-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, #2d7b00 2px, transparent 2px) 0 0,
    linear-gradient(90deg, #2d7b00 2px, transparent 2px) 0 100%,
    linear-gradient(0deg, #2d7b00 2px, transparent 2px) 0 0,
    linear-gradient(0deg, #2d7b00 2px, transparent 2px) 100% 0;
  background-size: 20px 20px;
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  z-index: 0;
  animation: borderAnimation 20s linear infinite;
  pointer-events: none;
}

.left-pane {
  flex: 1 1 45%;
  min-width: 300px;
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  position: relative;
  padding: 2rem;
  z-index: 1;
}

.vue-logo {
  width: 100%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 0 30px rgba(45, 123, 0, 0.5));
  transition: transform 0.3s ease;
}

.vue-logo:hover {
  transform: scale(1.05);
}

.right-pane {
  flex: 1 1 55%;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .left-pane, .right-pane {
    flex: 1 1 100%;
    min-height: auto;
  }
  
  .left-pane {
    padding: 4rem 2rem;
  }
  
  .vue-logo {
    max-width: 300px;
  }
}

.login-card {
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 12px;
  border-color: black;
  background-color: rgba(45, 123, 0, 0.171);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin: 1rem;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-sizing: border-box;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s;
  box-sizing: border-box;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  margin-top: 1rem;
}
.btn-primary:hover:not(:disabled) {
  background-color: #34966b;
}

.btn-secondary {
  background-color: #e9ecef;
  color: #495057;
  margin-top: 1rem;
}
.btn-secondary:hover {
  background-color: #d3d9df;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #c0392b;
  background-color: #fbeae5;
  text-align: center;
  margin-top: 1.5rem;
  padding: 0.8rem;
  border-radius: 8px;
}
.error-message p {
  margin: 0;
}
</style>
