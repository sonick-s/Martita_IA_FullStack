<template>
  <div class="split-screen-container">
    <div class="left-pane">
      <img src="@/assets/logo.svg" alt="Vue Logo" class="vue-logo" />
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
          <button type="submit" :disabled="isLoading">
            <span v-if="isLoading">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </form>

        <div class="register-link">
          <p>¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link></p>
        </div>

        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// El script no cambia
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
/* ... (Todos los estilos anteriores se mantienen) ... */
.split-screen-container, .left-pane, .right-pane, .vue-logo, .login-card, h2, .subtitle, .form-group, label, input, button, .error-message {
  /* No es necesario copiar esto, solo es para indicar que los estilos previos van aquí */
}

/* ESTILO AÑADIDO PARA EL NUEVO ENLACE */
.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
.register-link p {
  margin: 0;
}
.register-link a {
  color: #42b983;
  font-weight: 600;
  text-decoration: none;
}
.register-link a:hover {
  text-decoration: underline;
}

/* Re-copia estos estilos por si acaso */
.split-screen-container { display: flex; width: 100%; height: 100vh; }
.left-pane { flex: 1; display: flex; justify-content: center; align-items: center; background-color: white; }
.vue-logo { width: 50%; max-width: 300px; height: auto; }
.right-pane { flex: 1; display: flex; justify-content: center; align-items: center; background-color: #f0f2f5; }
.login-card { max-width: 400px; width: 100%; padding: 2.5rem; border-radius: 12px; background-color: white; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); margin: 1rem; }
h2 { text-align: center; color: #2c3e50; margin-top: 0; margin-bottom: 0.5rem; font-weight: 700; font-size: 2rem; }
.subtitle { text-align: center; color: #7f8c8d; margin-bottom: 2rem; }
.form-group { margin-bottom: 1.25rem; }
label { display: block; margin-bottom: 0.5rem; color: #34495e; font-weight: 600; }
input { width: 100%; padding: 0.8rem; border: 1px solid #dcdcdc; border-radius: 8px; box-sizing: border-box; }
button { width: 100%; padding: 0.9rem; background-color: #42b983; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; margin-top: 1rem; }
.error-message { color: #c0392b; background-color: #fbeae5; text-align: center; margin-top: 1.5rem; padding: 0.8rem; border-radius: 8px; }
.error-message p { margin: 0; }
</style>
