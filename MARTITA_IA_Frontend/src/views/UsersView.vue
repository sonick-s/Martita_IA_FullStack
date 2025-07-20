<template>
  <div class="users-view">
    <header class="view-header">
      <h1>Gestión de Usuarios</h1>
      <button class="action-btn">+ Invitar Usuario</button>
    </header>

    <div v-if="usersStore.isLoading || directionsStore.isLoading" class="loading-message">Cargando...</div>
    <div v-else-if="usersStore.error || directionsStore.error" class="error-message">
      {{ usersStore.error || directionsStore.error }}
    </div>

    <div v-else-if="usersStore.users.length > 0" class="users-grid">
      <div v-for="user in usersStore.users" :key="user.id_usuario" class="user-card">
        <div class="card-header">
          <div class="user-info">
            <h3 class="user-name">{{ user.nombre || 'Usuario sin nombre' }}</h3>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <span :class="['status-badge', user.estado === 1 ? 'active' : 'inactive']">
            {{ user.estado === 1 ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <div class="card-body">
          <p><strong>Fecha de Registro:</strong> {{ formatDate(user.fecha_registro) }}</p>
          <p><strong>Rol / Dirección:</strong> Supervisor de {{ directionInCharge(user.nombre) }}</p>
        </div>
        <div class="card-footer">
          <button class="card-action-btn edit">📝 Editar</button>
          <button class="card-action-btn delete">🗑️ Eliminar</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-message">No hay usuarios registrados en el sistema.</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useDirectionsStore } from '@/stores/directions';

const usersStore = useUsersStore();
const directionsStore = useDirectionsStore();

// Cuando el componente se carga, pedimos los datos de ambos endpoints
onMounted(() => {
  usersStore.fetchUsers();
  directionsStore.fetchDirections();
});

// Función para formatear la fecha que ahora sí funcionará
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función que busca en la lista de direcciones si el nombre de un usuario
// coincide con el de un responsable, y devuelve el nombre de la dirección.
const directionInCharge = (userName) => {
  if (!userName || !directionsStore.directions.length) {
    return 'Ninguna asignada';
  }
  const direction = directionsStore.directions.find(dir => dir.responsable === userName);
  return direction ? direction.nombre : 'Ninguna asignada';
};
</script>

<style scoped>
/* Estilos completos y funcionales */
.users-view {
  width: 100%;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.view-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}
.action-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.action-btn:hover {
  background-color: #34966b;
}
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.user-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}
.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}
.user-email {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.status-badge.active {
  background-color: #e7f5ec;
  color: #28a745;
}
.status-badge.inactive {
  background-color: #f8d7da;
  color: #dc3545;
}
.card-body {
  padding: 1.5rem;
  font-size: 0.9rem;
  color: #495057;
  flex-grow: 1;
}
.card-body p {
  margin: 0 0 0.5rem 0;
}
.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: #f8f9fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.card-action-btn {
  background: white;
  border: 1px solid #ced4da;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.card-action-btn.delete {
  background-color: #fff5f5;
  border-color: #e53e3e;
  color: #e53e3e;
}
.loading-message, .empty-message {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: white;
  border-radius: 12px;
}
</style>
