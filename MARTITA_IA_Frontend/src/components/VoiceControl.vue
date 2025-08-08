<template>
  <div class="voice-control">
    <div class="voice-header">
      <h3>🔊 Control de Voz</h3>
      <button 
        class="toggle-btn" 
        :class="{ active: isSpeechEnabled }"
        @click="toggleVoice"
      >
        {{ isSpeechEnabled ? '🔊' : '🔇' }}
      </button>
    </div>

    <div v-if="isSpeechEnabled" class="voice-settings">
      <div class="voice-selector">
        <label for="voice-select">Seleccionar Voz:</label>
        <select 
          id="voice-select" 
          v-model="selectedVoiceIndex" 
          @change="changeVoice"
          class="voice-select"
        >
          <option value="" disabled>Selecciona una voz...</option>
          <option 
            v-for="(voice, index) in availableVoices" 
            :key="index" 
            :value="index"
          >
            {{ voice.name }} ({{ voice.lang }})
          </option>
        </select>
      </div>

      <div class="voice-actions">
        <button class="test-btn" @click="testVoice">
          🎤 Probar Voz
        </button>
        <button class="stop-btn" @click="stopVoice">
          ⏹️ Detener
        </button>
      </div>

      <div class="emotion-controls">
        <h4>🎭 Emociones del Bot</h4>
        <div class="emotion-buttons">
          <button 
            v-for="emotion in availableEmotions" 
            :key="emotion"
            :class="['emotion-btn', { active: currentEmotion === emotion }]"
            @click="changeEmotion(emotion)"
          >
            {{ getEmotionEmoji(emotion) }} {{ emotion }}
          </button>
        </div>
        <p class="current-emotion">
          Emoción actual: <strong>{{ currentEmotion }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  getAvailableVoices, 
  setSelectedVoice, 
  toggleSpeech, 
  testSpeech, 
  stopSpeech,
  getCurrentEmotion,
  setEmotion,
  getAvailableEmotions
} from '@/services/martita-chatbot.js';

const isSpeechEnabled = ref(true);
const availableVoices = ref([]);
const selectedVoiceIndex = ref('');
const currentEmotion = ref('feliz');
const availableEmotions = ref([]);

const emotionEmojis = {
  'feliz': '😊',
  'saludo': '👋',
  'confundido': '😕',
  'enojado': '😠',
  'aturdido': '😵'
};

const getEmotionEmoji = (emotion) => {
  return emotionEmojis[emotion] || '😊';
};

const toggleVoice = () => {
  isSpeechEnabled.value = !isSpeechEnabled.value;
  toggleSpeech(isSpeechEnabled.value);
};

const changeVoice = () => {
  if (selectedVoiceIndex.value !== '') {
    setSelectedVoice(parseInt(selectedVoiceIndex.value));
  }
};

const testVoice = () => {
  const testMessages = [
    '¡Hola! Soy Martita AI, tu asistente virtual del GAD de Cayambe.',
    'Estoy aquí para ayudarte con todos los trámites municipales.',
    '¿En qué puedo ayudarte hoy?'
  ];
  const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
  testSpeech(randomMessage);
};

const stopVoice = () => {
  stopSpeech();
};

const changeEmotion = (emotion) => {
  setEmotion(emotion);
  currentEmotion.value = emotion;
  
  // Probar voz con mensaje específico para la emoción
  const emotionMessages = {
    'feliz': '¡Excelente! Me alegra poder ayudarte.',
    'saludo': '¡Hola! Bienvenido, es un placer conocerte.',
    'confundido': 'Hmm, no estoy seguro de entender completamente.',
    'enojado': 'Parece que hay un problema que necesitamos resolver.',
    'aturdido': 'Esto es un poco complicado, pero podemos resolverlo juntos.'
  };
  
  if (isSpeechEnabled.value && emotionMessages[emotion]) {
    testSpeech(emotionMessages[emotion]);
  }
};

onMounted(() => {
  // Cargar voces disponibles con un pequeño retraso
  setTimeout(() => {
    availableVoices.value = getAvailableVoices();
    currentEmotion.value = getCurrentEmotion();
    availableEmotions.value = getAvailableEmotions();
    
    // Seleccionar la primera voz española disponible
    const spanishVoice = availableVoices.value.findIndex(voice => 
      voice.lang.startsWith('es')
    );
    if (spanishVoice !== -1) {
      selectedVoiceIndex.value = spanishVoice;
      changeVoice();
    }
  }, 1000);
});
</script>

<style scoped>
.voice-control {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  margin-bottom: 2rem;
}

.voice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.voice-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.toggle-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1.2rem;
}

.toggle-btn.active {
  background-color: #42b983;
}

.toggle-btn:hover {
  opacity: 0.8;
}

.voice-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.voice-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.voice-select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: white;
  font-size: 0.9rem;
}

.voice-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.test-btn, .stop-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.test-btn {
  background-color: #42b983;
  color: white;
}

.test-btn:hover {
  background-color: #3aa873;
}

.stop-btn {
  background-color: #e74c3c;
  color: white;
}

.stop-btn:hover {
  background-color: #c0392b;
}

.emotion-controls h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.emotion-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.emotion-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 20px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.emotion-btn:hover {
  border-color: #42b983;
  background-color: #f8f9fa;
}

.emotion-btn.active {
  border-color: #42b983;
  background-color: #42b983;
  color: white;
}

.current-emotion {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  text-align: center;
}

/* === RESPONSIVE DESIGN === */

/* Mobile Landscape */
@media (max-width: 768px) {
  .voice-control {
    padding: 1rem;
  }
  
  .voice-header h3 {
    font-size: 1.1rem;
  }
  
  .voice-actions {
    justify-content: center;
  }
  
  .test-btn, .stop-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .emotion-buttons {
    justify-content: center;
  }
  
  .emotion-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .voice-control {
    padding: 0.8rem;
  }
  
  .voice-header {
    flex-direction: column;
    gap: 0.8rem;
    text-align: center;
  }
  
  .voice-settings {
    gap: 1rem;
  }
  
  .voice-actions {
    flex-direction: column;
  }
  
  .test-btn, .stop-btn {
    width: 100%;
  }
  
  .emotion-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .emotion-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
