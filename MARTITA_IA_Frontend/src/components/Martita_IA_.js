import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";

export function initChatbot() {
    const conversation = [];
    let currentQuestion = null;

    Chatbot.init({
        chatflowid: "8cc37f5a-3b9e-433f-8c20-771a974b1bf4",
        apiHost: "http://localhost:3000",
        container: '#chatbot-container',

        observersConfig: {
            observeUserInput: (userInput) => {
                if (userInput) {
                    currentQuestion = userInput;
                    console.log("Usuario preguntó:", userInput);
                }
            },

            observeMessages: async (messages) => {
                const botMessages = messages.filter(m => m.role === "assistant");
                const lastBotMessage = botMessages[botMessages.length - 1];

                if (currentQuestion && lastBotMessage) {
                    const interaction = {
                        question: currentQuestion,
                        answer: lastBotMessage.content,
                    };

                    conversation.push(interaction);
                    console.log("Respuesta del bot:", lastBotMessage.content);
                    console.log("Conversación actual:", conversation);

                    currentQuestion = null;

                    await enviarInteraccion(interaction);
                }
            },
        },

        theme: {
            button: {
                backgroundColor: '#3B81F6',
                right: 20,
                bottom: 20,
                size: 48,
                dragAndDrop: true,
                iconColor: 'white',
                customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                autoWindowOpen: {
                    autoOpen: true,
                    openDelay: 2,
                    autoOpenOnMobile: false
                }
            },
            tooltip: {
                showTooltip: true,
                tooltipMessage: 'Soy Martita tu asistente artificial👋!',
                tooltipBackgroundColor: '#3B81F6',
                tooltipTextColor: 'white',
                tooltipFontSize: 14
            },
            disclaimer: {
                title: 'Disclaimer',
                message: "By using this chatbot, you agree to the <a target=\"_blank\" href=\"https://flowiseai.com/terms\">Terms & Condition</a>",
                textColor: 'black',
                buttonColor: '#3b82f6',
                buttonText: 'Start Chatting',
                buttonTextColor: 'white',
                blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundColor: 'white'
            },
            customCSS: ``,
            chatWindow: {
                showTitle: true,
                showAgentMessages: true,
                title: 'Flowise Bot',
                titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                welcomeMessage: 'Hola , me llamo Martita IA y estoy diseñada para ayduarte con los tramites del gobierno de Cayambe',
                errorMessage: 'This is a custom error message',
                backgroundColor: '#ffffff',
                backgroundImage: 'enter image path or link',
                height: 700,
                width: 400,
                fontSize: 16,
                starterPrompts: [
                    "What is a bot?",
                    "Who are you?"
                ],
                starterPromptFontSize: 15,
                clearChatOnReload: false,
                sourceDocsTitle: 'Sources:',
                renderHTML: true,
                botMessage: {
                    backgroundColor: '#f7f8ff',
                    textColor: '#303235',
                    showAvatar: true,
                    avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png'
                },
                userMessage: {
                    backgroundColor: '#3B81F6',
                    textColor: '#ffffff',
                    showAvatar: true,
                    avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
                },
                textInput: {
                    placeholder: 'Type your question',
                    backgroundColor: '#ffffff',
                    textColor: '#303235',
                    sendButtonColor: '#3B81F6',
                    maxChars: 50,
                    maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 50 characters.',
                    autoFocus: true,
                    sendMessageSound: true,
                    sendSoundLocation: 'send_message.mp3',
                    receiveMessageSound: true,
                    receiveSoundLocation: 'receive_message.mp3'
                },
                feedback: {
                    color: '#303235'
                },
                dateTimeToggle: {
                    date: true,
                    time: true
                },
                footer: {
                    textColor: '#303235',
                    text: 'Powered by',
                    company: 'Flowise',
                    companyLink: 'https://flowiseai.com'
                }, // added comma here
            }
        }
        
    });
}

async function enviarInteraccion(item) {
    try {
        const response = await fetch('http://localhost:8000/interacciones/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pregunta: item.question,
                respuesta: item.answer,
                respuesta_util: null
            }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Interacción enviada:", data);
    } catch (error) {
        console.error("Error al enviar la interacción:", error);
    }
}

  