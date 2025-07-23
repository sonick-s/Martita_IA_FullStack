<template>
  <div class="split-screen-container">
    <div class="left-pane">
      <img src="@/assets/saludo.png" alt="Logo de Martita AI" class="vue-logo" />
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
  height: 100vh;
}

.left-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
}

.vue-logo {
  width: 70%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 0 50px rgba(45, 123, 0, 0.923));
  position: relative;
  z-index: 1;
}

.right-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 12px;
  background-color: white;
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
