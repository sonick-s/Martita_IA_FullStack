<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <img src="@/assets/saludo.png" alt="Vue Logo" class="logo" />
        <h2>Crear Nueva Cuenta</h2>
        <p>Es rápido y fácil. Únete a Martita AI.</p>
      </div>

      <form @submit.prevent="handleRegister($event)" class="card-body" autocomplete="off" novalidate>
        <!-- Sección de Credenciales de Administrador (Requeridas) -->
        <div class="admin-section">
          <h3 class="section-title">Credenciales de Administrador</h3>
          <p class="section-description">Ingrese las credenciales de administrador para autorizar el registro</p>
          
          <div class="form-group">
            <label for="adminUsername">Usuario Administrador *</label>
            <input 
              type="text" 
              id="adminUsername" 
              v-model="adminUsername" 
              placeholder="Ingrese usuario administrador" 
              autocomplete="off"
              spellcheck="false"
              data-form-type="other"
            />
          </div>
          <div class="form-group">
            <label for="adminPassword">Contraseña Administrador *</label>
            <input 
              type="password" 
              id="adminPassword" 
              v-model="adminPassword" 
              placeholder="Ingrese contraseña administrador" 
              autocomplete="new-password"
              data-form-type="other"
            />
          </div>
        </div>

        <!-- Separador -->
        <div class="form-divider"></div>

        <!-- Sección de Datos del Usuario -->
        <div class="user-section">
          <h3 class="section-title">Datos del Usuario</h3>
          <p class="section-description">Complete la información para crear su cuenta</p>
          
          <div class="form-group">
            <label for="name">Nombre Completo *</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              placeholder="Ingrese su nombre completo" 
              autocomplete="off"
              spellcheck="false"
              data-form-type="other"
            />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico *</label>
            <input 
              type="text" 
              id="email" 
              v-model="email" 
              placeholder="Ingrese su correo electrónico" 
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              data-1p-ignore
              readonly
              onfocus="this.removeAttribute('readonly');"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña *</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Mínimo 8 caracteres" 
              autocomplete="new-password"
              data-form-type="other"
              readonly
              onfocus="this.removeAttribute('readonly');"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña *</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="Confirme su contraseña" 
              autocomplete="new-password"
              data-form-type="other"
              readonly
              onfocus="this.removeAttribute('readonly');"
            />
          </div>
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

      <!-- Mensaje de Error Mejorado -->
      <div v-if="errorMessage" class="error-alert">
        <div class="error-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#EF4444"/>
            <path d="M10 6V10M10 14H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="error-content">
          <h4>Error en el registro</h4>
          <p>{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="error-close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
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
const adminUsername = ref('');
const adminPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const validateForm = () => {
  // Limpiar mensaje de error previo
  errorMessage.value = '';

  // Validar campos requeridos
  if (!name.value.trim()) {
    errorMessage.value = 'El nombre completo es requerido.';
    return false;
  }

  if (!email.value.trim()) {
    errorMessage.value = 'El correo electrónico es requerido.';
    return false;
  }

  // Validar dominio del email
  if (!email.value.endsWith('@gadipmc.gob.ec')) {
    errorMessage.value = 'Formato de correo electrónico no válido.';
    return false;
  }

  if (!password.value) {
    errorMessage.value = 'La contraseña es requerida.';
    return false;
  }

  if (password.value.length < 8) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
    return false;
  }

  if (!confirmPassword.value) {
    errorMessage.value = 'Debe confirmar su contraseña.';
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return false;
  }

  if (!adminUsername.value.trim()) {
    errorMessage.value = 'El usuario administrador es requerido.';
    return false;
  }

  if (!adminPassword.value) {
    errorMessage.value = 'La contraseña de administrador es requerida.';
    return false;
  }

  return true;
};

const handleRegister = async (event) => {
  // Prevenir comportamiento por defecto del formulario
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Validar formulario antes de proceder
  if (!validateForm()) {
    return; // Detener ejecución sin recargar la página
  }

  isLoading.value = true;
  try {
    await authStore.register(
      name.value, 
      email.value, 
      password.value, 
      adminUsername.value, 
      adminPassword.value
    );
    // Solo redirigir si el registro fue exitoso
    router.push('/dashboard');
  } catch (error) {
    // NO redirigir en caso de error, mantener en la página de registro
    console.error("Error en registro:", error);
    
    // Mostrar mensajes de error más específicos según el tipo de error
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail;
    } else if (error.response && error.response.status === 400) {
      errorMessage.value = 'Datos incorrectos. Verifica las credenciales de administrador y los datos del usuario.';
    } else if (error.response && error.response.status === 401) {
      errorMessage.value = 'Credenciales de administrador incorrectas.';
    } else if (error.response && error.response.status === 403) {
      errorMessage.value = 'No tienes permisos para registrar usuarios.';
    } else {
      errorMessage.value = 'No se pudo crear la cuenta. Verifica los datos ingresados.';
    }
    
    // Asegurar que NO se redirija a login
    // Permanecer en la página de registro
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
  max-width: 650px;
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

/* Estilos para campos readonly que se activan al hacer focus */
input[readonly] {
  background-color: white !important;
  color: #495057 !important;
  cursor: text !important;
  opacity: 1 !important;
}

input[readonly]:focus {
  background-color: white !important;
  border-color: #42b983 !important;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2) !important;
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

/* Nuevo diseño de alerta de error */
.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  animation: slideInDown 0.3s ease-out;
}

.error-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.error-content {
  flex: 1;
}

.error-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #dc2626;
}

.error-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #991b1b;
  line-height: 1.4;
}

.error-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.error-close:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para secciones del formulario */
.admin-section, .user-section {
  margin-bottom: 1.5rem;
}

.admin-section {
  background-color: #fff3cd;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  margin-bottom: 2rem;
}

.user-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 700;
}

.section-description {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.form-divider {
  height: 2px;
  background: linear-gradient(to right, #42b983, #ffc107);
  margin: 2rem 0;
  border-radius: 1px;
}

/* Mejorar placeholders */
input::placeholder {
  color: #adb5bd;
  font-style: italic;
}

/* Responsive para secciones */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    max-width: 100%;
    padding: 1.5rem;
  }
  
  .admin-section, .user-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .section-description {
    font-size: 0.85rem;
  }
  
  .error-alert {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .error-content h4 {
    font-size: 0.9rem;
  }
  
  .error-content p {
    font-size: 0.85rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .register-card {
    max-width: 580px;
  }
}

@media (min-width: 1025px) {
  .register-card {
    max-width: 650px;
  }
}
</style>
