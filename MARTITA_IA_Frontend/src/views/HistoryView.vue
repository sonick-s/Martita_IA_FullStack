<template>
  <div class="history-view">
    <header class="view-header">
      <h1>Historial de Mensajes</h1>
    </header>

    <div class="table-container">
      <div v-if="historyStore.isLoading" class="loading-message">Cargando historial...</div>
      <div v-else-if="historyStore.error" class="error-message">{{ historyStore.error }}</div>

      <table v-else-if="historyStore.interactions.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pregunta del Usuario</th>
            <th>Respuesta del Bot</th>
            <th>¿Respuesta Útil?</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historyStore.interactions" :key="item.id_interaccion">
            <td v-if="item">{{ item.id_interaccion }}</td>
            <td v-if="item" class="content-cell">{{ item.pregunta }}</td>
            <td v-if="item" class="content-cell">{{ item.respuesta }}</td>
            <td v-if="item">
              <span v-if="item.respuesta_util" :class="['like-badge', item.respuesta_util.toLowerCase()]">
                {{ item.respuesta_util }}
              </span>
              <span v-else class="like-badge n-a">N/A</span>
            </td>
            <td v-if="item">{{ formatDate(item.fecha) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-message">No hay interacciones en el historial.</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHistoryStore } from '@/stores/history';

const historyStore = useHistoryStore();

onMounted(() => {
  historyStore.fetchHistory();
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
/* Estilos consistentes con las otras vistas */
.history-view {
  font-family: sans-serif;
}
.view-header {
  margin-bottom: 2rem;
}
.view-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}
.table-container {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}
td {
  color: #2c3e50;
}
th {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.content-cell {
  max-width: 350px;
  white-space: normal;
}
.like-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.like-badge.like {
  background-color: #e7f5ec;
  color: #28a745;
}
.like-badge.dislike {
  background-color: #f8d7da;
  color: #dc3545;
}
.like-badge.n-a {
  background-color: #e9ecef;
  color: #6c757d;
}
.loading-message, .error-message, .empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
.error-message {
  color: #dc3545;
}
</style>
