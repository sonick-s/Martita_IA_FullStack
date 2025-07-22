<template>
  <div class="profile-view">
    <header class="view-header">
      <h1>Mi Perfil</h1>
      <p>Actualiza tu información personal y tu contraseña.</p>
    </header>

    <div v-if="usersStore.isLoading" class="loading-message">Cargando perfil...</div>
    <div v-else-if="usersStore.error" class="error-message">{{ usersStore.error }}</div>

    <div v-else-if="profileData" class="profile-container">
      <form @submit.prevent="handleUpdateProfile" class="profile-form">

        <div class="form-section">
          <h3>Información Personal</h3>
          <div class="form-group">
            <label for="name">Nombre</label>
            <input id="name" type="text" v-model="profileData.nombre" />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input id="email" type="email" v-model="profileData.email" disabled />
            <small>El correo electrónico no se puede cambiar.</small>
          </div>
        </div>

        <div class="form-section">
          <h3>Cambiar Contraseña</h3>
          <p class="section-subtitle">Deja estos campos en blanco si no quieres cambiar tu contraseña.</p>
          <div class="form-group">
            <label for="new-password">Nueva Contraseña</label>
            <input id="new-password" type="password" v-model="newPassword" placeholder="••••••••" />
          </div>
           <div class="form-group">
            <label for="confirm-password">Confirmar Nueva Contraseña</label>
            <input id="confirm-password" type="password" v-model="confirmPassword" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-actions">
          <button type="submit" class="button-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useUsersStore } from '@/stores/users';

const usersStore = useUsersStore();

const profileData = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

watch(() => usersStore.profile, (newProfile) => {
  if (newProfile) {
    profileData.value = { ...newProfile };
  }
}, { immediate: true });


onMounted(() => {
  if (!usersStore.profile) {
    usersStore.fetchProfile();
  }
});

const handleUpdateProfile = async () => {
  errorMessage.value = '';

  // Se valida que las contraseñas coincidan si se han rellenado
  if (newPassword.value || confirmPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Las nuevas contraseñas no coinciden.';
      return;
    }
  }
  // SE HA ELIMINADO LA VALIDACIÓN DE MÍNIMO DE CARACTERES

  const dataToUpdate = {
    nombre: profileData.value.nombre,
    email: profileData.value.email,
  };

  if (newPassword.value) {
    dataToUpdate.password = newPassword.value;
  }

  try {
    await usersStore.updateProfile(dataToUpdate);
    alert('¡Perfil actualizado con éxito!');
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al actualizar el perfil.';
    console.error("Error al actualizar el perfil:", error);
  }
};
</script>

<style scoped>
/* ESTILOS DE COLOR CORREGIDOS */
.profile-view {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  color: #2c3e50; /* Color de texto base */
}
.view-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}
.view-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}
.view-header p {
  color: #6c757d;
  margin-top: 0.5rem;
}
.profile-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
}
.profile-form {
  padding: 2rem;
}
.form-section {
  margin-bottom: 2rem;
}
.form-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  color: #2c3e50;
}
.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: -1rem;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50; /* Color de las etiquetas */
}
input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
  color: #2c3e50; /* Color del texto dentro del input */
}
input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
small {
  font-size: 0.8rem;
  color: #6c757d;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}
.button-primary {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.error-message {
  color: #c0392b;
  margin-top: 1rem;
  text-align: center;
}
.loading-message {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}
</style>
