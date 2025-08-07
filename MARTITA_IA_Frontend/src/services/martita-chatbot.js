
import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
import apiClient from '@/boot/axios';

/**
 * Inicializa el chatbot de Flowise con configuraciones personalizadas.
 */
export const initChatbot = () => {
  // Validar que las variables de entorno estén disponibles
  const chatflowId = import.meta.env.VITE_FLOWISE_CHATFLOW_ID;
  const apiHost = import.meta.env.VITE_FLOWISE_API_HOST;

  if (!chatflowId || !apiHost) {
    console.error('Error: Variables de entorno de Flowise no configuradas');
    console.error('VITE_FLOWISE_CHATFLOW_ID:', chatflowId);
    console.error('VITE_FLOWISE_API_HOST:', apiHost);
    return false;
  }

  console.log('Inicializando chatbot con:', { chatflowId, apiHost });

  try {
    Chatbot.init({
    // --- Configuración Esencial ---
    // Leemos estos valores desde tus variables de entorno (.env)
    chatflowid: import.meta.env.VITE_FLOWISE_CHATFLOW_ID,
    apiHost: import.meta.env.VITE_FLOWISE_API_HOST,

    // --- Captura de Datos de Entrada y Salida ---
    observersConfig: {
      // Se activa cada vez que el usuario envía un mensaje
      observeUserInput: (userInput) => {
        console.log("Usuario envió:", userInput);
      },
      // Se activa cuando el bot termina de generar una respuesta
      observeMessages: (messages) => {
        // 'messages' es un array con todo el historial de la sesión actual
        const lastMessage = messages[messages.length - 1];

        // Nos aseguramos de que el último mensaje sea del bot
        if (lastMessage && lastMessage.role === "assistant") {
          const userAnswer = messages[messages.length - 2]; // El mensaje anterior es el del usuario

          const interaction = {
            question: userAnswer.content,
            answer: lastMessage.content,
          };

          console.log("Conversación capturada:", interaction);

          // Enviamos la interacción a tu backend para guardarla en el historial
          enviarInteraccionAlBackend(interaction);
        }
      },
    },

    // --- Configuración Visual (Theme) ---
    theme: {
      button: {
        backgroundColor: '#42b983', // Un verde más alineado a tu app
        right: 20,
        bottom: 20,
        size: '60px',
        iconColor: 'white',
        // Puedes usar tu propio ícono si lo deseas
        // customIconSrc: 'URL_de_tu_logo.svg',
      },
      chatWindow: {
        welcomeMessage: '¡Hola! Soy Martita AI. Estoy aquí para ayudarte con los trámites del GAD de Cayambe.',
        title: 'Asistente Martita AI',
        titleAvatarSrc: 'URL_de_tu_logo_feli.png',
        backgroundColor: '#ffffff',
        height: 600,
        width: 400,
        fontSize: 16,
        // Sugerencias de preguntas para guiar al usuario
        starterPrompts: [
            "¿Qué necesito para sacar la licencia de construcción?",
            "Horarios de atención",
            "¿Cómo pago el impuesto predial?"
        ],
        // Estilos de los mensajes
        botMessage: {
          backgroundColor: '#f1f3f5',
          textColor: '#2c3e50',
          showAvatar: true,
          avatarSrc: 'URL_de_tu_logo_feli.png',
        },
        userMessage: {
          backgroundColor: '#42b983',
          textColor: '#ffffff',
          showAvatar: true,
        },
        // Campo de texto del usuario
        textInput: {
          placeholder: 'Escribe tu pregunta aquí...',
          sendButtonColor: '#42b983',
        },
      },
    }
  });

  console.log('Chatbot inicializado exitosamente');
  return true;
  } catch (error) {
    console.error('Error al inicializar el chatbot:', error);
    return false;
  }
};

/**
 * Envía la interacción capturada al backend para ser guardada.
 * @param {object} interaction - Objeto con 'question' y 'answer'.
 */
async function enviarInteraccionAlBackend(interaction) {
  try {
    const response = await apiClient.post('/interacciones/', {
      pregunta: interaction.question,
      respuesta: interaction.answer,
      respuesta_util: null // El usuario podría calificar la respuesta más tarde
    });
    console.log("Historial de interacción guardado:", response.data);
  } catch (error) {
    console.error("Error al guardar el historial de interacción:", error);
  }
}
