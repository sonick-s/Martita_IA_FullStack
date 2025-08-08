import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
import apiClient from '@/boot/axios';

// Variables para manejar el estado del chatbot en la sesión actual
let loadedBotRules = [];
let conversationHistory = [];
let sessionId = null;
let isInitialized = false;

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
 * Envía la interacción capturada al backend para ser guardada.
 */
async function enviarInteraccionAlBackend(interaction) {
  try {
    const response = await apiClient.post('/interacciones/', {
      pregunta: interaction.question,
      respuesta: interaction.answer,
      respuesta_util: null
    });
    console.log("Historial de interacción guardado:", response.data);
  } catch (error) {
    console.error("Error al guardar el historial de interacción:", error);
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

    Chatbot.init({
      chatflowid: chatflowId,
      apiHost: apiHost,
      overrideConfig: {
        systemMessage: systemPrompt,
      },
      observersConfig: {
        observeMessages: (messages) => {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            const userAnswer = messages[messages.length - 2];
            if (userAnswer && userAnswer.role === 'user') {
              const interaction = {
                question: userAnswer.content,
                answer: lastMessage.content,
              };
              conversationHistory.push({ role: 'user', content: interaction.question });
              conversationHistory.push({ role: 'assistant', content: interaction.answer });
              enviarInteraccionAlBackend(interaction);
            }
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
          customIconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM0MmI5ODMiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDExQzEwIDEwLjQ0NyAxMC40NDcgMTAgMTEgMTBIMTNDMTMuNTUzIDEwIDE0IDEwLjQ0NyAxNCAxMUMxNCAxMS41NTMgMTMuNTUzIDEyIDEzIDEySDExQzEwLjQ0NyAxMiAxMCAxMS41NTMgMTAgMTFaIiBmaWxsPSIjNDJiOTgzIi8+CjxwYXRoIGQ9Ik04IDE0QzggMTMuNDQ3IDguNDQ3IDEzIDkgMTNIMTVDMTUuNTUzIDEzIDE2IDEzLjQ0NyAxNiAxNEMxNiAxNC41NTMgMTUuNTUzIDE1IDE1IDE1SDlDOC40NDcgMTUgOCAxNC41NTMgOCAxNFoiIGZpbGw9IiM0MmI5ODMiLz4KPHBhdGggZD0iTTEyIDE4QzEwLjkgMTggMTAgMTcuMSAxMCAxNkMxMCAxNC45IDEwLjkgMTQgMTIgMTRDMTMuMSAxNCAxNCAxNC45IDE0IDE2QzE0IDE3LjEgMTMuMSAxOCAxMiAxOFoiIGZpbGw9IiM0MmI5ODMiLz4KPC9zdmc+',
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
            avatarSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM0MmI5ODMiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDExQzEwIDEwLjQ0NyAxMC40NDcgMTAgMTEgMTBIMTNDMTMuNTUzIDEwIDE0IDEwLjQ0NyAxNCAxMUMxNCAxMS41NTMgMTMuNTUzIDEyIDEzIDEySDExQzEwLjQ0NyAxMiAxMCAxMS41NTMgMTAgMTFaIiBmaWxsPSIjNDJiOTgzIi8+CjxwYXRoIGQ9Ik04IDE0QzggMTMuNDQ3IDguNDQ3IDEzIDkgMTNIMTVDMTUuNTUzIDEzIDE2IDEzLjQ0NyAxNiAxNEMxNiAxNC41NTMgMTUuNTUzIDE1IDE1IDE1SDlDOC40NDcgMTUgOCAxNC41NTMgOCAxNFoiIGZpbGw9IiM0MmI5ODMiLz4KPHBhdGggZD0iTTEyIDE4QzEwLjkgMTggMTAgMTcuMSAxMCAxNkMxMCAxNC45IDEwLjkgMTQgMTIgMTRDMTMuMSAxNCAxNCAxNC45IDE0IDE2QzE0IDE3LjEgMTMuMSAxOCAxMiAxOFoiIGZpbGw9IiM0MmI5ODMiLz4KPC9zdmc+',
          },
          userMessage: {
            backgroundColor: '#42b983',
            textColor: '#ffffff',
            showAvatar: true,
            avatarSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM2Yzc1N2QiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDExQzEwIDEwLjQ0NyAxMC40NDcgMTAgMTEgMTBIMTNDMTMuNTUzIDEwIDE0IDEwLjQ0NyAxNCAxMUMxNCAxMS41NTMgMTMuNTUzIDEyIDEzIDEySDExQzEwLjQ0NyAxMiAxMCAxMS41NTMgMTAgMTFaIiBmaWxsPSIjNmM3NTdkIi8+CjxwYXRoIGQ9Ik04IDE0QzggMTMuNDQ3IDguNDQ3IDEzIDkgMTNIMTVDMTUuNTUzIDEzIDE2IDEzLjQ0NyAxNiAxNEMxNiAxNC41NTMgMTUuNTUzIDE1IDE1IDE1SDlDOC40NDcgMTUgOCAxNC41NTMgOCAxNFoiIGZpbGw9IiM2Yzc1N2QiLz4KPHBhdGggZD0iTTEyIDE4QzEwLjkgMTggMTAgMTcuMSAxMCAxNkMxMCAxNC45IDEwLjkgMTQgMTIgMTRDMTMuMSAxNCAxNCAxNC45IDE0IDE2QzE0IDE3LjEgMTMuMSAxOCAxMiAxOFoiIGZpbGw9IiM2Yzc1N2QiLz4KPC9zdmc+',
          },
          textInput: {
            placeholder: 'Escribe tu pregunta aquí...',
            sendButtonColor: '#42b983',
          },
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

export const clearConversationHistory = () => {
  conversationHistory = [];
  sessionId = null;
  console.log('Historial de conversación local limpiado.');
};

export const isChatbotInitialized = () => {
  return isInitialized;
};
