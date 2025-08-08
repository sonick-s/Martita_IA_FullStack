<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h1>¡Bienvenido al Dashboard de Martita AI!</h1>
      
      <div v-if="isLoading" class="loading">Cargando información del usuario...</div>
      
      <div v-else-if="authStore.userEmail" class="user-info">
        <p>Sesión iniciada como: <strong>{{ authStore.userEmail }}</strong></p>
        <p class="welcome-text">Desde aquí puedes gestionar las reglas del bot, revisar el historial y configurar las opciones de voz.</p>
      </div>
      
      <p v-else class="error">No se pudo cargar la información del usuario.</p>
    </div>

    <!-- Voice Control Section -->
    <VoiceControl />

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <router-link to="/dashboard/rules" class="action-card">
          <div class="action-icon">⚙️</div>
          <h3>Reglas del Bot</h3>
          <p>Configura las reglas y comportamiento de Martita AI</p>
        </router-link>
        
        <router-link to="/dashboard/history" class="action-card">
          <div class="action-icon">📊</div>
          <h3>Historial</h3>
          <p>Revisa las conversaciones y estadísticas</p>
        </router-link>
        
        <router-link to="/dashboard/procedures" class="action-card">
          <div class="action-icon">📋</div>
          <h3>Trámites</h3>
          <p>Gestiona los procedimientos municipales</p>
        </router-link>
        
        <router-link to="/dashboard/users" class="action-card">
          <div class="action-icon">👥</div>
          <h3>Usuarios</h3>
          <p>Administra cuentas de usuario</p>
        </router-link>
      </div>
    </div>

    <!-- Chatbot Status -->
    <div class="chatbot-status">
      <h3>Estado del Chatbot</h3>
      <div class="status-info">
        <div class="status-item">
          <span class="status-label">Estado:</span>
          <span :class="['status-badge', chatbotInitialized ? 'active' : 'inactive']">
            {{ chatbotInitialized ? '🟢 Activo' : '🔴 Inactivo' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Emoción Actual:</span>
          <span class="emotion-display">{{ getEmotionEmoji(currentEmotion) }} {{ currentEmotion }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">Voz:</span>
          <span :class="['status-badge', speechEnabled ? 'active' : 'inactive']">
            {{ speechEnabled ? '🔊 Habilitada' : '🔇 Deshabilitada' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VoiceControl from '@/components/VoiceControl.vue'
import { 
  isChatbotInitialized, 
  getCurrentEmotion 
} from '@/services/martita-chatbot.js'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)
const chatbotInitialized = ref(false)
const currentEmotion = ref('feliz')
const speechEnabled = ref(true)

const emotionEmojis = {
  'feliz': '😊',
  'saludo': '👋',
  'confundido': '😕',
  'enojado': '😠',
  'aturdido': '😵'
}

const getEmotionEmoji = (emotion) => {
  return emotionEmojis[emotion] || '😊'
}

onMounted(async () => {
  if (!authStore.userEmail) {
    await authStore.fetchUser()
  }
  
  // Verificar estado del chatbot
  chatbotInitialized.value = isChatbotInitialized()
  currentEmotion.value = getCurrentEmotion()
  
  // Verificar si la síntesis de voz está disponible
  speechEnabled.value = 'speechSynthesis' in window
  
  isLoading.value = false
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #42b983 0%, #369870 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(66, 185, 131, 0.3);
}

.welcome-section h1 {
  margin: 0 0 1rem 0;
  font-size: 2.2rem;
  font-weight: 700;
}

.user-info {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.user-info p {
  margin: 0.5rem 0;
}

.welcome-text {
  opacity: 0.9;
  font-size: 1.1rem;
}

.loading {
  padding: 2rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

.error {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 8px;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #42b983;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.action-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  text-align: center;
}

.action-card p {
  margin: 0;
  color: #6c757d;
  text-align: center;
  line-height: 1.5;
}

/* Chatbot Status */
.chatbot-status {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.chatbot-status h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.5rem;
}

.status-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.emotion-display {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-radius: 20px;
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
}

/* === RESPONSIVE DESIGN === */

/* Tablets */
@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1.5rem;
  }
  
  .welcome-section {
    padding: 1.5rem;
  }
  
  .welcome-section h1 {
    font-size: 1.8rem;
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .action-card {
    padding: 1.5rem;
  }
}

/* Mobile Landscape */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .welcome-section {
    padding: 1rem;
    margin-bottom: 2rem;
  }
  
  .welcome-section h1 {
    font-size: 1.6rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .action-card {
    padding: 1.2rem;
  }
  
  .action-icon {
    font-size: 2.5rem;
  }
  
  .status-info {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .chatbot-status {
    padding: 1.5rem;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .dashboard-container {
    padding: 0.8rem;
  }
  
  .welcome-section {
    padding: 0.8rem;
  }
  
  .welcome-section h1 {
    font-size: 1.4rem;
  }
  
  .action-card {
    padding: 1rem;
  }
  
  .action-icon {
    font-size: 2rem;
  }
  
  .action-card h3 {
    font-size: 1.1rem;
  }
  
  .chatbot-status {
    padding: 1rem;
  }
  
  .status-badge, .emotion-display {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
.loading, .err {
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
