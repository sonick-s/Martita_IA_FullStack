import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
import apiClient from '@/boot/axios';

// Variables para manejar el estado del chatbot en la sesión actual
let loadedBotRules = [];
let conversationHistory = [];
let sessionId = null;
let isInitialized = false;
let currentEmotion = 'feliz'; // Estado emocional actual del bot
let speechSynthesis = null;
let availableVoices = [];
let selectedVoice = null;
let isSpeechEnabled = true;
let lastProcessedMessageId = null; // Para evitar reproducir mensajes antiguos
let isFirstLoad = true; // Para detectar la primera carga del chat

// Mapeo de emociones basado en el contenido de la respuesta
const emotionMapping = {
  'feliz': ['feliz.png', 'feli.png'],
  'saludo': ['saludo.png'],
  'confundido': ['confundido.png'],
  'enojado': ['enojado.png'],
  'aturdido': ['aturdido.png']
};

// Palabras clave para detectar emociones
const emotionKeywords = {
  'feliz': ['excelente', 'perfecto', 'genial', 'fantástico', 'maravilloso', 'bien', 'correcto', 'sí', 'claro', 'por supuesto'],
  'confundido': ['no entiendo', 'confuso', 'no comprendo', 'no sé', 'incierto', 'dudoso'],
  'enojado': ['error', 'problema', 'incorrecto', 'mal', 'no funciona', 'falla', 'imposible'],
  'aturdido': ['complicado', 'difícil', 'complejo', 'muchas opciones', 'varios pasos'],
  'saludo': ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'bienvenido']
};

/**
 * Carga las reglas del bot desde el backend.
 */
async function loadBotRules() {
  try {
    const response = await apiClient.get('/prompts-bot/');
    loadedBotRules = response.data.filter(rule => rule.estado === 1); // Solo reglas activas
    console.log('Reglas del bot cargadas:', loadedBotRules.length);
  } catch (error) {
    console.error('Error al cargar las reglas del bot:', error);
    loadedBotRules = [];
  }
}

/**
 * Construye el prompt dinámico basado en las reglas cargadas.
 */
function buildSystemPrompt(botRules) {
  let prompt = `Eres Martita AI, una asistente virtual amigable y profesional del GAD de Cayambe. Tu objetivo es ayudar a los usuarios con información sobre trámites y servicios municipales.

REGLAS GENERALES:
- Si sabes la respuesta, respóndela de forma clara y amable.
- Si no tienes información suficiente, sugiere contactar al encargado.
- Mantén un tono amigable y profesional.

REGLAS ESPECÍFICAS CONFIGURADAS:`;

  botRules.forEach((rule, index) => {
    prompt += `\n${index + 1}. ${rule.nombre} (${rule.tipo}): ${rule.contenido}`;
  });
  return prompt;
}

/**
 * Detecta la emoción basada en el contenido de la respuesta del bot
 */
function detectEmotion(responseText) {
  const text = responseText.toLowerCase();

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return emotion;
    }
  }

  // Emoción por defecto
  return 'feliz';
}

/**
 * Obtiene la imagen correspondiente a una emoción
 */
function getEmotionImage(emotion) {
  const images = emotionMapping[emotion] || emotionMapping['feliz'];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return `/src/assets/${randomImage}`;
}

/**
 * Inicializa el sistema de síntesis de voz
 */
function initializeSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;

    // Cargar voces disponibles
    const loadVoices = () => {
      try {
        // Obtener todas las voces disponibles
        const allVoices = speechSynthesis.getVoices();
        
        // Filtrar solo voces en español y que sean femeninas
        availableVoices = allVoices.filter(voice => {
          const voiceName = voice.name.toLowerCase();
          const isSpanish = voice.lang.startsWith('es');
          const isFemale = 
            voiceName.includes('helena') || 
            voiceName.includes('sabina') ||
            voiceName.includes('mujer') ||
            voiceName.includes('female') ||
            voiceName.endsWith('a') && 
            !voiceName.includes('jorge') && 
            !voiceName.includes('pablo') &&
            !voiceName.includes('carlos') &&
            !voiceName.includes('diego') &&
            !voiceName.includes('juan') &&
            !voiceName.includes('hombre') &&
            !voiceName.includes('male');
          
          return isSpanish && isFemale;
        });
        
        // Si no hay voces femeninas, mostrar advertencia y no seleccionar ninguna
        if (availableVoices.length === 0) {
          console.warn('⚠️ No se encontraron voces femeninas en español');
          // Mostrar todas las voces disponibles para depuración
          console.log('🔊 Voces disponibles en el sistema:', allVoices.map(v => `${v.name} (${v.lang})`).join(', '));
          return;
        }
        
        // Seleccionar la primera voz femenina disponible
        selectedVoice = availableVoices[0];
        console.log('✅ Voz femenina seleccionada:', selectedVoice.name, '- Idioma:', selectedVoice.lang);
      } catch (error) {
        console.error('❌ Error al cargar voces:', error);
      }
    };

    // Cargar voces inmediatamente
    loadVoices();
    
    // También cargar cuando cambien las voces disponibles
    speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    console.error('❌ SpeechSynthesis no está disponible en este navegador');
  }
}

/**
 * Reproduce el texto usando síntesis de voz con manejo robusto de errores
 */
function speakText(text) {
  // Limpiar el texto antes de procesarlo
  const cleanText = cleanTextForSpeech(text);
  
  // Verificar si el texto está vacío después de limpiar
  if (!cleanText) {
    console.log('🔇 speakText() ignorada - Texto vacío después de limpiar');
    return;
  }
  
  console.log('🔊 speakText() llamada con texto:', cleanText?.substring(0, 50) + (cleanText?.length > 50 ? '...' : ''));
  console.log('🔊 Estado de voz - isSpeechEnabled:', isSpeechEnabled);
  console.log('🔊 speechSynthesis disponible:', !!speechSynthesis);
  console.log('🔊 selectedVoice:', selectedVoice?.name || 'No seleccionada');

  // Validaciones previas
  if (!isSpeechEnabled) {
    console.log('❌ speakText() cancelada - Voz deshabilitada');
    return;
  }
  
  // Verificar que tenemos una voz femenina seleccionada
  if (!selectedVoice) {
    console.log('❌ speakText() cancelada - No hay voz femenina disponible');
    // Intentar reinicializar por si acaso
    initializeSpeechSynthesis();
    return;
  }

  if (!speechSynthesis) {
    console.log('❌ speakText() cancelada - SpeechSynthesis no disponible');
    return;
  }

  if (!cleanText) {
    console.log('❌ speakText() cancelada - Texto vacío después de limpiar');
    return;
  }

  // Si no hay voz seleccionada, intentar reinicializar
  if (!selectedVoice) {
    console.log('⚠️ No hay voz seleccionada, intentando reinicializar...');
    initializeSpeechSynthesis();
    
    // Esperar un poco y verificar de nuevo
    setTimeout(() => {
      if (!selectedVoice) {
        console.error('❌ No se pudo inicializar ninguna voz');
        return;
      }
      speakText(text); // Reintentar
    }, 200);
    return;
  }

  try {
    // Cancelar cualquier reproducción anterior
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      console.log('🔄 Cancelando reproducción anterior...');
      speechSynthesis.cancel();
      
      // Esperar un poco antes de continuar
      setTimeout(() => {
        performSpeech(cleanText);
      }, 100);
    } else {
      performSpeech(cleanText);
    }
  } catch (error) {
    console.error('❌ Error general en speakText:', error);
  }
}

/**
 * Función auxiliar para realizar la síntesis de voz
 */
function performSpeech(text) {
  try {
    console.log('🔊 Iniciando síntesis con voz:', selectedVoice.name);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar la voz y parámetros
    utterance.voice = selectedVoice;
    utterance.rate = 0.8;   // Velocidad moderada
    utterance.pitch = 0.9;  // Tono natural
    utterance.volume = 0.8; // Volumen moderado
    utterance.lang = selectedVoice.lang || 'es-ES';

    // Eventos para monitorear el estado
    utterance.onstart = () => {
      console.log('✅ Síntesis de voz iniciada exitosamente');
    };
    
    utterance.onend = () => {
      console.log('✅ Síntesis de voz completada exitosamente');
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Error en síntesis de voz:', {
        error: event.error,
        name: event.name,
        type: event.type
      });
      
      // Intentar con fallback si hay error
      if (event.error === 'interrupted' || event.error === 'network') {
        console.log('🔄 Intentando con voz de fallback...');
        tryFallbackVoice(text);
      }
    };
    
    utterance.onpause = () => {
      console.log('⏸️ Síntesis de voz pausada');
    };
    
    utterance.onresume = () => {
      console.log('▶️ Síntesis de voz reanudada');
    };

    // Reproducir el texto
    speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error('❌ Error al crear utterance:', error);
    tryFallbackVoice(text);
  }
}

/**
 * Intenta reproducir con una voz de fallback
 */
function tryFallbackVoice(text) {
  try {
    console.log('🔄 Buscando voz de fallback...');
    
    // Buscar una voz diferente como fallback
    const fallbackVoice = availableVoices.find(voice => 
      voice !== selectedVoice && voice.lang.startsWith('es')
    ) || availableVoices.find(voice => 
      voice !== selectedVoice && voice.lang.startsWith('en')
    ) || availableVoices.find(voice => voice !== selectedVoice);
    
    if (fallbackVoice) {
      console.log('✅ Usando voz de fallback:', fallbackVoice.name);
      const originalVoice = selectedVoice;
      selectedVoice = fallbackVoice;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = fallbackVoice;
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        console.log('✅ Fallback completado, restaurando voz original');
        selectedVoice = originalVoice;
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Error también en fallback:', event.error);
        selectedVoice = originalVoice;
      };
      
      speechSynthesis.speak(utterance);
    } else {
      console.error('❌ No hay voces de fallback disponibles');
    }
  } catch (error) {
    console.error('❌ Error en fallback:', error);
  }
}

/**
 * Envía la interacción capturada al backend para ser guardada.
 */
async function enviarInteraccionAlBackend(interaction) {
  try {
    // Crear fecha y hora actual en formato ISO
    const currentDateTime = new Date().toISOString();
    
    const response = await apiClient.post('/interacciones/', {
      pregunta: interaction.question,
      respuesta: interaction.answer,
      respuesta_util: null,
      fecha: currentDateTime
    });
    console.log("✅ Historial de interacción guardado:", response.data);
    
    // Notificar al store para actualizar el historial automáticamente
    if (typeof window !== 'undefined' && window.updateHistoryStore) {
      console.log("📊 Actualizando store del historial...");
      window.updateHistoryStore();
    }
  } catch (error) {
    console.error("❌ Error al guardar el historial de interacción:", error);
  }
}

/**
 * Inicializa el chatbot de Flowise.
 */
export const initChatbot = async () => {
  try {
    const chatflowId = import.meta.env.VITE_FLOWISE_CHATFLOW_ID;
    const apiHost = import.meta.env.VITE_FLOWISE_API_HOST;

    if (!chatflowId || !apiHost) {
      console.error('Variables de entorno de Flowise no configuradas');
      return false;
    }

    await loadBotRules();
    const systemPrompt = buildSystemPrompt(loadedBotRules);

    // Inicializar síntesis de voz
    initializeSpeechSynthesis();

    Chatbot.init({
      chatflowid: chatflowId,
      apiHost: apiHost,
      overrideConfig: {
        systemMessage: systemPrompt,
      },
      observersConfig: {
        observeMessages: (messages) => {
          console.log('📨 observeMessages ejecutado - Total mensajes:', messages.length);
          console.log('📨 Mensajes completos:', messages);
          
          const lastMessage = messages[messages.length - 1];
          console.log('📨 Último mensaje:', lastMessage);
          
          // Detectar mensajes del bot usando la estructura de Flowise: type: 'apiMessage'
          if (lastMessage && lastMessage.type === "apiMessage" && lastMessage.message && lastMessage.message.trim() !== '') {
            console.log('✅ Detectado mensaje del bot:', lastMessage.message);
            
            // Verificar si es un mensaje nuevo usando messageId o timestamp
            const messageId = lastMessage.messageId || lastMessage.dateTime || lastMessage.message;
            const isNewMessage = lastProcessedMessageId !== messageId;
            
            console.log('🔍 Verificando si es mensaje nuevo:');
            console.log('   - ID del mensaje actual:', messageId);
            console.log('   - Último ID procesado:', lastProcessedMessageId);
            console.log('   - Es primera carga:', isFirstLoad);
            console.log('   - Es mensaje nuevo:', isNewMessage);
            
            // Si es la primera carga, solo marcarla como completada sin procesar mensajes antiguos
            if (isFirstLoad) {
              console.log('🚫 Primera carga del chat - Marcando como completada sin reproducir mensajes antiguos');
              isFirstLoad = false;
              lastProcessedMessageId = messageId; // Marcar este mensaje como procesado
              return; // Salir sin procesar mensajes antiguos
            }
            
            // Solo procesar si es un mensaje nuevo (después de la primera carga)
            if (isNewMessage) {
              const userAnswer = messages[messages.length - 2];
              console.log('📨 Mensaje del usuario anterior:', userAnswer);
              
              // Detectar mensajes del usuario usando la estructura de Flowise: type: 'userMessage'
              if (userAnswer && userAnswer.type === 'userMessage' && userAnswer.message) {
                console.log('✅ Par pregunta-respuesta válido detectado - PROCESANDO MENSAJE NUEVO');
                
                const interaction = {
                  question: userAnswer.message,
                  answer: lastMessage.message,
                };

                // Detectar emoción y actualizar avatar
                currentEmotion = detectEmotion(lastMessage.message);
                updateBotAvatar(currentEmotion);

                // Reproducir respuesta con voz para mensajes nuevos
                console.log('🔊 Intentando reproducir voz - isSpeechEnabled:', isSpeechEnabled);
                if (isSpeechEnabled) {
                  console.log('🔊 Llamando a speakText con:', lastMessage.message);
                  speakText(lastMessage.message);
                } else {
                  console.log('❌ Voz deshabilitada, no se reproduce');
                }

                conversationHistory.push({ role: 'user', content: interaction.question });
                conversationHistory.push({ role: 'assistant', content: interaction.answer });
                enviarInteraccionAlBackend(interaction);
                
                // Actualizar el ID del último mensaje procesado
                lastProcessedMessageId = messageId;
              } else {
                console.log('❌ No se encontró mensaje de usuario válido anterior');
              }
            } else {
              console.log('🚫 Mensaje ya procesado anteriormente - NO se reproduce voz');
            }
          } else {
            console.log('❌ El último mensaje no es del bot o está vacío');
          }
        },
      },
      theme: {
        button: {
          backgroundColor: '#42b983',
          right: 20,
          bottom: 20,
          size: '60px',
          iconColor: 'white',
          customIconSrc: '/src/assets/saludo.png', // Imagen de saludo cuando está cerrado
        },
        chatWindow: {
          welcomeMessage: '¡Hola! Soy Martita AI. Estoy aquí para ayudarte con los trámites del GAD de Cayambe.',
          title: 'Asistente Martita AI',
          backgroundColor: '#ffffff',
          height: 600,
          width: 400,
          fontSize: 16,
          botMessage: {
            backgroundColor: '#f1f3f5',
            textColor: '#2c3e50',
            showAvatar: true,
            avatarSrc: '/src/assets/feliz.png', // Avatar dinámico del bot
          },
          userMessage: {
            backgroundColor: '#42b983',
            textColor: '#ffffff',
            showAvatar: true,
            avatarSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM2Yzc1N2QiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDExQzEwIDEwLjQ0NyAxMC40NDcgMTAgMTEgMTBIMTNDMTMuNTUzIDEwIDE0IDEwLjQ0NyAxNCAxMUMxNCAxMS41NTMgMTMuNTUzIDEyIDEzIDEySDExQzEwLjQ0NyAxMiAxMCAxMS41NTMgMTAgMTFaIiBmaWxsPSIjNmM3NTdkIi8+CjxwYXRoIGQ9Ik04IDE0QzggMTMuNDQ3IDguNDQ3IDEzIDkgMTNIMTVDMTUuNTUzIDEzIDE2IDEzLjQ0NyAxNiAxNEMxNiAxNC41NTMgMTUuNTUzIDE1IDE1IDE1SDlDOC40NDcgMTUgOCAxNC41NTMgOCAxNFoiIGZpbGw9IiM2Yzc1N2QiLz4KPHBhdGggZD0iTTEyIDE4QzEwLjkgMTggMTAgMTcuMSAxMCAxNkMxMCAxNC45IDEwLjkgMTQgMTIgMTRDMTMuMSAxNCAxNCAxNC45IDE0IDE2QzE0IDE3LjEgMTMuMSAxOCAxMiAxOFoiIGZpbGw9IiM2Yzc1N2QiLz4KPC9zdmc+',
          },
          feedback: {
            color: '#303235'
        },
          textInput: {
            placeholder: 'Escribe tu pregunta aquí...',
            sendButtonColor: '#42b983',
          },
          footer: {
            textColor: '#303235',
            text: 'Powered by',
            company: 'Jean de la Cruz y Omar Sani',
            companyLink: 'https://flowiseai.com'
        }
        }
      }
    });

    console.log('Chatbot inicializado exitosamente.');
    isInitialized = true;
    return true;

  } catch (error) {
    console.error('Error fatal al inicializar el chatbot:', error);
    return false;
  }
};

export const updateBotRules = async () => {
  await loadBotRules();
  await initChatbot(); // Re-inicializa para aplicar el nuevo prompt
  console.log('Reglas del bot actualizadas y chatbot reinicializado');
};

export const getBotRules = () => {
  return loadedBotRules;
};

export const getConversationHistory = () => {
  return [...conversationHistory];
};

/**
 * Actualiza el avatar del bot basado en la emoción
 */
function updateBotAvatar(emotion) {
  const avatarSrc = getEmotionImage(emotion);

  // Intentar actualizar el avatar en el DOM del chatbot
  setTimeout(() => {
    const botAvatars = document.querySelectorAll('.flowise-bot-message img, .bot-avatar');
    botAvatars.forEach(avatar => {
      if (avatar) {
        avatar.src = avatarSrc;
      }
    });
  }, 100);
}

export const clearConversationHistory = () => {
  conversationHistory = [];
  sessionId = null;
  currentEmotion = 'feliz';
  console.log('Historial de conversación local limpiado.');
};

export const isChatbotInitialized = () => {
  return isInitialized;
};

// === FUNCIONES DE VOZ ===

/**
 * Limpia el texto para síntesis de voz, eliminando caracteres especiales, emojis, etc.
 * @param {string} text - Texto a limpiar
 * @returns {string} Texto limpio para síntesis de voz
 */
function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Eliminar emojis
  let cleaned = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '');
  
  // Eliminar caracteres especiales como * ** _ __ ~ ` etc.
  cleaned = cleaned.replace(/[\*_~`]+/g, '');
  
  // Eliminar URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
  
  // Eliminar correos electrónicos
  cleaned = cleaned.replace(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g, '');
  
  // Eliminar múltiples espacios, saltos de línea y tabulaciones
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Eliminar signos de puntuación repetidos
  cleaned = cleaned.replace(/([.,!?])\1+/g, '$1');
  
  // Eliminar espacios antes de signos de puntuación
  cleaned = cleaned.replace(/\s+([.,!?])/g, '$1');
  
  // Asegurar que los signos de puntuación tengan espacios después
  cleaned = cleaned.replace(/([.,!?])([^\s])/g, '$1 $2');
  
  console.log('Texto limpio para voz:', cleaned);
  return cleaned;
}

/**
 * Obtiene la voz actualmente seleccionada
 */
function getSelectedVoice() {
  return selectedVoice;
}

/**
 * Habilita o deshabilita la síntesis de voz
 */
function toggleSpeech(enabled) {
  isSpeechEnabled = enabled;
  console.log(`🔊 Voz ${enabled ? 'habilitada' : 'deshabilitada'}`);
  
  // Si se está desactivando, detener cualquier reproducción en curso
  if (!enabled && speechSynthesis) {
    stopSpeech();
  }
};

/**
 * Reproduce un texto específico (para pruebas)
 */
export const testSpeech = (text = 'Hola, soy Martita AI. ¿En qué puedo ayudarte?') => {
  console.log('🧪 Iniciando prueba de voz...');
  
  // Diagnóstico completo antes de la prueba
  diagnoseSpeechIssues();
  
  // Intentar reproducir
  speakText(text);
};

/**
 * Diagnostica problemas comunes con la síntesis de voz
 */
export const diagnoseSpeechIssues = () => {
  console.log('🔍 === DIAGNÓSTICO DE SÍNTESIS DE VOZ ===');
  
  // 1. Verificar disponibilidad básica
  console.log('1. SpeechSynthesis disponible:', 'speechSynthesis' in window);
  
  if (!('speechSynthesis' in window)) {
    console.error('❌ SpeechSynthesis no está disponible en este navegador');
    return;
  }
  
  // 2. Estado del speechSynthesis
  console.log('2. Estado speechSynthesis:', {
    speaking: speechSynthesis.speaking,
    pending: speechSynthesis.pending,
    paused: speechSynthesis.paused
  });
  
  // 3. Voces disponibles
  const voices = speechSynthesis.getVoices();
  console.log('3. Total voces disponibles:', voices.length);
  
  if (voices.length === 0) {
    console.warn('⚠️ No hay voces disponibles. Intentando recargar...');
    // Forzar recarga de voces
    speechSynthesis.onvoiceschanged = () => {
      const newVoices = speechSynthesis.getVoices();
      console.log('🔄 Voces recargadas:', newVoices.length);
    };
    return;
  }
  
  // 4. Voz seleccionada
  console.log('4. Voz seleccionada:', selectedVoice ? {
    name: selectedVoice.name,
    lang: selectedVoice.lang,
    localService: selectedVoice.localService,
    default: selectedVoice.default,
    voiceURI: selectedVoice.voiceURI
  } : 'Ninguna');
  
  // 5. Estado de la aplicación
  console.log('5. Estado aplicación:', {
    isSpeechEnabled,
    availableVoicesCount: availableVoices.length
  });
  
  // 6. Prueba básica de audio
  console.log('6. Iniciando prueba básica de audio...');
  testBasicAudio();
};

/**
 * Prueba básica de audio para verificar permisos y funcionamiento
 */
function testBasicAudio() {
  try {
    // Crear una prueba muy simple
    const testUtterance = new SpeechSynthesisUtterance('Test');
    testUtterance.volume = 1.0;
    testUtterance.rate = 1.0;
    testUtterance.pitch = 1.0;
    
    // Usar voz por defecto del sistema
    const defaultVoice = speechSynthesis.getVoices().find(voice => voice.default) || 
                        speechSynthesis.getVoices()[0];
    
    if (defaultVoice) {
      testUtterance.voice = defaultVoice;
      console.log('🎤 Probando con voz por defecto:', defaultVoice.name);
    }
    
    testUtterance.onstart = () => {
      console.log('✅ Prueba de audio INICIADA - El audio debería funcionar');
    };
    
    testUtterance.onend = () => {
      console.log('✅ Prueba de audio COMPLETADA');
    };
    
    testUtterance.onerror = (event) => {
      console.error('❌ Error en prueba de audio:', event.error);
      
      // Sugerencias basadas en el tipo de error
      switch(event.error) {
        case 'not-allowed':
          console.log('💡 SOLUCIÓN: Verifica los permisos de audio en el navegador');
          break;
        case 'network':
          console.log('💡 SOLUCIÓN: Problema de red, intenta con voz local');
          break;
        case 'synthesis-unavailable':
          console.log('💡 SOLUCIÓN: Síntesis no disponible, reinicia el navegador');
          break;
        case 'interrupted':
          console.log('💡 SOLUCIÓN: Audio interrumpido, verifica que no haya otras reproducciones');
          break;
        default:
          console.log('💡 SOLUCIÓN: Error desconocido, verifica configuración de audio del sistema');
      }
    };
    
    // Cancelar cualquier reproducción anterior
    speechSynthesis.cancel();
    
    // Esperar un poco y reproducir
    setTimeout(() => {
      console.log('🔊 Ejecutando speechSynthesis.speak()...');
      speechSynthesis.speak(testUtterance);
    }, 100);
    
  } catch (error) {
    console.error('❌ Error al crear prueba de audio:', error);
  }
}

/**
 * Detiene la reproducción de voz actual
 */
export const stopSpeech = () => {
  speechSynthesis?.cancel();
};

// === FUNCIONES DE EMOCIONES ===

/**
 * Obtiene la emoción actual del bot
 */
export const getCurrentEmotion = () => {
  return currentEmotion;
};

/**
 * Cambia manualmente la emoción del bot
 */
export const setEmotion = (emotion) => {
  if (emotionMapping[emotion]) {
    currentEmotion = emotion;
    updateBotAvatar(emotion);
    console.log('Emoción cambiada a:', emotion);
  }
};

/**
 * Obtiene todas las emociones disponibles
 */
export const getAvailableEmotions = () => {
  return Object.keys(emotionMapping);
};
