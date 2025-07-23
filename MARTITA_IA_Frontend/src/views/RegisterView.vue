<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <img src="@/assets/saludo.png" alt="Vue Logo" class="logo" />
        <h2>Crear Nueva Cuenta</h2>
        <p>Es rápido y fácil. Únete a Martita AI.</p>
      </div>

      <form @submit.prevent="handleRegister" class="card-body">
        <div class="form-group">
          <label for="name">Nombre Completo</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>

        <div class="form-actions">
          <router-link to="/login" class="btn btn-secondary">
            Iniciar Sesión
          </router-link>
          <button type="submit" :disabled="isLoading" class="btn btn-primary">
            {{ isLoading ? 'Creando...' : 'Registrarse' }}
          </button>
        </div>
      </form>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
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

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register(name.value, email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = 'No se pudo crear la cuenta. El email podría estar en uso.';
    console.error("Error capturado en el componente de registro:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  padding: 2rem;
  box-sizing: border-box;
}

.register-card {
  background: white;
  max-width: 450px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 90px;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.card-header p {
  margin-top: 0.5rem;
  color: #6c757d;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: background-color 0.2s, box-shadow 0.2s;
  text-align: center;
  text-decoration: none;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #34966b;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
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
